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
    <section id='hero' className='relative w-full min-h-[500px] lg:min-h-[700px] flex items-center justify-center overflow-hidden rounded-[2.5rem] md:rounded-[4.5rem] shadow-2xl animate-fade-in py-16 lg:py-0'>
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
                <div className='absolute inset-0 bg-black/25 z-10' />
            </>
          )}
        </div>
        <div className='relative z-20 w-full max-w-5xl px-6 flex flex-col items-center text-center'>
          <h1 className='text-5xl lg:text-7xl font-extrabold leading-[1.1] text-white tracking-tighter mb-6 drop-shadow-2xl uppercase'>
            {getLocalizedValue(content?.heroTitle, locale) || t("Hero.title_main")}
          </h1>
          <p className='text-lg lg:text-xl text-white font-medium max-w-2xl mb-12 drop-shadow-lg leading-relaxed'>
            {getLocalizedValue(content?.heroDescription, locale) || t("Hero.description")}
          </p>
          <div className='bg-white p-2 rounded-[2rem] lg:rounded-full shadow-2xl flex flex-col lg:flex-row items-center w-full max-w-4xl border border-gray-100/50'>
            <div className='w-full lg:flex-1 flex items-center px-8 py-3 lg:border-r border-gray-100 text-left'>
                <MapPin className='text-primary mr-4' size={20} />
                <div className="flex-1">
                     <p className='text-[10px] font-black text-gray-400 uppercase tracking-widest'>{t("Hero.search.location_label")}</p>
                     <input 
                        type="text" 
                        placeholder={getLocalizedValue(content?.ctaText, locale) || t("Hero.search.location_placeholder")}
                        className="w-full bg-transparent border-none outline-none text-sm font-bold text-slate-800 placeholder:text-slate-400"
                     />
                </div>
            </div>
            <div className='w-full lg:flex-1 flex items-center px-8 py-3 lg:border-r border-gray-100 text-left'>
                <Calendar className='text-primary mr-4' size={20} />
                <div>
                     <p className='text-[10px] font-black text-gray-400 uppercase tracking-widest'>{t("Hero.search.time_label")}</p>
                     <p className='text-sm font-bold text-slate-700'>{t("Hero.search.time_value")}</p>
                </div>
            </div>
            <Button color='primary' className='m-1 font-black h-16 px-12 rounded-full text-sm tracking-widest' startContent={<Search size={20}/>}>
                {getLocalizedValue(content?.buttonText, locale) || t("Hero.search.button")}
            </Button>
          </div>
        </div>
    </section>
  );
}
