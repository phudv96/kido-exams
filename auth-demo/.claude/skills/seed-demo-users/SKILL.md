---
name: seed-demo-users
description: Reset the auth-demo SQLite database and seed it with fixed admin/user demo accounts for manual testing of login, account info, change password, and admin role flows.
---

# Seed demo users

Use this skill when you need a clean, known set of test accounts for `auth-demo` — before a manual test pass, a demo, or after the DB has been mutated by ad-hoc testing (password changes, etc.).

## What it does

Runs `node scripts/seed.js` from the `auth-demo` project root, which:
1. Wipes the `users` table in `data.sqlite` (creates the file/table first run).
2. Inserts two fixed accounts:
   - `admin@example.com` / `Admin@123` (role `admin`)
   - `user@example.com` / `User@123` (role `user`)
3. Prints the credentials to stdout.

## Steps

1. Ensure dependencies are installed: `npm install` in `auth-demo/` (skip if `node_modules` already exists).
2. Run `npm run seed` (or `node scripts/seed.js`) from `auth-demo/`.
3. Confirm the console output lists both demo accounts before proceeding to test login/account/change-password/admin flows.

## Notes

- Passwords are hashed with bcrypt before insert — the DB never stores plaintext.
- Re-running this skill always resets both accounts back to their original password, undoing any `PUT /api/users/me/password` changes made during testing.
