"use client";

import * as LucideIcons from "lucide-react";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { useTranslations } from "next-intl";

import adminEn from "@/messages/admin/en.json";
import adminVi from "@/messages/admin/vi.json";
import { MapExplorationContent, MapPoint } from "@/types";
import { BilingualInput } from "@/components/admin/bilingual-input";

const editorsVi = adminVi.Builder.editors;
const editorsEn = adminEn.Builder.editors;

interface MapExplorationEditorProps {
  content: MapExplorationContent;
  onUpdate: (content: Partial<MapExplorationContent>) => void;
}

export function MapExplorationEditor({
  content,
  onUpdate,
}: MapExplorationEditorProps) {
  const t = useTranslations("Admin.Builder.editors");
  const points = content.points ?? [];

  const updatePoint = (idx: number, updates: Partial<MapPoint>) => {
    const nextPoints = [...points];

    nextPoints[idx] = { ...nextPoints[idx], ...updates };
    onUpdate({ points: nextPoints });
  };

  const addPoint = () => {
    onUpdate({
      points: [
        ...points,
        {
          id: `point_${Date.now()}`,
          lat: 10.7769,
          lng: 106.7009,
          title: { vi: editorsVi.new_point, en: editorsEn.new_point },
        },
      ],
    });
  };

  const removePoint = (idx: number) => {
    onUpdate({ points: points.filter((_, i) => i !== idx) });
  };

  return (
    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <BilingualInput
        label={t("map_title")}
        name="map_title"
        value={content.title}
        onValueChange={(val) => onUpdate({ title: val })}
      />

      <div className="space-y-4">
        <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">
          {t("map_points", { count: points.length })}
        </div>
        <div className="space-y-4">
          {points.map((point, idx) => (
            <div
              key={point.id || idx}
              className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm relative group space-y-4"
            >
              <button
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                onClick={() => removePoint(idx)}
              >
                <LucideIcons.X size={12} />
              </button>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  classNames={{
                    inputWrapper:
                      "bg-slate-50 dark:bg-slate-800 border-none h-11",
                  }}
                  label={t("latitude")}
                  type="number"
                  value={String(point.lat)}
                  onChange={(e) =>
                    updatePoint(idx, {
                      lat: Number.parseFloat(e.target.value) || 0,
                    })
                  }
                />
                <Input
                  classNames={{
                    inputWrapper:
                      "bg-slate-50 dark:bg-slate-800 border-none h-11",
                  }}
                  label={t("longitude")}
                  type="number"
                  value={String(point.lng)}
                  onChange={(e) =>
                    updatePoint(idx, {
                      lng: Number.parseFloat(e.target.value) || 0,
                    })
                  }
                />
              </div>

              <Input
                classNames={{
                  inputWrapper:
                    "bg-slate-50 dark:bg-slate-800 border-none h-11",
                }}
                label={t("destination_id_optional")}
                value={point.destinationId || ""}
                onChange={(e) =>
                  updatePoint(idx, { destinationId: e.target.value })
                }
              />

              <BilingualInput
                label={t("point_name")}
                name={`point_title_${idx}`}
                value={point.title}
                onValueChange={(val) => updatePoint(idx, { title: val })}
              />
            </div>
          ))}
        </div>

        <Button
          className="w-full h-14 border-dashed border-2 border-slate-200 dark:border-slate-800 rounded-2xl text-slate-400 hover:border-primary hover:text-primary transition-all font-bold"
          startContent={<LucideIcons.Plus size={18} />}
          variant="bordered"
          onClick={addPoint}
        >
          {t("add_point")}
        </Button>
      </div>
    </div>
  );
}
