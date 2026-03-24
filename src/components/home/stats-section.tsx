"use client";

import { getLocalizedValue } from "@/lib/utils/i18n";

interface StatsSectionProps {
  content: any;
  locale: string;
}

export function StatsSection({ content, locale }: StatsSectionProps) {
  const items = content?.items || [];
  
  if (items.length === 0) return null;

  return (
    <section id='stats' className='relative z-30 -mt-16 lg:-mt-20 px-6 animate-in fade-in duration-700'>
        <div className='max-w-5xl mx-auto bg-white dark:bg-slate-900 rounded-3xl shadow-xl p-6 md:p-8 border border-gray-100/50'>
          <div className='grid grid-cols-2 lg:grid-cols-4 gap-8 lg:divide-x divide-gray-100'>
            {items.map((stat: any, idx: number) => (
              <div key={idx} className='flex flex-col items-center px-4 group' style={{ animationDelay: `${idx * 150}ms` }}>
                <p className='text-3xl lg:text-4xl font-black text-foreground group-hover:text-primary transition-all tracking-tight'>{stat.value}</p>
                <p className='text-[9px] font-black text-gray-400 uppercase tracking-widest mt-2 opacity-60'>
                    {getLocalizedValue(stat.label, locale)}
                </p>
              </div>
            ))}
          </div>
        </div>
    </section>
  );
}
