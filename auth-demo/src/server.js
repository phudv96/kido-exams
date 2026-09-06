const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');

// require('./config') o day dam bao dotenv.config() (goi ben trong config.js) chay
// TRUOC khi cac module ben duoi (routes/middleware) doc process.env.JWT_SECRET.
const config = require('./config');
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const adminRoutes = require('./routes/admin.routes');

const app = express();

app.use(express.json()); // parse JSON body -> req.body
app.use(cookieParser()); // parse header Cookie -> req.cookies (can cho middleware `auth` doc token)
app.use(express.static(path.join(__dirname, '..', 'public'))); // serve thang cac file trong public/ (login.html, account.html, ...)

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);

app.listen(config.port, () => {
  console.log(`auth-demo running at http://localhost:${config.port}/login.html`);
});
