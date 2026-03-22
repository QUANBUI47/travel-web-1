"use client";

import { useState } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Switch } from "@heroui/switch";
import { Button } from "@heroui/button";
import { addToast } from "@heroui/toast";
import * as LucideIcons from "lucide-react";

interface SystemSettingsFormProps {
  initialData: any;
}

export function SystemSettingsForm({ initialData }: SystemSettingsFormProps) {
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    const formData = new FormData(e.currentTarget);
    
    const settings = {
        maintenanceMode: formData.get("maintenanceMode") === "on",
    };

    try {
      const response = await fetch("/api/v1/settings/system", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ group: "GENERAL", settings }),
      });

      if (response.ok) {
        addToast({ title: "Thành công", color: "success", description: "Đã cập nhật trạng thái hệ thống" });
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
                        <div className="p-2 bg-warning/10 rounded-xl text-warning">
                             <LucideIcons.ShieldAlert size={20} />
                        </div>
                        Quản lý trạng thái hệ thống
                    </h3>
                </CardHeader>
                <CardBody className="p-8 space-y-6">
                    <div className="flex items-center justify-between p-6 bg-white rounded-3xl border border-warning/10 shadow-sm transition-all hover:shadow-md">
                        <div className="space-y-1">
                            <p className="font-black text-slate-800 uppercase text-xs tracking-wider">Chế độ bảo trì</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Vô hiệu hóa truy cập từ phía khách hàng</p>
                        </div>
                        <Switch 
                            name="maintenanceMode" 
                            defaultSelected={initialData?.maintenanceMode} 
                            color="warning" 
                            size="lg"
                        />
                    </div>
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
                    Cập nhật hệ thống
                </Button>
            </div>
        </form>
    </div>
  );
}
