"use client";

import type { HeroContent } from "@/types/builder";
import type { Destination } from "@/types";

import React from "react";
import { Search, MapPin, Calendar, ChevronDown, X } from "lucide-react";
import { Button } from "@heroui/button";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import { HeroSearchDropdown } from "@/components/home/hero-search-dropdown";
import { buildTourSearchUrl } from "@/lib/tour/search-params";
import { getDBLocalizedValue, getLocalizedValue } from "@/lib/utils/i18n";
import { cn } from "@/lib/utils";

type HeroSearchWidgetProps = {
  destinations: Destination[];
  locale: string;
  content?: Pick<
    HeroContent,
    | "searchLocationLabel"
    | "searchLocationPlaceholder"
    | "searchDateLabel"
    | "searchDatePlaceholder"
    | "searchSuggestions"
  >;
};

type ActivePanel = "destination" | "date" | null;

function resolveSuggestionSlug(
  suggestion: { vi: string; en?: string },
  destinations: Destination[],
): string | undefined {
  const match = destinations.find(
    (d) =>
      d.nameVi === suggestion.vi ||
      (suggestion.en && d.nameEn === suggestion.en),
  );

  return match?.slug;
}

function formatDateLabel(from: string, to: string, locale: string): string {
  const fmt = (iso: string) => {
    const [y, m, d] = iso.split("-").map(Number);

    return new Date(y, m - 1, d).toLocaleDateString(
      locale === "vi" ? "vi-VN" : "en-US",
      { day: "2-digit", month: "2-digit", year: "numeric" },
    );
  };

  if (from && to) return `${fmt(from)} – ${fmt(to)}`;
  if (from) return fmt(from);

  return "";
}

const todayIso = () => {
  const d = new Date();

  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

export function HeroSearchWidget({
  destinations,
  locale,
  content,
}: HeroSearchWidgetProps) {
  const t = useTranslations("HomePage.Hero");
  const router = useRouter();

  const searchBarRef = React.useRef<HTMLDivElement>(null);
  const destAnchorRef = React.useRef<HTMLDivElement>(null);
  const dateAnchorRef = React.useRef<HTMLDivElement>(null);
  const destSearchRef = React.useRef<HTMLInputElement>(null);
  const destListRef = React.useRef<HTMLUListElement>(null);

  const [destinationSlug, setDestinationSlug] = React.useState<string | null>(
    null,
  );
  const [fromDate, setFromDate] = React.useState("");
  const [toDate, setToDate] = React.useState("");
  const [activePanel, setActivePanel] = React.useState<ActivePanel>(null);
  const [destQuery, setDestQuery] = React.useState("");
  const [highlightIndex, setHighlightIndex] = React.useState(0);

  const destinationItems = React.useMemo(
    () =>
      destinations.map((d) => ({
        slug: d.slug,
        label: getDBLocalizedValue(d, "name", locale),
        region: d.region
          ? getDBLocalizedValue(d.region, "name", locale)
          : undefined,
      })),
    [destinations, locale],
  );

  const filteredDestinations = React.useMemo(() => {
    const q = destQuery.trim().toLowerCase();

    if (!q) return destinationItems;

    return destinationItems.filter(
      (d) =>
        d.label.toLowerCase().includes(q) ||
        d.region?.toLowerCase().includes(q),
    );
  }, [destinationItems, destQuery]);

  const selectedDestination = destinationItems.find(
    (d) => d.slug === destinationSlug,
  );

  const locationDisplay = selectedDestination?.label;
  const dateDisplay = formatDateLabel(fromDate, toDate, locale);
  const hasLocation = Boolean(selectedDestination);
  const hasDates = Boolean(fromDate || toDate);
  const minDate = todayIso();

  const closePanels = () => setActivePanel(null);

  const openDestination = () => {
    setActivePanel("destination");
    setHighlightIndex(0);
    requestAnimationFrame(() => destSearchRef.current?.focus());
  };

  const openDate = () => {
    setActivePanel("date");
  };

  const selectDestination = (slug: string, label: string) => {
    setDestinationSlug(slug);
    setDestQuery(label);
    closePanels();
    openDate();
  };

  const navigate = React.useCallback(
    (slug: string | null, from: string, to: string) => {
      const params: Parameters<typeof buildTourSearchUrl>[0] = {};

      if (slug) params.destination = slug;
      if (from) params.from = from;
      if (to) params.to = to;

      router.push(buildTourSearchUrl(params));
    },
    [router],
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    closePanels();
    navigate(destinationSlug, fromDate, toDate);
  };

  const clearAll = () => {
    setDestinationSlug(null);
    setDestQuery("");
    setFromDate("");
    setToDate("");
    closePanels();
  };

  React.useEffect(() => {
    setHighlightIndex(0);
  }, [destQuery, activePanel]);

  React.useEffect(() => {
    if (fromDate && toDate && toDate < fromDate) {
      setToDate(fromDate);
    }
  }, [fromDate, toDate]);

  const handleDestKeyDown = (e: React.KeyboardEvent) => {
    if (!filteredDestinations.length) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightIndex((i) => (i + 1) % filteredDestinations.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightIndex(
        (i) =>
          (i - 1 + filteredDestinations.length) % filteredDestinations.length,
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      const item = filteredDestinations[highlightIndex];

      if (item) selectDestination(item.slug, item.label);
    }
  };

  const suggestionTags = React.useMemo(() => {
    const fromCms = (content?.searchSuggestions || [])
      .map((s) => {
        const slug = resolveSuggestionSlug(s, destinations);
        const label = getLocalizedValue(s, locale);

        return slug ? { slug, label } : null;
      })
      .filter((x): x is { slug: string; label: string } => Boolean(x));

    if (fromCms.length > 0) return fromCms;

    return destinations.slice(0, 5).map((d) => ({
      slug: d.slug,
      label: getDBLocalizedValue(d, "name", locale),
    }));
  }, [content?.searchSuggestions, destinations, locale]);

  const fieldClass =
    "w-full lg:flex-1 flex items-center gap-3 px-4 sm:px-5 py-2.5 lg:py-3 text-left rounded-2xl lg:rounded-none transition-colors cursor-pointer select-none";

  const iconClass =
    "flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white";

  const labelClass =
    "text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-0.5";

  const valueClass = (active: boolean) =>
    cn(
      "text-sm lg:text-[15px] font-bold leading-snug truncate",
      active
        ? "text-slate-900 dark:text-white"
        : "text-slate-500 dark:text-slate-400",
    );

  return (
    <form
      className="relative z-30 w-full flex flex-col items-center animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-300"
      onSubmit={handleSubmit}
    >
      <div
        ref={searchBarRef}
        className="relative z-30 w-full max-w-4xl bg-white/95 dark:bg-slate-900/90 backdrop-blur-xl p-1.5 sm:p-2 rounded-[1.75rem] lg:rounded-full shadow-[0_24px_50px_-16px_rgba(0,0,0,0.4)] flex flex-col lg:flex-row lg:items-center border border-white/90 dark:border-white/10 mx-auto gap-1 lg:gap-0"
      >
        <div ref={destAnchorRef} className="relative flex-1 min-w-0">
          <button
            aria-expanded={activePanel === "destination"}
            aria-haspopup="listbox"
            className={cn(
              fieldClass,
              "group lg:rounded-l-full lg:pr-3",
              "border-b lg:border-b-0 lg:border-r border-slate-200/60 dark:border-white/10",
              "hover:bg-slate-50 dark:hover:bg-white/5",
              activePanel === "destination" && "bg-slate-50 dark:bg-white/5",
            )}
            type="button"
            onClick={() => {
              if (activePanel === "destination") closePanels();
              else openDestination();
            }}
          >
            <div className={iconClass}>
              <MapPin size={18} strokeWidth={2.5} />
            </div>
            <div className="flex-1 min-w-0 text-left">
              <p className={labelClass}>
                {getLocalizedValue(content?.searchLocationLabel, locale) ||
                  t("search.location_label")}
              </p>
              <p
                className={cn(
                  valueClass(hasLocation),
                  "flex items-center gap-1",
                )}
              >
                <span className="truncate">
                  {locationDisplay ||
                    getLocalizedValue(
                      content?.searchLocationPlaceholder,
                      locale,
                    ) ||
                    t("search.location_help")}
                </span>
                <ChevronDown
                  className={cn(
                    "shrink-0 opacity-40 transition-transform duration-200",
                    activePanel === "destination" && "rotate-180",
                  )}
                  size={14}
                />
              </p>
            </div>
            {hasLocation && (
              <span
                className="shrink-0 p-1 rounded-full cursor-pointer hover:bg-slate-200/80 dark:hover:bg-white/10 text-slate-400 transition-colors"
                role="button"
                tabIndex={0}
                onClick={(e) => {
                  e.stopPropagation();
                  setDestinationSlug(null);
                  setDestQuery("");
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    e.stopPropagation();
                    setDestinationSlug(null);
                    setDestQuery("");
                  }
                }}
              >
                <X size={14} />
              </span>
            )}
          </button>

          <HeroSearchDropdown
            align="anchor"
            anchorRef={destAnchorRef}
            minWidth={280}
            open={activePanel === "destination"}
            onClose={closePanels}
          >
            <div className="p-2 border-b border-slate-100 dark:border-slate-800 shrink-0">
              <input
                ref={destSearchRef}
                className="w-full px-3 py-2 text-sm rounded-lg bg-slate-50 dark:bg-slate-800 border-none outline-none focus:ring-2 focus:ring-primary/25 cursor-text"
                placeholder={t("search.location_placeholder")}
                type="search"
                value={destQuery}
                onChange={(e) => setDestQuery(e.target.value)}
                onKeyDown={handleDestKeyDown}
              />
            </div>
            <ul
              ref={destListRef}
              className="overflow-y-auto custom-scrollbar p-1 min-h-0 flex-1"
              role="listbox"
            >
              {filteredDestinations.length === 0 ? (
                <li className="px-3 py-4 text-sm text-slate-400 text-center">
                  {locale === "vi" ? "Không có kết quả" : "No results"}
                </li>
              ) : (
                filteredDestinations.map((item, index) => (
                  <li key={item.slug}>
                    <button
                      aria-selected={
                        destinationSlug === item.slug ||
                        index === highlightIndex
                      }
                      className={cn(
                        "w-full text-left px-3 py-2 rounded-lg text-sm font-semibold transition-colors cursor-pointer",
                        index === highlightIndex &&
                          "bg-primary/10 text-primary",
                        destinationSlug === item.slug &&
                          index !== highlightIndex &&
                          "bg-primary/5 text-primary",
                        index !== highlightIndex &&
                          destinationSlug !== item.slug &&
                          "hover:bg-slate-50 dark:hover:bg-slate-800/80 text-slate-800 dark:text-slate-100",
                      )}
                      role="option"
                      type="button"
                      onClick={() => selectDestination(item.slug, item.label)}
                      onMouseEnter={() => setHighlightIndex(index)}
                    >
                      {item.label}
                      {item.region && (
                        <span className="block text-[10px] font-medium text-slate-400 mt-0.5">
                          {item.region}
                        </span>
                      )}
                    </button>
                  </li>
                ))
              )}
            </ul>
          </HeroSearchDropdown>
        </div>

        <div ref={dateAnchorRef} className="relative flex-1 min-w-0">
          <button
            aria-expanded={activePanel === "date"}
            className={cn(
              fieldClass,
              "group lg:px-5",
              "border-b lg:border-b-0 lg:border-r border-slate-200/60 dark:border-white/10",
              "hover:bg-slate-50 dark:hover:bg-white/5",
              activePanel === "date" && "bg-slate-50 dark:bg-white/5",
            )}
            type="button"
            onClick={() => {
              if (activePanel === "date") closePanels();
              else openDate();
            }}
          >
            <div className={iconClass}>
              <Calendar size={18} strokeWidth={2.5} />
            </div>
            <div className="flex-1 min-w-0 text-left">
              <p className={labelClass}>
                {getLocalizedValue(content?.searchDateLabel, locale) ||
                  t("search.time_label")}
              </p>
              <p
                className={cn(valueClass(hasDates), "flex items-center gap-1")}
              >
                <span className="truncate">
                  {dateDisplay ||
                    getLocalizedValue(content?.searchDatePlaceholder, locale) ||
                    t("search.time_placeholder")}
                </span>
                <ChevronDown
                  className={cn(
                    "shrink-0 opacity-40 transition-transform duration-200",
                    activePanel === "date" && "rotate-180",
                  )}
                  size={14}
                />
              </p>
            </div>
            {hasDates && (
              <span
                className="shrink-0 p-1 rounded-full cursor-pointer hover:bg-slate-200/80 dark:hover:bg-white/10 text-slate-400 transition-colors"
                role="button"
                tabIndex={0}
                onClick={(e) => {
                  e.stopPropagation();
                  setFromDate("");
                  setToDate("");
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    e.stopPropagation();
                    setFromDate("");
                    setToDate("");
                  }
                }}
              >
                <X size={14} />
              </span>
            )}
          </button>

          <HeroSearchDropdown
            align="anchor"
            anchorRef={dateAnchorRef}
            minWidth={260}
            open={activePanel === "date"}
            onClose={closePanels}
          >
            <div className="p-3 space-y-3 shrink-0">
              <div className="grid grid-cols-2 gap-3">
                <label className="flex flex-col gap-1 cursor-pointer">
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                    {locale === "vi" ? "Từ ngày" : "From"}
                  </span>
                  <input
                    className="w-full px-3 py-2 text-sm rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 outline-none focus:ring-2 focus:ring-primary/25 cursor-pointer"
                    min={minDate}
                    type="date"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                  />
                </label>
                <label className="flex flex-col gap-1 cursor-pointer">
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                    {locale === "vi" ? "Đến ngày" : "To"}
                  </span>
                  <input
                    className="w-full px-3 py-2 text-sm rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 outline-none focus:ring-2 focus:ring-primary/25 cursor-pointer"
                    min={fromDate || minDate}
                    type="date"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                  />
                </label>
              </div>
              <div className="flex gap-2">
                <Button
                  className="flex-1 font-bold text-xs cursor-pointer"
                  size="sm"
                  variant="flat"
                  onPress={() => {
                    setFromDate("");
                    setToDate("");
                  }}
                >
                  {locale === "vi" ? "Xóa" : "Clear"}
                </Button>
                <Button
                  className="flex-1 font-bold text-xs cursor-pointer"
                  color="primary"
                  size="sm"
                  onPress={closePanels}
                >
                  {locale === "vi" ? "Xong" : "Done"}
                </Button>
              </div>
            </div>
          </HeroSearchDropdown>
        </div>

        <Button
          className="m-1 sm:m-1.5 font-black h-11 sm:h-12 px-8 sm:px-10 rounded-full text-xs sm:text-sm tracking-[0.2em] shadow-lg shadow-primary/30 w-[calc(100%-8px)] sm:w-auto lg:w-auto mx-auto lg:mx-0 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer"
          type="submit"
        >
          <span className="flex items-center gap-2">
            <Search size={18} strokeWidth={2.5} />
            {t("search.button")}
          </span>
        </Button>
      </div>

      {(hasLocation || hasDates) && (
        <button
          className="mt-2 text-[10px] font-bold text-white/50 hover:text-white/80 underline-offset-2 hover:underline transition-colors cursor-pointer"
          type="button"
          onClick={clearAll}
        >
          {locale === "vi" ? "Xóa bộ lọc" : "Clear filters"}
        </button>
      )}

      {suggestionTags.length > 0 && activePanel === null && (
        <div className="relative z-10 flex flex-wrap items-center justify-center gap-1.5 mt-3 max-w-4xl">
          <span className="text-white/40 text-[10px] font-bold uppercase tracking-widest mr-1">
            {t("suggestions_label")}
          </span>
          {suggestionTags.map((tag) => (
            <button
              key={tag.slug}
              className="bg-white/10 hover:bg-white/25 hover:border-white/30 backdrop-blur-md border border-white/15 text-white/80 hover:text-white px-2.5 py-1 rounded-full text-[10px] font-bold transition-all cursor-pointer active:scale-95"
              type="button"
              onClick={() => selectDestination(tag.slug, tag.label)}
            >
              {tag.label}
            </button>
          ))}
        </div>
      )}
    </form>
  );
}
