import { Card, CardBody, CardHeader } from "@heroui/card";
import { Input, Textarea } from "@heroui/input";
import { Button } from "@heroui/button";
import { Select, SelectItem } from "@heroui/select";
import { Switch } from "@heroui/switch";
import * as LucideIcons from "lucide-react";

export default function AdminTourDetailPage({ params }: { params: { id: string } }) {
  const isNew = params.id === "new";

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Button isIconOnly variant="flat" radius="full" size="sm">
             <LucideIcons.ChevronLeft size={20} />
          </Button>
          <h1 className="text-3xl font-extrabold tracking-tight text-default-900">
            {isNew ? "Thêm Tour mới" : "Chỉnh sửa Tour"}
          </h1>
        </div>
        <div className="flex gap-2">
           <Button variant="flat">Hủy bỏ</Button>
           <Button color="primary" className="font-bold shadow-lg shadow-primary/20">Lưu thông tin</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-none shadow-sm">
            <CardHeader className="px-6 pt-6 font-bold text-lg">Thông tin cơ bản</CardHeader>
            <CardBody className="px-6 pb-6 space-y-4">
               <Input label="Tên Tour (Vietnamese)" placeholder="Vịnh Hạ Long — Hành trình di sản" variant="bordered" />
               <Input label="Tên Tour (English)" placeholder="Ha Long Bay — Heritage Journey" variant="bordered" />
               <div className="grid grid-cols-2 gap-4">
                  <Input label="Slug (URL)" placeholder="ha-long-bay-journey" variant="bordered" />
                  <Input label="Giá gốc (VND)" type="number" placeholder="2,500,000" variant="bordered" />
               </div>
               <Textarea label="Mô tả vắn tắt" placeholder="Mô tả nhanh về tour..." variant="bordered" />
            </CardBody>
          </Card>

          <Card className="border-none shadow-sm">
            <CardHeader className="px-6 pt-6 font-bold text-lg">Hình ảnh</CardHeader>
            <CardBody className="px-6 pb-6">
               <div className="grid grid-cols-3 gap-4 h-40">
                  <div className="border-2 border-dashed border-default-200 rounded-2xl flex flex-col items-center justify-center text-default-400 hover:border-primary hover:text-primary transition-colors cursor-pointer">
                     <LucideIcons.Upload size={24} />
                     <span className="text-[10px] mt-2 font-bold uppercase">Upload</span>
                  </div>
                  <div className="bg-default-100 rounded-2xl relative overflow-hidden group">
                     <img src="https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=300&auto=format&fit=crop" className="w-full h-full object-cover" />
                     <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <Button isIconOnly size="sm" color="danger" variant="flat"><LucideIcons.Trash2 size={16} /></Button>
                     </div>
                  </div>
               </div>
            </CardBody>
          </Card>
        </div>

        <div className="space-y-6">
           <Card className="border-none shadow-sm">
             <CardHeader className="px-6 pt-6 font-bold text-lg">Trạng thái & Phân loại</CardHeader>
             <CardBody className="px-6 pb-6 space-y-4">
                <div className="flex justify-between items-center p-3 bg-default-50 rounded-xl border border-default-100">
                   <div className="flex flex-col gap-1">
                      <p className="text-sm font-bold">Hoạt động</p>
                      <p className="text-[10px] text-default-400">Hiển thị tour lên website</p>
                   </div>
                   <Switch defaultSelected />
                </div>
                <Select label="Điểm đến" variant="bordered">
                   <SelectItem key="halong">Hạ Long</SelectItem>
                   <SelectItem key="danang">Đà Nẵng</SelectItem>
                   <SelectItem key="phuquoc">Phú Quốc</SelectItem>
                </Select>
                <Input label="Số ngày" placeholder="3" type="number" variant="bordered" />
                <Input label="Phòng khách sạn (Chọn)" placeholder="Mường Thanh Luxury..." variant="bordered" />
             </CardBody>
           </Card>
        </div>
      </div>
    </div>
  );
}
