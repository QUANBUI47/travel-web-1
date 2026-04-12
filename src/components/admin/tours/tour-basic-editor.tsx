"use client";

import type { Tour } from "@/types";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Input } from "@heroui/input";
import { Switch } from "@heroui/switch";
import { Select, SelectItem } from "@heroui/select";
import { addToast } from "@heroui/toast";
import { useTranslations } from "next-intl";

import { updateTourAction } from "@/actions/tour.actions";
import { invalidateTourDetail } from "@/lib/query/invalidate";
import { RichTextEditor } from "@/components/ui/rich-text-editor";

const DEFAULT_TRANSPORT = "Ô tô";
const DEFAULT_TOUR_TYPE = "Ghép đoàn";

type TourBasicEditorProps = {
  tour: Tour;
};

export function TourBasicEditor({ tour }: TourBasicEditorProps) {
  const queryClient = useQueryClient();
  const t = useTranslations("Admin.Tours");
  const tAdmin = useTranslations("Admin.Common");
  const tCommon = useTranslations("Common");

  const [formData, setFormData] = useState({
    description: tour.description ?? "",
    isActive: tour.isActive,
    priceFrom: tour.priceFrom,
    oldPrice: tour.oldPrice || 0,
    durationText: tour.durationText || "",
    departurePoint: tour.departurePoint || "",
    transport: tour.transport || DEFAULT_TRANSPORT,
    tourType: tour.tourType || DEFAULT_TOUR_TYPE,
    tagsString: (tour.tags || []).join(", "),
    inclusions: (tour.inclusions as string) || "",
    exclusions: (tour.exclusions as string) || "",
    policy: (tour.policy as string) || "",
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const tags = formData.tagsString
        ? formData.tagsString
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean)
        : [];

      const res = await updateTourAction(tour.id, {
        description: formData.description || null,
        isActive: formData.isActive,
        priceFrom: formData.priceFrom,
        oldPrice: formData.oldPrice,
        durationText: formData.durationText,
        departurePoint: formData.departurePoint,
        transport: formData.transport,
        tourType: formData.tourType,
        tags,
        inclusions: formData.inclusions,
        exclusions: formData.exclusions,
        policy: formData.policy,
      } as Parameters<typeof updateTourAction>[1]);

      if (!res?.success) {
        addToast({
          title: tCommon("error"),
          description:
            res.message ?? res.error ?? tCommon("toast_system_error"),
          color: "danger",
        });

        return;
      }

      addToast({ title: tCommon("success"), color: "success" });
      void invalidateTourDetail(queryClient, tour.id);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="border-none shadow-sm">
      <CardHeader className="px-8 pt-8 flex justify-between items-center">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-black uppercase tracking-tight">
            {t("basic_title")}
          </h2>
          <p className="text-[10px] text-primary font-black uppercase tracking-[0.3em]">
            {t("basic_subtitle")}
          </p>
        </div>
        <Button
          className="font-black px-8"
          color="primary"
          isLoading={isSaving}
          onPress={handleSave}
        >
          {tAdmin("save_info")}
        </Button>
      </CardHeader>
      <CardBody className="px-8 pb-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
          <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
            <div className="flex flex-col gap-0.5">
              <p className="text-[10px] font-black uppercase tracking-widest">
                {t("status_label")}
              </p>
              <p className="text-[9px] text-slate-400 font-bold uppercase">
                {formData.isActive ? t("status_visible") : t("status_hidden")}
              </p>
            </div>
            <Switch
              isSelected={formData.isActive}
              onValueChange={(v) =>
                setFormData({ ...formData, isActive: Boolean(v) })
              }
            />
          </div>
          <Input
            label={t("duration_text_label")}
            labelPlacement="outside"
            placeholder={t("duration_text_placeholder")}
            value={formData.durationText}
            variant="bordered"
            onValueChange={(v) => setFormData({ ...formData, durationText: v })}
          />
          <Input
            label={t("departure_point_label")}
            labelPlacement="outside"
            placeholder={t("field_departure_placeholder")}
            value={formData.departurePoint}
            variant="bordered"
            onValueChange={(v) =>
              setFormData({ ...formData, departurePoint: v })
            }
          />
          <Select
            label={t("transport_label")}
            labelPlacement="outside"
            selectedKeys={[formData.transport]}
            variant="bordered"
            onSelectionChange={(keys) =>
              setFormData({
                ...formData,
                transport: Array.from(keys)[0] as string,
              })
            }
          >
            <SelectItem key={DEFAULT_TRANSPORT}>
              {t("transport_bus")}
            </SelectItem>
            <SelectItem key="Máy bay">{t("transport_plane")}</SelectItem>
            <SelectItem key="Tàu thủy">{t("transport_ship")}</SelectItem>
            <SelectItem key="Tàu hỏa">{t("transport_train")}</SelectItem>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Input
            color="primary"
            label={t("price_current")}
            labelPlacement="outside"
            type="number"
            value={formData.priceFrom.toString()}
            variant="bordered"
            onValueChange={(v) =>
              setFormData({ ...formData, priceFrom: parseInt(v) || 0 })
            }
          />
          <Input
            label={t("price_old")}
            labelPlacement="outside"
            type="number"
            value={formData.oldPrice.toString()}
            variant="bordered"
            onValueChange={(v) =>
              setFormData({ ...formData, oldPrice: parseInt(v) || 0 })
            }
          />
          <Input
            className="md:col-span-2"
            label={t("tags_label")}
            labelPlacement="outside"
            placeholder={t("tags_placeholder")}
            value={formData.tagsString}
            variant="bordered"
            onValueChange={(v) => setFormData({ ...formData, tagsString: v })}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <RichTextEditor
              label={t("inclusions")}
              placeholder={t("inclusions_placeholder")}
              value={formData.inclusions}
              onChange={(v) => setFormData({ ...formData, inclusions: v })}
            />
            <RichTextEditor
              label={t("exclusions")}
              placeholder={t("exclusions_placeholder")}
              value={formData.exclusions}
              onChange={(v) => setFormData({ ...formData, exclusions: v })}
            />
          </div>
          <div className="space-y-6">
            <RichTextEditor
              label={t("policy")}
              placeholder={t("policy_placeholder")}
              value={formData.policy}
              onChange={(v) => setFormData({ ...formData, policy: v })}
            />
            <RichTextEditor
              label={t("overview")}
              placeholder={t("overview_short_placeholder")}
              value={formData.description}
              onChange={(v) => setFormData({ ...formData, description: v })}
            />
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
