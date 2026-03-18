import { Card, CardBody } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@heroui/table";
import { User } from "@heroui/user";
import { Button } from "@heroui/button";
import * as LucideIcons from "lucide-react";
import { prisma } from "@/lib/prisma";

const statusColorMap: Record<string, "warning" | "success" | "danger" | "default"> = {
  PENDING: "warning",
  CONFIRMED: "success",
  CANCELLED: "danger",
  COMPLETED: "default",
};

export default async function AdminBookingsPage() {
  const bookings = await prisma.booking.findMany({
    include: { profile: true },
    orderBy: { createdAt: "desc" },
    take: 15,
  });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-extrabold tracking-tight text-default-900">Đơn đặt chỗ</h1>
        <p className="text-default-500">Quản lý và xử lý các yêu cầu đặt tour/khách sạn từ khách hàng.</p>
      </div>

      <Card className="border-none shadow-sm">
        <CardBody className="p-0">
          <Table aria-label="Danh sách đơn đặt" removeWrapper className="min-h-[400px]">
            <TableHeader>
              <TableColumn className="bg-default-100/50">KHÁCH HÀNG</TableColumn>
              <TableColumn className="bg-default-100/50">LOẠI</TableColumn>
              <TableColumn className="bg-default-100/50 text-center">TỔNG TIỀN</TableColumn>
              <TableColumn className="bg-default-100/50">NGÀY ĐẶT</TableColumn>
              <TableColumn className="bg-default-100/50">TRẠNG THÁI</TableColumn>
              <TableColumn className="bg-default-100/50 text-right">THÀO TÁC</TableColumn>
            </TableHeader>
            <TableBody emptyContent={"Hiện chưa có đơn đặt chỗ nào."}>
              {bookings.map((booking: any) => (
                <TableRow key={booking.id} className="hover:bg-default-50 transition-colors">
                  <TableCell>
                    <User
                      name={booking.guestName}
                      description={booking.guestEmail}
                      avatarProps={{
                        src: booking.profile?.avatarUrl || `https://i.pravatar.cc/150?u=${booking.id}`,
                        size: "sm",
                        isBordered: true,
                        color: "primary"
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip size="sm" variant="flat" color={booking.bookingType === "TOUR" ? "secondary" : "primary"} className="font-bold text-[10px]">
                      {booking.bookingType}
                    </Chip>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="font-bold">₫{Number(booking.totalAmount).toLocaleString("vi-VN")}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-xs text-default-500 italic">
                      {new Date(booking.createdAt).toLocaleDateString("vi-VN")}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Chip
                      color={statusColorMap[booking.status]}
                      size="sm"
                      variant="dot"
                      className="font-bold text-[10px] uppercase"
                    >
                      {booking.status}
                    </Chip>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                       <Button isIconOnly variant="light" size="sm" color="primary"><LucideIcons.Search size={16} /></Button>
                       <Button isIconOnly variant="light" size="sm" color="success"><LucideIcons.Check size={18} /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardBody>
      </Card>
    </div>
  );
}
