import { Card, CardBody, CardHeader } from "@heroui/card";
import { Divider } from "@heroui/divider";
import * as LucideIcons from "lucide-react";
import { clsx } from "clsx";
import { prisma } from "@/lib/prisma";

interface StatCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: keyof typeof LucideIcons;
  color: "primary" | "success" | "warning" | "danger" | "secondary";
}

function StatCard({ title, value, description, icon, color }: StatCardProps) {
  const Icon = LucideIcons[icon] as any;
  
  const colorMap = {
    primary: "bg-primary/10 text-primary shadow-primary/10",
    success: "bg-success/10 text-success shadow-success/10",
    warning: "bg-warning/10 text-warning shadow-warning/10",
    danger: "bg-danger/10 text-danger shadow-danger/10",
    secondary: "bg-secondary/10 text-secondary shadow-secondary/10",
  };

  return (
    <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
      <CardBody className="p-5 flex flex-row items-center gap-4">
        <div className={clsx("p-3 rounded-2xl shadow-inner", colorMap[color])}>
          <Icon size={24} />
        </div>
        <div className="flex flex-col">
          <p className="text-default-500 text-xs font-medium uppercase tracking-wider">{title}</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-bold text-default-900">{value}</h3>
          </div>
          <p className="text-default-400 text-[10px] mt-1 italic">{description}</p>
        </div>
      </CardBody>
    </Card>
  );
}

export default async function AdminDashboardPage() {
  // Fetch stats and recent bookings from DB
  const [bookingCount, tourCount, userCount, revenue, recentBookings] = await Promise.all([
    prisma.booking.count(),
    prisma.tour.count({ where: { isActive: true } }),
    prisma.profile.count({ where: { role: "USER" } }),
    prisma.payment.aggregate({ _sum: { amount: true }, where: { status: "SUCCESS" } }),
    prisma.booking.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        profile: true,
        tourBooking: { include: { tour: true } },
        hotelBooking: { include: { room: { include: { hotel: true } } } }
      }
    })
  ]);

  const totalRevenue = Number(revenue._sum.amount || 0).toLocaleString("vi-VN");

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-extrabold tracking-tight text-default-900">Bảng điều khiển</h1>
        <p className="text-default-500">Chào mừng trở lại, Administrator. Đây là tổng quan hệ thống hôm nay.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard 
          title="Tổng đơn đặt" 
          value={bookingCount} 
          description="Dữ liệu thời gian thực từ hệ thống" 
          icon="ShoppingBag" 
          color="primary" 
        />
        <StatCard 
          title="Tour hoạt động" 
          value={tourCount} 
          description="Các tour đang mở bán công khai" 
          icon="Palmtree" 
          color="success" 
        />
        <StatCard 
          title="Khách hàng" 
          value={userCount} 
          description="Người dùng đăng ký vai trò Customer" 
          icon="Users" 
          color="warning" 
        />
        <StatCard 
          title="Doanh thu (VND)" 
          value={totalRevenue} 
          description="Tổng tiền thanh toán thành công" 
          icon="Banknote" 
          color="secondary" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-none shadow-sm h-full flex flex-col">
          <CardHeader className="flex flex-col items-start px-6 pt-6 pb-2">
            <h2 className="text-lg font-bold">Đơn hàng gần đây</h2>
            <p className="text-default-400 text-xs">{recentBookings.length} giao dịch cuối cùng được xử lý</p>
          </CardHeader>
          <CardBody className="px-6 pb-6 flex-1 flex flex-col justify-between">
            <div className="w-full overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                   <tr className="text-default-400 font-medium border-b border-default-100">
                     <th className="py-3 px-2">Khách hàng</th>
                     <th className="py-3 px-2">Dịch vụ</th>
                     <th className="py-3 px-2">Giá trị</th>
                     <th className="py-3 px-2 text-right">Trạng thái</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-default-100">
                   {recentBookings.map((booking) => {
                     let service = "Khác";
                     if (booking.bookingType === "TOUR" && booking.tourBooking?.tour) service = booking.tourBooking.tour.nameVi;
                     if (booking.bookingType === "HOTEL" && booking.hotelBooking?.room?.hotel) service = booking.hotelBooking.room.hotel.nameVi;
                     
                     let color = "text-default-500";
                     let statusName: string = booking.status;
                     if (booking.status === "COMPLETED") { color = "text-success"; statusName = "Hoàn tất"; }
                     if (booking.status === "PENDING") { color = "text-warning"; statusName = "Chờ xử lý"; }
                     if (booking.status === "CONFIRMED") { color = "text-primary"; statusName = "Đã xác nhận"; }
                     if (booking.status === "CANCELLED") { color = "text-danger"; statusName = "Đã hủy"; }
                     
                     return (
                       <tr key={booking.id} className="hover:bg-default-50 transition-colors">
                         <td className="py-4 px-2 font-medium">{booking.guestName || booking.profile?.displayName || "Khách hàng"}</td>
                         <td className="py-4 px-2 text-default-600">
                            <span className="line-clamp-1">{service}</span>
                         </td>
                         <td className="py-4 px-2 font-semibold">₫{Number(booking.totalAmount).toLocaleString("vi-VN")}</td>
                         <td className={clsx("py-4 px-2 text-right font-bold w-[120px]", color)}>{statusName}</td>
                       </tr>
                     );
                   })}
                   {recentBookings.length === 0 && (
                     <tr>
                       <td colSpan={4} className="text-center py-6 text-default-400 font-medium italic">Không có giao dịch nào gần đây</td>
                     </tr>
                   )}
                </tbody>
              </table>
            </div>
            
            <div className="mt-auto">
              <Divider className="my-4" />
              <div className="flex justify-center">
                <button className="text-xs text-primary font-bold hover:underline">Xem tất cả đơn hàng →</button>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="border-none shadow-sm bg-primary text-white overflow-hidden relative">
          <CardBody className="p-8 flex flex-col justify-between z-10">
            <div>
               <h3 className="text-xl font-bold mb-2">Thông tin hệ thống</h3>
               <p className="text-primary-100 text-sm leading-relaxed">
                 Hệ thống Vivu Admin đang hoạt động ổn định. Đã cấu hình SEO tự động cho 120 trang sản phẩm mới.
               </p>
            </div>
            <div className="mt-8">
               <div className="flex justify-between items-end">
                  <div>
                     <p className="text-primary-200 text-xs">Sử dụng tài nguyên</p>
                     <p className="text-2xl font-bold">12%</p>
                  </div>
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md">
                     <LucideIcons.Activity className="text-white" size={24} />
                  </div>
               </div>
            </div>
          </CardBody>
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
        </Card>
      </div>
    </div>
  );
}
