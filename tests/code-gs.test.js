// Runs apps-script/Code.gs against in-memory fakes of the Apps Script services it uses.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const SRC = fs.readFileSync(path.join(__dirname, '..', 'apps-script', 'Code.gs'), 'utf8');

function load({ adminPassword = 'hunter2-long' } = {}) {
    const grid = [];
    const sheet = {
        getLastRow: () => grid.length,
        getDataRange: () => ({ getValues: () => grid.map(r => r.slice()) }),
        getRange: (row) => ({ setNumberFormat() {}, setValues(v) { grid[row - 1] = v[0].slice(); } }),
    };
    const ctx = {
        SpreadsheetApp: { getActiveSheet: () => sheet },
        LockService: { getScriptLock: () => ({ waitLock() {}, releaseLock() {} }) },
        PropertiesService: { getScriptProperties: () => ({ getProperty: k => (k === 'ADMIN_PASSWORD' ? adminPassword : null) }) },
        Utilities: { sleep() {} },
        ContentService: { MimeType: { JSON: 'json' }, createTextOutput: s => ({ setMimeType: () => JSON.parse(s) }) },
    };
    vm.createContext(ctx);
    vm.runInContext(SRC + '\nthis.doPost = doPost;', ctx);
    const post = body => ctx.doPost({ postData: { contents: typeof body === 'string' ? body : JSON.stringify(body) } });
    return { post, grid };
}

const ROW = { user: 'Rahul92', salt: 'c2E=', iv: 'aXY=', ct: '+Y3Q=' };

test('verify action: right password succeeds, wrong one fails, nothing is written', () => {
    const { post, grid } = load();
    assert.deepEqual(post({ action: 'verify', password: 'hunter2-long' }), { success: true });
    assert.deepEqual(post({ action: 'verify', password: 'nope' }), { success: false, error: 'incorrect admin password' });
    assert.equal(grid.length, 0);
});

test('add requires the admin password', () => {
    const { post, grid } = load();
    assert.deepEqual(post({ action: 'add', ...ROW }), { success: false, error: 'incorrect admin password' });
    assert.deepEqual(post({ action: 'add', password: 'wrong', ...ROW }), { success: false, error: 'incorrect admin password' });
    assert.equal(grid.length, 0);
});

test('an api key is no longer accepted in place of the password', () => {
    const { post } = load();
    assert.equal(post({ action: 'add', apiKey: 'hunter2-long', ...ROW }).success, false);
});

test('fails closed when ADMIN_PASSWORD script property is not set', () => {
    const { post } = load({ adminPassword: null });
    const res = post({ action: 'verify', password: '' });
    assert.equal(res.success, false);
    assert.match(res.error, /ADMIN_PASSWORD/);
});

test('add writes header + row, re-adding same user (any case) updates in place', () => {
    const { post, grid } = load();
    assert.deepEqual(post({ action: 'add', password: 'hunter2-long', ...ROW }), { success: true, updated: false });
    assert.deepEqual(post({ action: 'add', password: 'hunter2-long', ...ROW, user: 'amina.k' }), { success: true, updated: false });
    assert.deepEqual(post({ action: 'add', password: 'hunter2-long', ...ROW, user: 'RAHUL92', salt: 'bmV3' }), { success: true, updated: true });
    // JSON round trip: arrays built inside the vm context have a different Array prototype.
    assert.deepEqual(JSON.parse(JSON.stringify(grid)), [
        ['user', 'salt', 'iv', 'ct'],
        ['RAHUL92', 'bmV3', 'aXY=', '+Y3Q='],
        ['amina.k', 'c2E=', 'aXY=', '+Y3Q='],
    ]);
});

test('add still validates fields', () => {
    const { post } = load();
    const pw = { action: 'add', password: 'hunter2-long' };
    assert.deepEqual(post({ ...pw, ...ROW, ct: '' }), { success: false, error: 'missing field: ct' });
    assert.deepEqual(post({ ...pw, ...ROW, salt: 'not base64!' }), { success: false, error: 'invalid base64 in: salt' });
    assert.deepEqual(post({ ...pw, ...ROW, user: '=EVIL()' }), { success: false, error: 'username cannot start with = + - or @' });
});

test('unknown action and bad JSON are rejected', () => {
    const { post } = load();
    assert.deepEqual(post({ action: 'drop', password: 'hunter2-long' }), { success: false, error: 'unknown action' });
    assert.deepEqual(post('not json'), { success: false, error: 'invalid JSON body' });
});
