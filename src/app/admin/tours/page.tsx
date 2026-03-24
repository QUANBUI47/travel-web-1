"use client";

import React, { useState, useEffect } from "react";
import { Card, CardBody } from "@heroui/card";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Chip } from "@heroui/chip";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@heroui/table";
import { User } from "@heroui/user";
import { Tooltip } from "@heroui/tooltip";
import * as LucideIcons from "lucide-react";
import axios from "axios";
import { addToast } from "@heroui/toast";

export default function AdminToursPage() {
  const [tours, setTours] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTours();
  }, []);

  const fetchTours = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("/api/v1/tours");
      if (response.data.success) {
        setTours(response.data.data);
      }
    } catch (error) {
      console.error(error);
      addToast({ title: "Lỗi tải danh sách tour", color: "danger" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa tour này?")) return;
    try {
      const response = await axios.delete(`/api/v1/tours/${id}`);
      if (response.data.success) {
        addToast({ title: "Đã xóa tour thành công", color: "success" });
        fetchTours();
      }
    } catch (error) {
      addToast({ title: "Lỗi khi xóa tour", color: "danger" });
    }
  };

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
            <TableBody 
              items={tours} 
              isLoading={isLoading} 
              emptyContent={isLoading ? "Đang tải dữ liệu..." : "Chưa có tour nào được khởi tạo."}
            >
              {(tour) => (
                <TableRow key={tour.id} className="hover:bg-default-50 transition-colors">
                  <TableCell>
                    <User
                      name={tour.nameVi}
                      description={tour.slug}
                      avatarProps={{
                        src: tour.imageUrls?.[0] || "https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=200&auto=format&fit=crop",
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
                      <Tooltip content="Xem chi tiết">
                        <Button isIconOnly variant="light" size="sm"><LucideIcons.Eye size={18} className="text-default-400" /></Button>
                      </Tooltip>
                      <Tooltip content="Chỉnh sửa">
                        <Button isIconOnly variant="light" size="sm"><LucideIcons.Edit2 size={16} className="text-primary" /></Button>
                      </Tooltip>
                      <Tooltip content="Xóa tour" color="danger">
                        <Button isIconOnly variant="light" size="sm" onClick={() => handleDelete(tour.id)}><LucideIcons.Trash2 size={18} className="text-danger" /></Button>
                      </Tooltip>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardBody>
      </Card>
    </div>
  );
}

