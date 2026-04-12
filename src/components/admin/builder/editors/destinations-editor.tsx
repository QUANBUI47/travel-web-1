"use client";

import * as LucideIcons from "lucide-react";
import { useTranslations } from "next-intl";

import { DestinationsContent, Destination } from "@/types";
import { BilingualInput } from "@/components/admin/bilingual-input";
import { cn } from "@/lib/utils";

interface DestinationsEditorProps {
  content: DestinationsContent;
  onUpdate: (content: Partial<DestinationsContent>) => void;
  allDestinations: Destination[];
}

export function DestinationsEditor({
  content,
  onUpdate,
  allDestinations,
}: DestinationsEditorProps) {
  const t = useTranslations("Admin.Builder.editors");

  const toggleDestination = (id: string) => {
    const current = content.selectedIds || [];
    const newIds = current.includes(id)
      ? current.filter((i) => i !== id)
      : [...current, id];

    onUpdate({ selectedIds: newIds });
  };

  return (
    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <BilingualInput
        label={t("section_title")}
        name="destinations_section_title"
        value={content.sectionTitle}
        onValueChange={(val) => onUpdate({ sectionTitle: val })}
      />

      <div className="space-y-4">
        <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">
          {t("display_type")}
        </div>
        <div className="grid grid-cols-3 gap-3">
          {(["grid", "masonry", "carousel"] as const).map((p) => (
            <button
              key={p}
              className={cn(
                "py-3 rounded-2xl border-2 transition-all flex flex-col items-center gap-2",
                content.layoutPattern === p
                  ? "border-primary bg-primary/5 text-primary shadow-sm"
                  : "border-slate-100 dark:border-slate-800 text-slate-400 hover:border-slate-200",
              )}
              onClick={() => onUpdate({ layoutPattern: p })}
            >
              <LucideIcons.LayoutGrid size={18} />
              <span className="text-[10px] font-black uppercase tracking-tight">
                {p}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">
          {t("select_destinations", {
            count: content.selectedIds?.length || 0,
          })}
        </div>
        <div className="grid grid-cols-2 gap-3 max-h-[400px] overflow-y-auto p-2 custom-scrollbar">
          {allDestinations.map((dest) => {
            const isSelected = content.selectedIds?.includes(dest.id);

            return (
              <button
                key={dest.id}
                className={cn(
                  "p-3 rounded-2xl border-2 text-left transition-all relative group",
                  isSelected
                    ? "border-primary bg-primary/5"
                    : "border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900",
                )}
                onClick={() => toggleDestination(dest.id)}
              >
                <div className="text-xs font-bold truncate pr-6">
                  {dest.nameVi}
                </div>
                <div className="text-[10px] text-slate-400 truncate">
                  {dest.region?.nameVi || "Vietnam"}
                </div>
                {isSelected && (
                  <div className="absolute top-3 right-3 w-4 h-4 bg-primary text-white rounded-full flex items-center justify-center">
                    <LucideIcons.Check size={10} strokeWidth={3} />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
