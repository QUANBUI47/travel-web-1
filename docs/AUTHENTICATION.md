# Hệ thống xác thực (Authentication)

Dự án Vivu Travel sử dụng **Supabase Auth** để quản lý người dùng và phiên đăng nhập. Việc tích hợp được thực hiện thông qua `@supabase/ssr` của Next.js để đảm bảo tính nhất quán giữa Server-side và Client-side.

## 🗝️ Luồng xác thực cơ bản

### 1. Đăng nhập & Đăng ký
- **Client Side**: Sử dụng `supabase.auth.signInWithPassword()` hoặc các Provider bên thứ ba (Google, Apple).
- **Server Side**: Thông qua **Server Actions** (`src/actions/auth.actions.ts`) để tương tác an toàn với Supabase Auth API từ phía server.

### 2. Quản lý Phiên (Session)
- Phên đăng nhập được lưu trữ trong Cookie, cho phép Next.js Server Components và Middleware truy cập trực tiếp.
- `src/middleware.ts` tự động làm mới (refresh) access token của người dùng khi nó sắp hết hạn thông qua cơ chế `setAll` của Supabase SSR.

## 🛡️ Phân quyền & Bảo vệ Route

### Vai trò (Roles)
Hệ thống sử dụng ENUM `Role` trong database (đồng bộ với Prisma):
- `USER`: Khách hàng thông thường.
- `ADMIN`: Quản trị viên hệ thống.

### Bảo vệ bằng Middleware
`src/middleware.ts` kiểm duyệt mọi request:
- **Admin Layout**: Chỉ `ADMIN` mới có thể truy cập `/admin/*`. Nếu chưa đăng nhập hoặc không có quyền lợi, người dùng sẽ bị redirect về `/admin/login` hoặc trang chủ.
- **Client Auth Pages**: Nếu người dùng đã đăng nhập, họ sẽ không thể truy cập lại trang `/login` hoặc `/register` (trừ khi là ADMIN đang truy cập trang công khai).

## 🧩 Shared Auth State

- **`i18n-provider.tsx`**: Cung cấp context xác thực cho toàn bộ ứng dụng Client.
- **`user-menu.tsx`**: Component hiển thị thông tin người dùng và nút đăng xuất trên Navbar, xử lý logic hiển thị dựa trên trạng thái auth hiện tại.

## 🔒 Lưu ý bảo mật
- **Row Level Security (RLS)**: Nên được kích hoạt trên Supabase cho các bảng quan trọng để bảo vệ dữ liệu ở mức database.
- **Environment Variables**: Phải cấu hình đầy đủ `NEXT_PUBLIC_SUPABASE_URL` và `NEXT_PUBLIC_SUPABASE_ANON_KEY` trong tệp `.env`.
