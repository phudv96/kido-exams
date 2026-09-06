const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../db');
const auth = require('../middleware/auth');
const log = require('../logger');

const router = express.Router();

/**
 * GET /api/users/me
 * Tra thong tin cua chinh user dang goi (danh tinh lay tu JWT trong cookie, khong
 * phai tu URL param) - vi vay 1 user khong the doc thong tin cua user khac qua route nay.
 *
 * Yeu cau: da dang nhap (middleware `auth`).
 * Response: 200 { user: { id, email, role } } | 401 chua dang nhap | 404 user bi xoa
 */
router.get('/me', auth, (req, res) => {
  const user = db
    .prepare('SELECT id, email, role FROM users WHERE id = ?')
    .get(req.user.id);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.json({ user });
});

/**
 * PUT /api/users/me/password
 * Doi mat khau cua chinh user dang goi. Bat buoc phai dung oldPassword de xac nhan
 * lai danh tinh (khong chi dua vao JWT con hieu luc), tranh truong hop ai do chiem
 * duoc phien dang nhap (session hijack) roi tu do doi mat khau chiem luon tai khoan.
 *
 * Sau khi doi thanh cong: clearCookie('token') de vo hieu hoa ngay session hien tai,
 * bat buoc phai dang nhap lai bang mat khau moi (xem giai thich flow o cau hoi truoc).
 *
 * Yeu cau: da dang nhap (middleware `auth`).
 * Body: { oldPassword: string, newPassword: string }
 * Response: 200 { ok: true } | 400 thieu field hoac sai oldPassword | 401 chua dang nhap
 */
router.put('/me/password', auth, (req, res) => {
  const { oldPassword, newPassword } = req.body || {};
  if (!oldPassword || !newPassword) {
    return res.status(400).json({ error: 'Missing oldPassword or newPassword' });
  }

  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.id);
  if (!user || !bcrypt.compareSync(oldPassword, user.password_hash)) {
    log.warn('password_change_failed', { userId: req.user.id });
    return res.status(400).json({ error: 'Old password is incorrect' });
  }

  const newHash = bcrypt.hashSync(newPassword, 10);
  db.prepare('UPDATE users SET password_hash = ? WHERE id = ?').run(
    newHash,
    user.id
  );

  log.info('password_changed', { userId: user.id });
  res.clearCookie('token');
  res.json({ ok: true });
});

module.exports = router;
