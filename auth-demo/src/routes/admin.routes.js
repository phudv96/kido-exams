const express = require('express');
const db = require('../db');
const auth = require('../middleware/auth');
const requireRole = require('../middleware/requireRole');
const log = require('../logger');

const router = express.Router();

/**
 * GET /api/admin/users
 * Tra toan bo danh sach user (khac /me: route nay lo du lieu cua NGUOI KHAC nen
 * chi admin duoc goi). Vi vay can 2 middleware xep chong: `auth` (co dang nhap
 * khong) roi moi den `requireRole('admin')` (dung role khong).
 *
 * Yeu cau: da dang nhap VA role = 'admin'.
 * Response: 200 { users: [{id, email, role, created_at}] } | 401 chua dang nhap | 403 khong du quyen
 */
router.get('/users', auth, requireRole('admin'), (req, res) => {
  const users = db.prepare('SELECT id, email, role, created_at FROM users').all();
  log.info('admin_list_users', { userId: req.user.id });
  res.json({ users });
});

module.exports = router;
