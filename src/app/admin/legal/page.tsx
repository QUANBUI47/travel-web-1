import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import * as LucideIcons from "lucide-react";
import { Divider } from "@heroui/divider";

export default function AdminLegalPage() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-extrabold tracking-tight text-default-900">Pháp lý & Bảo mật</h1>
        <p className="text-default-500">Quản lý các điều khoản dịch vụ và chính sách bảo mật của hệ thống.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <Card className="border-none shadow-sm">
           <CardHeader className="flex gap-3 px-6 pt-6">
              <LucideIcons.FileText className="text-primary" />
              <h3 className="text-lg font-bold">Điều khoản Dịch vụ</h3>
           </CardHeader>
           <CardBody className="px-6 pb-6">
              <p className="text-sm text-default-500 mb-6">Phiên bản hiện tại: 1.0 (Cập nhật 15/03/2026)</p>
              <Button color="primary" variant="flat" className="font-bold w-full">Chỉnh sửa nội dung</Button>
           </CardBody>
         </Card>

         <Card className="border-none shadow-sm">
           <CardHeader className="flex gap-3 px-6 pt-6">
              <LucideIcons.Lock className="text-success" />
              <h3 className="text-lg font-bold">Chính sách Bảo mật</h3>
           </CardHeader>
           <CardBody className="px-6 pb-6">
              <p className="text-sm text-default-500 mb-6">Phiên bản hiện tại: 1.0 (Cập nhật 15/03/2026)</p>
              <Button color="success" variant="flat" className="font-bold w-full">Chỉnh sửa nội dung</Button>
           </CardBody>
         </Card>
      </div>

      <Card className="border-none shadow-sm">
         <CardHeader className="px-6 pt-6">
            <h3 className="text-lg font-bold">Nhật ký bảo mật</h3>
         </CardHeader>
         <CardBody className="px-6 pb-6">
            <div className="bg-default-50 p-4 rounded-xl space-y-3">
               <div className="flex justify-between text-xs border-b border-default-100 pb-2">
                  <span className="text-default-500">Admin Login - 18/03/2026 21:20</span>
                  <span className="text-success font-bold">Thành công</span>
               </div>
               <div className="flex justify-between text-xs border-b border-default-100 pb-2">
                  <span className="text-default-500">Admin Login - 18/03/2026 15:45</span>
                  <span className="text-success font-bold">Thành công</span>
               </div>
            </div>
         </CardBody>
      </Card>
    </div>
  );
}
