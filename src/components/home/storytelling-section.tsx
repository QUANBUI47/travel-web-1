import type { StorytellingSectionProps } from "@/components/home/section-props";
import type { I18nString } from "@/types/builder";

import { Quote, Star } from "lucide-react";
import { useTranslations } from "next-intl";

import { getLocalizedValue } from "@/lib/utils/i18n";

type StoryCardItem = {
  author: string | I18nString;
  role: string | I18nString;
  quote: string | I18nString;
  rating?: number;
};

export function StorytellingSection({
  content,
  locale,
}: StorytellingSectionProps) {
  const t = useTranslations("HomePage.Storytelling");
  const title = getLocalizedValue(content?.title, locale) || t("title");
  const demoItems = t.raw("demo_items") as Array<{
    author: { vi: string; en: string };
    role: { vi: string; en: string };
    quote: { vi: string; en: string };
    rating?: number;
  }>;
  const items = content?.items?.length ? content.items : demoItems;

  return (
    <section className="w-full py-20 md:py-24 bg-slate-50 dark:bg-slate-900/50">
      <div className="container mx-auto max-w-7xl px-4 lg:px-10 text-center">
        <div className="relative inline-block mb-12">
          <Quote className="mx-auto text-blue-50/60" size={80} />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-primary font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-[0.625rem] md:text-xs whitespace-nowrap">
              {t("badge")}
            </span>
          </div>
        </div>

        <h2 className="text-3xl md:text-5xl font-black font-['Plus_Jakarta_Sans'] tracking-tight mb-12 leading-tight dark:text-white">
          {title}
        </h2>

        <div className="flex flex-wrap justify-center gap-8">
          {items.map((item: StoryCardItem, i: number) => (
            <div
              key={i}
              className="w-full md:w-[calc(33.333%-1.5rem)] min-w-[300px] bg-white dark:bg-slate-800/50 dark:backdrop-blur-md p-10 rounded-[2.5rem] border border-slate-100 dark:border-white/10 flex flex-col items-center text-center shadow-sm hover:shadow-xl transition-all duration-500 group"
            >
              <div className="flex gap-1 text-[#fcc219] mb-6">
                {[...Array(item.rating || 5)].map((_, j) => (
                  <Star key={j} fill="currentColor" size={14} />
                ))}
              </div>
              <p className="text-slate-600 dark:text-slate-300 text-base font-medium italic leading-relaxed mb-8">
                &quot;
                {getLocalizedValue(item.quote, locale) ||
                  (typeof item.quote === "string" ? item.quote : "")}
                &quot;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-900/40 flex items-center justify-center font-black text-primary dark:text-blue-300 text-sm md:text-base">
                  {(
                    getLocalizedValue(item.author, locale) ||
                    (typeof item.author === "string" ? item.author : "V")
                  )?.charAt(0) || "V"}
                </div>
                <div className="text-left">
                  <p className="text-xs md:text-sm font-black uppercase tracking-widest text-primary dark:text-blue-400">
                    {getLocalizedValue(item.author, locale) ||
                      (typeof item.author === "string" ? item.author : "")}
                  </p>
                  <p className="text-[0.625rem] md:text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
                    {getLocalizedValue(item.role, locale) ||
                      (typeof item.role === "string" ? item.role : "")}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
