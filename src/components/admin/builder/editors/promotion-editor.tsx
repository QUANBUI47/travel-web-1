"use client";

import { Input } from "@heroui/input";
import { useTranslations } from "next-intl";

import { PromotionContent } from "@/types";
import { BilingualInput } from "@/components/admin/bilingual-input";
import { MediaUploader } from "@/components/ui/media-uploader";

interface PromotionEditorProps {
  content: PromotionContent;
  onUpdate: (content: Partial<PromotionContent>) => void;
}

export function PromotionEditor({ content, onUpdate }: PromotionEditorProps) {
  const t = useTranslations("Admin.Builder.editors");

  return (
    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-6">
        <BilingualInput
          label={t("promo_content")}
          name="promotion_content"
          value={content.content}
          onValueChange={(val) => onUpdate({ content: val })}
        />

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              {t("deadline")}
            </div>
            <Input
              classNames={{
                inputWrapper: "bg-slate-50 dark:bg-slate-800 border-none h-11",
              }}
              type="datetime-local"
              value={content.deadline}
              onChange={(e) => onUpdate({ deadline: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              {t("theme")}
            </div>
            <select
              className="w-full h-11 px-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-sm font-medium border-none outline-none focus:ring-2 focus:ring-primary/20 transition-all appearance-none"
              value={content.theme}
              onChange={(e) => onUpdate({ theme: e.target.value })}
            >
              <option value="gold">{t("theme_gold")}</option>
              <option value="red">{t("theme_red")}</option>
              <option value="blue">{t("theme_blue")}</option>
              <option value="dark">{t("theme_dark")}</option>
            </select>
          </div>
        </div>

        <div className="space-y-3">
          <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            {t("banner_bg")}
          </div>
          <MediaUploader
            accept="image/*"
            value={content.backgroundImage ?? ""}
            onChange={(val) => onUpdate({ backgroundImage: val })}
          />
        </div>
      </div>
    </div>
  );
}
