/**
 * Ambassador credentials: write endpoint for admin.html.
 * REFERENCE COPY. This file does not run from the repo. It runs inside Google Apps Script.
 *
 * DEPLOYMENT
 *  1. Open the credentials Google Sheet
 *     (https://docs.google.com/spreadsheets/d/1fdjSP6MUNHw5DIyyTBIs4TsaR_16Pod82YdTCzcnyIc/edit).
 *  2. Extensions > Apps Script.
 *  3. Replace the contents of Code.gs with this file.
 *  4. Set ADMIN_API_KEY below to a long random string. Put the same value in admin.html.
 *  5. Deploy > New deployment > gear icon > Web app.
 *       Execute as:      Me
 *       Who has access:  Anyone
 *     Click Deploy and approve the authorization prompts.
 *  6. Copy the Web app URL (ends in /exec) into admin.html's APPS_SCRIPT_URL
 *     and into DEPLOYED_URL below so you know which deployment is live.
 *  7. After later edits to this file: Deploy > Manage deployments > edit (pencil) >
 *     Version: New version > Deploy. Otherwise the URL keeps serving the old code.
 *
 * Writes go to the first sheet (getActiveSheet() returns it in a web app), which should be the
 * same sheet you published as CSV for script.js. The header row (user, salt, iv, ct) is created
 * automatically if the sheet is empty.
 *
 * Apps Script cannot set HTTP status codes. Every response is HTTP 200, and the JSON
 * {success: true|false, error?} body tells the caller whether the write worked.
 */

const ADMIN_API_KEY = 'PASTE_ADMIN_API_KEY_HERE';
const DEPLOYED_URL = 'PASTE_APPS_SCRIPT_WEB_APP_URL_HERE'; // note only, not used by the code

const HEADERS = ['user', 'salt', 'iv', 'ct'];
const BASE64_RE = /^[A-Za-z0-9+/]+={0,2}$/;

function doPost(e) {
  let body;
  try {
    body = JSON.parse(e.postData.contents);
  } catch (err) {
    return jsonResponse({ success: false, error: 'invalid JSON body' });
  }

  if (ADMIN_API_KEY.indexOf('PASTE_') === 0) {
    return jsonResponse({ success: false, error: 'ADMIN_API_KEY is not configured in Code.gs' });
  }
  if (!body || body.apiKey !== ADMIN_API_KEY) {
    return jsonResponse({ success: false, error: 'invalid API key' });
  }

  const row = {};
  for (const field of HEADERS) {
    const value = typeof body[field] === 'string' ? body[field].trim() : '';
    if (!value) return jsonResponse({ success: false, error: 'missing field: ' + field });
    row[field] = value;
  }
  for (const field of ['salt', 'iv', 'ct']) {
    if (!BASE64_RE.test(row[field])) return jsonResponse({ success: false, error: 'invalid base64 in: ' + field });
  }
  // Block spreadsheet formula injection through the username.
  if (/^[=+\-@]/.test(row.user)) {
    return jsonResponse({ success: false, error: 'username cannot start with = + - or @' });
  }

  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
  } catch (err) {
    return jsonResponse({ success: false, error: 'sheet is busy, try again' });
  }

  try {
    const sheet = SpreadsheetApp.getActiveSheet();
    if (sheet.getLastRow() === 0) writeRow(sheet, 1, HEADERS);

    const values = sheet.getDataRange().getValues();
    const header = values[0].map(h => String(h).trim().toLowerCase());
    const userCol = header.indexOf('user');
    if (userCol === -1 || HEADERS.some(h => header.indexOf(h) === -1)) {
      return jsonResponse({ success: false, error: 'sheet header row must be: ' + HEADERS.join(', ') });
    }

    const wanted = row.user.toLowerCase();
    let existingRow = -1;
    for (let i = 1; i < values.length; i++) {
      if (String(values[i][userCol]).trim().toLowerCase() === wanted) {
        existingRow = i + 1; // 1-based sheet row
        break;
      }
    }

    // Respect the sheet's column order, whatever it is.
    const ordered = new Array(header.length).fill('');
    HEADERS.forEach(h => { ordered[header.indexOf(h)] = row[h]; });

    if (existingRow !== -1) {
      writeRow(sheet, existingRow, ordered);
      return jsonResponse({ success: true, updated: true });
    }
    writeRow(sheet, sheet.getLastRow() + 1, ordered);
    return jsonResponse({ success: true, updated: false });
  } catch (err) {
    return jsonResponse({ success: false, error: String(err && err.message || err) });
  } finally {
    lock.releaseLock();
  }
}

// Lets you check the deployment by opening the URL in a browser.
function doGet() {
  return jsonResponse({ success: true, message: 'Ambassador credentials endpoint is running. Use POST.' });
}

// Writes as plain text so Sheets never reinterprets base64 (e.g. a leading "+") as a number.
function writeRow(sheet, rowIndex, values) {
  const range = sheet.getRange(rowIndex, 1, 1, values.length);
  range.setNumberFormat('@');
  range.setValues([values]);
}

function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
