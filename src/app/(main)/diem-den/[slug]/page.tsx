import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import { Camera, ChevronRight, MapPin, Route } from "lucide-react";
import { Button } from "@heroui/button";

import { AppImage } from "@/components/ui/app-image";
import { DestinationJsonLd } from "@/components/destinations/destination-json-ld";
import { DestinationGallery } from "@/components/destinations/destination-gallery";
import { DestinationDetailSidebar } from "@/components/destinations/destination-detail-sidebar";
import { TourCard } from "@/components/tours/tour-card";
import { DestinationService } from "@/services/destination.service";
import { TourService } from "@/services/tour.service";
import { getDestinationHeroTagline } from "@/lib/destination/excerpt";
import { getDBLocalizedValue } from "@/lib/utils/i18n";
import { serialize } from "@/lib/utils";
import { plainTextFromHtml, sanitizeTourHtml } from "@/lib/sanitize-html";
import {
  getDestinationCoverImage,
  getDestinationGallery,
} from "@/lib/destination/cover-image";
import { ROUTES, destinationDetailPath } from "@/constants";

interface Props {
  params: Promise<{ slug: string }>;
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://vivuvietnam.vn";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const locale = await getLocale();
  const destination = await DestinationService.getBySlug(slug);

  if (!destination) return { title: "Not Found" };

  const name = getDBLocalizedValue(destination, "name", locale);
  const description = destination.description
    ? plainTextFromHtml(String(destination.description), 200)
    : undefined;
  const canonical = `${siteUrl}${destinationDetailPath(destination.slug)}`;
  const ogImage = getDestinationCoverImage(destination);

  return {
    title: `${name} | Vivu Travel`,
    description,
    alternates: { canonical },
    openGraph: {
      title: `${name} | Vivu Travel`,
      description,
      url: canonical,
      type: "article",
      images: [{ url: ogImage, alt: name }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${name} | Vivu Travel`,
      description,
      images: [ogImage],
    },
  };
}

export default async function DestinationDetailPage({ params }: Props) {
  const { slug } = await params;
  const locale = await getLocale();
  const t = await getTranslations("DestinationDetail");

  const raw = await DestinationService.getBySlug(slug);

  if (!raw) notFound();

  const destination = serialize(raw);
  const tours = serialize(
    await TourService.searchListings({ destination: slug }),
  );
  const name = getDBLocalizedValue(destination, "name", locale);
  const regionName = destination.region
    ? getDBLocalizedValue(destination.region, "name", locale)
    : "";
  const coverImage = getDestinationCoverImage(destination);
  const extraGallery = getDestinationGallery(destination).filter(
    (url) => url !== coverImage,
  );
  const galleryImages =
    extraGallery.length > 0 ? extraGallery : getDestinationGallery(destination);
  const photoCount =
    extraGallery.length > 0
      ? extraGallery.length + 1
      : getDestinationGallery(destination).length || 1;
  const heroTagline = getDestinationHeroTagline(destination.description);
  const canonical = `${siteUrl}${destinationDetailPath(destination.slug)}`;
  const plainDescription = destination.description
    ? plainTextFromHtml(String(destination.description), 300)
    : undefined;

  const sidebarLabels = {
    region: t("region_label"),
    viewTours: t("view_tours"),
    statTours: t("stat_tours"),
    statPhotos: t("stat_photos"),
    mapTitle: t("map_title"),
    openMaps: t("open_maps"),
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <DestinationJsonLd
        description={plainDescription}
        image={coverImage}
        name={name}
        regionName={regionName}
        url={canonical}
      />

      {/* Hero */}
      <section className="relative h-[68vh] min-h-[420px] max-h-[780px] w-full overflow-hidden">
        <AppImage
          fill
          priority
          alt={name}
          className="object-cover"
          sizes="100vw"
          src={coverImage}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-slate-950/10" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,transparent_0%,rgba(2,6,23,0.35)_100%)]" />

        <div className="absolute inset-0 flex flex-col justify-between p-6 md:p-10 lg:p-14">
          <nav
            aria-label="Breadcrumb"
            className="flex flex-wrap items-center gap-2 rounded-full bg-black/25 px-4 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-white/70 backdrop-blur-md w-fit"
          >
            <Link
              className="cursor-pointer transition-colors hover:text-white"
              href={ROUTES.HOME}
            >
              {t("breadcrumb_home")}
            </Link>
            <ChevronRight size={12} />
            <Link
              className="cursor-pointer transition-colors hover:text-white"
              href={ROUTES.DESTINATIONS}
            >
              {t("breadcrumb_destinations")}
            </Link>
            {regionName && destination.region?.slug && (
              <>
                <ChevronRight size={12} />
                <Link
                  className="cursor-pointer transition-colors hover:text-white"
                  href={`${ROUTES.DESTINATIONS}?region=${destination.region.slug}`}
                >
                  {regionName}
                </Link>
              </>
            )}
            <ChevronRight size={12} />
            <span className="text-white">{name}</span>
          </nav>

          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl space-y-4">
              {regionName && (
                <span className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-white shadow-lg shadow-primary/30">
                  <MapPin size={12} />
                  {regionName}
                </span>
              )}

              <h1 className="font-heading text-4xl font-black leading-[1.02] tracking-tighter text-white md:text-6xl lg:text-7xl">
                {name}
              </h1>

              {heroTagline && (
                <p className="max-w-2xl text-base font-medium leading-relaxed text-white/80 md:text-lg border-l-2 border-primary/80 pl-4">
                  {heroTagline}
                </p>
              )}
            </div>

            <div className="flex flex-wrap gap-3 lg:justify-end">
              <div className="flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-3 backdrop-blur-md ring-1 ring-white/20">
                <Route className="text-primary shrink-0" size={18} />
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-wider text-white/50">
                    {t("stat_tours")}
                  </p>
                  <p className="text-lg font-black text-white">
                    {tours.length}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-3 backdrop-blur-md ring-1 ring-white/20">
                <Camera className="text-primary shrink-0" size={18} />
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-wider text-white/50">
                    {t("stat_photos")}
                  </p>
                  <p className="text-lg font-black text-white">{photoCount}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery — chồng lên hero */}
      {galleryImages.length > 0 && (
        <div className="relative z-10 mx-auto -mt-16 max-w-7xl px-4 pb-4 lg:-mt-24 lg:px-10">
          <div className="rounded-[2rem] bg-white p-4 shadow-2xl shadow-slate-900/10 ring-1 ring-slate-200/80 dark:bg-slate-900 dark:ring-slate-800 md:p-6">
            <DestinationGallery
              destinationName={name}
              images={galleryImages}
              title={t("gallery_title")}
              viewPhotoLabel={t("view_photo")}
            />
          </div>
        </div>
      )}

      {/* Story + sidebar */}
      <section
        className={`mx-auto max-w-7xl px-4 lg:px-10 ${galleryImages.length > 0 ? "py-14 lg:py-20" : "py-14 lg:py-20 -mt-8"}`}
      >
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-14">
          <div className="space-y-10 lg:col-span-8">
            <article className="relative overflow-hidden rounded-[2rem] bg-slate-50/80 p-8 ring-1 ring-slate-100 dark:bg-slate-900/50 dark:ring-slate-800 md:p-10 lg:p-12">
              <div className="absolute top-0 left-0 h-full w-1 bg-gradient-to-b from-primary via-sky-400 to-transparent" />
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">
                {t("story_title", { name })}
              </p>
              {destination.description ? (
                <div
                  dangerouslySetInnerHTML={{
                    __html: sanitizeTourHtml(String(destination.description)),
                  }}
                  className="prose prose-lg mt-8 max-w-none font-medium text-slate-600 prose-headings:font-heading prose-headings:font-bold prose-headings:tracking-tight prose-a:text-primary dark:prose-invert dark:text-slate-300"
                />
              ) : (
                <p className="mt-8 font-medium text-slate-500">
                  {t("no_description")}
                </p>
              )}
            </article>
          </div>

          <div className="lg:col-span-4">
            <DestinationDetailSidebar
              destinationName={name}
              destinationSlug={destination.slug}
              labels={sidebarLabels}
              lat={destination.latitude}
              lng={destination.longitude}
              photoCount={photoCount}
              regionName={regionName}
              tourCount={tours.length}
            />
          </div>
        </div>
      </section>

      {/* Tours */}
      <section className="relative overflow-hidden border-t border-slate-200/80 bg-slate-950 py-20 dark:border-slate-800">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(0,104,195,0.15),transparent_55%)]" />
        <div className="relative mx-auto max-w-7xl px-4 lg:px-10">
          <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.35em] text-primary">
                {t("tours_badge")}
              </span>
              <h2 className="mt-3 font-heading text-3xl font-black tracking-tight text-white md:text-5xl">
                {t("tours_title", { name })}
              </h2>
            </div>
            <Button
              as={Link}
              className="cursor-pointer border-white/30 font-black text-xs uppercase tracking-widest text-white"
              href={`${ROUTES.TOURS}?destination=${destination.slug}`}
              radius="full"
              variant="bordered"
            >
              {t("tours_view_all")}
            </Button>
          </div>

          {tours.length === 0 ? (
            <p className="font-medium text-slate-400">{t("tours_empty")}</p>
          ) : (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {tours.map((tour) => (
                <TourCard key={tour.id} locale={locale} tour={tour} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
