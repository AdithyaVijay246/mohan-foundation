# MOHAN Foundation Organ Donation Ambassador site

Static site (`index.html`, `script.js`, `styles.css`) hosted on GitHub Pages.

## Ambassador login and credential admin

### How it fits together

There's no backend and no database. Three pieces do the work:

| Piece | Role |
|---|---|
| **Google Sheet** ([credentials sheet](https://docs.google.com/spreadsheets/d/1fdjSP6MUNHw5DIyyTBIs4TsaR_16Pod82YdTCzcnyIc/edit)) | The credential store. One row per ambassador: `user, salt, iv, ct`. Published to the web as CSV. |
| **`index.html` + `script.js`** | At login, fetches the published CSV and tries to decrypt the row that matches the username. If it decrypts, the Drive link shows up in `#drive-link-reveal`. |
| **`admin.html` + `apps-script/Code.gs`** | The only way to write. The admin page encrypts each new `username,password` in the browser and POSTs the row to an Apps Script Web App bound to the sheet. The script appends the row, or replaces it if that username already exists. |

Both pages share the crypto in `credential-crypto.js`. The key comes from PBKDF2 (SHA-256, 150,000 iterations, random 16-byte salt) over `"<username, trimmed and lowercased>:<password>"`. That key AES-256-GCM-encrypts the Drive link with a random 12-byte IV. `salt`, `iv` and `ct` are stored as standard base64. Plaintext passwords never touch the sheet. A row only decrypts with the right username and password, so a wrong password fails GCM authentication.

Adding ambassadors needs no code change or redeploy. Open `admin.html`, unlock it, paste `username,password` lines, and submit.

Google caches the published CSV, so a newly added ambassador may have to wait a few minutes before their login works.

### Security caveat

This keeps casual visitors out. It is not real access control. Everything runs in the browser, so anyone who opens the page source can see it:

- `ADMIN_API_KEY` sits in `admin.html`. Anyone who reads it can POST rows to the Apps Script endpoint and add their own login. The admin password gate only hides the form and doesn't protect the key.
- `ADMIN_PASSWORD_HASH` is an unsalted SHA-256, so a short or common admin password can be cracked offline. Use a long one.
- The credential CSV is public. Anyone can download every salt and ciphertext and guess passwords offline. PBKDF2 slows that down, but weak ambassador passwords will still fall.
- Once someone has the Drive link, they can share it. Whatever sharing settings the Drive folder has are the real protection for the files.

Don't put anything behind this login that would cause real harm if it leaked.

### Placeholders to fill in

None of this works end to end until these are set:

| Value | Where | What to put |
|---|---|---|
| `SHEET_CSV_URL` | `script.js` (Ambassador Login block) | In the sheet: File > Share > Publish to web > pick the sheet > CSV > Publish. Copy that URL. |
| `APPS_SCRIPT_URL` | `admin.html` (and the `DEPLOYED_URL` note in `apps-script/Code.gs`) | The Web app URL (ends in `/exec`) you get after deploying `Code.gs`. The steps are at the top of that file. |
| `ADMIN_API_KEY` | `admin.html` and `apps-script/Code.gs` | One long random string, the same in both files. |
| `ADMIN_PASSWORD_HASH` | `admin.html` | Lowercase hex SHA-256 of the admin password (see below). |
| `DEFAULT_DRIVE_LINK` | `admin.html` | Already set to the training-materials folder. Change it if the folder moves. Admins can override it for each batch. |

To get the admin password hash, run this in PowerShell:

```powershell
$p = Read-Host "Admin password"
-join ([Security.Cryptography.SHA256]::Create().ComputeHash([Text.Encoding]::UTF8.GetBytes($p)) | % { $_.ToString("x2") })
```

Or in a browser console:

```js
[...new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode('your-password')))].map(b => b.toString(16).padStart(2, '0')).join('')
```

To generate an API key, run `[guid]::NewGuid().ToString("N") + [guid]::NewGuid().ToString("N")` in PowerShell.

### Tests

The shared crypto and parsing code has tests that need no dependencies (Node 18+):

```
node --test tests/*.test.js
```
