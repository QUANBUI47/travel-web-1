import Link from "next/link";
import { ArrowUpRight, Camera, MapPin, Navigation, Route } from "lucide-react";
import { Button } from "@heroui/button";

import { DestinationMiniMap } from "@/components/destinations/destination-mini-map";
import { ROUTES } from "@/constants";

interface DestinationDetailSidebarProps {
  regionName: string;
  destinationSlug: string;
  tourCount: number;
  photoCount: number;
  lat?: number | null;
  lng?: number | null;
  destinationName: string;
  labels: {
    region: string;
    viewTours: string;
    statTours: string;
    statPhotos: string;
    mapTitle: string;
    openMaps: string;
  };
}

export function DestinationDetailSidebar({
  regionName,
  destinationSlug,
  tourCount,
  photoCount,
  lat,
  lng,
  destinationName,
  labels,
}: DestinationDetailSidebarProps) {
  const hasCoords =
    typeof lat === "number" &&
    typeof lng === "number" &&
    Number.isFinite(lat) &&
    Number.isFinite(lng);

  const mapsUrl = hasCoords
    ? `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`
    : null;

  return (
    <aside className="lg:sticky lg:top-24 lg:self-start space-y-5">
      <div className="overflow-hidden rounded-[2rem] bg-white shadow-xl shadow-slate-900/[0.06] ring-1 ring-slate-200/80 dark:bg-slate-900 dark:shadow-none dark:ring-slate-800">
        <div className="h-1.5 bg-gradient-to-r from-primary via-sky-400 to-primary/40" />

        <div className="p-6 md:p-7">
          <div className="grid grid-cols-2 gap-3">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 to-sky-500/5 p-4 ring-1 ring-primary/10">
              <Route className="mb-3 text-primary" size={18} />
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {labels.statTours}
              </p>
              <p className="mt-0.5 font-heading text-3xl font-black text-slate-900 dark:text-white">
                {tourCount}
              </p>
            </div>
            <div className="relative overflow-hidden rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-100 dark:bg-slate-800/60 dark:ring-slate-700/50">
              <Camera className="mb-3 text-primary" size={18} />
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {labels.statPhotos}
              </p>
              <p className="mt-0.5 font-heading text-3xl font-black text-slate-900 dark:text-white">
                {photoCount}
              </p>
            </div>
          </div>

          <div className="mt-7 rounded-2xl border border-slate-100 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-800/40">
            <div className="flex items-center gap-2 text-primary">
              <MapPin size={16} />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                {labels.region}
              </span>
            </div>
            <p className="mt-2 font-heading text-xl font-bold text-slate-900 dark:text-white">
              {regionName || "—"}
            </p>
          </div>

          <Button
            as={Link}
            className="mt-6 w-full cursor-pointer font-black text-xs uppercase tracking-widest shadow-lg shadow-primary/25"
            color="primary"
            endContent={<ArrowUpRight size={16} />}
            href={`${ROUTES.TOURS}?destination=${destinationSlug}`}
            radius="full"
            size="lg"
          >
            {labels.viewTours}
          </Button>
        </div>
      </div>

      {hasCoords && (
        <div className="overflow-hidden rounded-[2rem] bg-white shadow-lg shadow-slate-900/[0.04] ring-1 ring-slate-200/80 dark:bg-slate-900 dark:ring-slate-800">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 dark:border-slate-800">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
              {labels.mapTitle}
            </p>
            <Navigation className="text-primary" size={14} />
          </div>
          <DestinationMiniMap
            className="destination-mini-map h-56 w-full"
            label={destinationName}
            lat={lat}
            lng={lng}
          />
          {mapsUrl ? (
            <Link
              className="flex cursor-pointer items-center justify-center gap-2 border-t border-slate-100 py-4 text-[10px] font-black uppercase tracking-widest text-primary transition-colors hover:bg-primary/[0.03] dark:border-slate-800"
              href={mapsUrl}
              rel="noopener noreferrer"
              target="_blank"
            >
              {labels.openMaps}
              <ArrowUpRight size={12} />
            </Link>
          ) : null}
        </div>
      )}
    </aside>
  );
}
