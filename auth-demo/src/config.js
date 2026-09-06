require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3000,
  jwtExpiresIn: '1h',
  cookieMaxAgeMs: 60 * 60 * 1000, // khop voi jwtExpiresIn
  loginRateLimit: {
    windowMs: 15 * 60 * 1000, // 15 phut
    max: 5, // toi da 5 lan thu login / IP trong 1 window
  },
};
