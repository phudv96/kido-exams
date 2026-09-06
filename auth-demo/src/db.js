const path = require('path');
const Database = require('better-sqlite3');

// better-sqlite3 mo/tao file data.sqlite ngay khi require module nay - khong can
// buoc "connect" rieng nhu cac driver DB khac (sync API, khong async/callback).
const db = new Database(path.join(__dirname, '..', 'data.sqlite'));

// Chay 1 lan luc app khoi dong: tao bang neu chua co, khong lam gi neu da ton tai.
// Khong co migration framework rieng - du voi quy mo demo nay.
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('admin', 'user')),
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  )
`);

module.exports = db;
