"use client";

import { useState } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Switch } from "@heroui/switch";
import { Button } from "@heroui/button";
import { addToast } from "@heroui/toast";
import * as LucideIcons from "lucide-react";
import { useTranslations } from "next-intl";

import { updateSystemSettingsAction } from "@/actions/system.actions";

interface SystemSettingsFormProps {
  initialData: Record<string, unknown>;
}

export function SystemSettingsForm({ initialData }: SystemSettingsFormProps) {
  const [isSaving, setIsSaving] = useState(false);
  const tCommon = useTranslations("Common");
  const t = useTranslations("Admin.Settings");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);

    const formData = new FormData(e.currentTarget);
    const settings = {
      maintenanceMode: formData.get("maintenanceMode") === "on",
    };

    try {
      const result = await updateSystemSettingsAction("GENERAL", settings);

      if (result.success) {
        addToast({
          title: tCommon("success"),
          color: "success",
          description: tCommon("toast_system_updated"),
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
        description: message,
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
              <div className="p-2 bg-warning/10 rounded-xl text-warning">
                <LucideIcons.ShieldAlert size={20} />
              </div>
              {t("system_form_title")}
            </h3>
          </CardHeader>
          <CardBody className="p-8 space-y-6">
            <div className="flex items-center justify-between p-6 bg-white rounded-3xl border border-warning/10 shadow-sm transition-all hover:shadow-md">
              <div className="space-y-1">
                <label
                  className="font-black text-slate-800 uppercase text-xs tracking-wider cursor-pointer"
                  htmlFor="maintenanceMode"
                >
                  {t("maintenance_mode")}
                </label>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  {t("maintenance_desc")}
                </p>
              </div>
              <Switch
                color="warning"
                defaultSelected={Boolean(initialData?.maintenanceMode)}
                id="maintenanceMode"
                name="maintenanceMode"
                size="lg"
              />
            </div>
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
            {t("update_system")}
          </Button>
        </div>
      </form>
    </div>
  );
}
