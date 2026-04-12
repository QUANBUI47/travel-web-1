"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2, Calendar as CalendarIcon, Save } from "lucide-react";
import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Input } from "@heroui/input";
import { DatePicker } from "@heroui/date-picker";
import { addToast } from "@heroui/toast";
import { useTranslations } from "next-intl";
import { parseDate, getLocalTimeZone } from "@internationalized/date";

import { Tour, TourDeparture } from "@/types";
import { updateTourDeparturesAction } from "@/actions/tour.actions";
import { invalidateTourDetail } from "@/lib/query/invalidate";

type TourDeparturesEditorProps = {
  tour: Tour;
};

export function TourDeparturesEditor({ tour }: TourDeparturesEditorProps) {
  const queryClient = useQueryClient();
  const t = useTranslations("Admin.Tours");
  const tAdmin = useTranslations("Admin.Common");
  const tCommon = useTranslations("Common");
  const [departures, setDepartures] = useState<Partial<TourDeparture>[]>(
    tour.departures || [],
  );
  const [isSaving, setIsSaving] = useState(false);

  const handleAdd = () => {
    setDepartures([
      ...departures,
      {
        startDate: new Date().toISOString(),
        status: "AVAILABLE",
        priceOverride: null,
        maxParticipants: null,
      },
    ]);
  };

  const handleRemove = (index: number) => {
    setDepartures(departures.filter((_, i) => i !== index));
  };

  const handleChange = (index: number, data: Partial<TourDeparture>) => {
    const newDepartures = [...departures];

    newDepartures[index] = { ...newDepartures[index], ...data };
    setDepartures(newDepartures);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await updateTourDeparturesAction(
        tour.id,
        departures.map((d) => ({
          startDate: new Date(d.startDate as string),
          endDate: d.endDate ? new Date(d.endDate as string) : null,
          priceOverride: d.priceOverride ? Number(d.priceOverride) : null,
          maxParticipants: d.maxParticipants ? Number(d.maxParticipants) : null,
          notes: d.notes || null,
        })),
      );

      if (res.success) {
        addToast({ title: tCommon("success"), color: "success" });
        void invalidateTourDetail(queryClient, tour.id);
      } else {
        addToast({
          title: tCommon("error"),
          description: res.error || tCommon("toast_system_error"),
          color: "danger",
        });
      }
    } catch (error: unknown) {
      addToast({
        title: tCommon("error"),
        description:
          error instanceof Error
            ? error.message
            : tCommon("toast_system_error"),
        color: "danger",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="border-none shadow-sm">
      <CardHeader className="px-8 pt-8 flex justify-between items-center">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-black uppercase tracking-tight">
            {t("departures_title")}
          </h2>
          <p className="text-[10px] text-primary font-black uppercase tracking-[0.3em]">
            {t("departures_subtitle")}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            className="font-black"
            color="primary"
            startContent={<Plus size={18} />}
            variant="flat"
            onPress={handleAdd}
          >
            {t("add_departure")}
          </Button>
          <Button
            className="font-black px-8"
            color="primary"
            isLoading={isSaving}
            startContent={<Save size={18} />}
            onPress={handleSave}
          >
            {tAdmin("save_schedule")}
          </Button>
        </div>
      </CardHeader>
      <CardBody className="px-8 pb-8 space-y-6">
        {departures.length === 0 ? (
          <div className="py-20 text-center border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-[2rem]">
            <CalendarIcon className="mx-auto mb-4 text-slate-200" size={48} />
            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">
              {t("departures_empty")}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {departures.map((d, index) => (
              <div
                key={index}
                className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end p-6 bg-slate-50 dark:bg-slate-900/50 rounded-[2rem] border border-slate-100 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-300"
              >
                <div className="md:col-span-3">
                  <DatePicker
                    label={t("departure_date")}
                    labelPlacement="outside"
                    value={
                      d.startDate
                        ? parseDate((d.startDate as string).split("T")[0])
                        : null
                    }
                    variant="bordered"
                    onChange={(date) => {
                      if (!date) return;
                      handleChange(index, {
                        startDate: date
                          .toDate(getLocalTimeZone())
                          .toISOString(),
                      });
                    }}
                  />
                </div>
                <div className="md:col-span-3">
                  <Input
                    label={t("price_override")}
                    labelPlacement="outside"
                    placeholder={t("price_override_placeholder")}
                    type="number"
                    value={d.priceOverride?.toString() || ""}
                    variant="bordered"
                    onValueChange={(v) =>
                      handleChange(index, {
                        priceOverride: v ? Number(v) : null,
                      })
                    }
                  />
                </div>
                <div className="md:col-span-2">
                  <Input
                    label={t("max_participants")}
                    labelPlacement="outside"
                    placeholder={t("max_participants_placeholder")}
                    type="number"
                    value={d.maxParticipants?.toString() || ""}
                    variant="bordered"
                    onValueChange={(v) =>
                      handleChange(index, {
                        maxParticipants: v ? Number(v) : null,
                      })
                    }
                  />
                </div>
                <div className="md:col-span-3">
                  <Input
                    label={t("notes_label")}
                    labelPlacement="outside"
                    placeholder={t("notes_placeholder")}
                    value={d.notes || ""}
                    variant="bordered"
                    onValueChange={(v) => handleChange(index, { notes: v })}
                  />
                </div>
                <div className="md:col-span-1 flex justify-end">
                  <Button
                    isIconOnly
                    color="danger"
                    radius="full"
                    variant="flat"
                    onPress={() => handleRemove(index)}
                  >
                    <Trash2 size={18} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardBody>
    </Card>
  );
}
