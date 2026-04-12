import type { Tour } from "@/types";

import { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";

import { TourService } from "@/services/tour.service";
import { DestinationService } from "@/services/destination.service";
import { TourCard } from "@/components/tours/tour-card";
import { ToursSearchBar } from "@/components/tours/tours-search-bar";
import { parseTourSearchParams } from "@/lib/tour/search-params";
import { serialize } from "@/lib/utils";
import { getDBLocalizedValue } from "@/lib/utils/i18n";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: "Tours" });

  return {
    title: t("title"),
    description: t("description"),
    openGraph: {
      title: `${t("title")} | Vivu Travel`,
      description: t("description"),
    },
  };
}

export default async function ToursPage({ searchParams }: PageProps) {
  const locale = await getLocale();
  const t = await getTranslations("Tours");
  const filters = parseTourSearchParams(await searchParams);

  const [tours, destinations] = serialize(
    await Promise.all([
      TourService.searchListings(filters),
      DestinationService.getAll(),
    ]),
  ) as [Tour[], Awaited<ReturnType<typeof DestinationService.getAll>>];

  const activeDestination = filters.destination
    ? destinations.find((d) => d.slug === filters.destination)
    : undefined;

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950/50">
      <div className="max-w-7xl mx-auto px-4 lg:px-10 py-24 sm:py-32">
        <div className="flex flex-col gap-4 mb-10 max-w-3xl animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <span className="text-primary font-black uppercase tracking-[0.4em] text-[10px] sm:text-xs block">
            {t("title")}
          </span>
          <h1 className='text-4xl sm:text-6xl lg:text-7xl font-black font-["Plus_Jakarta_Sans"] tracking-tighter leading-[1.1] uppercase text-slate-900 dark:text-white'>
            {t("description")}
          </h1>
          {activeDestination && (
            <p className="text-slate-500 dark:text-slate-400 font-medium">
              {t("filtered_by_destination", {
                name: getDBLocalizedValue(activeDestination, "name", locale),
              })}
            </p>
          )}
          <div className="h-1.5 w-24 bg-primary rounded-full mt-2" />
        </div>

        <ToursSearchBar
          destinations={destinations}
          initial={filters}
          locale={locale}
        />

        {tours.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
            {tours.map((tour, index) => (
              <div
                key={tour.id}
                className="animate-in fade-in slide-in-from-bottom-10 duration-1000 fill-mode-both"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <TourCard locale={locale} tour={tour} />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6 text-slate-400">
              <svg
                className="w-10 h-10"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M9.172 9.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              {t("no_tours")}
            </h3>
          </div>
        )}
      </div>
    </div>
  );
}
