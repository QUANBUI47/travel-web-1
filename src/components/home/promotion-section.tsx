import { useState, useEffect } from "react";
import { Sparkles, Users, Gift, TrendingUp, ChevronRight } from "lucide-react";
import { Button } from "@heroui/button";
import Image from "next/image";
import { getLocalizedValue } from "@/lib/utils/i18n";
import { cn } from "@/lib/utils/index";
import { motion } from "framer-motion";

interface PromotionSectionProps {
  content: any;
  locale: string;
}

export function PromotionSection({ content, locale }: PromotionSectionProps) {
    const theme = content?.theme || 'gold';
    const text = getLocalizedValue(content?.content, locale);
    const deadlineStr = content?.deadline || '2026-12-31 23:59:59';
    const backgroundImage = content?.backgroundImage;

    // Debug log to check sync
    useEffect(() => {
        if (backgroundImage) {
            console.log("[PromotionSection] Background Image URL:", backgroundImage);
        }
        if (content?.content) {
            console.log("[PromotionSection] Raw Content:", content.content);
            console.log("[PromotionSection] Localized Text:", text);
        }
    }, [backgroundImage, content, text]);

    return (
        <section className="px-4 py-8">
            <div className={cn(
                "w-full p-6 sm:p-10 lg:p-12 rounded-3xl flex flex-col lg:flex-row items-center justify-between gap-8 relative overflow-hidden shadow-xl group transition-all duration-700",
                !backgroundImage && (
                    theme === 'gold' ? "bg-gradient-to-br from-amber-400 via-orange-500 to-rose-600 text-white" :
                    theme === 'blue' ? "bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-800 text-white" :
                    "bg-slate-900 text-white"
                ),
                backgroundImage && "bg-slate-900 text-white"
            )}>
                 {/* Background Image with Overlay */}
                 {backgroundImage && (
                    <div className="absolute inset-0 z-0">
                        <Image 
                            src={backgroundImage} 
                            alt="Background" 
                            fill 
                            priority
                            unoptimized
                            quality={100}
                            sizes="(max-width: 768px) 100vw, 80vw"
                            className="object-cover transition-transform duration-[5000ms] group-hover:scale-105" 
                        />
                        <div className="absolute inset-0 bg-black/50 lg:bg-black/40 z-0" />
                        <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-black/90 lg:from-black/80 via-black/20 to-transparent z-0" />
                    </div>
                 )}

                 {/* Decorative background elements (Only if no BG Image) */}
                 {!backgroundImage && (
                    <>
                        <div className="absolute -top-32 -right-32 w-64 lg:w-96 h-64 lg:h-96 bg-white/20 rounded-full blur-[60px] lg:blur-[100px] animate-pulse" />
                        <div className="absolute -bottom-32 -left-32 w-64 lg:w-80 h-64 lg:h-80 bg-black/20 rounded-full blur-[50px] lg:blur-[80px]" />
                        <div className="absolute top-1/2 left-1/4 w-24 lg:w-32 h-24 lg:h-32 bg-amber-200/20 rounded-full blur-[40px] lg:blur-[50px] animate-spin-slow" />
                    </>
                 )}
                 
                 {/* Floating Particles/Sparkles style */}
                 <div className="absolute inset-0 pointer-events-none opacity-30 z-0">
                    <Sparkles className="absolute top-6 left-6 text-white animate-bounce" size={16} />
                    <Sparkles className="absolute bottom-10 right-10 text-white animate-pulse" size={12} />
                    <Gift className="absolute top-20 right-1/4 text-white/20 -rotate-12 hidden sm:block" size={80} />
                 </div>

                 <div className="relative z-10 flex-1 text-center lg:text-left">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6 justify-center lg:justify-start"
                    >
                        <div className="p-1.5 sm:p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                            <TrendingUp className="text-white" size={16}/>
                        </div>
                        <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-[0.3em] sm:tracking-[0.4em] text-white/90">VIP FLASH SALE</span>
                    </motion.div>
                    
                    <motion.h2 
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tighter leading-tight sm:leading-tight lg:leading-[1.1] mb-6 sm:mb-8 drop-shadow-2xl uppercase italic"
                    >
                        {text || "Mùa hè rực rỡ - Ưu đãi hấp dẫn"}
                    </motion.h2>
                    <p className="text-white/80 font-bold uppercase tracking-widest text-[8px] sm:text-[10px] lg:text-xs">Ưu đãi giới hạn - Đặt ngay kẻo lỡ!</p>
                 </div>

                 <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                    className="relative z-10 flex flex-col items-center gap-4 sm:gap-6 bg-white/10 backdrop-blur-xl p-6 sm:p-8 lg:p-10 rounded-3xl border border-white/30 shadow-2xl w-full sm:w-auto min-w-[280px] sm:min-w-[300px]"
                 >
                    <div className="text-center space-y-1">
                        <p className="text-[8px] sm:text-[10px] font-black uppercase tracking-[0.3em] text-white/50">Thời gian còn lại</p>
                        <div className="h-1 w-8 sm:w-12 bg-white/20 mx-auto rounded-full" />
                    </div>
                    
                    <Countdown deadline={deadlineStr} />
                    
                    <Button 
                        radius="full" 
                        size="lg"
                        suppressHydrationWarning
                        className="w-full mt-2 sm:mt-4 h-14 sm:h-16 font-black tracking-[0.1em] sm:tracking-[0.2em] bg-white text-slate-900 shadow-xl shadow-black/10 hover:shadow-2xl hover:scale-105 active:scale-95 transition-all text-xs sm:text-sm"
                        endContent={<ChevronRight size={18} />}
                    >
                        NHẬN ƯU ĐÃI NGAY
                    </Button>
                 </motion.div>
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
        <div className="flex gap-2 sm:gap-4 font-mono text-2xl sm:text-4xl lg:text-5xl font-black tabular-nums">
            <div className="flex flex-col items-center w-[1.5em] sm:w-[1.8em]">
                <span className="drop-shadow-md text-center">{timeLeft.h}</span>
                <span className="text-[6px] sm:text-[9px] font-bold uppercase tracking-widest text-white/40 mt-1 sm:mt-2">H</span>
            </div>
            <span className="text-white/20 animate-pulse text-xl sm:text-3xl">:</span>
            <div className="flex flex-col items-center w-[1.5em] sm:w-[1.8em]">
                <span className="drop-shadow-md text-center">{timeLeft.m}</span>
                <span className="text-[6px] sm:text-[9px] font-bold uppercase tracking-widest text-white/40 mt-1 sm:mt-2">M</span>
            </div>
            <span className="text-white/20 animate-pulse text-xl sm:text-3xl">:</span>
            <div className="flex flex-col items-center w-[1.5em] sm:w-[1.8em] text-amber-300">
                <span className="drop-shadow-md text-center">{timeLeft.s}</span>
                <span className="text-[6px] sm:text-[9px] font-bold uppercase tracking-widest text-white/40 mt-1 sm:mt-2">S</span>
            </div>
        </div>
    );
}

export function PromoSection({ t }: { t: (key: string) => string }) {
    return (
        <section id='promo' className='px-4'>
            <div className='bg-slate-900 p-10 lg:p-16 rounded-3xl relative overflow-hidden group'>
                {/* Decorative gradients */}
                <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-blue-600/20 to-transparent pointer-events-none" />
                <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px]" />
                
                <div className='relative z-10 flex flex-col lg:flex-row gap-20 items-center'>
                    <motion.div 
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className='flex-1 space-y-10 text-center lg:text-left'
                    >
                        <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-[0.3em]">
                            <Sparkles size={14} />
                            {t("Promo.badge")}
                        </div>
                        
                        <h2 className='text-4xl lg:text-5xl font-black leading-[0.95] text-white tracking-tight uppercase italic'>
                            {t("Promo.title_prefix")} <br/>
                            <span className='bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent'>
                                {t("Promo.title_highlight")}
                            </span>
                        </h2>
                        
                        <p className='text-slate-400 text-base lg:text-lg leading-relaxed max-w-xl font-medium'>
                            {t("Promo.description_prefix")} <span className='text-white border-b-2 border-blue-500 pb-1'>{t("Promo.description_highlight")}</span> {t("Promo.description_suffix")}
                        </p>
                        
                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                            <Button 
                                color='primary' 
                                size='lg' 
                                className='h-20 px-16 text-xl font-black bg-blue-600 shadow-2xl shadow-blue-600/40 rounded-3xl hover:scale-105 transition-all uppercase tracking-widest'
                            >
                                {t("Promo.button")}
                            </Button>
                            <div className="flex -space-x-4 items-center justify-center lg:justify-start">
                                {[1,2,3,4].map(i => (
                                    <div key={i} className="w-12 h-12 rounded-full border-4 border-slate-900 bg-slate-800 overflow-hidden relative">
                                        <Image src={`https://i.pravatar.cc/150?u=${i}`} alt="User" fill />
                                    </div>
                                ))}
                                <div className="pl-6 text-sm font-bold text-slate-400 uppercase tracking-tighter">
                                    +2k {t("Promo.others_joined")}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                    
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
                        whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className='flex-1 relative h-[450px] w-full rounded-3xl overflow-hidden'
                    >
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent z-10" />
                        <Image 
                            src="https://images.unsplash.com/photo-1543681534-75eb8bdbe9b8?q=80&w=2072&auto=format&fit=crop" 
                            alt='Promo' 
                            fill 
                            className='object-cover transition-transform duration-[3000ms] group-hover:scale-110' 
                        />
                        <div className="absolute bottom-10 left-10 z-20 bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/20">
                            <p className="text-white text-3xl font-black italic">-50% OFF</p>
                            <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest">Limited Summer Pack</p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
