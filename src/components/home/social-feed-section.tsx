"use client";

import type { SocialFeedSectionProps } from "@/components/home/section-props";

import { Instagram, Heart, MessageCircle } from "lucide-react";
import { useTranslations } from "next-intl";

import { AppImage } from "@/components/ui/app-image";
import { getLocalizedValue } from "@/lib/utils/i18n";

export function SocialFeedSection({ content, locale }: SocialFeedSectionProps) {
  const t = useTranslations("HomePage.Social");

  // Demo Instagram images
  const demoFeeds = [
    "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&q=80&w=400",
    "https://images.unsplash.com/photo-1555518829-39ca5408f65d?auto=format&fit=crop&q=80&w=400",
    "https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&q=80&w=400",
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=400",
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=400",
    "https://images.unsplash.com/photo-1505993597083-3bd19fb75e57?auto=format&fit=crop&q=80&w=400",
  ];

  return (
    <section className="py-24 bg-slate-50 dark:bg-slate-900 overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 text-center space-y-16">
        <div className="space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div className="p-3 bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 text-white rounded-2xl shadow-xl">
              <Instagram size={20} strokeWidth={2.5} />
            </div>
            <span className="text-slate-400 font-black text-xs uppercase tracking-[0.3em]">
              {t("follow_handle")}
            </span>
          </div>
          <h2 className="text-4xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight">
            {getLocalizedValue(content?.title, locale) || t("title_fallback")}
          </h2>
        </div>

        <div className="flex flex-wrap justify-center gap-4 lg:gap-6">
          {demoFeeds.map((url, idx) => (
            <div
              key={idx}
              className="group relative w-[180px] h-[180px] lg:w-[220px] lg:h-[220px] rounded-3xl overflow-hidden shadow-lg transition-all duration-500 hover:-rotate-2 hover:scale-105"
            >
              <AppImage
                fill
                alt="Social feed"
                className="object-cover"
                src={url}
              />

              {/* Interaction Overlay */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-6 text-white">
                <div className="flex flex-col items-center">
                  <Heart fill="currentColor" size={20} />
                  <span className="text-[10px] font-black mt-1">1.2k</span>
                </div>
                <div className="flex flex-col items-center">
                  <MessageCircle fill="currentColor" size={20} />
                  <span className="text-[10px] font-black mt-1">45</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button className="px-10 py-5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-full text-[11px] font-black uppercase tracking-[0.2em] text-slate-900 dark:text-white hover:bg-primary hover:text-white transition-all shadow-xl">
          {t("view_more_instagram")}
        </button>
      </div>
    </section>
  );
}
