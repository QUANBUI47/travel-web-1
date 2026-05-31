"use client";

import type { HeroContent } from "@/types/builder";
import type { Destination } from "@/types";
import type { RangeValue } from "@react-types/shared";
import type { DateValue } from "@internationalized/date";

import React from "react";
import { Search, MapPin, Calendar, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import { HeroSearchDropdown } from "@/components/home/hero-search-dropdown";
import { HeroSearchDatePanel } from "@/components/home/hero-search-date-panel";
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

function dateValueToIso(value: DateValue | null | undefined): string {
  if (!value) return "";
  const m = String(value.month).padStart(2, "0");
  const d = String(value.day).padStart(2, "0");

  return `${value.year}-${m}-${d}`;
}

function formatDateRangeLabel(
  range: RangeValue<DateValue> | null,
  locale: string,
): string {
  if (!range) return "";
  const lang = locale === "vi" ? "vi-VN" : "en-US";
  const opts: Intl.DateTimeFormatOptions = {
    weekday: "short",
    day: "numeric",
    month: "short",
  };
  const start = range.start
    .toDate("UTC")
    .toLocaleDateString(lang, opts)
    .replace(",", "");
  const end = range.end
    .toDate("UTC")
    .toLocaleDateString(lang, opts)
    .replace(",", "");

  return `${start} – ${end}`;
}

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
  const [dateRange, setDateRange] =
    React.useState<RangeValue<DateValue> | null>(null);
  const [activePanel, setActivePanel] = React.useState<ActivePanel>(null);
  const [destQuery, setDestQuery] = React.useState("");
  const [highlightIndex, setHighlightIndex] = React.useState(0);
  /** Increments each time the date panel opens, used to re-seed its draft. */
  const [datePanelOpenKey, setDatePanelOpenKey] = React.useState(0);

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
  const dateDisplay = formatDateRangeLabel(dateRange, locale);
  const hasLocation = Boolean(selectedDestination);
  const hasDates = Boolean(dateRange);

  const closePanels = () => setActivePanel(null);

  const openDestination = () => {
    setActivePanel("destination");
    setHighlightIndex(0);
    requestAnimationFrame(() => destSearchRef.current?.focus());
  };

  const openDate = () => {
    setActivePanel("date");
    setDatePanelOpenKey((k) => k + 1);
  };

  const selectDestination = (slug: string, label: string) => {
    setDestinationSlug(slug);
    setDestQuery(label);
    closePanels();
    openDate();
  };

  const navigate = React.useCallback(
    (slug: string | null, range: RangeValue<DateValue> | null) => {
      const params: Parameters<typeof buildTourSearchUrl>[0] = {};

      if (slug) params.destination = slug;
      if (range?.start) params.from = dateValueToIso(range.start);
      if (range?.end) params.to = dateValueToIso(range.end);

      router.push(buildTourSearchUrl(params));
    },
    [router],
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    closePanels();
    navigate(destinationSlug, dateRange);
  };

  const clearAll = () => {
    setDestinationSlug(null);
    setDestQuery("");
    setDateRange(null);
    closePanels();
  };

  React.useEffect(() => {
    setHighlightIndex(0);
  }, [destQuery, activePanel]);

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

  const renderField = ({
    active,
    icon,
    label,
    value,
    placeholder,
    filled,
    onClick,
    onClear,
  }: {
    active: boolean;
    icon: React.ReactNode;
    label: string;
    value?: string;
    placeholder: string;
    filled: boolean;
    onClick: () => void;
    onClear?: () => void;
  }) => (
    <button
      aria-expanded={active}
      className={cn(
        "group relative flex h-full w-full items-center gap-3 text-left transition-all cursor-pointer",
        "rounded-2xl lg:rounded-full px-4 py-3 lg:px-5",
        "border bg-white dark:bg-slate-800/70",
        active
          ? "border-primary ring-2 ring-primary/20 dark:ring-primary/30 shadow-md shadow-primary/10"
          : "border-slate-200 dark:border-slate-700/80 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800",
      )}
      type="button"
      onClick={onClick}
    >
      <span
        className={cn(
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors",
          active
            ? "bg-primary text-white"
            : "bg-primary/10 text-primary group-hover:bg-primary/15",
        )}
      >
        {icon}
      </span>
      <span className="flex min-w-0 flex-1 flex-col text-left">
        <span className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
          {label}
        </span>
        <span
          className={cn(
            "truncate text-sm font-bold leading-tight",
            filled
              ? "text-slate-900 dark:text-white"
              : "text-slate-500 dark:text-slate-400",
          )}
        >
          {value || placeholder}
        </span>
      </span>
      {filled && onClear ? (
        <span
          aria-label="Clear"
          className="shrink-0 rounded-full p-1 text-slate-400 transition-colors hover:bg-slate-200/80 hover:text-slate-700 dark:hover:bg-slate-700 dark:hover:text-white"
          role="button"
          tabIndex={0}
          onClick={(e) => {
            e.stopPropagation();
            onClear();
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              e.stopPropagation();
              onClear();
            }
          }}
        >
          <X size={14} strokeWidth={2.5} />
        </span>
      ) : null}
    </button>
  );

  return (
    <form
      className="relative z-30 w-full flex flex-col items-center animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-300"
      onSubmit={handleSubmit}
    >
      <div
        ref={searchBarRef}
        className={cn(
          "relative z-30 w-full max-w-5xl mx-auto",
          "bg-white/95 dark:bg-slate-900/90 backdrop-blur-xl",
          "rounded-[1.75rem] lg:rounded-full",
          "shadow-[0_28px_60px_-18px_rgba(2,8,23,0.45)]",
          "ring-1 ring-white/40 dark:ring-white/10",
          "p-2 sm:p-2.5",
          "flex flex-col lg:flex-row lg:items-stretch gap-2",
        )}
      >
        <div ref={destAnchorRef} className="relative w-full lg:flex-1">
          {renderField({
            active: activePanel === "destination",
            icon: <MapPin size={18} strokeWidth={2.5} />,
            label:
              getLocalizedValue(content?.searchLocationLabel, locale) ||
              t("search.location_label"),
            value: locationDisplay,
            placeholder:
              getLocalizedValue(content?.searchLocationPlaceholder, locale) ||
              t("search.location_help"),
            filled: hasLocation,
            onClick: () =>
              activePanel === "destination" ? closePanels() : openDestination(),
            onClear: () => {
              setDestinationSlug(null);
              setDestQuery("");
            },
          })}

          <HeroSearchDropdown
            align="anchor"
            anchorRef={destAnchorRef}
            minWidth={320}
            open={activePanel === "destination"}
            onClose={closePanels}
          >
            <div className="p-2 border-b border-slate-100 dark:border-slate-800 shrink-0">
              <input
                ref={destSearchRef}
                className="w-full px-3 py-2 text-sm rounded-lg bg-slate-50 dark:bg-slate-800 border-none outline-none focus:ring-2 focus:ring-primary/25 cursor-text text-slate-900 dark:text-white"
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
                      {item.region ? (
                        <span className="block text-[10px] font-medium text-slate-400 mt-0.5">
                          {item.region}
                        </span>
                      ) : null}
                    </button>
                  </li>
                ))
              )}
            </ul>
          </HeroSearchDropdown>
        </div>

        <div ref={dateAnchorRef} className="relative w-full lg:flex-1">
          {renderField({
            active: activePanel === "date",
            icon: <Calendar size={18} strokeWidth={2.5} />,
            label:
              getLocalizedValue(content?.searchDateLabel, locale) ||
              t("search.time_label"),
            value: dateDisplay,
            placeholder:
              getLocalizedValue(content?.searchDatePlaceholder, locale) ||
              t("search.time_placeholder"),
            filled: hasDates,
            onClick: () =>
              activePanel === "date" ? closePanels() : openDate(),
            onClear: () => setDateRange(null),
          })}

          <HeroSearchDropdown
            tall
            align="center"
            anchorRef={dateAnchorRef}
            minWidth={320}
            open={activePanel === "date"}
            panelWidth={680}
            onClose={closePanels}
          >
            <HeroSearchDatePanel
              ariaLabel={t("search.time_label")}
              locale={locale}
              openKey={datePanelOpenKey}
              value={dateRange}
              onApply={(range) => setDateRange(range)}
              onClose={closePanels}
            />
          </HeroSearchDropdown>
        </div>

        <button
          className={cn(
            "shrink-0 w-full lg:w-auto cursor-pointer",
            "rounded-2xl lg:rounded-full",
            "bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800",
            "text-white font-black text-sm tracking-[0.15em] uppercase",
            "h-12 lg:h-auto lg:min-h-[52px] px-7 lg:px-8",
            "shadow-lg shadow-primary/30",
            "hover:brightness-110 active:scale-[0.98]",
            "transition-all flex items-center justify-center gap-2",
          )}
          type="submit"
        >
          <Search size={18} strokeWidth={2.75} />
          <span>{t("search.button")}</span>
        </button>
      </div>

      {(hasLocation || hasDates) && (
        <button
          className="mt-3 text-[10px] font-bold text-white/60 hover:text-white underline-offset-2 hover:underline transition-colors cursor-pointer drop-shadow"
          type="button"
          onClick={clearAll}
        >
          {locale === "vi" ? "Xóa bộ lọc" : "Clear filters"}
        </button>
      )}

      {suggestionTags.length > 0 && activePanel === null ? (
        <div className="relative z-10 flex flex-wrap items-center justify-center gap-1.5 mt-4 max-w-4xl">
          <span className="text-white/50 text-[10px] font-bold uppercase tracking-widest mr-1 drop-shadow">
            {t("suggestions_label")}
          </span>
          {suggestionTags.map((tag) => (
            <button
              key={tag.slug}
              className="bg-white/10 hover:bg-white/25 hover:border-white/30 backdrop-blur-md border border-white/15 text-white/90 hover:text-white px-3 py-1 rounded-full text-[10px] font-bold transition-all cursor-pointer active:scale-95"
              type="button"
              onClick={() => selectDestination(tag.slug, tag.label)}
            >
              {tag.label}
            </button>
          ))}
        </div>
      ) : null}
    </form>
  );
}
