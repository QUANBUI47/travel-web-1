"use client";

import { useState, useRef, useEffect } from "react";
import NextLink from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  Map,
  Compass,
  Sparkles,
  Zap,
  ArrowRight,
} from "lucide-react";
import clsx from "clsx";
import { useTranslations } from "next-intl";

import { AppImage } from "@/components/ui/app-image";
import { NavItem } from "@/config/site";
import { ROUTES } from "@/constants";

interface MegamenuProps {
  item: NavItem;
  isActive: boolean;
  isTransparent: boolean;
  label: string;
}

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&q=80&w=800";

export function Megamenu({
  item,
  isActive,
  isTransparent,
  label,
}: MegamenuProps) {
  const t = useTranslations("Navbar.megamenu");
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(true);
  };

  const handleLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 150);
  };

  const close = () => setIsOpen(false);

  const isDestinations = item.label === "destinations";

  const regionLinks =
    item.children?.filter((child) => child.href.includes("?region=")) ?? [];
  const destinationLinks = isDestinations
    ? (item.children?.filter(
        (child) =>
          child.href.startsWith(`${ROUTES.DESTINATIONS}/`) &&
          !child.href.includes("?"),
      ) ?? [])
    : [];

  const featuredChild = isDestinations
    ? (destinationLinks[0] ?? regionLinks[0])
    : item.children?.[0];

  const rawFeaturedUrl = (
    featuredChild as { imageUrl?: string } | undefined
  )?.imageUrl?.trim();
  const resolvedFeaturedSrc =
    rawFeaturedUrl && rawFeaturedUrl.length > 0
      ? rawFeaturedUrl
      : FALLBACK_IMAGE;

  const [featuredSrc, setFeaturedSrc] = useState(resolvedFeaturedSrc);

  useEffect(() => {
    setFeaturedSrc(resolvedFeaturedSrc);
  }, [resolvedFeaturedSrc]);

  const featuredTitle = isDestinations
    ? (featuredChild?.label ?? t("heritage_journey"))
    : (item.children?.[0]?.label ?? t("premium_experience"));

  const heroDesc = isDestinations ? t("destination_desc") : t("tour_desc");

  const col2Label = isDestinations ? t("region") : t("suggestion");
  const col3Label = isDestinations ? t("destination_col") : t("see_more");

  const col2Links = isDestinations
    ? regionLinks
    : (item.children?.slice(0, 5) ?? []);
  const col3Links = isDestinations
    ? destinationLinks
    : item.children && item.children.length > 5
      ? item.children.slice(5, 10)
      : [];

  return (
    <div
      className="relative"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      {/* Trigger Button */}
      <button
        aria-expanded={isOpen}
        aria-haspopup="true"
        className={clsx(
          "flex items-center gap-1.5 text-[11px] font-black uppercase transition-all duration-300 relative group py-6 cursor-pointer",
          isActive
            ? "text-primary"
            : isTransparent
              ? "text-white/80 hover:text-white"
              : "text-foreground/60 hover:text-primary",
        )}
        type="button"
      >
        {label}
        <ChevronDown
          className={clsx(
            "transition-transform duration-300",
            isOpen ? "rotate-180" : "rotate-0",
          )}
          size={12}
          strokeWidth={3}
        />
        {/* Animated Underline */}
        <span
          className={clsx(
            "absolute bottom-4 left-0 h-[3px] bg-primary rounded-full transition-all duration-300",
            isActive ? "w-full" : "w-0 group-hover:w-full",
          )}
        />
      </button>

      {/* Megamenu Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="fixed top-[64px] lg:top-[80px] left-0 z-[110] w-full max-h-[calc(100vh-100px)] overflow-y-auto overflow-x-hidden whitespace-normal border-b border-slate-200/50 bg-white shadow-[0_40px_80px_-20px_rgba(0,0,0,0.15)] backdrop-blur-3xl supports-[backdrop-filter]:bg-white/95 dark:border-white/10 dark:bg-slate-900 supports-[backdrop-filter]:dark:bg-slate-900/95 [&_a]:cursor-pointer [&_button]:cursor-pointer"
            exit={{ opacity: 0, y: -10 }}
            initial={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
          >
            {/* grid-cols with explicit minmax(0,1fr) so each column NEVER exceeds its track */}
            <div className="w-full max-w-[1440px] mx-auto px-8 py-10 grid gap-10 [grid-template-columns:repeat(4,minmax(0,1fr))]">
              {/* ── Column 1: Featured Hero ── */}
              <div className="flex flex-col gap-5 min-w-0">
                <div className="relative aspect-video w-full rounded-2xl overflow-hidden group/thumb shadow-xl border border-slate-100 dark:border-white/5">
                  <AppImage
                    fill
                    alt={featuredTitle}
                    className="object-cover transition-transform duration-1000 group-hover/thumb:scale-110"
                    sizes="(max-width: 1280px) 90vw, 25vw"
                    src={featuredSrc}
                    onError={() => setFeaturedSrc(FALLBACK_IMAGE)}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent z-10" />
                  <div className="absolute bottom-4 left-5 right-5 z-20">
                    <span className="bg-primary text-white text-[9px] font-black uppercase px-2 py-1 rounded-full mb-2 inline-block tracking-widest">
                      {isDestinations ? t("explore") : t("featured")}
                    </span>
                    <h4 className="text-base font-black text-white leading-tight line-clamp-2">
                      {featuredTitle}
                    </h4>
                  </div>
                </div>

                <div className="flex flex-col gap-2 px-1 min-w-0">
                  <p className="relative z-10 w-full break-words text-pretty text-[11px] font-medium leading-relaxed text-slate-500 dark:text-slate-400">
                    {heroDesc}
                  </p>
                  <NextLink
                    className="flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-widest group/all w-fit cursor-pointer"
                    href={item.href}
                    onClick={close}
                  >
                    {t("view_all")}
                    <ArrowRight
                      className="group-hover/all:translate-x-1 transition-transform"
                      size={12}
                      strokeWidth={3}
                    />
                  </NextLink>
                </div>
              </div>

              {/* ── Column 2: Primary Links ── */}
              <div className="flex flex-col gap-5 min-w-0">
                <h5 className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-white/30">
                  <Map className="text-primary" size={12} />
                  {col2Label}
                </h5>
                <ul className="flex flex-col gap-4">
                  {col2Links.map((child) => (
                    <li key={child.href}>
                      <NextLink
                        className="group/link flex flex-col cursor-pointer"
                        href={child.href}
                        onClick={close}
                      >
                        <span className="text-[14px] font-black text-slate-800 dark:text-slate-200 group-hover/link:text-primary transition-colors line-clamp-1">
                          {child.label}
                        </span>
                        <span className="text-[9px] text-slate-400 font-bold opacity-0 group-hover/link:opacity-100 transition-all -translate-x-1 group-hover/link:translate-x-0">
                          {t("explore_now")} →
                        </span>
                      </NextLink>
                    </li>
                  ))}
                </ul>
              </div>

              {/* ── Column 3: Secondary Links ── */}
              <div className="flex flex-col gap-5 min-w-0">
                <h5 className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-white/30">
                  <Compass className="text-primary" size={12} />
                  {col3Label}
                </h5>
                <ul className="flex flex-col gap-4">
                  {col3Links.length > 0 ? (
                    col3Links.map((child) => (
                      <li key={child.href}>
                        <NextLink
                          className="text-[14px] font-bold text-slate-600 dark:text-slate-400 hover:text-primary transition-colors line-clamp-1 block cursor-pointer"
                          href={child.href}
                          onClick={close}
                        >
                          {child.label}
                        </NextLink>
                      </li>
                    ))
                  ) : (
                    <li className="text-[12px] font-medium text-slate-400">
                      {t("no_destinations")}
                    </li>
                  )}
                </ul>
              </div>

              {/* ── Column 4: Login CTA ── */}
              <div className="flex flex-col gap-5 min-w-0">
                <h5 className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-white/30">
                  <Sparkles className="text-primary" size={12} />
                  {t("for_you")}
                </h5>

                <div className="relative bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-3xl p-6 transition-all duration-300 hover:border-primary/50 hover:shadow-xl group/cta">
                  {/* Accent bar */}
                  <div className="absolute left-0 top-6 bottom-6 w-1 bg-primary rounded-r-full" />

                  {/* Icon + text row — both constrained to column width */}
                  <div className="flex items-start gap-3 mb-6">
                    <div className="shrink-0 w-10 h-10 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                      <Zap fill="currentColor" size={20} />
                    </div>
                    {/* min-w-0 prevents flex child from escaping parent bounds */}
                    <div className="min-w-0 flex flex-col gap-1">
                      <p className="text-[14px] font-black text-slate-800 dark:text-white tracking-tight">
                        {t("premium_title")}
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 font-bold leading-relaxed whitespace-normal break-words">
                        {t("premium_desc")}
                      </p>
                    </div>
                  </div>

                  <button
                    className="w-full py-3.5 bg-slate-900 dark:bg-primary text-white rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg cursor-pointer"
                    type="button"
                  >
                    {t("start_now")} →
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
