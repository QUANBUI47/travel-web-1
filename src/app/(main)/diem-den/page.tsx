import { Metadata } from "next";
import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";

import { AppImage } from "@/components/ui/app-image";
import { DestinationService } from "@/services/destination.service";
import { getDBLocalizedValue } from "@/lib/utils/i18n";
import { IMAGES, destinationDetailPath } from "@/constants";
import { serialize } from "@/lib/utils";

type PageProps = {
  searchParams: Promise<{ region?: string }>;
};

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("DestinationsPage");

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function DestinationsPage({ searchParams }: PageProps) {
  const locale = await getLocale();
  const t = await getTranslations("DestinationsPage");
  const { region } = await searchParams;

  const destinations = serialize(
    await DestinationService.getByRegionSlug(region),
  );

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950/50">
      <div className="max-w-7xl mx-auto px-4 lg:px-10 py-24 sm:py-32">
        <div className="flex flex-col gap-4 mb-16 max-w-3xl">
          <span className="text-primary font-black uppercase tracking-[0.4em] text-[10px] sm:text-xs block">
            {t("title")}
          </span>
          <h1 className='text-4xl sm:text-6xl font-black font-["Plus_Jakarta_Sans"] tracking-tighter leading-[1.1] uppercase text-slate-900 dark:text-white'>
            {t("description")}
          </h1>
          <div className="h-1.5 w-24 bg-primary rounded-full mt-2" />
        </div>

        {destinations.length === 0 ? (
          <p className="text-slate-500 font-medium">{t("empty")}</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {destinations.map((dest) => {
              const name = getDBLocalizedValue(dest, "name", locale);
              const regionName = dest.region
                ? getDBLocalizedValue(dest.region, "name", locale)
                : "";

              return (
                <Link
                  key={dest.id}
                  className="group relative overflow-hidden rounded-[2rem] aspect-[4/5] shadow-xl"
                  href={destinationDetailPath(dest.slug)}
                >
                  <AppImage
                    fill
                    alt={name}
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, 33vw"
                    src={dest.imageUrl || IMAGES.PLACEHOLDERS.DESTINATION}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-8">
                    {regionName && (
                      <span className="text-[10px] font-black uppercase tracking-widest text-primary-200 mb-2 block">
                        {regionName}
                      </span>
                    )}
                    <h2 className="text-2xl font-black text-white uppercase tracking-tight">
                      {name}
                    </h2>
                    <span className="text-xs font-bold text-white/80 mt-2 inline-block group-hover:text-primary transition-colors">
                      {t("discover")} →
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
