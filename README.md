# UptoZishu Admin (separate website)

Static site (no build). Host it like the store and console — put these files in their own repo, domain in `CNAME` (`admin.uptozishu.zishuai.cloud`).

- `index.html`, `assets/admin.css`, `assets/admin.js`, `favicon.png`, `CNAME`
- Uses the same Firebase project as the store and console.

## Who is an admin
Realtime Database → `admins` → `<uid>` = `true`. Remove it to remove access. (Needs `firebase-rules-NEW.json` published.)

## One-time setup
Firebase Console → Authentication → Settings → Authorized domains → add `admin.uptozishu.zishuai.cloud` (needed for Google sign-in).
