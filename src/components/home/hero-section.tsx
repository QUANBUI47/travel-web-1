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
    <div className='w-full'>
        <header id='hero' className='relative w-full h-[700px] lg:h-[850px] flex items-center justify-center overflow-hidden animate-fade-in mb-0 rounded-b-[4rem] lg:rounded-b-[6rem] shadow-2xl shadow-slate-200/50'>
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
                <div className='absolute inset-0 bg-black/40 z-10' />
             </>
          )}
        </div>
        
        <div className='relative z-20 w-full max-w-4xl px-4 md:px-6 flex flex-col items-center text-center'>
            <h1 className='text-3xl md:text-5xl lg:text-6xl font-black leading-[1.3] md:leading-[1.1] text-white tracking-tight mb-6 lg:mb-8 uppercase drop-shadow-2xl'>
               {getLocalizedValue(content?.heroTitle, locale) || "Hành trình Vivu của bạn"}
            </h1>
            
            {/* Reverting to a more compact search bar */}
            <div className='bg-white/95 backdrop-blur-md p-3 lg:p-2 rounded-3xl lg:rounded-full shadow-2xl flex flex-col lg:flex-row items-center w-full max-w-3xl border border-white/20 gap-2 lg:gap-0'>
                <div className='w-full lg:flex-1 flex items-center px-6 py-4 lg:py-3 border-b lg:border-b-0 lg:border-r border-slate-100 text-left bg-white/50 lg:bg-transparent rounded-2xl lg:rounded-none transition-colors'>
                    <MapPin className='text-primary mr-3' size={20} />
                    <div className="flex-1">
                         <p className='text-[8px] lg:text-[9px] font-black text-slate-400 uppercase tracking-widest'>Điểm đến</p>
                         <p className="text-xs lg:text-sm font-bold text-slate-800">Bạn muốn đi đâu?</p>
                    </div>
                </div>
                <div className='w-full lg:flex-1 flex items-center px-6 py-3 text-left'>
                    <Calendar className='text-primary mr-3' size={20} />
                    <div>
                         <p className='text-[9px] font-black text-slate-400 uppercase tracking-widest'>Thời gian</p>
                         <p className='text-sm font-bold text-slate-800'>Chọn ngày khởi hành</p>
                    </div>
                </div>
                <Button 
                    color='primary' 
                    suppressHydrationWarning
                    className='m-1 font-black h-14 px-10 rounded-xl lg:rounded-full text-xs tracking-widest shadow-lg shadow-primary/20 w-full lg:w-auto' 
                    startContent={<Search size={18} strokeWidth={3}/>}
                >
                    TÌM KIẾM
                </Button>
            </div>
        </div>
    </header>
    </div>
  );
}
