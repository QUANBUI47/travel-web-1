import { Card, CardBody, CardHeader } from "@heroui/card";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Tổng quan</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-0">Điểm đến</CardHeader>
          <CardBody className="pt-1">
            <p className="text-2xl font-semibold">—</p>
            <p className="text-default-500 text-sm">Sẽ lấy từ DB</p>
          </CardBody>
        </Card>
        <Card>
          <CardHeader className="pb-0">Khách sạn</CardHeader>
          <CardBody className="pt-1">
            <p className="text-2xl font-semibold">—</p>
            <p className="text-default-500 text-sm">Sẽ lấy từ DB</p>
          </CardBody>
        </Card>
        <Card>
          <CardHeader className="pb-0">Tour</CardHeader>
          <CardBody className="pt-1">
            <p className="text-2xl font-semibold">—</p>
            <p className="text-default-500 text-sm">Sẽ lấy từ DB</p>
          </CardBody>
        </Card>
        <Card>
          <CardHeader className="pb-0">Đơn đặt (tháng)</CardHeader>
          <CardBody className="pt-1">
            <p className="text-2xl font-semibold">—</p>
            <p className="text-default-500 text-sm">Sẽ lấy từ DB</p>
          </CardBody>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Phân quyền</h2>
        </CardHeader>
        <CardBody>
          <p className="text-default-600 text-sm">
            Khu vực Admin chỉ dành cho tài khoản có role <strong>ADMIN</strong>.
            Khi tích hợp Supabase Auth, kiểm tra <code>profiles.role</code> và
            chuyển hướng user thường về trang chủ nếu truy cập /admin.
          </p>
        </CardBody>
      </Card>
    </div>
  );
}
