/**
 * Script chuan bi du lieu test: xoa toan bo user hien co va tao lai dung 2 tai khoan
 * demo co dinh (1 admin, 1 user). Dung khi can reset ve trang thai sach de test lai
 * tu dau (vi du sau khi da doi mat khau qua UI luc test thu cong).
 *
 * Chay: npm run seed  (hoac node scripts/seed.js)
 * Cung chinh la script duoc Claude Code Skill "seed-demo-users" goi.
 */
require('dotenv').config();
const bcrypt = require('bcrypt');
const db = require('../src/db');

const DEMO_USERS = [
  { email: 'admin@example.com', password: 'Admin@123', role: 'admin' },
  { email: 'user@example.com', password: 'User@123', role: 'user' },
];

// Xoa het user cu truoc - dam bao seed luon idempotent (chay lai bao nhieu lan
// cung ra dung 2 tai khoan nay, khong bi loi UNIQUE constraint tren cot email).
db.exec('DELETE FROM users');

const insert = db.prepare(
  'INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?)'
);

for (const u of DEMO_USERS) {
  // Hash o day, khong bao gio insert password dang plaintext vao DB.
  const hash = bcrypt.hashSync(u.password, 10);
  insert.run(u.email, hash, u.role);
}

console.log('Seeded demo users:');
for (const u of DEMO_USERS) {
  console.log(`  ${u.role.padEnd(5)} -> ${u.email} / ${u.password}`);
}
