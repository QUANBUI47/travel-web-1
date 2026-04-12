import { getTranslations } from "next-intl/server";

import { prisma } from "@/lib/prisma";
import { SeoSettingsForm } from "@/components/admin/seo-settings-form";
import { I18nString } from "@/types";

interface SeoSettingsData {
  siteTitle?: I18nString;
  metaDescription?: I18nString;
  faviconUrl?: string;
}

function isI18nStringValue(value: unknown): value is I18nString {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;

  return typeof v.vi === "string" && typeof v.en === "string";
}

export default async function SeoSettingsPage() {
  const t = await getTranslations("Admin.Settings");
  const systemSettingsRaw = await prisma.systemSetting.findMany({
    where: { group: "SEO" },
  });

  const initialData: SeoSettingsData = {};

  systemSettingsRaw.forEach((setting) => {
    if (setting.key === "siteTitle") {
      initialData.siteTitle = isI18nStringValue(setting.value)
        ? setting.value
        : { vi: "", en: "" };
    } else if (setting.key === "metaDescription") {
      initialData.metaDescription = isI18nStringValue(setting.value)
        ? setting.value
        : { vi: "", en: "" };
    } else if (setting.key === "faviconUrl") {
      initialData.faviconUrl = String(setting.value ?? "");
    }
  });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-black tracking-tight text-slate-800 uppercase">
          {t("seo_title")}
        </h1>
        <p className="text-slate-500 font-medium text-sm">
          {t("seo_subtitle")}
        </p>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 p-8">
        <SeoSettingsForm initialData={initialData} />
      </div>
    </div>
  );
}
