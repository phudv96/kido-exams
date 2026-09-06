const log = require('../logger');

/**
 * Middleware factory phan quyen: tra ve 1 middleware chi cho request di tiep
 * neu req.user.role dung bang "role" yeu cau.
 *
 * Phai dung SAU middleware `auth` (can req.user da duoc gan truoc), vi du:
 *   router.get('/users', auth, requireRole('admin'), handler)
 * Tach rieng voi `auth` vi day la 2 loai loi khac ban chat: `auth` tra 401
 * ("chua chung minh duoc anh la ai"), con day tra 403 ("biet anh la ai roi,
 * nhung khong du quyen").
 *
 * @param {string} role - role yeu cau, vi du 'admin'
 * @returns {import('express').RequestHandler} middleware kiem tra role
 */
function requireRole(role) {
  return function (req, res, next) {
    if (!req.user || req.user.role !== role) {
      log.warn('admin_access_denied', {
        userId: req.user ? req.user.id : 'unknown',
        role: req.user ? req.user.role : 'unknown',
        path: req.originalUrl,
      });
      return res.status(403).json({ error: 'Forbidden' });
    }
    next();
  };
}

module.exports = requireRole;
