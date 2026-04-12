"use client";

import type { StatsSectionProps } from "@/components/home/section-props";
import type { StatsItem } from "@/types/builder";

import { getLocalizedValue } from "@/lib/utils/i18n";

export function StatsSection({ content, locale }: StatsSectionProps) {
  const items = content?.items || [];

  if (items.length === 0) return null;

  return (
    <section
      className="relative w-full max-w-7xl mx-auto z-30 -mt-16 lg:-mt-20 px-4 lg:px-10 mb-6"
      id="stats"
    >
      <div className="w-full mx-auto bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl p-6 md:p-10 border border-slate-100">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:divide-x divide-slate-100">
          {items.map((stat: StatsItem, idx: number) => (
            <div key={idx} className="flex flex-col items-center px-4 group">
              <p className="text-3xl font-black text-slate-900 tracking-tight">
                {stat.value}
              </p>
              <p className="text-[0.5625rem] font-black text-slate-400 uppercase tracking-widest mt-2">
                {getLocalizedValue(stat.label, locale)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
