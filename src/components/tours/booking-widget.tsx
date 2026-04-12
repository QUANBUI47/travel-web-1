"use client";

import { useState } from "react";
import { Users, Calendar } from "lucide-react";
import { Card, CardBody } from "@heroui/card";
import { Button } from "@heroui/button";
import { Select, SelectItem } from "@heroui/select";
import { Chip } from "@heroui/chip";
import { useTranslations } from "next-intl";

import { Tour } from "@/types";

interface BookingWidgetProps {
  tour: Tour;
  locale: string;
}

export function BookingWidget({ tour, locale }: BookingWidgetProps) {
  const t = useTranslations("Tours");
  const [selectedDepartureId, setSelectedDepartureId] = useState<string>("");
  const [participants, setParticipants] = useState(1);

  const selectedDeparture = tour.departures?.find(
    (d) => d.id === selectedDepartureId,
  );

  const currentPrice = selectedDeparture?.priceOverride ?? tour.priceFrom;

  const intlLocale = locale === "vi" ? "vi-VN" : "en-US";
  const currency = locale === "vi" ? "VND" : "USD";

  const formatPrice = (val: number) =>
    new Intl.NumberFormat(intlLocale, {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(val);

  const totalPrice = formatPrice(currentPrice * participants);

  return (
    <div className="sticky top-32 space-y-8">
      <Card className="border-none shadow-2xl rounded-[2.5rem] bg-white dark:bg-slate-900 overflow-hidden">
        <CardBody className="p-10 space-y-8">
          <div className="flex flex-col gap-1">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
              {t("price_from")}
            </p>
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-black text-primary tracking-tighter">
                {formatPrice(currentPrice)}
              </span>
              {tour.oldPrice && !selectedDeparture?.priceOverride && (
                <span className="text-sm font-bold text-slate-300 line-through tracking-tighter">
                  {formatPrice(tour.oldPrice)}
                </span>
              )}
            </div>
          </div>

          <div className="space-y-6 pt-4 border-t border-slate-50 dark:border-slate-800">
            {/* Chọn ngày khởi hành */}
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
                <Calendar className="text-primary" size={12} />
                {t("departure_schedule")}
              </label>
              <Select
                classNames={{
                  trigger: "h-14",
                }}
                placeholder={t("select_date")}
                radius="lg"
                selectedKeys={selectedDepartureId ? [selectedDepartureId] : []}
                variant="bordered"
                onSelectionChange={(keys) =>
                  setSelectedDepartureId(Array.from(keys)[0] as string)
                }
              >
                {(tour.departures ?? []).map((d) => (
                  <SelectItem
                    key={d.id}
                    textValue={new Date(d.startDate).toLocaleDateString(
                      intlLocale,
                    )}
                  >
                    <div className="flex justify-between items-center w-full">
                      <span className="font-bold">
                        {new Date(d.startDate).toLocaleDateString(intlLocale)}
                      </span>
                      {d.priceOverride && (
                        <Chip
                          className="font-black text-[9px]"
                          color="warning"
                          size="sm"
                          variant="flat"
                        >
                          {formatPrice(d.priceOverride)}
                        </Chip>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </Select>
            </div>

            {/* Chọn số người */}
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
                <Users className="text-primary" size={12} />
                {t("guest_count")}
              </label>
              <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-800/50 p-2 rounded-2xl border border-slate-100 dark:border-slate-800">
                <Button
                  isIconOnly
                  radius="lg"
                  size="sm"
                  variant="flat"
                  onPress={() => setParticipants(Math.max(1, participants - 1))}
                >
                  -
                </Button>
                <span className="flex-1 text-center font-black">
                  {participants}
                </span>
                <Button
                  isIconOnly
                  radius="lg"
                  size="sm"
                  variant="flat"
                  onPress={() => setParticipants(participants + 1)}
                >
                  +
                </Button>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-50 dark:border-slate-800 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                {t("total")}
              </span>
              <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">
                {totalPrice}
              </span>
            </div>

            <Button
              className="w-full h-16 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black text-sm uppercase tracking-[0.2em] rounded-2xl shadow-xl hover:bg-primary dark:hover:bg-primary hover:text-white dark:hover:text-white transition-all active:scale-95 disabled:opacity-50"
              isDisabled={!selectedDepartureId}
            >
              {t("book_now")}
            </Button>
          </div>

          <p className="text-[10px] text-center text-slate-400 font-bold uppercase tracking-widest italic leading-relaxed">
            {!selectedDepartureId
              ? t("select_date_hint")
              : t("price_includes_tax")}
          </p>
        </CardBody>
      </Card>

      {/* Support Card */}
      <div className="p-8 bg-primary/5 rounded-[2rem] border border-primary/10 flex flex-col gap-4">
        <h4 className="font-black text-xs uppercase tracking-[0.2em] text-primary">
          {t("support_247")}
        </h4>
        <p className="text-xs text-slate-500 font-bold leading-relaxed">
          {t("support_desc")}
        </p>
        <a
          className="text-xl font-black text-slate-900 dark:text-white hover:text-primary transition-colors"
          href="tel:19001234"
        >
          1900 1234
        </a>
      </div>
    </div>
  );
}
