const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const db = require('../db');
const config = require('../config');
const log = require('../logger');

const router = express.Router();

// Option cho cookie chua JWT - xem giai thich chi tiet tung field o cac cau
// hoi truoc: httpOnly (JS khong doc duoc, chong XSS steal token), sameSite=
// lax (chan CSRF tu request ngam cross-site), maxAge (khop voi jwtExpiresIn
// de cookie va token het han cung luc).
const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: 'lax',
  maxAge: config.cookieMaxAgeMs,
};

// Rate-limit rieng cho /login: chi chong brute-force / credential stuffing
// (1 IP thu nhieu password lien tuc), KHONG phai giai phap chong DDoS that
// su (DDoS volumetric phai chan o tang ha tang/CDN, ngoai pham vi code app).
const loginLimiter = rateLimit({
  windowMs: config.loginRateLimit.windowMs,
  max: config.loginRateLimit.max,
  // Tra ve RateLimit-* header (chuan moi) de client biet con bao nhieu
  // luot/khi nao reset.
  standardHeaders: true,
  // Tat X-RateLimit-* header (chuan cu, trung lap voi standardHeaders)
  // cho gon.
  legacyHeaders: false,
  handler: (req, res) => {
    // Duoc goi thay vi next() khi 1 IP vuot qua "max" request trong
    // "windowMs".
    log.warn('rate_limited', { ip: req.ip, path: req.originalUrl });
    res.status(429).json({
      error: 'Too many login attempts, please try again later',
    });
  },
});

/**
 * POST /api/auth/login
 * Xac thuc email/password, neu dung thi tao JWT moi va set vao cookie
 * httpOnly. Co gioi han rate-limit (loginLimiter) de chong brute-force.
 *
 * Body: { email: string, password: string }
 * Response: 200 { user } | 400 thieu field | 401 sai email/password |
 *           429 qua so lan thu
 */
router.post('/login', loginLimiter, (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: 'Missing email or password' });
  }

  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  if (!user || !bcrypt.compareSync(password, user.password_hash)) {
    // Co y tra CUNG 1 message cho "email khong ton tai" va "sai password"
    // de khong lo email nao co that trong he thong (chong user
    // enumeration).
    log.warn('login_failed', { email });
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const token = jwt.sign(
    // payload: KHONG nhet password/du lieu nhay cam, JWT khong ma hoa.
    { sub: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: config.jwtExpiresIn }
  );

  res.cookie('token', token, COOKIE_OPTIONS);
  log.info('login_success', {
    email: user.email,
    userId: user.id,
    role: user.role,
  });
  res.json({ user: { id: user.id, email: user.email, role: user.role } });
});

/**
 * POST /api/auth/logout
 * Xoa cookie "token" o phia trinh duyet. Khong can middleware `auth` vi
 * logout phai luon thanh cong duoc, ke ca khi cookie da het han/khong
 * hop le.
 *
 * Response: 200 { ok: true } (luon thanh cong)
 */
router.post('/logout', (req, res) => {
  try {
    // Chi de lay userId phuc vu logging, khong dung de quyet dinh co cho
    // logout hay khong.
    const payload = jwt.verify(req.cookies.token, process.env.JWT_SECRET);
    log.info('logout', { userId: payload.sub });
  } catch (err) {
    // Cookie thieu/het han: khong co user de log, van cho logout binh
    // thuong.
  }
  res.clearCookie('token');
  res.json({ ok: true });
});

module.exports = router;
