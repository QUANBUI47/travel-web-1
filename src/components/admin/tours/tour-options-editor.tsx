"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2, Layers, Save } from "lucide-react";
import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Input, Textarea } from "@heroui/input";
import { Switch } from "@heroui/switch";
import { addToast } from "@heroui/toast";
import { useTranslations } from "next-intl";

import { Tour, TourOption } from "@/types";
import { updateTourOptionsAction } from "@/actions/tour.actions";
import { invalidateTourDetail } from "@/lib/query/invalidate";

type TourOptionsEditorProps = {
  tour: Pick<Tour, "id"> & { options?: TourOption[] };
};

type DraftOption = {
  key: string;
  nameVi: string;
  nameEn: string;
  description: string;
  surchargeAdult: number;
  surchargeChild: number;
  isActive: boolean;
};

const toDraft = (o: TourOption, idx: number): DraftOption => ({
  key: o.id || `opt_${idx}`,
  nameVi: o.nameVi ?? "",
  nameEn: o.nameEn ?? "",
  description: o.description ?? "",
  surchargeAdult: Number(o.surchargeAdult ?? 0),
  surchargeChild: Number(o.surchargeChild ?? 0),
  isActive: o.isActive ?? true,
});

export function TourOptionsEditor({ tour }: TourOptionsEditorProps) {
  const queryClient = useQueryClient();
  const t = useTranslations("Admin.Tours");
  const tAdmin = useTranslations("Admin.Common");
  const tCommon = useTranslations("Common");

  const [items, setItems] = useState<DraftOption[]>(
    (tour.options || []).map((o, idx) => toDraft(o, idx)),
  );
  const [isSaving, setIsSaving] = useState(false);

  const addOption = () =>
    setItems((prev) => [
      ...prev,
      {
        key: `opt_${prev.length}_${Date.now()}`,
        nameVi: "",
        nameEn: "",
        description: "",
        surchargeAdult: 0,
        surchargeChild: 0,
        isActive: true,
      },
    ]);

  const removeOption = (idx: number) =>
    setItems((prev) => prev.filter((_, i) => i !== idx));

  const update = (idx: number, patch: Partial<DraftOption>) =>
    setItems((prev) =>
      prev.map((it, i) => (i === idx ? { ...it, ...patch } : it)),
    );

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const payload = items.map((it, idx) => ({
        nameVi: it.nameVi,
        nameEn: it.nameEn || null,
        description: it.description || null,
        surchargeAdult: it.surchargeAdult,
        surchargeChild: it.surchargeChild,
        sortOrder: idx,
        isActive: it.isActive,
      }));

      const res = await updateTourOptionsAction(tour.id, payload);

      if (res.success) {
        addToast({ title: tCommon("success"), color: "success" });
        void invalidateTourDetail(queryClient, tour.id);
      } else {
        addToast({
          title: tCommon("error"),
          description:
            res.message ?? res.error ?? tCommon("toast_system_error"),
          color: "danger",
        });
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="border-none shadow-sm">
      <CardHeader className="px-8 pt-8 flex justify-between items-center">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-black uppercase tracking-tight">
            {t("options_title")}
          </h2>
          <p className="text-[10px] text-primary font-black uppercase tracking-[0.3em]">
            {t("options_subtitle")}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            className="font-black"
            color="primary"
            startContent={<Plus size={18} />}
            variant="flat"
            onPress={addOption}
          >
            {t("add_option")}
          </Button>
          <Button
            className="font-black px-8"
            color="primary"
            isLoading={isSaving}
            startContent={<Save size={18} />}
            onPress={handleSave}
          >
            {tAdmin("save_info")}
          </Button>
        </div>
      </CardHeader>
      <CardBody className="px-8 pb-8 space-y-6">
        {items.length === 0 ? (
          <div className="py-20 text-center border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-[2rem]">
            <Layers className="mx-auto mb-4 text-slate-200" size={48} />
            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">
              {t("options_empty")}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((it, idx) => (
              <div
                key={it.key}
                className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start p-6 bg-slate-50 dark:bg-slate-900/50 rounded-[2rem] border border-slate-100 dark:border-slate-800"
              >
                <div className="md:col-span-3">
                  <Input
                    isRequired
                    label={t("option_name_vi")}
                    labelPlacement="outside"
                    placeholder={t("option_name_vi_placeholder")}
                    value={it.nameVi}
                    variant="bordered"
                    onValueChange={(v) => update(idx, { nameVi: v })}
                  />
                </div>
                <div className="md:col-span-3">
                  <Input
                    label={t("option_name_en")}
                    labelPlacement="outside"
                    placeholder={t("option_name_en_placeholder")}
                    value={it.nameEn}
                    variant="bordered"
                    onValueChange={(v) => update(idx, { nameEn: v })}
                  />
                </div>
                <div className="md:col-span-2">
                  <Input
                    label={t("option_surcharge_adult")}
                    labelPlacement="outside"
                    type="number"
                    value={it.surchargeAdult.toString()}
                    variant="bordered"
                    onValueChange={(v) =>
                      update(idx, { surchargeAdult: Number(v) || 0 })
                    }
                  />
                </div>
                <div className="md:col-span-2">
                  <Input
                    label={t("option_surcharge_child")}
                    labelPlacement="outside"
                    type="number"
                    value={it.surchargeChild.toString()}
                    variant="bordered"
                    onValueChange={(v) =>
                      update(idx, { surchargeChild: Number(v) || 0 })
                    }
                  />
                </div>
                <div className="md:col-span-1 flex flex-col items-center gap-1 pt-6">
                  <Switch
                    isSelected={it.isActive}
                    size="sm"
                    onValueChange={(v) => update(idx, { isActive: v })}
                  />
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                    {it.isActive ? tAdmin("active") : tAdmin("inactive")}
                  </span>
                </div>
                <div className="md:col-span-1 flex justify-end pt-6">
                  <Button
                    isIconOnly
                    color="danger"
                    radius="full"
                    variant="flat"
                    onPress={() => removeOption(idx)}
                  >
                    <Trash2 size={18} />
                  </Button>
                </div>
                <div className="md:col-span-12">
                  <Textarea
                    label={t("option_description")}
                    labelPlacement="outside"
                    minRows={2}
                    placeholder={t("option_description_placeholder")}
                    value={it.description}
                    variant="bordered"
                    onValueChange={(v) => update(idx, { description: v })}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </CardBody>
    </Card>
  );
}
