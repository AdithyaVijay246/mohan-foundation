/**
 * Ambassador credential crypto, shared by index.html (login) and admin.html (adding ambassadors).
 *
 * Each credential row is { user, salt, iv, ct } (all but user are standard base64):
 *   key = PBKDF2(SHA-256, 150000 iterations, 16-byte salt) of "<username trimmed+lowercased>:<password>"
 *   ct  = AES-256-GCM(key, 12-byte iv) of the Google Drive link (GCM tag appended, Web Crypto default)
 *
 * Loaded as a plain <script> in the browser (exposes window.MFCredentials) and via require() in tests.
 */
(function (root) {
    const PBKDF2_ITERATIONS = 150000;
    const SALT_BYTES = 16;
    const IV_BYTES = 12;
    const subtle = globalThis.crypto.subtle;
    const enc = new TextEncoder();

    function bytesToBase64(bytes) {
        let bin = '';
        for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
        return btoa(bin);
    }

    function base64ToBytes(b64) {
        const bin = atob(b64);
        const bytes = new Uint8Array(bin.length);
        for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
        return bytes;
    }

    function normalizeUsername(username) {
        return String(username).trim().toLowerCase();
    }

    async function deriveKey(username, password, salt, usage) {
        const material = enc.encode(`${normalizeUsername(username)}:${password}`);
        const baseKey = await subtle.importKey('raw', material, 'PBKDF2', false, ['deriveKey']);
        return subtle.deriveKey(
            { name: 'PBKDF2', salt, iterations: PBKDF2_ITERATIONS, hash: 'SHA-256' },
            baseKey,
            { name: 'AES-GCM', length: 256 },
            false,
            [usage]
        );
    }

    async function encryptCredential(username, password, driveLink) {
        const salt = globalThis.crypto.getRandomValues(new Uint8Array(SALT_BYTES));
        const iv = globalThis.crypto.getRandomValues(new Uint8Array(IV_BYTES));
        const key = await deriveKey(username, password, salt, 'encrypt');
        const ct = await subtle.encrypt({ name: 'AES-GCM', iv }, key, enc.encode(driveLink));
        return {
            user: String(username).trim(),
            salt: bytesToBase64(salt),
            iv: bytesToBase64(iv),
            ct: bytesToBase64(new Uint8Array(ct)),
        };
    }

    // Returns the decrypted link, or null if the credentials (or the row) are wrong.
    async function decryptCredential(row, username, password) {
        try {
            const key = await deriveKey(username, password, base64ToBytes(row.salt), 'decrypt');
            const pt = await subtle.decrypt({ name: 'AES-GCM', iv: base64ToBytes(row.iv) }, key, base64ToBytes(row.ct));
            return new TextDecoder().decode(pt);
        } catch (err) {
            return null;
        }
    }

    async function findDriveLink(rows, username, password) {
        const wanted = normalizeUsername(username);
        for (const row of rows) {
            if (normalizeUsername(row.user) !== wanted) continue;
            const link = await decryptCredential(row, username, password);
            if (link !== null) return link;
        }
        return null;
    }

    // Minimal RFC 4180 CSV parser (quoted fields, "" escapes, CRLF).
    function parseCsvRows(text) {
        const rows = [];
        let row = [], field = '', inQuotes = false;
        for (let i = 0; i < text.length; i++) {
            const c = text[i];
            if (inQuotes) {
                if (c === '"' && text[i + 1] === '"') { field += '"'; i++; }
                else if (c === '"') inQuotes = false;
                else field += c;
            } else if (c === '"') inQuotes = true;
            else if (c === ',') { row.push(field); field = ''; }
            else if (c === '\n' || c === '\r') {
                if (c === '\r' && text[i + 1] === '\n') i++;
                row.push(field); rows.push(row); row = []; field = '';
            } else field += c;
        }
        if (field !== '' || row.length) { row.push(field); rows.push(row); }
        return rows;
    }

    // Maps columns by header name (user, salt, iv, ct), so column order in the sheet doesn't matter.
    function parseCredentialCsv(text) {
        const rows = parseCsvRows(text).filter(r => r.some(cell => cell.trim() !== ''));
        if (!rows.length) return [];
        const header = rows[0].map(h => h.trim().toLowerCase());
        const col = name => header.indexOf(name);
        return rows.slice(1)
            .map(r => ({
                user: (r[col('user')] || '').trim(),
                salt: (r[col('salt')] || '').trim(),
                iv: (r[col('iv')] || '').trim(),
                ct: (r[col('ct')] || '').trim(),
            }))
            .filter(r => r.user && r.salt && r.iv && r.ct);
    }

    // Parses admin input: one "username,password" per line. Blank lines and "#" comments are skipped.
    // Splits on the first comma only, so passwords may contain commas.
    function parseAmbassadorLines(text) {
        const out = [];
        for (const raw of String(text).split(/\r?\n/)) {
            const line = raw.trim();
            if (!line || line.startsWith('#')) continue;
            const comma = line.indexOf(',');
            if (comma === -1) { out.push({ line, error: 'expected "username,password"' }); continue; }
            const username = line.slice(0, comma).trim();
            const password = line.slice(comma + 1).trim();
            if (!username) out.push({ line, error: 'username is empty' });
            else if (!password) out.push({ line, error: 'password is empty' });
            else out.push({ line, username, password });
        }
        return out;
    }

    const api = { encryptCredential, decryptCredential, findDriveLink, parseCredentialCsv, parseAmbassadorLines };
    if (typeof module !== 'undefined' && module.exports) module.exports = api;
    else root.MFCredentials = api;
})(this);
