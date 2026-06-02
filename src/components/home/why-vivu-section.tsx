import type { WhyVivuSectionProps } from "@/components/home/section-props";
import type { WhyVivuItem } from "@/types/builder";

import { PlayCircle, ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";

import { AppImage } from "@/components/ui/app-image";
import { getLucideIcon } from "@/lib/utils/lucide-icon";
import { IMAGES } from "@/constants";
import { getLocalizedValue } from "@/lib/utils/i18n";

export function WhyVivuSection({ content, locale }: WhyVivuSectionProps) {
  const t = useTranslations("HomePage.WhyVivu");
  const items = content?.items || [];
  const sectionTitle =
    getLocalizedValue(content?.sectionTitle, locale) || t("title_highlight");
  const sectionSubtitle =
    getLocalizedValue(content?.sectionSubtitle, locale) || t("description");
  const featuredImage = content?.featuredImage || IMAGES.PLACEHOLDERS.HERO;

  return (
    <section
      className="bg-slate-50 dark:bg-slate-900/50 py-20 md:py-24 overflow-hidden relative border-y border-slate-100 dark:border-white/5"
      id="why-vivu"
    >
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-100/10 rounded-full blur-[120px] translate-x-1/2 -translate-y-1/2" />
      <div className="container mx-auto max-w-7xl px-4 lg:px-10 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
        <div className="relative w-full">
          <div className="w-full aspect-[4/3] lg:aspect-square rounded-[2.5rem] lg:rounded-[3.5rem] overflow-hidden shadow-2xl relative z-10">
            <AppImage
              fill
              alt="Travel guide"
              className="object-cover"
              src={featuredImage}
            />
            <div className="absolute inset-0 bg-blue-900/5" />
            <div className="absolute inset-0 flex items-center justify-center">
              <PlayCircle
                className="text-white/80 animate-pulse cursor-pointer hover:text-white transition-colors"
                size={80}
              />
            </div>
          </div>
          <div className="absolute -bottom-6 -right-6 w-48 h-48 lg:-bottom-8 lg:-right-8 lg:w-64 lg:h-64 bg-[#fcc219] rounded-[2rem] lg:rounded-[2.5rem] -z-0 shadow-xl opacity-40 lg:opacity-50" />
        </div>

        <div className="space-y-8 text-left">
          <div className="space-y-4">
            <span className="text-primary font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-[0.625rem] md:text-xs">
              {t("badge")}
            </span>
            <h2 className="text-4xl lg:text-5xl font-black tracking-tight leading-tight text-slate-900 dark:text-white">
              {sectionTitle}
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-lg leading-relaxed font-medium">
              {sectionSubtitle}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-10 mt-8 pt-8 border-t border-slate-100 dark:border-white/10">
            {items.map((item: WhyVivuItem, i: number) => {
              const IconNode = getLucideIcon(item.icon) ?? ShieldCheck;

              return (
                <div key={i} className="flex gap-4 group cursor-default">
                  <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-white/10 flex items-center justify-center text-primary group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-500 shrink-0">
                    {item.imageUrl ? (
                      <AppImage
                        alt={getLocalizedValue(item.title, locale)}
                        className="w-6 h-6 object-contain"
                        height={24}
                        src={item.imageUrl}
                        width={24}
                      />
                    ) : (
                      <IconNode size={22} strokeWidth={2.5} />
                    )}
                  </div>
                  <div>
                    <h4 className="font-black text-xs md:text-sm uppercase tracking-widest mb-1 text-slate-800 dark:text-white">
                      {getLocalizedValue(item.title, locale)}
                    </h4>
                    <p className="text-[0.625rem] md:text-xs text-slate-400 dark:text-slate-500 font-bold leading-relaxed uppercase tracking-wide">
                      {getLocalizedValue(item.desc, locale)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
