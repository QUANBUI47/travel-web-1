"use client";

import { MapPin, Clock, Plane, Bus } from "lucide-react";
import { Card, CardBody, CardFooter } from "@heroui/card";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import Link from "next/link";
import { useTranslations } from "next-intl";

import { AppImage } from "@/components/ui/app-image";
import { Tour } from "@/types";
import { formatTransport } from "@/lib/tour/display-labels";
import { getDBLocalizedValue } from "@/lib/utils/i18n";
import { IMAGES } from "@/constants";

interface TourCardProps {
  tour: Tour;
  locale: string;
}

export function TourCard({ tour, locale }: TourCardProps) {
  const t = useTranslations("Tours");

  const name = getDBLocalizedValue(tour, "name", locale);
  const destinationName = tour.destination
    ? getDBLocalizedValue(tour.destination, "name", locale)
    : "";

  const formatPrice = (val: number | string | null | undefined) =>
    new Intl.NumberFormat(locale === "vi" ? "vi-VN" : "en-US", {
      style: "currency",
      currency: locale === "vi" ? "VND" : "USD",
      maximumFractionDigits: 0,
    }).format(Number(val ?? 0));

  const price = formatPrice(tour.priceAdult);
  const oldPrice = tour.oldPrice ? formatPrice(tour.oldPrice) : null;

  const discountPercent =
    tour.oldPrice && tour.priceAdult
      ? Math.round((1 - Number(tour.priceAdult) / Number(tour.oldPrice)) * 100)
      : 0;

  return (
    <Card className="group border-none shadow-sm hover:shadow-2xl transition-all duration-500 rounded-[2.5rem] overflow-hidden bg-white dark:bg-slate-900">
      <CardBody className="p-0 relative aspect-[4/3] overflow-hidden">
        {/* Badges */}
        <div className="absolute top-5 left-5 z-20 flex flex-col gap-2">
          {discountPercent > 0 && (
            <Chip
              className="bg-red-500 text-white border-none font-black text-[10px] uppercase tracking-widest shadow-lg animate-pulse"
              size="sm"
            >
              -{discountPercent}%
            </Chip>
          )}
          <Chip
            className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-none font-black text-[9px] uppercase tracking-widest text-primary shadow-lg"
            size="sm"
            variant="flat"
          >
            {t("duration", { days: tour.durationDays })}
          </Chip>
        </div>

        {/* Tags */}
        <div className="absolute top-5 right-5 z-20 flex flex-wrap gap-1 justify-end max-w-[60%]">
          {tour.tags?.slice(0, 2).map((tag, i) => (
            <Chip
              key={i}
              className="bg-emerald-500/90 text-white border-none font-black text-[8px] uppercase tracking-tighter shadow-sm"
              size="sm"
            >
              {tag}
            </Chip>
          ))}
        </div>

        {/* Ảnh Tour */}
        <AppImage
          fill
          alt={name}
          className="object-cover transition-transform duration-1000 group-hover:scale-110"
          src={tour.imageUrls?.[0] || IMAGES.PLACEHOLDERS.TOUR}
        />

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
      </CardBody>

      <CardBody className="p-6 sm:p-8 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-primary">
            <MapPin size={14} strokeWidth={3} />
            <span className="text-[10px] font-black uppercase tracking-widest opacity-80">
              {destinationName}
            </span>
          </div>
          {tour.departurePoint && (
            <div className="flex items-center gap-1 text-slate-400">
              <span className="text-[9px] font-bold uppercase tracking-tight">
                {t("from")}: {tour.departurePoint}
              </span>
            </div>
          )}
        </div>

        <h3 className="text-xl sm:text-2xl font-black leading-tight text-slate-900 dark:text-white group-hover:text-primary transition-colors line-clamp-2">
          {name}
        </h3>

        <div className="flex items-center gap-4 text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase tracking-wider">
          <div className="flex items-center gap-1.5">
            <Clock size={12} />
            <span>{t("duration", { days: tour.durationDays })}</span>
          </div>
          <div className="flex items-center gap-1.5">
            {tour.transport?.toLowerCase().includes("bay") ? (
              <Plane size={12} />
            ) : (
              <Bus size={12} />
            )}
            <span>{formatTransport(tour.transport, t)}</span>
          </div>
        </div>
      </CardBody>

      <CardFooter className="px-6 sm:px-8 pb-8 pt-0 flex items-center justify-between">
        <div className="flex flex-col">
          {oldPrice && (
            <span className="text-[10px] font-bold text-slate-400 line-through opacity-70">
              {oldPrice}
            </span>
          )}
          <span className="text-xl sm:text-2xl font-black text-primary">
            {price}
          </span>
        </div>

        <Button
          as={Link}
          className="font-black bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl px-6 h-12 shadow-xl hover:bg-primary dark:hover:bg-primary hover:text-white dark:hover:text-white transition-all active:scale-95"
          href={`/tours/${tour.slug}`}
          size="md"
        >
          {t("view_detail")}
        </Button>
      </CardFooter>
    </Card>
  );
}
