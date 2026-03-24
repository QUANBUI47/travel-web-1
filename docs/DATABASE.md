# Cấu trúc Database

Dự án sử dụng **PostgreSQL** (hosted trên Supabase) và **Prisma ORM** để quản lý sơ đồ dữ liệu.

## 📊 Sơ đồ thực thể chính (ERD)

Các Model chính trong `schema.prisma`:

### Người dùng & Phân quyền
- **`Profile`**: Thông tin người dùng mở rộng, liên kết với Supabase Auth. Lưu trữ `role` (ADMIN/USER), `displayName`, `avatarUrl`.

### Địa điểm & Sản phẩm
- **`Region`**: Vùng miền (VD: Miền Bắc, Miền Trung, Miền Nam).
- **`Destination`**: Điểm đến cụ thể (VD: Hạ Long, Phú Quốc, Hội An).
- **`Hotel`**: Khách sạn, resort.
- **`Room`**: Loại phòng trong khách sạn.
- **`Tour`**: Các gói tour du lịch.
- **`TourItinerary`**: Lịch trình chi tiết theo ngày của tour.

### Giao dịch & Phản hồi
- **`Booking`**: Thông tin đặt chỗ chung.
- **`HotelBooking` / `TourBooking`**: Chi tiết cụ thể cho từng loại đặt chỗ.
- **`Payment`**: Thông tin thanh toán liên kết với Booking.
- **`Review`**: Đánh giá từ khách hàng cho khách sạn hoặc tour.

### Cấu hình & Nội dung
- **`SeoPage`**: Quản lý metadata SEO cho từng trang theo slug.
- **`HomeSetting`**: Lưu trữ cấu hình giao diện trang chủ dạng JSON.
- **`SystemSetting`**: Các thiết lập hệ thống chung.
- **`LegalContent`**: Nội dung pháp lý, điều khoản dịch vụ.

## ⚙️ Quy trình làm việc với Prisma

### 1. Cập nhật Schema
Sau khi thay đổi `prisma/schema.prisma`, chạy lệnh sau để tạo file migration và cập nhật database:
```bash
npx prisma migrate dev --name <ten_migration>
```

### 2. Sinh mã Prisma Client
```bash
npx prisma generate
```

### 3. Kiểm tra dữ liệu (Prisma Studio)
```bash
npx prisma studio
```

## 📝 Lưu ý về Kiểu dữ liệu
- Tiền tệ (Giá phòng, giá tour) được lưu dưới dạng `Decimal(14, 0)` để đảm bảo độ chính xác và phù hợp với VNĐ.
- Các trường đa ngôn ngữ thường có hậu tố `Vi` (VD: `nameVi`) và `En` (VD: `nameEn`).
