"use client";

import React from "react";
import * as LucideIcons from "lucide-react";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { useTranslations } from "next-intl";

import adminEn from "@/messages/admin/en.json";
import adminVi from "@/messages/admin/vi.json";
import { StatsContent, StatsItem } from "@/types";
import { BilingualInput } from "@/components/admin/bilingual-input";
import { getLucideIcon } from "@/lib/utils/lucide-icon";

const editorsVi = adminVi.Builder.editors;
const editorsEn = adminEn.Builder.editors;

interface StatsEditorProps {
  content: StatsContent;
  onUpdate: (content: Partial<StatsContent>) => void;
}

export function StatsEditor({ content, onUpdate }: StatsEditorProps) {
  const t = useTranslations("Admin.Builder.editors");

  const updateStat = (idx: number, updates: Partial<StatsItem>) => {
    const newItems = [...content.items];

    newItems[idx] = { ...newItems[idx], ...updates };
    onUpdate({ items: newItems });
  };

  const removeStat = (idx: number) => {
    onUpdate({ items: content.items.filter((_, i) => i !== idx) });
  };

  const addStat = () => {
    onUpdate({
      items: [
        ...content.items,
        {
          label: { vi: editorsVi.new_label, en: editorsEn.new_label },
          value: "0",
          icon: "Activity",
        },
      ],
    });
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-4">
        {content.items.map((stat, idx) => (
          <div
            key={idx}
            className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-4 relative group"
          >
            <button
              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
              onClick={() => removeStat(idx)}
            >
              <LucideIcons.X size={12} />
            </button>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  {t("stat_value")}
                </div>
                <Input
                  classNames={{
                    inputWrapper:
                      "bg-slate-50 dark:bg-slate-800 border-none h-11",
                  }}
                  value={stat.value}
                  onChange={(e) => updateStat(idx, { value: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  {t("icon_lucide")}
                </div>
                <Input
                  classNames={{
                    inputWrapper:
                      "bg-slate-50 dark:bg-slate-800 border-none h-11",
                  }}
                  startContent={
                    stat.icon
                      ? React.createElement(getLucideIcon(stat.icon), {
                          size: 16,
                        })
                      : null
                  }
                  value={stat.icon}
                  onChange={(e) => updateStat(idx, { icon: e.target.value })}
                />
              </div>
            </div>

            <BilingualInput
              label={t("stat_label")}
              name={`stats_item_label_${idx}`}
              value={stat.label}
              onValueChange={(val) => updateStat(idx, { label: val })}
            />
          </div>
        ))}
      </div>

      <Button
        className="w-full h-14 border-dashed border-2 border-slate-200 dark:border-slate-800 rounded-2xl text-slate-400 hover:border-primary hover:text-primary transition-all font-bold"
        startContent={<LucideIcons.Plus size={18} />}
        variant="bordered"
        onClick={addStat}
      >
        {t("add_stat")}
      </Button>
    </div>
  );
}
