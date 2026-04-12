"use client";

import type { CuratedCollectionsSectionProps } from "@/components/home/section-props";

import { Layers, ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";

import { AppImage } from "@/components/ui/app-image";
import { getLocalizedValue } from "@/lib/utils/i18n";

type DemoCollectionConfig = {
  id: string;
  title: { vi: string; en: string };
  color: string;
  slugHints?: string[];
  defaultCount: number;
  useHalfTourCount?: boolean;
};

const COLLECTION_IMAGES: Record<string, string> = {
  c1: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=800",
  c2: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&q=80&w=800",
  c3: "https://images.unsplash.com/photo-1505993597083-3bd19fb75e57?auto=format&fit=crop&q=80&w=800",
  c4: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=800",
};

function countToursBySlugHints(
  tours: Array<{ slug: string }>,
  hints: string[],
): number {
  if (!hints.length) return 0;

  return tours.filter((tour) => hints.some((hint) => tour.slug.includes(hint)))
    .length;
}

export function CuratedCollectionsSection({
  content,
  locale,
  tours = [],
}: CuratedCollectionsSectionProps) {
  const t = useTranslations("HomePage.Curated");

  const demoConfig = t.raw("demo_collections") as DemoCollectionConfig[];

  const demoCollections = demoConfig.map((item) => {
    const matched = countToursBySlugHints(tours, item.slugHints ?? []);
    const count = item.useHalfTourCount
      ? tours.length > 0
        ? Math.ceil(tours.length / 2)
        : item.defaultCount
      : matched || item.defaultCount;

    return {
      ...item,
      count,
      image: COLLECTION_IMAGES[item.id] ?? COLLECTION_IMAGES.c1,
    };
  });

  return (
    <section className="py-24 bg-white dark:bg-slate-900">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between mb-16">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/10 text-primary rounded-2xl">
                <Layers size={20} strokeWidth={2.5} />
              </div>
              <span className="text-primary font-black text-xs uppercase tracking-[0.3em]">
                {t("editors_choice")}
              </span>
            </div>
            <h2 className="text-4xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight">
              {getLocalizedValue(content?.title, locale) || t("badge")}
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {demoCollections.map((collection) => (
            <div
              key={collection.id}
              className="group relative aspect-[3/4] rounded-[3rem] overflow-hidden cursor-pointer shadow-xl transition-all duration-700 hover:scale-[1.02]"
            >
              <AppImage
                fill
                alt={getLocalizedValue(collection.title, locale)}
                className="object-cover transition-transform duration-1000 group-hover:scale-110"
                src={collection.image}
              />

              <div
                className={`absolute inset-0 bg-gradient-to-t ${collection.color} via-transparent to-transparent opacity-80 group-hover:opacity-95 transition-opacity`}
              />

              <div className="absolute inset-x-0 bottom-0 p-8 z-20 space-y-4">
                <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md border border-white/20 rounded-full text-[9px] font-black uppercase text-white tracking-widest">
                  {t("places_count", { count: collection.count })}
                </span>
                <h3 className="text-2xl font-black text-white leading-tight">
                  {getLocalizedValue(collection.title, locale)}
                </h3>
                <div className="pt-2 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                  <div className="flex items-center gap-2 text-white font-black text-[10px] uppercase tracking-[0.2em]">
                    {t("explore")} <ArrowRight size={14} strokeWidth={3} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
