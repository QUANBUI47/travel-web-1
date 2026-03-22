"use client";

import { useState } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { addToast } from "@heroui/toast";
import * as LucideIcons from "lucide-react";
import { BilingualInput } from "./bilingual-input";
import { BilingualTextarea } from "./bilingual-textarea";

interface SeoSettingsFormProps {
  initialData: any;
}

export function SeoSettingsForm({ initialData }: SeoSettingsFormProps) {
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    const formData = new FormData(e.currentTarget);
    
    const settings = {
        siteTitle: {
            vi: formData.get("siteTitle_vi"),
            en: formData.get("siteTitle_en"),
        },
        metaDescription: {
            vi: formData.get("metaDescription_vi"),
            en: formData.get("metaDescription_en"),
        },
        faviconUrl: formData.get("faviconUrl"),
    };

    try {
      const response = await fetch("/api/v1/settings/system", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ group: "SEO", settings }),
      });

      if (response.ok) {
        addToast({ title: "Thành công", color: "success", description: "Đã cập nhật cấu hình SEO" });
      } else {
        throw new Error("Lỗi lưu dữ liệu");
      }
    } catch (error) {
      addToast({ title: "Lỗi", color: "danger", description: "Không thể lưu cấu hình" });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full">
        <form onSubmit={handleSubmit} className="space-y-6">
            <Card className="border-none shadow-sm bg-slate-50/50 rounded-[2rem]">
                <CardHeader className="pb-0 pt-8 px-8">
                    <h3 className="text-xl font-black flex items-center gap-3 uppercase tracking-tight">
                        <div className="p-2 bg-primary/10 rounded-xl text-primary">
                            <LucideIcons.Globe size={20} />
                        </div>
                        Cấu hình tìm kiếm (SEO)
                    </h3>
                </CardHeader>
                <CardBody className="p-8 space-y-8">
                    <BilingualInput 
                        name="siteTitle" 
                        label="Site Title (Tiêu đề trang)" 
                        defaultValue={initialData?.siteTitle} 
                        placeholder="Vivu Travel — Du lịch & Khách sạn"
                    />
                    <BilingualTextarea 
                        name="metaDescription" 
                        label="Meta Description (Mô tả tìm kiếm)" 
                        defaultValue={initialData?.metaDescription} 
                        placeholder="Vivu Travel cung cấp dịch vụ đặt tour..."
                    />
                    <Input 
                        name="faviconUrl" 
                        label="Favicon URL" 
                        defaultValue={initialData?.faviconUrl || "/favicon.ico"} 
                        variant="bordered"
                        radius="lg"
                        className="font-bold"
                        description="Hỗ trợ .ico, .png, .svg"
                    />
                </CardBody>
            </Card>
            <div className="flex justify-end pr-4">
                <Button 
                    color="primary" 
                    type="submit" 
                    isLoading={isSaving} 
                    className="font-black px-10 py-6 rounded-2xl shadow-xl shadow-primary/20 text-xs tracking-widest uppercase"
                    startContent={!isSaving && <LucideIcons.Save size={18}/>}
                >
                    Lưu cấu hình SEO
                </Button>
            </div>
        </form>
    </div>
  );
}
