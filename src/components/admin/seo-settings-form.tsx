"use client";

import { useState } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { addToast } from "@heroui/toast";
import * as LucideIcons from "lucide-react";
import { useTranslations } from "next-intl";

import { BilingualInput } from "./bilingual-input";
import { BilingualTextarea } from "./bilingual-textarea";

import { I18nString } from "@/types";
import { updateSystemSettingsAction } from "@/actions/system.actions";

interface SeoSettingsData {
  siteTitle?: I18nString;
  metaDescription?: I18nString;
  faviconUrl?: string;
}

interface SeoSettingsFormProps {
  initialData: SeoSettingsData;
}

export function SeoSettingsForm({ initialData }: SeoSettingsFormProps) {
  const [isSaving, setIsSaving] = useState(false);
  const tCommon = useTranslations("Common");
  const t = useTranslations("Admin.Settings");

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
      const result = await updateSystemSettingsAction(
        "SEO",
        settings as Record<string, unknown>,
      );

      if (result.success) {
        addToast({
          title: tCommon("success"),
          color: "success",
          description: tCommon("toast_seo_updated"),
        });
      } else {
        addToast({
          title: tCommon("error"),
          color: "danger",
          description: result.message ?? tCommon("toast_cannot_save_config"),
        });
      }
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : tCommon("toast_cannot_save_config");

      addToast({
        title: tCommon("error"),
        color: "danger",
        description: message || tCommon("toast_cannot_save_config"),
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full">
      <form className="space-y-6" onSubmit={handleSubmit}>
        <Card className="border-none shadow-sm bg-slate-50/50 rounded-[2rem]">
          <CardHeader className="pb-0 pt-8 px-8">
            <h3 className="text-xl font-black flex items-center gap-3 uppercase tracking-tight">
              <div className="p-2 bg-primary/10 rounded-xl text-primary">
                <LucideIcons.Globe size={20} />
              </div>
              {t("seo_form_title")}
            </h3>
          </CardHeader>
          <CardBody className="p-8 space-y-8">
            <BilingualInput
              defaultValue={initialData?.siteTitle}
              label={t("site_title")}
              name="siteTitle"
              placeholder={t("site_title_placeholder")}
            />
            <BilingualTextarea
              defaultValue={initialData?.metaDescription}
              label={t("meta_description")}
              name="metaDescription"
              placeholder={t("meta_description_placeholder")}
            />
            <Input
              className="font-bold"
              defaultValue={initialData?.faviconUrl || "/favicon.ico"}
              description={t("favicon_hint")}
              label={t("favicon_url_label")}
              name="faviconUrl"
              radius="lg"
              variant="bordered"
            />
          </CardBody>
        </Card>
        <div className="flex justify-end pr-4">
          <Button
            className="font-black px-10 py-6 rounded-2xl shadow-xl shadow-primary/20 text-xs tracking-widest uppercase"
            color="primary"
            isLoading={isSaving}
            startContent={!isSaving && <LucideIcons.Save size={18} />}
            type="submit"
          >
            {t("save_seo")}
          </Button>
        </div>
      </form>
    </div>
  );
}
