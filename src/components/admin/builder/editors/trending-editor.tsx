"use client";

import { Input } from "@heroui/input";
import { useTranslations } from "next-intl";

import { TrendingContent } from "@/types";
import { BilingualInput } from "@/components/admin/bilingual-input";

interface TrendingEditorProps {
  content: TrendingContent;
  onUpdate: (content: Partial<TrendingContent>) => void;
}

export function TrendingEditor({ content, onUpdate }: TrendingEditorProps) {
  const t = useTranslations("Admin.Builder.editors");

  return (
    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <BilingualInput
        label={t("trending_title")}
        name="trending_title"
        value={content.title}
        onValueChange={(val) => onUpdate({ title: val })}
      />

      <BilingualInput
        label={t("subtitle")}
        name="trending_subtitle"
        value={content.subtitle || { vi: "", en: "" }}
        onValueChange={(val) => onUpdate({ subtitle: val })}
      />

      <div className="space-y-2">
        <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">
          {t("tour_ids_list")}
        </div>
        <Input
          classNames={{
            inputWrapper: "bg-slate-50 dark:bg-slate-800 border-none h-11",
          }}
          placeholder="tour-id-1,tour-id-2"
          value={(content.selectedTourIds || []).join(",")}
          onChange={(e) =>
            onUpdate({
              selectedTourIds: e.target.value
                .split(",")
                .map((id) => id.trim())
                .filter(Boolean),
            })
          }
        />
      </div>
    </div>
  );
}
