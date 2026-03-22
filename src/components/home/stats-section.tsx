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
    <section id='stats' className='relative z-30 -mt-24 lg:-mt-32 px-4 md:px-10 animate-in fade-in duration-700'>
        <div className='max-w-6xl mx-auto bg-white dark:bg-slate-900 rounded-[2.5rem] md:rounded-[3rem] xl:rounded-[4rem] shadow-2xl p-8 md:p-12 border border-gray-100/50'>
          <div className='grid grid-cols-2 lg:grid-cols-4 gap-12 lg:divide-x divide-gray-100'>
            {items.map((stat: any, idx: number) => (
              <div key={idx} className='flex flex-col items-center px-4 group' style={{ animationDelay: `${idx * 150}ms` }}>
                <p className='text-4xl lg:text-5xl font-black text-foreground group-hover:text-primary transition-all tracking-tighter scale-100 group-hover:scale-110'>{stat.value}</p>
                <p className='text-[10px] font-black text-gray-400 uppercase tracking-widest mt-3 opacity-60 group-hover:opacity-100 transition-opacity'>
                    {getLocalizedValue(stat.label, locale)}
                </p>
              </div>
            ))}
          </div>
        </div>
    </section>
  );
}
