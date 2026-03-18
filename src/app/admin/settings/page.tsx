"use client";

import { useState } from "react";
import { Tabs, Tab } from "@heroui/tabs";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Input, Textarea } from "@heroui/input";
import { Button } from "@heroui/button";
import { Divider } from "@heroui/divider";
import * as LucideIcons from "lucide-react";
import { Switch } from "@heroui/switch";
import { addToast } from "@heroui/toast";
import { updateHomeSettings, updateSystemSettings } from "@/app/admin/actions";

export default function AdminSettingsPage() {
  const [isSaving, setIsSaving] = useState(false);

  // Handle Home Settings Save
  const handleSaveHome = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    const formData = new FormData(e.currentTarget);
    const data = {
      heroTitle: formData.get("heroTitle"),
      heroDescription: formData.get("heroDescription"),
      heroImage: formData.get("heroImage"),
    };

    const res = await updateHomeSettings(data);
    if (res.success) {
      addToast({ title: "Thành công", description: "Đã cập nhật cấu hình trang chủ.", color: "success" });
    } else {
      addToast({ title: "Lỗi", description: res.error, color: "danger" });
    }
    setIsSaving(false);
  };

  // Handle SEO Save
  const handleSaveSeo = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    const formData = new FormData(e.currentTarget);
    const settings = {
      siteTitle: formData.get("siteTitle"),
      metaDescription: formData.get("metaDescription"),
      faviconUrl: formData.get("faviconUrl"),
    };

    const res = await updateSystemSettings("SEO", settings);
    if (res.success) {
      addToast({ title: "Thành công", description: "Đã lưu cấu hình SEO.", color: "success" });
    } else {
      addToast({ title: "Lỗi", description: "Không thể lưu cài đặt SEO.", color: "danger" });
    }
    setIsSaving(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-extrabold tracking-tight text-default-900">Cài đặt hệ thống</h1>
        <p className="text-default-500">Quản lý nội dung trang chủ, cấu hình SEO và các thiết lập chung.</p>
      </div>

      <div className="flex w-full flex-col">
        <Tabs 
          aria-label="Options" 
          color="primary" 
          variant="underlined"
          classNames={{
            tabList: "gap-6 w-full relative rounded-none p-0 border-b border-divider",
            cursor: "w-full bg-primary",
            tab: "max-w-fit px-0 h-12",
            tabContent: "group-data-[selected=true]:text-primary font-semibold"
          }}
        >
          <Tab
            key="home"
            title={
              <div className="flex items-center space-x-2">
                <LucideIcons.Home size={18} />
                <span>Trang chủ</span>
              </div>
            }
          >
            <form onSubmit={handleSaveHome}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-6">
                <Card className="border-none shadow-sm h-fit">
                  <CardHeader className="px-6 pt-6">
                      <h3 className="text-lg font-bold">Hero Section</h3>
                  </CardHeader>
                  <CardBody className="px-6 pb-6 space-y-4">
                      <Input name="heroTitle" label="Tiêu đề chính (H1)" placeholder="Khám phá vẻ đẹp Việt Nam..." defaultValue="Khám phá vẻ đẹp Việt Nam" variant="bordered" />
                      <Textarea name="heroDescription" label="Mô tả phụ" placeholder="Hành trình của bạn bắt đầu từ đây..." defaultValue="Hành trình của bạn bắt đầu từ đây với những trải nghiệm du lịch tuyệt vời nhất." variant="bordered" />
                      <Input name="heroImage" label="URL Ảnh nền (Hero Image)" placeholder="https://..." variant="bordered" />
                      <Button type="submit" color="primary" className="font-bold" isLoading={isSaving}>Lưu thay đổi</Button>
                  </CardBody>
                </Card>

                <Card className="border-none shadow-sm h-fit">
                  <CardHeader className="px-6 pt-6">
                      <h3 className="text-lg font-bold">Stats (Số liệu thống kê)</h3>
                  </CardHeader>
                  <CardBody className="px-6 pb-6 space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <Input name="statCustomers" label="Khách hàng" defaultValue="15,000+" variant="bordered" />
                        <Input name="statTours" label="Tour hoàn thành" defaultValue="1,200+" variant="bordered" />
                      </div>
                      <Button color="success" className="text-white font-bold w-full">Cập nhật chỉ số</Button>
                  </CardBody>
                </Card>
              </div>
            </form>
          </Tab>

          <Tab
            key="seo"
            title={
              <div className="flex items-center space-x-2">
                <LucideIcons.Search size={18} />
                <span>SEO & Meta</span>
              </div>
            }
          >
            <form onSubmit={handleSaveSeo}>
              <Card className="border-none shadow-sm mt-6">
                <CardBody className="p-8 space-y-8">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    <div className="space-y-6">
                      <h3 className="text-lg font-bold flex items-center gap-2">
                        <LucideIcons.Globe size={20} className="text-primary" />
                        Cấu hình Meta mặc định
                      </h3>
                      <Input name="siteTitle" label="Site Title" defaultValue="Vivu Travel — Du lịch Việt Nam" variant="faded" />
                      <Textarea name="metaDescription" label="Meta Description" defaultValue="Vivu — Đặt khách sạn, tour du lịch và trải nghiệm điểm đến Việt Nam. Giá tốt, đặt chỗ dễ dàng." variant="faded" />
                      <Input name="faviconUrl" label="Favicon URL" defaultValue="/favicon.ico" variant="faded" description="Hỗ trợ các định dạng .ico, .png, .svg" />
                    </div>

                    <div className="space-y-6">
                      <h3 className="text-lg font-bold flex items-center gap-2">
                        <LucideIcons.Share2 size={20} className="text-success" />
                        Social Sharing (Open Graph)
                      </h3>
                      <Input name="ogTitle" label="OG Title" defaultValue="Vivu Travel — Khám phá Việt Nam" variant="faded" />
                      <div className="bg-default-100 p-4 rounded-xl border border-dashed border-default-300">
                        <p className="text-xs text-default-500 italic">Mẹo: Sử dụng ảnh 1200x630px để hiển thị tốt nhất trên Facebook/Zalo.</p>
                      </div>
                    </div>
                  </div>
                  <Divider />
                  <div className="flex justify-end gap-3">
                    <Button type="submit" color="primary" className="px-8 font-bold shadow-lg shadow-primary/30" isLoading={isSaving}>Lưu cấu hình SEO</Button>
                  </div>
                </CardBody>
              </Card>
            </form>
          </Tab>

          <Tab
            key="general"
            title={
              <div className="flex items-center space-x-2">
                <LucideIcons.Settings2 size={18} />
                <span>Chế độ hệ thống</span>
              </div>
            }
          >
            <Card className="border-none shadow-sm mt-6 p-6">
              <CardBody className="space-y-6">
                 <div className="flex items-center justify-between p-4 bg-default-50 rounded-2xl border border-default-100">
                    <div className="flex flex-col gap-1">
                       <p className="font-bold">Chế độ bảo trì (Maintenance Mode)</p>
                       <p className="text-xs text-default-500">Khi bật, khách hàng sẽ không thể truy cập trang web.</p>
                    </div>
                    <Switch color="danger" />
                 </div>
              </CardBody>
            </Card>
          </Tab>

          <Tab
            key="legal"
            title={
              <div className="flex items-center space-x-2">
                <LucideIcons.ShieldCheck size={18} />
                <span>Pháp lý & Bảo mật</span>
              </div>
            }
          >
            <div className="grid grid-cols-1 gap-6 py-6">
               <Card className="border-none shadow-sm">
                 <CardHeader className="px-6 pt-6 flex justify-between">
                    <h3 className="text-lg font-bold">Điều khoản & Chính sách</h3>
                    <Button color="primary" size="sm" startContent={<LucideIcons.Save size={16} />}>Lưu bản thảo</Button>
                 </CardHeader>
                 <CardBody className="px-6 pb-6 space-y-6">
                    <div className="space-y-4">
                       <p className="text-sm font-semibold">Điều khoản dịch vụ</p>
                       <Textarea minRows={10} variant="bordered" placeholder="Nhập nội dung điều khoản..." />
                    </div>
                    <Divider />
                    <div className="space-y-4">
                       <p className="text-sm font-semibold">Chính sách bảo mật</p>
                       <Textarea minRows={10} variant="bordered" placeholder="Nhập nội dung chính sách..." />
                    </div>
                 </CardBody>
               </Card>
            </div>
          </Tab>
        </Tabs>
      </div>
    </div>
  );
}
