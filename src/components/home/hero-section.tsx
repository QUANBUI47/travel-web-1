"use client";

import type { HeroSectionProps } from "@/components/home/section-props";

import React from "react";
import { ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";

import { AppImage } from "@/components/ui/app-image";
import { IMAGES } from "@/constants";
import { getLocalizedValue } from "@/lib/utils/i18n";
import { cn } from "@/lib/utils";
import { HeroSearchWidget } from "@/components/home/hero-search-widget";

export function HeroSection({
  content,
  locale,
  layoutVariant = "fullscreen",
  destinations = [],
}: HeroSectionProps) {
  const t = useTranslations("HomePage.Hero");
  const [currentIdx, setCurrentIdx] = React.useState(0);
  const isVideo = content?.type === "video";
  const pool = React.useMemo(() => {
    return content?.heroImages?.length
      ? content.heroImages
      : [IMAGES.PLACEHOLDERS.HERO];
  }, [content?.heroImages]);

  // Slideshow effect
  React.useEffect(() => {
    if (pool.length <= 1 || isVideo) return;
    const interval = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % pool.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [pool.length, isVideo]);

  const currentHero = pool[currentIdx] || pool[0];

  const searchWidget = (
    <HeroSearchWidget
      content={content}
      destinations={destinations}
      locale={locale}
    />
  );

  // ── LAYOUT: SPLIT ──────────────────────────────────────────────────────────
  if (layoutVariant === "split") {
    return (
      <div
        className="w-full min-h-screen flex flex-col md:flex-row animate-fade-in bg-white dark:bg-slate-900"
        id="home"
      >
        {/* Left: Content */}
        <div className="flex-1 flex flex-col justify-center px-8 md:px-16 lg:px-20 py-20 order-2 md:order-1 bg-white dark:bg-slate-900">
          <div className="max-w-xl">
            <span className="bg-primary/10 text-primary px-5 py-2 rounded-full text-xs font-black uppercase mb-8 inline-block w-fit">
              {t("badge")}
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-[1.1] text-slate-900 dark:text-white tracking-tight mb-6">
              {getLocalizedValue(content?.heroTitle, locale) ||
                t("title_fallback")}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-lg font-medium mb-12 leading-relaxed">
              {getLocalizedValue(content?.heroDescription, locale) ||
                t("description_fallback")}
            </p>

            <div className="w-full transform-none lg:scale-90 lg:-ml-[5%]">
              {searchWidget}
            </div>
          </div>
        </div>
        {/* Right: Image */}
        <div className="relative flex-1 min-h-[50vh] md:min-h-0 order-1 md:order-2">
          <AppImage
            key={currentHero}
            fill
            priority
            alt="Hero"
            className="object-cover transition-opacity duration-1000 animate-in fade-in"
            src={currentHero}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white/20 dark:from-slate-900/20 to-transparent" />
        </div>
      </div>
    );
  }

  // ── LAYOUT: CINEMATIC ──────────────────────────────────────────────────────
  if (layoutVariant === "cinematic") {
    return (
      <div
        className="w-full relative h-screen overflow-hidden animate-fade-in"
        id="home"
      >
        {/* Background */}
        <div className="absolute inset-0 bg-slate-900">
          {isVideo && content.videoUrl ? (
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover opacity-70"
              poster={content.posterUrl}
            >
              <source src={content.videoUrl} type="video/mp4" />
            </video>
          ) : (
            <AppImage
              key={currentHero}
              fill
              priority
              alt="Hero"
              className="object-cover brightness-[0.6] saturate-110 transition-opacity duration-1000 animate-in fade-in"
              src={currentHero}
            />
          )}
        </div>
        {/* Cinematic Content Area */}
        <div className="absolute inset-0 z-20 flex flex-col justify-end p-8 md:p-16 lg:p-20 bg-gradient-to-t from-black/90 via-black/20 to-transparent">
          <div className="max-w-7xl w-full mx-auto space-y-10">
            <div className="space-y-6">
              <span className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-5 py-2 rounded-full text-xs font-black uppercase inline-block">
                {t("badge")}
              </span>
              <h1 className="text-6xl md:text-8xl lg:text-9xl font-black leading-[0.9] text-white tracking-tighter max-w-5xl">
                {getLocalizedValue(content?.heroTitle, locale) ||
                  t("title_fallback")}
              </h1>
              <p className="text-white/70 text-lg md:text-xl font-medium max-w-2xl leading-relaxed">
                {getLocalizedValue(content?.heroDescription, locale)}
              </p>
            </div>
            {searchWidget}
          </div>
        </div>
      </div>
    );
  }

  // ── LAYOUT: FULLSCREEN (mặc định) ───────────────────
  return (
    <div className="w-full" id="home">
      <header className="relative w-full h-screen flex items-center justify-center overflow-hidden animate-fade-in">
        <div className="absolute inset-0 z-0 bg-slate-900">
          {isVideo ? (
            content.videoUrl && (
              <video
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover opacity-60"
                poster={content.posterUrl}
              >
                <source src={content.videoUrl} type="video/mp4" />
              </video>
            )
          ) : (
            <AppImage
              key={currentHero}
              fill
              priority
              alt="Hero"
              className="object-cover transition-opacity duration-1000 animate-in fade-in"
              src={currentHero}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/30 via-transparent to-slate-900/90 z-10" />
        </div>

        <div className="relative z-20 w-full max-w-6xl px-4 md:px-8 flex flex-col items-center text-center">
          <span className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-6 py-2.5 rounded-full text-xs font-black uppercase mb-10 inline-block shadow-lg">
            {t("badge")}
          </span>
          <h1 className="text-5xl md:text-7xl lg:text-[6rem] font-black leading-[1.05] text-white tracking-tight mb-6 drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)] text-balance max-w-5xl">
            {getLocalizedValue(content?.heroTitle, locale) ||
              t("title_fallback")}
          </h1>
          <p className="text-white/80 text-lg md:text-xl font-medium max-w-2xl mb-12 drop-shadow-lg leading-relaxed">
            {getLocalizedValue(content?.heroDescription, locale) ||
              t("description_fallback")}
          </p>

          {searchWidget}
        </div>

        {/* Slide Pagination (Dots) */}
        {pool.length > 1 && content?.showPagination !== false && (
          <div className="absolute right-8 md:right-12 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-4 animate-in fade-in slide-in-from-right-4 duration-1000 delay-500">
            {pool.map((_, idx: number) => (
              <button
                key={idx}
                className={cn(
                  "group relative w-1.5 transition-all duration-500 rounded-full",
                  currentIdx === idx
                    ? "h-12 bg-primary shadow-[0_0_20px_rgba(var(--primary-rgb),0.5)]"
                    : "h-1.5 bg-white/30 hover:bg-white/60",
                )}
                onClick={() => setCurrentIdx(idx)}
              >
                <span
                  className={cn(
                    "absolute right-full mr-4 text-[10px] font-black uppercase tracking-widest text-white transition-all duration-300 whitespace-nowrap opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0",
                    currentIdx === idx ? "opacity-100 translate-x-0" : "",
                  )}
                >
                  0{idx + 1}
                </span>
              </button>
            ))}
          </div>
        )}

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 animate-bounce opacity-70">
          <ChevronDown className="text-white" size={32} strokeWidth={2.5} />
        </div>
      </header>
    </div>
  );
}
