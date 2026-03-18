import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Chip } from "@heroui/chip";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@heroui/table";
import { User } from "@heroui/user";
import * as LucideIcons from "lucide-react";
import { prisma } from "@/lib/prisma";

export default async function AdminToursPage() {
  const tours = await prisma.tour.findMany({
    include: { destination: true },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-extrabold tracking-tight text-default-900">Quản lý Tour</h1>
          <p className="text-default-500">Danh sách các chương trình du lịch hiện có trên hệ thống.</p>
        </div>
        <Button color="primary" startContent={<LucideIcons.Plus size={18} />} className="font-bold shadow-lg shadow-primary/20">
          Thêm Tour mới
        </Button>
      </div>

      <div className="flex gap-4">
        <Input 
          placeholder="Tìm kiếm tour theo tên hoặc địa điểm..." 
          startContent={<LucideIcons.Search size={18} className="text-default-400" />}
          variant="flat"
          className="flex-1"
        />
        <Button variant="flat" startContent={<LucideIcons.Filter size={18} />}>Bộ lọc</Button>
      </div>

      <Card className="border-none shadow-sm">
        <CardBody className="p-0">
          <Table aria-label="Danh sách tour" removeWrapper className="min-h-[400px]">
            <TableHeader>
              <TableColumn className="bg-default-100/50">TÊN TOUR</TableColumn>
              <TableColumn className="bg-default-100/50">ĐỊA ĐIỂM</TableColumn>
              <TableColumn className="bg-default-100/50">THỜI GIAN</TableColumn>
              <TableColumn className="bg-default-100/50">GIÁ TỪ (VND)</TableColumn>
              <TableColumn className="bg-default-100/50">TRẠNG THÁI</TableColumn>
              <TableColumn className="bg-default-100/50 text-right">THAO TÁC</TableColumn>
            </TableHeader>
            <TableBody emptyContent={"Chưa có tour nào được khởi tạo."}>
              {tours.map((tour: any) => (
                <TableRow key={tour.id} className="hover:bg-default-50 transition-colors">
                  <TableCell>
                    <User
                      name={tour.nameVi}
                      description={tour.slug}
                      avatarProps={{
                        src: tour.imageUrls[0] || "https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=200&auto=format&fit=crop",
                        radius: "lg"
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <LucideIcons.MapPin size={14} className="text-default-400" />
                      <span className="text-sm font-medium">{tour.destination?.nameVi || "N/A"}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{tour.durationDays} ngày</span>
                  </TableCell>
                  <TableCell>
                    <span className="font-bold">₫{Number(tour.priceFrom).toLocaleString("vi-VN")}</span>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      color={tour.isActive ? "success" : "default"} 
                      size="sm" 
                      variant="flat" 
                      className="font-bold uppercase text-[10px]"
                    >
                      {tour.isActive ? "Hoạt động" : "Tạm ẩn"}
                    </Chip>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button isIconOnly variant="light" size="sm"><LucideIcons.Eye size={18} className="text-default-400" /></Button>
                      <Button isIconOnly variant="light" size="sm"><LucideIcons.Edit2 size={16} className="text-primary" /></Button>
                      <Button isIconOnly variant="light" size="sm"><LucideIcons.Trash2 size={18} className="text-danger" /></Button>
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
