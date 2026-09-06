# Bài nộp phỏng vấn

## [interview-prep/](interview-prep/) — Phần 1 & 2: Bài tập thuật toán

4 bài tập nhỏ về tối ưu độ phức tạp thuật toán (two-pointer, expand-around-center...):

- [bai1.js](interview-prep/bai1.js), [bai2.js](interview-prep/bai2.js) — bài cơ bản
- [bai3.js](interview-prep/bai3.js) — tìm 2/3 phần tử có tổng bằng k (two-pointer, O(n²))
- [bai4.js](interview-prep/bai4.js) — đếm palindromic substring (expand around center, O(n²))

Chạy từng file bằng `node interview-prep/bai3.js` (hoặc file tương ứng).

## [auth-demo/](auth-demo/) — Phần 3: Authentication & User Management

App demo Node.js + Express + SQLite + JWT: Đăng nhập, Trang thông tin tài
khoản, Đổi mật khẩu, Phân quyền Admin/User. Có rate-limit chống brute-force,
logging theo catalog event (`events.yaml`), và 1 Claude Code Skill riêng cho
dự án (`auth-demo/.claude/skills/seed-demo-users`) để seed tài khoản demo.

Xem chi tiết đầy đủ (cách chạy, API, flow, các cân nhắc bảo mật) trong
[auth-demo/README.md](auth-demo/README.md).
