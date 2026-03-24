# Kiến trúc hệ thống (Architecture)

Dự án Vivu Travel được xây dựng trên nền tảng **Next.js 14** sử dụng **App Router**, tuân thủ các nguyên tắc thiết kế hiện đại để đảm bảo tính mở mở rộng và dễ bảo trì.

## 🏗️ Cấu trúc thư mục `src/`

- **`app/`**: Chứa các route, layout và page của ứng dụng (Next.js App Router).
  - `(auth)`: Nhóm các route liên quan đến xác thực người dùng.
  - `(main)`: Nhóm các route chính của website (Home, Hotels, Tours).
  - `admin`: Khu vực quản trị hệ thống.
  - `api`: Các API route handler.
- **`services/`**: Layer xử lý logic nghiệp vụ và tương tác với Database/External API. Các component và action nên gọi qua service thay vì gọi trực tiếp Prisma.
- **`actions/`**: Chứa các Server Actions để xử lý Form submission và các thao tác mutation từ phía Client.
- **`components/`**: Thư viện các UI component dùng chung, được xây dựng dựa trên HeroUI.
- **`lib/`**: Chứa các cấu hình thư viện bên thứ ba (Prisma client, Supabase client).
- **`constants/`**: Lưu trữ các hằng số, enum, route path dùng chung toàn hệ thống.
- **`utils/`**: Các hàm tiện ích (helper functions).
- **`types/`**: Định nghĩa các TypeScript interface và type.
- **`messages/`**: Chứa các tệp JSON lưu trữ bản dịch cho đa ngôn ngữ (VI/EN).

## 🛡️ Xác thực & Phân quyền (Auth)

Dự án sử dụng **Supabase Auth** với cơ chế **SSR (Server-Side Rendering)**.
- `middleware.ts` đóng vai trò quan trọng trong việc làm mới session và bảo vệ các route nhạy cảm (như `/admin/*`).
- Có hai vai trò chính: `USER` (Khách hàng) và `ADMIN` (Quản trị viên).

## 🌐 Đa ngôn ngữ (i18n)

Hệ thống sử dụng `next-intl` để hỗ trợ đa ngôn ngữ từ phía Server lẫn Client.
- Các bản dịch được tập trung tại `src/messages/`.
- `middleware` xử lý việc xác định ngôn ngữ từ URL hoặc cookie.

## 💾 Tương tác dữ liệu

- **Prisma ORM**: Được sử dụng để giao tiếp với PostgreSQL.
- **Service Layer**: Mọi truy vấn Prisma phức tạp nên được đóng gói trong các tệp tại `src/services/` để tái sử dụng giữa Server Components, API Routes và Server Actions.
