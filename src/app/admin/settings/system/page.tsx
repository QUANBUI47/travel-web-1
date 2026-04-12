import { getTranslations } from "next-intl/server";

import { prisma } from "@/lib/prisma";
import { SystemSettingsForm } from "@/components/admin/system-settings-form";

export default async function SystemSettingsPage() {
  const t = await getTranslations("Admin.Settings");
  const systemSettingsRaw = await prisma.systemSetting.findMany({
    where: { group: "GENERAL" },
  });

  const initialData: Record<string, unknown> = {};

  systemSettingsRaw.forEach((setting) => {
    initialData[setting.key] = setting.value;
  });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-black tracking-tight text-slate-800 uppercase">
          {t("system_title")}
        </h1>
        <p className="text-slate-500 font-medium text-sm">
          {t("system_subtitle")}
        </p>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 p-8">
        <SystemSettingsForm initialData={initialData} />
      </div>
    </div>
  );
}
