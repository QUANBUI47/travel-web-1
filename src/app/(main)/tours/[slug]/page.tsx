import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import {
  MapPin,
  Clock,
  Calendar,
  Users,
  ShieldCheck,
  Info,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { Tabs, Tab } from "@heroui/tabs";
import { Card, CardBody } from "@heroui/card";

import { AppImage } from "@/components/ui/app-image";
import { TourService } from "@/services/tour.service";
import { getDBLocalizedValue } from "@/lib/utils/i18n";
import { IMAGES } from "@/constants";
import { serialize } from "@/lib/utils";
import { BookingWidget } from "@/components/tours/booking-widget";
import { plainTextFromHtml, sanitizeTourHtml } from "@/lib/sanitize-html";
import { isUuid } from "@/lib/utils/uuid";
import { TourJsonLd } from "@/components/tours/tour-json-ld";
import { ROUTES } from "@/constants";
import { formatTourType, formatTransport } from "@/lib/tour/display-labels";

interface Props {
  params: Promise<{ slug: string }>;
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://vivuvietnam.vn";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const locale = await getLocale();
  const tour = await TourService.getBySlug(slug);

  if (!tour) return { title: "Not Found" };

  const name = getDBLocalizedValue(tour, "name", locale);
  const description = tour.description
    ? plainTextFromHtml(String(tour.description), 200)
    : undefined;
  const canonical = `${siteUrl}${ROUTES.TOURS}/${tour.slug}`;
  const ogImage = tour.imageUrls?.[0];

  return {
    title: `${name} | Vivu Travel`,
    description,
    alternates: { canonical },
    openGraph: {
      title: `${name} | Vivu Travel`,
      description,
      url: canonical,
      type: "website",
      images: ogImage ? [{ url: ogImage, alt: name }] : undefined,
    },
    twitter: {
      card: ogImage ? "summary_large_image" : "summary",
      title: `${name} | Vivu Travel`,
      description,
      images: ogImage ? [ogImage] : undefined,
    },
  };
}

export default async function TourDetailPage({ params }: Props) {
  const { slug } = await params;
  const locale = await getLocale();
  const t = await getTranslations("Tours");

  const tourBySlug = await TourService.getBySlug(slug);
  const tourById =
    !tourBySlug && isUuid(slug) ? await TourService.getById(slug) : null;
  const tourId = tourBySlug?.id ?? tourById?.id;

  if (!tourId) notFound();

  // Fetch full details with itineraries
  const fullTour = serialize(await TourService.getByIdWithItineraries(tourId));

  if (!fullTour) notFound();

  const name = getDBLocalizedValue(fullTour, "name", locale);
  const destinationName = fullTour.destination
    ? getDBLocalizedValue(fullTour.destination, "name", locale)
    : "";

  const canonical = `${siteUrl}${ROUTES.TOURS}/${fullTour.slug}`;
  const plainDescription = fullTour.description
    ? plainTextFromHtml(String(fullTour.description), 300)
    : undefined;

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <TourJsonLd
        description={plainDescription}
        locale={locale}
        name={name}
        tour={fullTour}
        url={canonical}
      />
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[400px] w-full overflow-hidden">
        <AppImage
          fill
          priority
          alt={name}
          className="object-cover"
          src={fullTour.imageUrls?.[0] || IMAGES.PLACEHOLDERS.TOUR}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

        <div className="absolute bottom-0 left-0 w-full p-8 lg:p-20">
          <div className="max-w-7xl mx-auto flex flex-col gap-6">
            <div className="flex flex-wrap gap-3">
              <span className="px-4 py-1.5 bg-primary text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full shadow-lg">
                {formatTourType(fullTour.tourType, t)}
              </span>
              <span className="px-4 py-1.5 bg-white/20 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full border border-white/20">
                {formatTransport(fullTour.transport, t)}
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white tracking-tighter leading-none max-w-4xl">
              {name}
            </h1>

            <div className="flex flex-wrap items-center gap-8 text-white/80 text-sm font-bold uppercase tracking-widest">
              <div className="flex items-center gap-2">
                <MapPin className="text-primary" size={18} />
                {destinationName}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="text-primary" size={18} />
                {fullTour.durationText ||
                  t("days", { count: fullTour.durationDays })}
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="text-primary" size={18} />
                {t("from")}: {fullTour.departurePoint}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 lg:px-10 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          {/* Left Column: Details */}
          <div className="lg:col-span-2 space-y-12">
            <Tabs
              classNames={{
                tabList:
                  "gap-8 border-b border-slate-100 dark:border-slate-800 p-0",
                cursor: "w-full bg-primary h-1",
                tab: "max-w-fit px-0 h-12",
                tabContent:
                  "group-data-[selected=true]:text-primary font-black uppercase tracking-widest text-xs",
              }}
              variant="underlined"
            >
              <Tab key="overview" title={t("tab_overview")}>
                <div className="py-8 space-y-8">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: sanitizeTourHtml(fullTour.description || ""),
                    }}
                    className="prose prose-lg dark:prose-invert max-w-none text-slate-600 dark:text-slate-400"
                  />

                  {/* Highlights Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8">
                    <Card className="bg-slate-50/50 dark:bg-slate-900/50 border-none shadow-none rounded-3xl">
                      <CardBody className="p-8 flex gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                          <ShieldCheck size={24} />
                        </div>
                        <div>
                          <h4 className="font-black text-sm uppercase tracking-tight mb-1">
                            {t("insurance_title")}
                          </h4>
                          <p className="text-xs text-slate-500">
                            {t("insurance_desc")}
                          </p>
                        </div>
                      </CardBody>
                    </Card>
                    <Card className="bg-slate-50/50 dark:bg-slate-900/50 border-none shadow-none rounded-3xl">
                      <CardBody className="p-8 flex gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                          <Users size={24} />
                        </div>
                        <div>
                          <h4 className="font-black text-sm uppercase tracking-tight mb-1">
                            {t("guide_title")}
                          </h4>
                          <p className="text-xs text-slate-500">
                            {t("guide_desc")}
                          </p>
                        </div>
                      </CardBody>
                    </Card>
                  </div>
                </div>
              </Tab>

              <Tab key="itinerary" title={t("tab_itinerary")}>
                <div className="py-8 space-y-12">
                  {fullTour.itineraries && fullTour.itineraries.length > 0 ? (
                    fullTour.itineraries.map(
                      (
                        day: {
                          id: string;
                          title: string;
                          description?: string | null;
                        },
                        index: number,
                      ) => (
                        <div key={day.id} className="relative pl-12 group">
                          {/* Timeline line */}
                          <div className="absolute left-4 top-2 bottom-0 w-0.5 bg-slate-100 dark:bg-slate-800 group-last:bg-transparent" />
                          {/* Timeline dot */}
                          <div className="absolute left-0 top-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-black text-xs shadow-lg shadow-primary/30 z-10">
                            {index + 1}
                          </div>

                          <div className="space-y-4">
                            <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                              {day.title}
                            </h3>
                            <div
                              dangerouslySetInnerHTML={{
                                __html: sanitizeTourHtml(day.description || ""),
                              }}
                              className="prose prose-sm dark:prose-invert max-w-none text-slate-600 dark:text-slate-400"
                            />
                          </div>
                        </div>
                      ),
                    )
                  ) : (
                    <div className="text-center py-20 text-slate-400">
                      <Info className="mx-auto mb-4" size={48} />
                      <p className="font-bold uppercase tracking-widest text-xs">
                        {t("itinerary_empty")}
                      </p>
                    </div>
                  )}
                </div>
              </Tab>

              <Tab key="policy" title={t("tab_policy")}>
                <div className="py-8 grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 text-emerald-500">
                      <CheckCircle2 size={24} />
                      <h3 className="font-black uppercase tracking-widest text-sm">
                        {t("includes")}
                      </h3>
                    </div>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: sanitizeTourHtml(fullTour.inclusions || ""),
                      }}
                      className="prose prose-sm dark:prose-invert max-w-none text-slate-600 dark:text-slate-400 marker:text-emerald-500"
                    />
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-center gap-3 text-red-500">
                      <XCircle size={24} />
                      <h3 className="font-black uppercase tracking-widest text-sm">
                        {t("excludes")}
                      </h3>
                    </div>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: sanitizeTourHtml(fullTour.exclusions || ""),
                      }}
                      className="prose prose-sm dark:prose-invert max-w-none text-slate-600 dark:text-slate-400 marker:text-red-500"
                    />
                  </div>

                  <div className="md:col-span-2 pt-8 border-t border-slate-50 dark:border-slate-900 space-y-6">
                    <div className="flex items-center gap-3 text-primary">
                      <Info size={24} />
                      <h3 className="font-black uppercase tracking-widest text-sm">
                        {t("terms_conditions")}
                      </h3>
                    </div>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: sanitizeTourHtml(fullTour.policy || ""),
                      }}
                      className="prose prose-sm dark:prose-invert max-w-none text-slate-600 dark:text-slate-400"
                    />
                  </div>
                </div>
              </Tab>
            </Tabs>
          </div>

          {/* Right Column: Booking Widget */}
          <div className="relative">
            <BookingWidget locale={locale} tour={fullTour} />
          </div>
        </div>
      </section>
    </div>
  );
}
