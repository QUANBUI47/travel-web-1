"use client";

import type { Destination } from "@/types";
import type { TourSearchParams } from "@/lib/tour/search-params";
import type { RangeValue } from "@react-types/shared";
import type { DateValue } from "@internationalized/date";

import React from "react";
import { Search } from "lucide-react";
import { Button } from "@heroui/button";
import { Autocomplete, AutocompleteItem } from "@heroui/autocomplete";
import { DateRangePicker } from "@heroui/date-picker";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { getLocalTimeZone, parseDate, today } from "@internationalized/date";

import { buildTourSearchUrl } from "@/lib/tour/search-params";
import { getDBLocalizedValue } from "@/lib/utils/i18n";

type ToursSearchBarProps = {
  destinations: Destination[];
  locale: string;
  initial: TourSearchParams;
};

function formatDateValue(date: DateValue): string {
  const y = date.year;
  const m = String(date.month).padStart(2, "0");
  const d = String(date.day).padStart(2, "0");

  return `${y}-${m}-${d}`;
}

export function ToursSearchBar({
  destinations,
  locale,
  initial,
}: ToursSearchBarProps) {
  const t = useTranslations("Tours");
  const router = useRouter();

  const [query, setQuery] = React.useState(() => {
    if (initial.q) return initial.q;
    if (initial.destination) {
      const dest = destinations.find((d) => d.slug === initial.destination);

      return dest ? getDBLocalizedValue(dest, "name", locale) : "";
    }

    return "";
  });
  const [destinationSlug, setDestinationSlug] = React.useState<string | null>(
    initial.destination ?? null,
  );
  const [dateRange, setDateRange] =
    React.useState<RangeValue<DateValue> | null>(() => {
      if (!initial.from && !initial.to) return null;

      return {
        start: initial.from ? parseDate(initial.from) : undefined,
        end: initial.to ? parseDate(initial.to) : undefined,
      } as RangeValue<DateValue>;
    });

  const destinationItems = React.useMemo(
    () =>
      destinations.map((d) => ({
        key: d.slug,
        label: getDBLocalizedValue(d, "name", locale),
      })),
    [destinations, locale],
  );

  const submit = (e: React.FormEvent) => {
    e.preventDefault();

    const params: TourSearchParams = {};

    if (destinationSlug) params.destination = destinationSlug;
    else if (query.trim()) params.q = query.trim();

    if (dateRange?.start) params.from = formatDateValue(dateRange.start);
    if (dateRange?.end) params.to = formatDateValue(dateRange.end);
    if (initial.type) params.type = initial.type;

    router.push(buildTourSearchUrl(params));
  };

  const clearFilters = () => {
    setQuery("");
    setDestinationSlug(null);
    setDateRange(null);
    router.push(buildTourSearchUrl(initial.type ? { type: initial.type } : {}));
  };

  const hasFilters = Boolean(
    initial.destination || initial.q || initial.from || initial.to,
  );

  return (
    <form
      className="mb-12 p-4 md:p-6 rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-none"
      onSubmit={submit}
    >
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
        <div className="md:col-span-5">
          <Autocomplete
            allowsCustomValue
            aria-label={t("search_destination")}
            inputValue={query}
            label={t("search_destination")}
            labelPlacement="outside"
            placeholder={t("search_placeholder")}
            selectedKey={destinationSlug}
            variant="bordered"
            onInputChange={setQuery}
            onSelectionChange={(key) => {
              const slug = key ? String(key) : null;

              setDestinationSlug(slug);
              if (slug) {
                const item = destinationItems.find((d) => d.key === slug);

                if (item) setQuery(item.label);
              }
            }}
          >
            {destinationItems.map((item) => (
              <AutocompleteItem key={item.key} textValue={item.label}>
                {item.label}
              </AutocompleteItem>
            ))}
          </Autocomplete>
        </div>

        <div className="md:col-span-5">
          <DateRangePicker
            aria-label={t("search_dates")}
            label={t("search_dates")}
            labelPlacement="outside"
            minValue={today(getLocalTimeZone())}
            value={dateRange}
            variant="bordered"
            onChange={setDateRange}
          />
        </div>

        <div className="md:col-span-2 flex flex-col gap-2">
          <Button
            className="font-black"
            color="primary"
            startContent={<Search size={18} />}
            type="submit"
          >
            {t("search_button")}
          </Button>
          {hasFilters && (
            <Button type="button" variant="flat" onPress={clearFilters}>
              {t("clear_filters")}
            </Button>
          )}
        </div>
      </div>
    </form>
  );
}
