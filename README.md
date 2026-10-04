# MOHAN Foundation Organ Donation Ambassador site

Static site (`index.html`, `script.js`, `styles.css`) hosted on GitHub Pages.

## Ambassador login and credential admin

### How it fits together

There's no backend and no database. Three pieces do the work:

| Piece | Role |
|---|---|
| **Google Sheet** ([credentials sheet](https://docs.google.com/spreadsheets/d/1fdjSP6MUNHw5DIyyTBIs4TsaR_16Pod82YdTCzcnyIc/edit)) | The credential store. One row per ambassador: `user, salt, iv, ct`. Published to the web as CSV. |
| **`index.html` + `script.js`** | At login, fetches the published CSV and tries to decrypt the row that matches the username. If it decrypts, the Drive link shows up in `#drive-link-reveal`. |
| **`admin.html` + `apps-script/Code.gs`** | The only way to write. The admin page encrypts each new `username,password` in the browser and POSTs the row, along with the admin password, to an Apps Script Web App bound to the sheet. The script checks the password, then appends the row, or replaces it if that username already exists. |

Both pages share the crypto in `credential-crypto.js`. The key comes from PBKDF2 (SHA-256, 150,000 iterations, random 16-byte salt) over `"<username, trimmed and lowercased>:<password>"`. That key AES-256-GCM-encrypts the Drive link with a random 12-byte IV. `salt`, `iv` and `ct` are stored as standard base64. Plaintext passwords never touch the sheet. A row only decrypts with the right username and password, so a wrong password fails GCM authentication.

Adding ambassadors needs no code change or redeploy. Open `admin.html`, log in with the admin password, paste `username,password` lines, and submit.

The admin password is stored only in the Apps Script project (Script Properties > `ADMIN_PASSWORD`). The website code doesn't contain it or a hash of it. To change it, edit that property; no redeploy is needed.

Google caches the published CSV, so a newly added ambassador may have to wait a few minutes before their login works.

### Security caveat

This keeps casual visitors out. It is not real access control. The login side runs entirely in the browser, so anyone can read how it works:

- The Apps Script URL is public (it's in `admin.html`), and anyone can send password guesses to it. Each wrong guess is delayed by a second, but that's the only limit. Use a long admin password.
- The credential CSV is public. Anyone can download every salt and ciphertext and guess passwords offline. PBKDF2 slows that down, but weak ambassador passwords will still fall.
- Once someone has the Drive link, they can share it. Whatever sharing settings the Drive folder has are the real protection for the files.

Don't put anything behind this login that would cause real harm if it leaked.

### Placeholders to fill in

None of this works end to end until these are set:

| Value | Where | What to put |
|---|---|---|
| `SHEET_CSV_URL` | `script.js` (Ambassador Login block) | In the sheet: File > Share > Publish to web > pick the sheet > CSV > Publish. Copy that URL. |
| `APPS_SCRIPT_URL` | `admin.html` (and the `DEPLOYED_URL` note in `apps-script/Code.gs`) | The Web app URL (ends in `/exec`) you get after deploying `Code.gs`. The steps are at the top of that file. |
| `ADMIN_PASSWORD` | Apps Script > Project Settings > Script Properties | The admin password. Set it there, not in any file in this repo. |
| `DEFAULT_DRIVE_LINK` | `admin.html` | Already set to the training-materials folder. Change it if the folder moves. Admins can override it for each batch. |

### Tests

The shared crypto and parsing code, and `apps-script/Code.gs` (run against fake Sheets services), have tests that need no dependencies (Node 18+):

```
node --test tests/*.test.js
```
