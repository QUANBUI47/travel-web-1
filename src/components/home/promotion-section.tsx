"use client";

import { useState, useEffect } from "react";
import { Users } from "lucide-react";
import { Button } from "@heroui/button";
import Image from "next/image";
import { getLocalizedValue } from "@/lib/utils/i18n";
import { cn } from "@/lib/utils/index";

interface PromotionSectionProps {
  content: any;
  locale: string;
}

export function PromotionSection({ content, locale }: PromotionSectionProps) {
    const theme = content?.theme || 'gold';
    const text = getLocalizedValue(content?.content, locale) || "Mùa hè rực rỡ - Ưu đãi hấp dẫn";
    const deadlineStr = content?.deadline || '2026-12-31 23:59:59';

    return (
        <section className="px-4">
            <div className={cn(
                "w-full p-10 lg:p-16 rounded-[4rem] flex flex-col lg:flex-row items-center justify-between gap-8 relative overflow-hidden",
                theme === 'gold' ? "bg-gradient-to-br from-amber-400 via-amber-500 to-amber-700 text-white" :
                theme === 'blue' ? "bg-gradient-to-br from-primary via-blue-600 to-blue-800 text-white" :
                "bg-slate-900 text-white"
            )}>
                 {/* Decorative background circle */}
                 <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
                 
                 <div className="relative z-10 flex-1 text-center lg:text-left">
                    <div className="flex items-center gap-3 mb-6 justify-center lg:justify-start">
                        <Users className="text-white/80" size={24}/>
                        <span className="text-xs font-black uppercase tracking-[0.4em] bg-white/20 px-4 py-1.5 rounded-full">FLASH SALE TODAY</span>
                    </div>
                    <h2 className="text-4xl lg:text-6xl font-black tracking-tight leading-none mb-4 drop-shadow-lg">
                        {text}
                    </h2>
                 </div>

                 <div className="relative z-10 flex flex-col items-center gap-4 bg-black/20 backdrop-blur-md p-8 lg:p-10 rounded-[3rem] border border-white/20">
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/60">Ending In</p>
                    <Countdown deadline={deadlineStr} />
                    <Button radius="full" className="w-full mt-4 h-14 font-black tracking-widest bg-white text-slate-900 hover:scale-105 transition-transform">
                        GET OFFER NOW
                    </Button>
                 </div>
            </div>
        </section>
    );
}

function Countdown({ deadline }: { deadline: string }) {
    const [timeLeft, setTimeLeft] = useState({ h: '00', m: '00', s: '00' });

    useEffect(() => {
        const timer = setInterval(() => {
            const target = new Date(deadline).getTime();
            const now = new Date().getTime();
            const distance = target - now;

            if (distance < 0) {
                clearInterval(timer);
                return;
            }

            const h = Math.floor(distance / (1000 * 60 * 60)).toString().padStart(2, '0');
            const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0');
            const s = Math.floor((distance % (1000 * 60)) / 1000).toString().padStart(2, '0');

            setTimeLeft({ h, m, s });
        }, 1000);

        return () => clearInterval(timer);
    }, [deadline]);

    return (
        <div className="flex gap-4 font-mono text-4xl lg:text-5xl font-black">
            <div className="flex flex-col items-center">
                <span>{timeLeft.h}</span>
                <span className="text-[8px] uppercase tracking-widest text-white/40 mt-1">HRS</span>
            </div>
            <span className="text-white/30">:</span>
            <div className="flex flex-col items-center text-white/70">
                <span>{timeLeft.m}</span>
                <span className="text-[8px] uppercase tracking-widest text-white/40 mt-1">MIN</span>
            </div>
            <span className="text-white/30">:</span>
            <div className="flex flex-col items-center">
                <span>{timeLeft.s}</span>
                <span className="text-[8px] uppercase tracking-widest text-white/40 mt-1">SEC</span>
            </div>
        </div>
    );
}

export function PromoSection({ t }: { t: (key: string) => string }) {
    return (
        <section id='promo' className='bg-slate-900 p-12 lg:p-20 rounded-[4rem] relative overflow-hidden mx-4'>
            <div className='relative z-10 flex flex-col lg:flex-row gap-16 items-center'>
                <div className='flex-1 space-y-8 text-center lg:text-left'>
                    <span className='bg-amber-500/20 text-amber-500 px-5 py-2 rounded-full text-xs font-black uppercase tracking-[0.25em]'>{t("Promo.badge")}</span>
                    <h2 className='text-4xl lg:text-6xl font-black leading-tight text-white tracking-tight'>
                        {t("Promo.title_prefix")} <br/>
                        <span className='text-blue-400'>{t("Promo.title_highlight")}</span>
                    </h2>
                    <p className='text-slate-400 text-lg leading-relaxed max-w-2xl'>
                        {t("Promo.description_prefix")} <span className='text-blue-400 font-black'>{t("Promo.description_highlight")}</span> {t("Promo.description_suffix")}
                    </p>
                    <Button color='primary' size='lg' radius='lg' className='h-16 px-14 text-lg font-black bg-blue-600 shadow-xl shadow-blue-600/20'>
                        {t("Promo.button")}
                    </Button>
                </div>
                <div className='hidden lg:block flex-1 relative h-[500px] w-full rounded-[3.5rem] overflow-hidden ring-12 ring-white/5'>
                    <Image src="https://images.unsplash.com/photo-1543681534-75eb8bdbe9b8?q=80&w=2072&auto=format&fit=crop" alt='Promo' fill className='object-cover' />
                </div>
            </div>
        </section>
    );
}
