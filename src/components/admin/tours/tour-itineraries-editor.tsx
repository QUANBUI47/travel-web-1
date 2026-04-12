"use client";

import type { Tour } from "@/types";

import { useMemo, useState } from "react";
import { Input, Textarea } from "@heroui/input";
import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { addToast } from "@heroui/toast";
import { Trash2, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

import { updateTourItinerariesAction } from "@/actions/tour.actions";
import { invalidateTourDetail } from "@/lib/query/invalidate";

type ItineraryInitial = {
  id: string;
  dayNumber: number;
  title: string;
  description?: string | null;
};

type TourItinerariesEditorProps = {
  tour: Pick<Tour, "id" | "durationDays" | "nameVi">;
  initialItineraries: ItineraryInitial[];
};

export function TourItinerariesEditor({
  tour,
  initialItineraries,
}: TourItinerariesEditorProps) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const t = useTranslations("Admin.Tours");
  const tAdmin = useTranslations("Admin.Common");
  const tCommon = useTranslations("Common");

  const initial = useMemo(() => {
    const sorted = [...initialItineraries].sort(
      (a, b) => a.dayNumber - b.dayNumber,
    );

    // UI ưu tiên đánh số tuần tự theo vị trí, tránh lệch dayNumber trong DB.
    return sorted.map((it, idx) => ({
      key: it.id || `${it.dayNumber}_${idx}`,
      title: it.title ?? "",
      description: it.description ?? "",
    }));
  }, [initialItineraries]);

  const [items, setItems] = useState(
    initial.length > 0
      ? initial
      : [{ key: "day_1", title: "", description: "" }],
  );
  const [isSaving, setIsSaving] = useState(false);

  const addDay = () => {
    setItems((prev) => [
      ...prev,
      {
        key: `day_${prev.length + 1}_${Date.now()}`,
        title: "",
        description: "",
      },
    ]);
  };

  const removeDay = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const payload = items.map((it, idx) => ({
        dayNumber: idx + 1,
        title: it.title,
        description: it.description ? it.description : null,
      }));

      const res = await updateTourItinerariesAction(tour.id, payload);

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
      router.refresh();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center gap-4">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-default-900">
            {t("itinerary_page_title")}
          </h2>
          <p className="text-xs text-default-500 mt-1">
            {t("itinerary_days_count", {
              name: tour.nameVi,
              count: items.length,
            })}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            color="primary"
            startContent={<Plus size={18} />}
            variant="flat"
            onPress={addDay}
          >
            {t("add_day")}
          </Button>
          <Button
            className="font-black"
            color="primary"
            isLoading={isSaving}
            onPress={handleSave}
          >
            {t("save_itinerary_btn")}
          </Button>
        </div>
      </div>

      <Card className="border-none shadow-sm">
        <CardHeader className="px-6 pt-6 font-bold text-lg">
          {t("itinerary_list_title")}
        </CardHeader>
        <CardBody className="px-6 pb-6 space-y-4">
          {items.map((it, idx) => (
            <div
              key={it.key}
              className="p-4 rounded-2xl border border-default-100 bg-default-50/40 space-y-4"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="text-sm font-black uppercase tracking-widest text-default-700">
                  {idx === 0
                    ? t("departure_point_day")
                    : t("day_n", { n: idx + 1 })}
                </div>
                <Button
                  color="danger"
                  isDisabled={items.length <= 1}
                  startContent={<Trash2 size={16} />}
                  variant="flat"
                  onPress={() => removeDay(idx)}
                >
                  {tAdmin("delete")}
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  isRequired
                  label={t("day_title")}
                  placeholder={t("itinerary_day_title_placeholder", {
                    day: idx + 1,
                  })}
                  value={it.title}
                  onValueChange={(val) => {
                    setItems((prev) =>
                      prev.map((p, i) =>
                        i === idx ? { ...p, title: val } : p,
                      ),
                    );
                  }}
                />
                <Input isReadOnly label={t("day_order")} value={`${idx + 1}`} />
              </div>

              <Textarea
                label={t("day_content")}
                placeholder={t("itinerary_day_desc_placeholder")}
                value={it.description}
                onValueChange={(val) => {
                  setItems((prev) =>
                    prev.map((p, i) =>
                      i === idx ? { ...p, description: val } : p,
                    ),
                  );
                }}
              />
            </div>
          ))}
        </CardBody>
      </Card>
    </div>
  );
}
