"use client";

import * as LucideIcons from "lucide-react";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import React from "react";
import { useTranslations } from "next-intl";

import adminEn from "@/messages/admin/en.json";
import adminVi from "@/messages/admin/vi.json";
import { WhyVivuContent, WhyVivuItem } from "@/types";
import { BilingualInput } from "@/components/admin/bilingual-input";
import { ImageUploader } from "@/components/ui/image-uploader";
import { getLucideIcon } from "@/lib/utils/lucide-icon";

const editorsVi = adminVi.Builder.editors;
const editorsEn = adminEn.Builder.editors;

interface WhyVivuEditorProps {
  content: WhyVivuContent;
  onUpdate: (content: Partial<WhyVivuContent>) => void;
}

export function WhyVivuEditor({ content, onUpdate }: WhyVivuEditorProps) {
  const t = useTranslations("Admin.Builder.editors");
  const updateItem = (idx: number, updates: Partial<WhyVivuItem>) => {
    const newItems = [...content.items];

    newItems[idx] = { ...newItems[idx], ...updates };
    onUpdate({ items: newItems });
  };

  const addItem = () => {
    onUpdate({
      items: [
        ...content.items,
        {
          icon: "Shield",
          title: { vi: editorsVi.new_title, en: editorsEn.new_title },
          desc: { vi: editorsVi.new_desc, en: editorsEn.new_desc },
        },
      ],
    });
  };

  const removeItem = (idx: number) => {
    onUpdate({ items: content.items.filter((_, i) => i !== idx) });
  };

  return (
    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-2 gap-4">
        <BilingualInput
          label={t("why_title")}
          name="why_vivu_section_title"
          value={content.sectionTitle}
          onValueChange={(val) => onUpdate({ sectionTitle: val })}
        />
        <BilingualInput
          label={t("why_subtitle")}
          name="why_vivu_section_subtitle"
          value={content.sectionSubtitle}
          onValueChange={(val) => onUpdate({ sectionSubtitle: val })}
        />
      </div>

      <div className="space-y-3">
        <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">
          {t("why_featured_image")}
        </div>
        <ImageUploader
          maxFiles={1}
          value={content.featuredImage ? [content.featuredImage] : []}
          onChange={(urls) => onUpdate({ featuredImage: urls[0] ?? "" })}
        />
      </div>

      <div className="space-y-4">
        <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">
          {t("why_items", { count: content.items.length })}
        </div>
        <div className="space-y-4">
          {content.items.map((item, idx) => (
            <div
              key={idx}
              className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm relative group space-y-4"
            >
              <button
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                onClick={() => removeItem(idx)}
              >
                <LucideIcons.X size={12} />
              </button>

              <div className="grid grid-cols-1 gap-4">
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
                      item.icon
                        ? React.createElement(getLucideIcon(item.icon), {
                            size: 16,
                          })
                        : null
                    }
                    value={item.icon}
                    onChange={(e) => updateItem(idx, { icon: e.target.value })}
                  />
                </div>
                <BilingualInput
                  label={t("benefit_title")}
                  name={`why_vivu_item_title_${idx}`}
                  value={item.title}
                  onValueChange={(val) => updateItem(idx, { title: val })}
                />
                <BilingualInput
                  label={t("benefit_desc")}
                  name={`why_vivu_item_desc_${idx}`}
                  value={item.desc}
                  onValueChange={(val) => updateItem(idx, { desc: val })}
                />
              </div>
            </div>
          ))}
        </div>

        <Button
          className="w-full h-14 border-dashed border-2 border-slate-200 dark:border-slate-800 rounded-2xl text-slate-400 hover:border-primary hover:text-primary transition-all font-bold"
          startContent={<LucideIcons.Plus size={18} />}
          variant="bordered"
          onClick={addItem}
        >
          {t("add_benefit")}
        </Button>
      </div>
    </div>
  );
}
