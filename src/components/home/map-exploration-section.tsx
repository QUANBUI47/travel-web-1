"use client";

import type { MapExplorationSectionProps } from "@/components/home/section-props";

import { Map as MapIcon, Navigation } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";

import { VietnamExplorationMap } from "@/components/home/vietnam-exploration-map";
import { ROUTES, destinationDetailPath } from "@/constants";
import { getLocalizedValue } from "@/lib/utils/i18n";

export function MapExplorationSection({
  content,
  destinations = [],
}: Omit<MapExplorationSectionProps, "locale">) {
  const locale = useLocale();
  const t = useTranslations("HomePage.Map");
  const points = content?.points ?? [];
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const activePoint = useMemo(() => {
    if (points.length === 0) return null;
    if (selectedId) {
      return points.find((p) => p.id === selectedId) ?? points[0];
    }

    return points[0];
  }, [points, selectedId]);

  const activeLabel = activePoint
    ? getLocalizedValue(activePoint.title, locale)
    : t("selected_location");

  const linkedDestination = activePoint?.destinationId
    ? destinations.find((d) => d.id === activePoint.destinationId)
    : undefined;

  const viewHref = linkedDestination
    ? destinationDetailPath(linkedDestination.slug)
    : ROUTES.TOURS;

  return (
    <section className="py-24 bg-slate-50 dark:bg-slate-900/50 relative overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
        <div className="lg:col-span-5 space-y-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary text-white rounded-2xl shadow-lg shadow-primary/20">
              <MapIcon size={20} strokeWidth={2.5} />
            </div>
            <span className="text-primary font-black text-xs uppercase tracking-[0.3em]">
              {t("badge")}
            </span>
          </div>
          <h2 className="text-4xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.1]">
            {getLocalizedValue(content?.title, locale) || t("title")}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-lg leading-relaxed font-medium">
            {t("description")}
          </p>

          <div className="grid grid-cols-2 gap-6 pt-4">
            <div className="p-6 bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-white/5 shadow-sm">
              <h4 className="text-2xl font-black text-primary mb-1">
                {t("provinces_count")}
              </h4>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                {t("provinces")}
              </p>
            </div>
            <div className="p-6 bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-white/5 shadow-sm">
              <h4 className="text-2xl font-black text-primary mb-1">
                {points.length > 0 ? points.length : "500+"}
              </h4>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                {t("destinations")}
              </p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7">
          <div className="relative aspect-square lg:aspect-[4/3] bg-white dark:bg-slate-800 rounded-[3rem] border border-slate-200/50 dark:border-white/10 shadow-2xl overflow-hidden isolate">
            <VietnamExplorationMap
              activePointId={activePoint?.id}
              className="vietnam-exploration-map z-0 h-full w-full"
              getPointLabel={(point) => getLocalizedValue(point.title, locale)}
              locale={locale}
              points={points}
              onSelectPoint={setSelectedId}
            />

            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[500] p-6 sm:p-8">
              <div className="pointer-events-auto flex flex-col gap-4 rounded-[2rem] border border-white/50 bg-white/90 p-5 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-slate-800/90 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-white">
                    <Navigation size={20} />
                  </div>
                  <div>
                    <p className="mb-0.5 text-[10px] font-black uppercase tracking-widest text-primary">
                      {t("selected")}
                    </p>
                    <p className="text-base font-black text-slate-900 dark:text-white">
                      {activeLabel}
                    </p>
                  </div>
                </div>
                <Link
                  className="flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-6 py-3 text-[10px] font-black uppercase tracking-widest text-white transition-all hover:bg-primary hover:text-white dark:bg-white dark:text-slate-900"
                  href={viewHref}
                >
                  {t("view_tours")}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
