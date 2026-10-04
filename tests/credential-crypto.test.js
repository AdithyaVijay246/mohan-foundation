// Run with: node --test tests/
const test = require('node:test');
const assert = require('node:assert/strict');
const MF = require('../credential-crypto.js');

const LINK = 'https://drive.google.com/drive/folders/example';

test('encrypted record has user/salt/iv/ct as base64 with expected byte lengths', async () => {
    const rec = await MF.encryptCredential('Rahul92', 'secret', LINK);
    assert.deepEqual(Object.keys(rec), ['user', 'salt', 'iv', 'ct']);
    assert.equal(rec.user, 'Rahul92');
    const b64 = /^[A-Za-z0-9+/]+={0,2}$/;
    for (const f of ['salt', 'iv', 'ct']) assert.match(rec[f], b64);
    assert.equal(Buffer.from(rec.salt, 'base64').length, 16);
    assert.equal(Buffer.from(rec.iv, 'base64').length, 12);
    assert.ok(!rec.ct.includes(LINK), 'ciphertext must not contain plaintext');
});

test('round trip: correct credentials decrypt, username is case-insensitive', async () => {
    const rec = await MF.encryptCredential('Rahul92', 'secret', LINK);
    assert.equal(await MF.decryptCredential(rec, 'rahul92', 'secret'), LINK);
    assert.equal(await MF.decryptCredential(rec, '  RAHUL92 ', 'secret'), LINK);
});

test('wrong password or wrong username returns null, never throws', async () => {
    const rec = await MF.encryptCredential('rahul92', 'secret', LINK);
    assert.equal(await MF.decryptCredential(rec, 'rahul92', 'Secret'), null);
    assert.equal(await MF.decryptCredential(rec, 'amina.k', 'secret'), null);
    assert.equal(await MF.decryptCredential({ ...rec, ct: 'garbage!!' }, 'rahul92', 'secret'), null);
});

test('key derivation matches the spec: PBKDF2-SHA256, 150000 iters, "<user lowercased>:<password>"', async () => {
    // Independent re-implementation of the documented scheme, so the module can't drift from it.
    const { subtle } = globalThis.crypto;
    const rec = await MF.encryptCredential('Amina.K', 'p@ss,word', LINK);
    const base = await subtle.importKey('raw', new TextEncoder().encode('amina.k:p@ss,word'), 'PBKDF2', false, ['deriveKey']);
    const key = await subtle.deriveKey(
        { name: 'PBKDF2', salt: Buffer.from(rec.salt, 'base64'), iterations: 150000, hash: 'SHA-256' },
        base, { name: 'AES-GCM', length: 256 }, false, ['decrypt']);
    const pt = await subtle.decrypt({ name: 'AES-GCM', iv: Buffer.from(rec.iv, 'base64') }, key, Buffer.from(rec.ct, 'base64'));
    assert.equal(new TextDecoder().decode(pt), LINK);
});

test('findDriveLink picks the matching row among many, case-insensitively', async () => {
    const rows = [
        await MF.encryptCredential('amina.k', 'one', 'https://a.example'),
        await MF.encryptCredential('Rahul92', 'two', 'https://b.example'),
    ];
    assert.equal(await MF.findDriveLink(rows, 'RAHUL92', 'two'), 'https://b.example');
    assert.equal(await MF.findDriveLink(rows, 'rahul92', 'one'), null);
    assert.equal(await MF.findDriveLink(rows, 'nobody', 'two'), null);
});

test('parseCredentialCsv reads header row, skips blanks, handles quotes and CRLF', () => {
    const csv = 'user,salt,iv,ct\r\n"rahul92",c2FsdA==,aXY=,Y3Q=\r\n\r\namina.k,czI=,aTI=,YzI=\r\n';
    assert.deepEqual(MF.parseCredentialCsv(csv), [
        { user: 'rahul92', salt: 'c2FsdA==', iv: 'aXY=', ct: 'Y3Q=' },
        { user: 'amina.k', salt: 'czI=', iv: 'aTI=', ct: 'YzI=' },
    ]);
    assert.deepEqual(MF.parseCredentialCsv(''), []);
    assert.deepEqual(MF.parseCredentialCsv('user,salt,iv,ct\n'), []);
});

test('parseAmbassadorLines splits on first comma, trims, flags bad lines', () => {
    const out = MF.parseAmbassadorLines('rahul92, secret\n\n# comment\namina.k,pa,ss\nnocomma\n,nouser\nnopass,\n');
    assert.deepEqual(out, [
        { line: 'rahul92, secret', username: 'rahul92', password: 'secret' },
        { line: 'amina.k,pa,ss', username: 'amina.k', password: 'pa,ss' },
        { line: 'nocomma', error: 'expected "username,password"' },
        { line: ',nouser', error: 'username is empty' },
        { line: 'nopass,', error: 'password is empty' },
    ]);
});

test('sha256Hex matches known vector', async () => {
    assert.equal(await MF.sha256Hex('abc'), 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad');
});
