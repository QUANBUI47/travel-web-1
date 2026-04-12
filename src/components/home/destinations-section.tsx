"use client";

import { ChevronRight, PlusCircle } from "lucide-react";
import { Button } from "@heroui/button";
import Link from "next/link";

import { AppImage } from "@/components/ui/app-image";
import { IMAGES, ROUTES, destinationDetailPath } from "@/constants";
import { getDBLocalizedValue } from "@/lib/utils/i18n";
import {
  Destination,
  DestinationsContent,
  DestinationsLayoutPattern,
} from "@/types";

interface DestinationsSectionProps {
  content: DestinationsContent;
  locale: string;
  t: (key: string, values?: Record<string, string | number>) => string;
  allDestinations: Destination[];
  layoutPattern?: DestinationsLayoutPattern;
}

export function DestinationsSection({
  content,
  locale,
  t,
  allDestinations,
  layoutPattern = "grid",
}: DestinationsSectionProps) {
  const title =
    (locale === "en"
      ? content?.sectionTitle?.en || content?.sectionTitle?.vi
      : content?.sectionTitle?.vi) || t("Destinations.title");
  const selectedIds = content?.selectedIds || [];

  // Filter and sort destinations based on selection
  const displayDestinations = (allDestinations || [])
    .filter((d) => selectedIds.includes(d.id))
    .sort((a, b) => selectedIds.indexOf(a.id) - selectedIds.indexOf(b.id));

  // Fallback if none selected
  const finalDestinations =
    displayDestinations.length > 0
      ? displayDestinations
      : (allDestinations || []).slice(0, 4);

  return (
    <section className="w-full py-20 md:py-24" id="destinations">
      <div className="container mx-auto max-w-7xl px-4 lg:px-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="flex flex-col gap-2">
            <span className="text-primary font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-[0.625rem] md:text-xs block mb-1 whitespace-nowrap">
              {t("Destinations.badge")}
            </span>
            <h2 className='text-3xl md:text-5xl font-black font-["Plus_Jakarta_Sans"] tracking-tight leading-[1.3] md:leading-[1.1] uppercase text-slate-900 dark:text-white'>
              {title}
            </h2>
          </div>
          <Button
            suppressHydrationWarning
            as={Link}
            className="font-black rounded-xl h-12 px-6 text-xs tracking-widest flex items-center gap-2 group hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
            color="primary"
            endContent={
              <ChevronRight
                className="group-hover:translate-x-1 transition-transform"
                size={18}
              />
            }
            href={ROUTES.TOURS}
            variant="light"
          >
            {t("Destinations.view_all")}
          </Button>
        </div>

        {/* ── CAROUSEL LAYOUT ───────────────────────────────────────────── */}
        {layoutPattern === "carousel" && (
          <div className="flex gap-5 overflow-x-auto snap-x snap-mandatory pb-6 scrollbar-hide -mx-4 px-4">
            {finalDestinations.map((dest, idx) => (
              <Link
                key={dest.id || idx}
                className="snap-start shrink-0 w-[280px] sm:w-[320px] relative rounded-3xl overflow-hidden group cursor-pointer shadow-lg h-[380px] transition-all hover:shadow-xl hover:-translate-y-1"
                href={destinationDetailPath(dest.slug)}
              >
                <AppImage
                  fill
                  alt={getDBLocalizedValue(dest, "name", locale)}
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  src={dest.imageUrl || IMAGES.PLACEHOLDERS.DESTINATION}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent flex flex-col justify-end p-6">
                  <h3 className="text-xl font-black text-white font-['Plus_Jakarta_Sans'] leading-tight">
                    {getDBLocalizedValue(dest, "name", locale)}
                  </h3>
                  <p className="text-white/60 text-xs font-bold mt-1">
                    {dest.region?.nameVi || ""}
                  </p>
                </div>
              </Link>
            ))}
            {/* Add more CTA card */}
            <Link
              className="snap-start shrink-0 w-[200px] relative rounded-3xl overflow-hidden group cursor-pointer bg-primary/5 dark:bg-primary/10 flex items-center justify-center border-2 border-dashed border-primary/20 hover:border-primary transition-all h-[380px]"
              href={ROUTES.DESTINATIONS}
            >
              <div className="text-center">
                <PlusCircle
                  className="mx-auto mb-3 text-primary/60 group-hover:text-primary transition-colors"
                  size={32}
                />
                <p className="text-xs font-black uppercase tracking-[0.2em] text-primary/60 group-hover:text-primary">
                  {t("Destinations.see_more_regions")}
                </p>
              </div>
            </Link>
          </div>
        )}

        {/* ── MASONRY LAYOUT ────────────────────────────────────────────── */}
        {layoutPattern === "masonry" && (
          <div className="columns-2 md:columns-3 gap-5 space-y-5">
            {finalDestinations.map((dest, idx) => (
              <Link
                key={dest.id || idx}
                className="break-inside-avoid block relative rounded-3xl overflow-hidden group cursor-pointer shadow-md hover:shadow-xl transition-all hover:-translate-y-1"
                href={destinationDetailPath(dest.slug)}
                style={{
                  height:
                    idx % 3 === 0 ? "380px" : idx % 3 === 1 ? "260px" : "320px",
                }}
              >
                <AppImage
                  fill
                  alt={getDBLocalizedValue(dest, "name", locale)}
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  src={dest.imageUrl || IMAGES.PLACEHOLDERS.DESTINATION}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex flex-col justify-end p-6">
                  <h3 className="text-lg font-black text-white font-['Plus_Jakarta_Sans'] leading-tight">
                    {getDBLocalizedValue(dest, "name", locale)}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* ── GRID LAYOUT (mặc định — giữ nguyên code gốc) ─────────────── */}
        {(!layoutPattern || layoutPattern === "grid") && (
          <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-none md:grid-rows-2 gap-8 h-auto md:h-[850px]">
            {/* Item 1: Large Feature (Left) */}
            {finalDestinations[0] && (
              <Link
                className="md:col-span-2 md:row-span-2 relative rounded-[4rem] overflow-hidden group cursor-pointer shadow-xl h-[450px] md:h-full transition-all hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1"
                href={destinationDetailPath(finalDestinations[0].slug)}
              >
                <AppImage
                  fill
                  alt={getDBLocalizedValue(
                    finalDestinations[0],
                    "name",
                    locale,
                  )}
                  className="object-cover transition-transform duration-1000 group-hover:scale-105"
                  src={
                    finalDestinations[0].imageUrl ||
                    IMAGES.PLACEHOLDERS.DESTINATION
                  }
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-10">
                  <span className="bg-[#fcc219] text-slate-900 w-fit px-4 py-1.5 rounded-full text-[0.625rem] md:text-xs font-black uppercase mb-4 shadow-lg">
                    {t("Destinations.category_heritage")}
                  </span>
                  <h3 className="text-3xl md:text-4xl font-black text-white font-['Plus_Jakarta_Sans'] leading-none">
                    {getDBLocalizedValue(finalDestinations[0], "name", locale)}
                  </h3>
                </div>
              </Link>
            )}

            {/* Item 2: Horizontal Medium (Top Right) */}
            {finalDestinations[1] && (
              <Link
                className="md:col-span-2 relative rounded-[4rem] overflow-hidden group cursor-pointer h-[280px] md:h-full shadow-lg hover:-translate-y-1 transition-all"
                href={destinationDetailPath(finalDestinations[1].slug)}
              >
                <AppImage
                  fill
                  alt={getDBLocalizedValue(
                    finalDestinations[1],
                    "name",
                    locale,
                  )}
                  className="object-cover transition-transform duration-1000 group-hover:scale-105"
                  src={
                    finalDestinations[1].imageUrl ||
                    IMAGES.PLACEHOLDERS.DESTINATION
                  }
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex flex-col justify-end p-10">
                  <h3 className="text-2xl font-black text-white font-['Plus_Jakarta_Sans']">
                    {getDBLocalizedValue(finalDestinations[1], "name", locale)}
                  </h3>
                </div>
              </Link>
            )}

            {/* Item 3: Square small */}
            {finalDestinations[2] && (
              <Link
                className="relative rounded-[4rem] overflow-hidden group cursor-pointer h-[280px] md:h-full shadow-lg hover:-translate-y-1 transition-all"
                href={destinationDetailPath(finalDestinations[2].slug)}
              >
                <AppImage
                  fill
                  alt={finalDestinations[2].nameVi}
                  className="object-cover group-hover:scale-110 transition-transform duration-1000"
                  src={
                    finalDestinations[2].imageUrl ||
                    IMAGES.PLACEHOLDERS.DESTINATION
                  }
                />
                <div className="absolute inset-0 bg-primary/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[1px]">
                  <p className="text-white font-black uppercase text-[0.625rem] tracking-[0.2em]">
                    {t("Destinations.discover")}
                  </p>
                </div>
              </Link>
            )}

            {/* Item 4: Action Call */}
            <Link
              className="relative rounded-[4rem] overflow-hidden group cursor-pointer bg-primary/5 dark:bg-primary/10 flex items-center justify-center border-2 border-dashed border-primary/20 dark:border-primary/30 hover:border-primary transition-all h-[280px] md:h-full hover:-translate-y-1"
              href={ROUTES.DESTINATIONS}
            >
              <div className="text-center group-hover:scale-110 transition-transform duration-500">
                <div className="w-14 h-14 bg-white dark:bg-slate-800 rounded-full shadow-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-primary group-hover:text-white transition-all text-primary border border-slate-100 dark:border-slate-700">
                  <PlusCircle size={28} />
                </div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-primary/70 group-hover:text-primary">
                  {t("Destinations.see_more_regions")}
                </p>
              </div>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
