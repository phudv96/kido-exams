const jwt = require('jsonwebtoken');

/**
 * Middleware xac thuc: doc JWT tu cookie "token", verify chu ky + han su dung,
 * roi gan req.user = { id, role } cho cac route/middleware phia sau su dung.
 *
 * Phai duoc gan TRUOC moi route can dang nhap (vi du: router.get('/me', auth, handler)).
 * Khong query lai DB o day - moi thu tin cay hoan toan vao payload da ky trong JWT.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 * @returns {void} tra 401 neu thieu cookie hoac token khong hop le/het han, nguoc lai goi next()
 */
function auth(req, res, next) {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  try {
    // jwt.verify kiem tra ca chu ky (chua bi sua/gia mao) lan claim "exp" (het han chua),
    // sai 1 trong 2 dieu se throw loi va roi vao catch ben duoi.
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: payload.sub, role: payload.role };
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

module.exports = auth;
