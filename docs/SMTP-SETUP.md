# SMTP Supabase Auth — Vivu Travel

Email xác nhận / quên mật khẩu do **Supabase Auth** gửi qua **Custom SMTP** trên Dashboard.

---

## Bước 1 — Bật Custom SMTP (Supabase)

1. [Supabase Dashboard](https://supabase.com/dashboard) → project.
2. **Project Settings** → **Authentication** → **SMTP Settings**.
3. Bật **Enable Custom SMTP**.

### Gmail

| Trường       | Giá trị                                                                                              |
| ------------ | ---------------------------------------------------------------------------------------------------- |
| Sender email | `admin.vivu@gmail.com`                                                                               |
| Sender name  | `Vivu Travel`                                                                                        |
| Host         | `smtp.gmail.com`                                                                                     |
| Port         | `587` (hoặc `465`)                                                                                   |
| Username     | `admin.vivu@gmail.com`                                                                               |
| Password     | **App Password** 16 ký tự — [tạo tại đây](https://myaccount.google.com/apppasswords) (bật 2FA trước) |

> **Lỗi 535 BadCredentials:** App Password sai hoặc thiếu ký tự (phải đủ **16** ký tự, không phải mật khẩu đăng nhập Gmail).

### Resend (production)

| Trường   | Giá trị           |
| -------- | ----------------- |
| Host     | `smtp.resend.com` |
| Port     | `465`             |
| Username | `resend`          |
| Password | API key `re_...`  |

4. **Save**.

---

## Bước 2 — Template email

Copy `supabase/templates/confirmation.html` → **Authentication** → **Email Templates** → **Confirm signup** → Save.

Xem [supabase/templates/README.md](../supabase/templates/README.md).

---

## Bước 3 — URL & Confirm email

| Mục               | Dev                                   |
| ----------------- | ------------------------------------- |
| **Confirm email** | BẬT (Providers → Email)               |
| **Site URL**      | `http://localhost:3000`               |
| **Redirect URLs** | `http://localhost:3000/auth/callback` |

`.env`: `NEXT_PUBLIC_SITE_URL=http://localhost:3000`

---

## Kiểm tra

1. Save SMTP trên Supabase.
2. Dán template `confirmation.html`.
3. Đăng ký `/dang-ky` với email **khác** email SMTP.
4. Kiểm tra Spam.

---

## Lỗi thường gặp

| Lỗi                                | Nguyên nhân                                            |
| ---------------------------------- | ------------------------------------------------------ |
| `Error sending confirmation email` | SMTP sai trên **Supabase** (không phải `.env` app)     |
| `535 BadCredentials`               | App Password Gmail sai / thiếu ký tự                   |
| Logo không hiện trong Preview      | Bình thường với base64 — mail gửi vẫn OK               |
| Logo không hiện                    | Đặt **Site URL** đúng trên Supabase (logo tải từ site) |
