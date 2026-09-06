# auth-demo

Demo app cho đề bài phỏng vấn "Authentication & User Management": Đăng nhập,
Trang thông tin tài khoản, Đổi mật khẩu, Phân quyền Admin/User.

Không yêu cầu UI đẹp, không production-ready, không deploy — mục tiêu là thể
hiện đúng flow, hiểu rõ từng cơ chế và giải thích được.

## Stack

- **Backend**: Node.js + Express
- **DB**: SQLite (`better-sqlite3`, sync API, không cần cài server DB riêng)
- **Auth**: JWT lưu trong cookie `httpOnly`
- **Password hashing**: bcrypt
- **Rate limiting**: `express-rate-limit` (chống brute-force ở `/login`)
- **Logging**: catalog event trong `events.yaml` + `src/logger.js`

## Cài đặt & chạy

```bash
npm install
node scripts/seed.js   # tạo 2 tài khoản demo (xem bên dưới)
node src/server.js     # http://localhost:3000/login.html
```

> **Windows/PowerShell**: nếu `npm run seed` báo lỗi
> `running scripts is disabled on this system`, đó là PowerShell chặn file
> `.ps1` của npm, không phải lỗi project. Dùng `npm.cmd run seed` hoặc chạy
> thẳng bằng `node scripts/seed.js` / `node src/server.js` như trên.

### Tài khoản demo (sau khi seed)

| Email | Password | Role |
|---|---|---|
| `admin@example.com` | `Admin@123` | admin |
| `user@example.com` | `User@123` | user |

Chạy lại `node scripts/seed.js` bất cứ lúc nào để reset DB về đúng 2 tài
khoản này (mất hết thay đổi cũ, kể cả password đã đổi qua UI). Cũng chính là
việc mà Claude Code Skill `seed-demo-users` (`.claude/skills/seed-demo-users/`)
làm.

## Cấu trúc thư mục

```
auth-demo/
  .env                    JWT_SECRET, PORT
  events.yaml             catalog message logging (level + description)
  scripts/seed.js         reset DB + seed 2 tài khoản demo
  src/
    config.js             config không nhạy cảm (port, jwtExpiresIn, rate limit...)
    db.js                 mở SQLite, tạo bảng users
    logger.js             đọc events.yaml, expose log()/log.info/warn/error
    server.js             khởi tạo Express, mount route, serve public/
    middleware/
      auth.js              verify JWT từ cookie, trả về req.user
      requireRole.js        middleware factory kiểm tra role
    routes/
      auth.routes.js        POST /api/auth/login, /logout
      user.routes.js         GET /api/users/me, PUT /api/users/me/password
      admin.routes.js        GET /api/admin/users (chỉ admin)
  public/                  login.html, account.html, change-password.html, admin.html
  .claude/skills/seed-demo-users/SKILL.md
```

## API

| Method | Path | Auth | Mô tả |
|---|---|---|---|
| POST | `/api/auth/login` | không | Đăng nhập, set cookie JWT. Có rate-limit 5 lần/IP/15 phút |
| POST | `/api/auth/logout` | không | Xoá cookie |
| GET | `/api/users/me` | đã đăng nhập | Thông tin tài khoản hiện tại |
| PUT | `/api/users/me/password` | đã đăng nhập | Đổi mật khẩu (cần `oldPassword`), tự động clear cookie sau khi đổi |
| GET | `/api/admin/users` | đăng nhập + role `admin` | Danh sách toàn bộ user |

## Flow xác thực (tóm tắt)

```
Đăng nhập    : so sánh password với bcrypt hash trong DB, ký JWT {sub, role},
               set cookie httpOnly (hết hạn 1h, khớp với JWT)
Request sau  : browser tự gửi cookie, middleware "auth" verify JWT,
               gán req.user = {id, role}, route dùng để trả dữ liệu
Phân quyền   : middleware "requireRole('admin')" chạy sau "auth",
               sai role trả 403; chưa đăng nhập trả 401 (ở bước "auth")
Đổi mật khẩu : xác nhận lại oldPassword, hash password mới,
               clearCookie ngay (vô hiệu hóa session hiện tại)
```

Chi tiết hơn: JWT không mã hoá payload (chỉ ký), nên không nhét dữ liệu nhạy
cảm vào. `password_hash` trong DB chỉ được dùng lúc login và lúc đổi mật
khẩu — các request đã đăng nhập khác không đụng tới nó, chỉ verify JWT bằng
`JWT_SECRET`.

## Bảo mật đã cân nhắc

- **httpOnly cookie**: JS phía client không đọc được token, giảm rủi ro XSS
  đánh cắp session.
- **sameSite: lax**: chặn cookie bị gửi kèm trong request ngầm cross-site
  (CSRF từ form/script ở site khác).
- **bcrypt + salt nhúng sẵn trong hash**: DB bị lộ vẫn không tra ngược được
  password gốc, và không thể brute-force hàng loạt bằng rainbow table vì mỗi
  user có salt riêng.
- **Rate-limit ở `/login`**: chống brute-force / credential stuffing. Đây
  **không phải** giải pháp chống DDoS thật (DDoS volumetric phải chặn ở tầng
  hạ tầng/CDN, ngoài phạm vi code app).
- **JWT_SECRET đọc thẳng từ `process.env`**, không đi qua `config.js`, để
  tránh secret bị loang qua 1 object có thể vô tình bị log/serialize.

Giới hạn đã biết (chấp nhận được ở quy mô demo): rate-limit dùng in-memory
store (mất khi restart server, không đồng bộ nếu chạy nhiều instance); chưa
có HTTPS (bắt buộc phải có ở production để bảo vệ password lúc truyền đi).

## Test thủ công

Không có test tự động — test bằng tay qua UI (`public/login.html`, rồi
`account.html`, `change-password.html`, `admin.html`) hoặc bằng `curl`:
login đúng/sai, xem account info, đổi mật khẩu đúng/sai `oldPassword`, và
gọi `/api/admin/users` bằng cả 2 tài khoản để thấy 403 (user) và danh sách
đầy đủ (admin).
