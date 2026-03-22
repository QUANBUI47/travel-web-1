import { prisma } from "@/lib/prisma";
import { SeoSettingsForm } from "@/components/admin/seo-settings-form";

export default async function SeoSettingsPage() {
  const systemSettingsRaw = await prisma.systemSetting.findMany({
    where: { group: "SEO" },
  });
  
  const initialData: Record<string, any> = {};
  systemSettingsRaw.forEach((setting: any) => {
    initialData[setting.key] = setting.value;
  });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-black tracking-tight text-slate-800 uppercase">SEO & Meta</h1>
        <p className="text-slate-500 font-medium text-sm">Tối ưu hóa tìm kiếm và thông tin Meta cho website.</p>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 p-8">
        <SeoSettingsForm initialData={initialData} />
      </div>
    </div>
  );
}
