"use client";

import type { RangeValue } from "@react-types/shared";
import type { DateValue } from "@internationalized/date";

import React from "react";
import { RangeCalendar } from "@heroui/calendar";
import { I18nProvider } from "@react-aria/i18n";
import { getLocalTimeZone, today } from "@internationalized/date";

import { cn } from "@/lib/utils";

type HeroSearchDatePanelProps = {
  locale: string;
  /** Currently committed date range. */
  value: RangeValue<DateValue> | null;
  /** Called only when user presses "Áp dụng" / "Apply". */
  onApply: (value: RangeValue<DateValue> | null) => void;
  /** Called by Apply button (and Clear button) to close the panel. */
  onClose: () => void;
  /**
   * Increments when the panel becomes visible. Used to re-seed internal
   * draft state from `value` whenever the panel re-opens.
   */
  openKey: number;
  ariaLabel: string;
};

type FlexChip = {
  /** Number of days from today the range will span. 0 = just today. */
  days: number;
  labelVi: string;
  labelEn: string;
};

const FLEX_CHIPS: ReadonlyArray<FlexChip> = [
  { days: 0, labelVi: "Hôm nay", labelEn: "Today" },
  { days: 1, labelVi: "± 1 ngày", labelEn: "± 1 day" },
  { days: 2, labelVi: "± 2 ngày", labelEn: "± 2 days" },
  { days: 3, labelVi: "± 3 ngày", labelEn: "± 3 days" },
  { days: 7, labelVi: "± 7 ngày", labelEn: "± 7 days" },
];

const calendarClassNames = {
  base: "w-full bg-transparent shadow-none p-0",
  headerWrapper: "px-2 pt-1 pb-3 bg-transparent",
  prevButton:
    "min-w-9 w-9 h-9 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer",
  nextButton:
    "min-w-9 w-9 h-9 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer",
  title: "font-bold text-slate-900 dark:text-white text-sm capitalize",
  gridHeaderCell:
    "text-slate-400 dark:text-slate-500 font-bold text-[11px] uppercase tracking-wide",
  // Keep cellButton minimal so HeroUI's built-in range fill stays intact.
  cellButton: "cursor-pointer",
};

function toAriaLocale(locale: string) {
  return locale === "vi" ? "vi-VN" : "en-US";
}

/**
 * Compute date range starting today, ending `days` days from today.
 * 0 = today only.
 */
function rangeFromToday(days: number): RangeValue<DateValue> {
  const start = today(getLocalTimeZone());
  const end = days <= 0 ? start : start.add({ days });

  return { start, end };
}

/**
 * Detect which preset chip (if any) matches the current date range.
 * A chip is "active" when range starts today and ends `days` days from today.
 */
function deriveActiveChip(value: RangeValue<DateValue> | null): number | null {
  if (!value) return null;
  const t = today(getLocalTimeZone());

  if (value.start.compare(t) !== 0) return null;

  const diff = value.end.compare(value.start);
  const match = FLEX_CHIPS.find((chip) => chip.days === diff);

  return match ? match.days : null;
}

export function HeroSearchDatePanel({
  locale,
  value,
  onApply,
  onClose,
  openKey,
  ariaLabel,
}: HeroSearchDatePanelProps) {
  const min = today(getLocalTimeZone());
  const isVi = locale === "vi";
  const [tab, setTab] = React.useState<"calendar" | "flex">("calendar");
  const [draft, setDraft] = React.useState<RangeValue<DateValue> | null>(value);

  // Re-seed the draft from the committed value each time the panel reopens.
  React.useEffect(() => {
    setDraft(value);
    // openKey is the trigger; intentional dep on it to reset on each open
  }, [openKey]);

  const activeChip = deriveActiveChip(draft);

  const handleApply = () => {
    onApply(draft);
    onClose();
  };

  const handleClear = () => {
    setDraft(null);
    onApply(null);
    onClose();
  };

  return (
    <I18nProvider locale={toAriaLocale(locale)}>
      <div className="flex w-full flex-col">
        <div
          className="grid grid-cols-2 border-b border-slate-100 dark:border-slate-800"
          role="tablist"
        >
          <button
            aria-selected={tab === "calendar"}
            className={cn(
              "py-3 text-sm font-bold transition-colors relative",
              tab === "calendar"
                ? "text-primary"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200",
            )}
            role="tab"
            type="button"
            onClick={() => setTab("calendar")}
          >
            {isVi ? "Lịch" : "Calendar"}
            {tab === "calendar" ? (
              <span className="absolute inset-x-6 -bottom-px h-0.5 bg-primary rounded-full" />
            ) : null}
          </button>
          <button
            aria-selected={tab === "flex"}
            className={cn(
              "py-3 text-sm font-bold transition-colors relative",
              tab === "flex"
                ? "text-primary"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200",
            )}
            role="tab"
            type="button"
            onClick={() => setTab("flex")}
          >
            {isVi ? "Ngày linh hoạt?" : "Flexible dates?"}
            {tab === "flex" ? (
              <span className="absolute inset-x-6 -bottom-px h-0.5 bg-primary rounded-full" />
            ) : null}
          </button>
        </div>

        {tab === "calendar" ? (
          <div className="px-3 pt-3 pb-1 sm:px-4">
            <RangeCalendar
              hideDisabledDates
              aria-label={ariaLabel}
              calendarWidth="auto"
              classNames={calendarClassNames}
              color="primary"
              minValue={min}
              value={draft ?? undefined}
              visibleMonths={2}
              onChange={(range) => setDraft(range ?? null)}
            />
          </div>
        ) : (
          <div className="px-5 py-8 text-sm text-slate-500 dark:text-slate-400">
            {isVi
              ? "Chế độ ngày linh hoạt sẽ sớm có. Hãy chọn khoảng ngày cụ thể ở tab Lịch."
              : "Flexible dates coming soon. Pick exact dates in the Calendar tab for now."}
          </div>
        )}

        <div className="border-t border-slate-100 dark:border-slate-800 px-4 sm:px-5 py-3">
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500 mb-2">
            {isVi ? "Khởi hành nhanh từ hôm nay" : "Quick depart from today"}
          </p>
          <div className="flex flex-wrap items-center gap-1.5">
            {FLEX_CHIPS.map((chip) => {
              const isActive = activeChip === chip.days;

              return (
                <button
                  key={chip.days}
                  aria-pressed={isActive}
                  className={cn(
                    "rounded-full px-3 py-1.5 text-xs font-bold transition-all",
                    isActive
                      ? "bg-primary text-white shadow-sm shadow-primary/30 ring-2 ring-primary/30"
                      : "border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-primary hover:text-primary",
                  )}
                  type="button"
                  onClick={() => setDraft(rangeFromToday(chip.days))}
                >
                  {isVi ? chip.labelVi : chip.labelEn}
                </button>
              );
            })}
          </div>
        </div>

        <div className="border-t border-slate-100 dark:border-slate-800 px-4 sm:px-5 py-3 flex items-center justify-between gap-2">
          <button
            className={cn(
              "text-xs font-bold px-3 py-1.5 rounded-full transition-colors",
              draft
                ? "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                : "text-slate-300 dark:text-slate-600 cursor-not-allowed",
            )}
            disabled={!draft}
            type="button"
            onClick={handleClear}
          >
            {isVi ? "Xóa" : "Clear"}
          </button>
          <button
            className={cn(
              "text-xs font-black uppercase tracking-wider px-5 py-2 rounded-full transition-all",
              "bg-primary text-white shadow-sm shadow-primary/30",
              "hover:brightness-110 active:scale-[0.98]",
            )}
            type="button"
            onClick={handleApply}
          >
            {isVi ? "Áp dụng" : "Apply"}
          </button>
        </div>
      </div>
    </I18nProvider>
  );
}
