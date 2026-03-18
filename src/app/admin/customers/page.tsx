import { Card, CardBody } from "@heroui/card";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@heroui/table";
import { User } from "@heroui/user";
import { Chip } from "@heroui/chip";
import { Button } from "@heroui/button";
import * as LucideIcons from "lucide-react";
import { prisma } from "@/lib/prisma";

export default async function AdminCustomersPage() {
  const customers = await prisma.profile.findMany({
    where: { role: "USER" },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-extrabold tracking-tight text-default-900">Khách hàng</h1>
        <p className="text-default-500">Danh sách người dùng đăng ký trên hệ thống Vivu Travel.</p>
      </div>

      <Card className="border-none shadow-sm">
        <CardBody className="p-0">
          <Table aria-label="Danh sách khách hàng" removeWrapper className="min-h-[400px]">
            <TableHeader>
              <TableColumn className="bg-default-100/50 uppercase text-[10px]">Người dùng</TableColumn>
              <TableColumn className="bg-default-100/50 uppercase text-[10px]">Email</TableColumn>
              <TableColumn className="bg-default-100/50 uppercase text-[10px]">Số điện thoại</TableColumn>
              <TableColumn className="bg-default-100/50 uppercase text-[10px]">Ngày tạo</TableColumn>
              <TableColumn className="bg-default-100/50 uppercase text-[10px] text-right">Thao tác</TableColumn>
            </TableHeader>
            <TableBody emptyContent={"Chưa có khách hàng đăng ký."}>
              {customers.map((user: any) => (
                <TableRow key={user.id} className="hover:bg-default-50 transition-colors">
                  <TableCell>
                    <User
                      name={user.fullName || "Ẩn danh"}
                      description={user.role}
                      avatarProps={{
                        src: user.avatarUrl || `https://i.pravatar.cc/150?u=${user.id}`,
                        size: "sm",
                        isBordered: true,
                        color: "primary"
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-default-600 italic underline cursor-pointer">{user.email}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm font-medium">{user.phoneNumber || "--"}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-xs text-default-400">
                      {new Date(user.createdAt).toLocaleDateString("vi-VN")}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                       <Button isIconOnly variant="light" size="sm" color="primary"><LucideIcons.Mail size={16} /></Button>
                       <Button isIconOnly variant="light" size="sm" color="danger"><LucideIcons.Ban size={16} /></Button>
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
