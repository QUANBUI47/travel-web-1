# Email Supabase — Vivu

File HTML thuần, **không** Handlebars. Chỉ dùng biến Supabase: `{{ .ConfirmationURL }}`, `{{ .Email }}`, `{{ .SiteURL }}`.

## Cấu hình

1. SMTP: [docs/SMTP-SETUP.md](../../docs/SMTP-SETUP.md)
2. **Authentication** → **Email Templates** → dán file tương ứng:

| Template       | File                | Subject                          |
| -------------- | ------------------- | -------------------------------- |
| Confirm signup | `confirmation.html` | `Xác nhận tài khoản Vivu Travel` |
| Reset password | `recovery.html`     | `Đặt lại mật khẩu Vivu Travel`   |
| Magic Link     | `magic_link.html`   | `Đăng nhập Vivu Travel`          |

3. **Site URL** = `NEXT_PUBLIC_SITE_URL` (logo: `{{ .SiteURL }}/images/vivu-logo-email.png`)

Sửa giao diện → chỉnh trực tiếp file `.html` → Save trên Dashboard.
