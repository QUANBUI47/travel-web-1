"use client";

import type { TrendingSectionProps } from "@/components/home/section-props";

import Link from "next/link";
import { Star, Zap, Flame, ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";

import { AppImage } from "@/components/ui/app-image";
import { getLocalizedValue } from "@/lib/utils/i18n";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/constants/routes";

export function TrendingSection({
  content,
  locale,
  tours = [],
}: TrendingSectionProps) {
  const t = useTranslations("HomePage.Trending");
  const tTours = useTranslations("Tours");

  if (!tours.length) return null;

  return (
    <section className="py-24 bg-white dark:bg-slate-900 overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-primary font-black text-xs uppercase tracking-[0.3em]">
              <Flame className="animate-pulse" fill="currentColor" size={16} />
              <span>
                {getLocalizedValue(content?.subtitle, locale) || t("subtitle")}
              </span>
            </div>
            <h2 className="text-4xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.1]">
              {getLocalizedValue(content?.title, locale) || t("title")}
            </h2>
          </div>
          <button className="px-8 py-4 bg-slate-100 dark:bg-white/5 text-slate-900 dark:text-white font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-primary hover:text-white transition-all shadow-sm">
            {t("view_all")}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tours.map((tour, idx) => (
            <div
              key={tour.id}
              className={cn(
                "group relative bg-white dark:bg-slate-800 rounded-[2.5rem] overflow-hidden border border-slate-100 dark:border-white/5 shadow-xl transition-all duration-500 hover:-translate-y-2",
                idx === 1
                  ? "lg:scale-105 lg:z-10 shadow-primary/20 border-primary/20"
                  : "",
              )}
            >
              {/* Glow Effect for Trending items */}
              {idx === 1 && (
                <div className="absolute -inset-1 bg-gradient-to-r from-primary via-blue-400 to-indigo-600 rounded-[2.6rem] blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200" />
              )}

              <div className="relative aspect-[4/3] overflow-hidden">
                <AppImage
                  fill
                  alt={
                    (locale === "vi" ? tour.nameVi : tour.nameEn) ??
                    tour.nameVi ??
                    ""
                  }
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  src={
                    tour.imageUrls[0] ||
                    "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&q=80&w=800"
                  }
                />
                <div className="absolute top-6 left-6 z-20">
                  <span className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md text-primary text-[10px] font-black uppercase px-4 py-2 rounded-full shadow-lg tracking-widest">
                    {idx === 0
                      ? "Best Seller"
                      : idx === 1
                        ? "Hot Deal"
                        : "Trending"}
                  </span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              <div className="p-8 space-y-6 relative bg-white dark:bg-slate-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-amber-400">
                    <Star fill="currentColor" size={14} />
                    <span className="text-xs font-black text-slate-900 dark:text-white">
                      5.0
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold">
                      (24)
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-primary">
                    <Zap fill="currentColor" size={14} />
                    <span className="text-[10px] font-black uppercase tracking-widest">
                      Instant Book
                    </span>
                  </div>
                </div>

                <h3 className="text-xl font-black text-slate-900 dark:text-white leading-snug group-hover:text-primary transition-colors line-clamp-2 min-h-[3.5rem]">
                  {locale === "vi" ? tour.nameVi : tour.nameEn}
                </h3>

                <div className="flex items-center justify-between pt-4 border-t border-slate-50 dark:border-white/5">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                      {tTours("price_from")}
                    </p>
                    <p className="text-2xl font-black text-primary">
                      ₫{Number(tour.priceAdult).toLocaleString("vi-VN")}
                    </p>
                  </div>
                  <Link
                    className="w-12 h-12 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all shadow-lg"
                    href={`${ROUTES.TOURS}/${tour.slug}`}
                  >
                    <ArrowRight size={20} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
