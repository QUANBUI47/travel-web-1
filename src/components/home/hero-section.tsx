"use client";

import { Search, MapPin, Calendar } from "lucide-react";
import { Button } from "@heroui/button";
import Image from "next/image";
import { getLocalizedValue } from "@/lib/utils/i18n";

interface HeroSectionProps {
  content: any;
  locale: string;
  t: (key: string, values?: any) => string;
}

export function HeroSection({ content, locale, t }: HeroSectionProps) {
  const isVideo = content?.type === 'video';
  const pool = content?.heroImages?.length ? content.heroImages : [
    "https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=2070&auto=format&fit=crop"
  ];
  const currentHero = pool[0];

  return (
    <section id='hero' className='relative w-full min-h-[450px] lg:min-h-[580px] flex items-center justify-center overflow-hidden rounded-[2rem] md:rounded-[3rem] shadow-xl animate-fade-in py-12 lg:py-0'>
        <div className='absolute inset-0 z-0'>
          {isVideo ? (
             <div className="absolute inset-0 bg-slate-900">
                {content.videoUrl && (
                    <video 
                        autoPlay 
                        muted 
                        loop 
                        playsInline 
                        poster={content.posterUrl}
                        className="w-full h-full object-cover opacity-60"
                    >
                        <source src={content.videoUrl} type="video/mp4" />
                    </video>
                )}
             </div>
          ) : (
            <>
                <Image src={currentHero} alt='Hero' fill className='object-cover' priority />
                <div className='absolute inset-0 bg-black/30 z-10' />
            </>
          )}
        </div>
        <div className='relative z-20 w-full max-w-4xl px-6 flex flex-col items-center text-center'>
          <h1 className='text-4xl lg:text-6xl font-extrabold leading-[1.1] text-white tracking-tight mb-4 uppercase drop-shadow-xl'>
            {getLocalizedValue(content?.heroTitle, locale) || t("Hero.title_main")}
          </h1>
          <p className='text-base lg:text-lg text-white/90 font-medium max-w-xl mb-10 drop-shadow-md leading-relaxed'>
            {getLocalizedValue(content?.heroDescription, locale) || t("Hero.description")}
          </p>
          <div className='bg-white p-1.5 rounded-2xl lg:rounded-full shadow-xl flex flex-col lg:flex-row items-center w-full max-w-3xl border border-gray-100/30'>
            <div className='w-full lg:flex-1 flex items-center px-6 py-2 lg:border-r border-gray-100/50 text-left'>
                <MapPin className='text-primary mr-3' size={18} />
                <div className="flex-1">
                     <p className='text-[8px] font-black text-gray-400 uppercase tracking-widest'>{t("Hero.search.location_label")}</p>
                     <input 
                        type="text" 
                        suppressHydrationWarning
                        placeholder={getLocalizedValue(content?.ctaText, locale) || t("Hero.search.location_placeholder")}
                        className="w-full bg-transparent border-none outline-none text-xs font-bold text-slate-800 placeholder:text-slate-300"
                     />
                </div>
            </div>
            <div className='w-full lg:flex-1 flex items-center px-6 py-2 lg:border-r border-gray-100/50 text-left'>
                <Calendar className='text-primary mr-3' size={18} />
                <div>
                     <p className='text-[8px] font-black text-gray-400 uppercase tracking-widest'>{t("Hero.search.time_label")}</p>
                     <p className='text-xs font-black text-slate-700'>{t("Hero.search.time_value")}</p>
                </div>
            </div>
            <Button 
                color='primary' 
                suppressHydrationWarning
                className='m-1 font-black h-14 px-10 rounded-xl lg:rounded-full text-xs tracking-widest shadow-lg shadow-primary/20' 
                startContent={<Search size={18}/>}
            >
                {getLocalizedValue(content?.buttonText, locale) || t("Hero.search.button")}
            </Button>
          </div>
        </div>
    </section>
  );
}
