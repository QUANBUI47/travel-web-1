# Vivu Travel - Web Application

Vivu Travel là một nền tảng du lịch hiện đại dành cho thị trường Việt Nam, chuyên về đặt phòng khách sạn và các tour du lịch đa dạng. Dự án được xây dựng với mục tiêu mang lại trải nghiệm người dùng mượt mà, tối ưu SEO và hỗ trợ đa ngôn ngữ.

## 🚀 Công nghệ sử dụng

- **Frontend**: [Next.js 14](https://nextjs.org/) (App Router), [HeroUI v2](https://heroui.com/) (formerly NextUI), [Tailwind CSS](https://tailwindcss.com/).
- **Backend & Database**: [Prisma](https://www.prisma.io/) ORM, [PostgreSQL](https://www.postgresql.org/) (hosted on Supabase).
- **Authentication**: [Supabase Auth](https://supabase.com/auth).
- **Quản lý ảnh**: [Cloudinary](https://cloudinary.com/).
- **Đa ngôn ngữ**: `next-intl` (Hỗ trợ Tiếng Việt & Tiếng Anh).

## ✨ Tính năng chính

- **Đặt phòng & Tour**: Hệ thống tìm kiếm và đặt chỗ linh hoạt.
- **Admin Dashboard**: Quản lý nội dung (CMS), cấu hình hệ thống, quản lý đơn hàng.
- **i18n**: Chuyển đổi ngôn ngữ VI/EN toàn diện.
- **Tối ưu SEO**: Metadata chuẩn SEO cho từng trang, sitemap và robots.txt tự động.
- **Responsive Design**: Giao diện tối ưu cho mọi thiết bị (Desktop, Mobile).

## 🛠️ Cài đặt & Chạy dự án

### 1. Cài đặt dependencies

```bash
npm install
```

### 2. Cấu hình biến môi trường

Sao chép tệp `.env.example` thành `.env.local` và điền thông tin:

```bash
cp .env.example .env.local
```

### 3. Thiết lập Database (Prisma)

```bash
npx prisma generate
npx prisma db push
```

### 4. Chạy server phát triển

```bash
npm run dev
```

Truy cập `http://localhost:3000` để xem kết quả.

## 📖 Tài liệu hướng dẫn thêm

Để hiểu sâu hơn về dự án, vui lòng tham khảo các tài liệu trong thư mục `docs/`:

- [Kiến trúc hệ thống (Architecture)](./docs/ARCHITECTURE.md)
- [Cấu trúc Database](./docs/DATABASE.md)
- [Hệ thống xác thực (Authentication)](./docs/AUTHENTICATION.md)
- [Hướng dẫn đa ngôn ngữ (i18n)](./docs/I18N.md)

## 📄 License

Project này được phát triển bởi Vivu Travel Team.
