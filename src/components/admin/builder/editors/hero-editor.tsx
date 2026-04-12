"use client";

import { useTranslations } from "next-intl";

import { HeroContent, Destination, I18nString } from "@/types";
import { BilingualInput } from "@/components/admin/bilingual-input";
import { MediaUploader } from "@/components/ui/media-uploader";
import { cn } from "@/lib/utils";

interface HeroEditorProps {
  content: HeroContent;
  onUpdate: (content: Partial<HeroContent>) => void;
  allDestinations: Destination[];
}

export function HeroEditor({
  content,
  onUpdate,
  allDestinations,
}: HeroEditorProps) {
  const t = useTranslations("Admin.Builder.editors");

  const toggleSuggestion = (destName: I18nString) => {
    const current = content.searchSuggestions || [];
    const exists = current.some((s) => s.vi === destName.vi);

    const newSuggestions = exists
      ? current.filter((s) => s.vi !== destName.vi)
      : [...current, destName];

    onUpdate({ searchSuggestions: newSuggestions });
  };

  return (
    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Media Type Selection */}
      <div className="grid grid-cols-2 gap-3 p-1.5 bg-slate-100 dark:bg-slate-800/50 rounded-2xl">
        {(["image", "video"] as const).map((mediaType) => (
          <button
            key={mediaType}
            className={cn(
              "py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
              content.type === mediaType
                ? "bg-white dark:bg-slate-700 text-primary shadow-sm scale-[1.02]"
                : "text-slate-500 hover:text-slate-700",
            )}
            onClick={() => onUpdate({ type: mediaType })}
          >
            {mediaType === "image" ? t("media_image") : t("media_video")}
          </button>
        ))}
      </div>

      <div className="space-y-6">
        <BilingualInput
          label={t("main_title")}
          name="hero_title"
          value={content.heroTitle}
          onValueChange={(val) => onUpdate({ heroTitle: val })}
        />
        <BilingualInput
          label={t("short_desc")}
          name="hero_description"
          value={content.heroDescription}
          onValueChange={(val) => onUpdate({ heroDescription: val })}
        />

        <div className="grid grid-cols-2 gap-4">
          <BilingualInput
            label={t("cta_label")}
            name="hero_cta_text"
            value={content.ctaText}
            onValueChange={(val) => onUpdate({ ctaText: val })}
          />
          <BilingualInput
            label={t("primary_btn")}
            name="hero_button_text"
            value={content.buttonText}
            onValueChange={(val) => onUpdate({ buttonText: val })}
          />
        </div>

        {/* Search Suggestions */}
        <div className="space-y-3">
          <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            {t("search_keywords")}
          </div>
          <div className="flex flex-wrap gap-2 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800">
            {allDestinations.map((dest) => {
              const destName = {
                vi: dest.nameVi,
                en: dest.nameEn || dest.nameVi,
              };
              const isSelected = (content.searchSuggestions || []).some(
                (s) => s.vi === destName.vi,
              );

              return (
                <button
                  key={dest.id}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-[10px] font-bold transition-all border",
                    isSelected
                      ? "bg-primary border-primary text-white shadow-md scale-105"
                      : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 hover:border-primary hover:text-primary",
                  )}
                  onClick={() => toggleSuggestion(destName)}
                >
                  {dest.nameVi}
                </button>
              );
            })}
          </div>
        </div>

        {/* Media Uploader */}
        <div className="space-y-3">
          <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            {content.type === "image" ? t("bg_image") : t("bg_video")}
          </div>
          <MediaUploader
            accept={content.type === "video" ? "video/*" : "image/*"}
            value={
              content.type === "image"
                ? (content.heroImages[0] ?? "")
                : (content.videoUrl ?? "")
            }
            onChange={(val) =>
              content.type === "image"
                ? onUpdate({ heroImages: [val] })
                : onUpdate({ videoUrl: val })
            }
          />
        </div>
      </div>
    </div>
  );
}
