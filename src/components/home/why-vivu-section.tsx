"use client";

import { ShieldCheck, Clock, Map } from "lucide-react";

interface WhyVivuSectionProps {
  t: (key: string, values?: any) => string;
}

export function WhyVivuSection({ t }: WhyVivuSectionProps) {
    return (
        <section className='grid grid-cols-1 md:grid-cols-3 gap-8 px-4'>
            {[
                { icon: ShieldCheck, title: t("WhyVivu.safe.title"), desc: t("WhyVivu.safe.description") },
                { icon: Clock, title: t("WhyVivu.support.title"), desc: t("WhyVivu.support.description") },
                { icon: Map, title: t("WhyVivu.local.title"), desc: t("WhyVivu.local.description") },
            ].map((item, i) => (
                <div key={i} className='flex flex-col items-center text-center p-8 bg-white rounded-3xl border border-slate-50 shadow-sm hover:shadow-xl transition-all group'>
                    <div className='w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all'>
                        <item.icon size={32} />
                    </div>
                    <h3 className='font-bold text-xl mb-3'>{item.title}</h3>
                    <p className='text-gray-500 text-sm leading-relaxed'>{item.desc}</p>
                </div>
            ))}
        </section>
    );
}
