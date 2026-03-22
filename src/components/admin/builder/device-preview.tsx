"use client";

import { HomeModule } from "@/lib/types/builder";
import * as LucideIcons from "lucide-react";
import { cn } from "@/lib/utils/index";
import { useTranslations, useLocale } from "next-intl";
import { HeroSection } from "@/components/home/hero-section";
import { StatsSection } from "@/components/home/stats-section";
import { WhyVivuSection } from "@/components/home/why-vivu-section";
import { DestinationsSection } from "@/components/home/destinations-section";
import { PromotionSection } from "@/components/home/promotion-section";
import { PromoSection } from "@/components/home/promotion-section";

interface DevicePreviewProps {
  modules: HomeModule[];
  mode?: "desktop" | "mobile";
  allDestinations?: any[];
}

export function DevicePreview({
  modules,
  mode = "mobile",
  allDestinations = [],
}: DevicePreviewProps) {
  const isDesktop = mode === "desktop";
  const locale = useLocale();
  const t = useTranslations("HomePage");

  return (
    <div className='w-full h-full flex items-center justify-center animate-in fade-in duration-500 overflow-hidden p-0'>
      <div
        className={cn(
          "relative bg-white transition-all duration-500 flex flex-col mx-auto shrink-0 shadow-[0_48px_96px_-24px_rgba(0,0,0,0.35)]",
          isDesktop
            ? "w-full h-full"
            : "w-[440px] max-w-[95%] max-h-[95%] aspect-[440/952] rounded-[3.5rem] border-[10px] border-slate-900 overflow-hidden ring-1 ring-slate-800",
        )}
      >
        {isDesktop ? (
          /* Browser Header for Desktop Mode */
          <div className='h-12 bg-slate-50 border-b border-slate-200 flex items-center px-4 gap-4 shrink-0 z-[60]'>
            <div className='flex gap-1.5'>
              <div className='w-3 h-3 rounded-full bg-slate-200' />
              <div className='w-3 h-3 rounded-full bg-slate-200' />
              <div className='w-3 h-3 rounded-full bg-slate-200' />
            </div>
            <div className='flex-1 max-w-xl h-7 bg-white border border-slate-200 rounded-lg flex items-center px-3 gap-2 mx-auto'>
              <LucideIcons.Lock size={10} className='text-slate-400' />
              <div className='text-[10px] text-slate-400 font-medium truncate'>
                https://vivuvietnam.vn
              </div>
            </div>
            <div className='flex gap-3 text-slate-400'>
              <LucideIcons.RotateCw size={12} />
              <LucideIcons.MoreHorizontal size={14} />
            </div>
          </div>
        ) : (
          <>
            {/* iPhone 16 Pro Max Status Bar */}
            <div className='absolute top-0 left-0 right-0 h-10 flex items-center justify-between px-10 z-[60] text-black font-black text-[11px] tracking-tight'>
              <div className='pl-2'>9:41</div>
              <div className='flex items-center gap-1.5 pr-2'>
                <LucideIcons.Signal size={12} className='stroke-[2.5]' />
                <LucideIcons.Wifi size={12} className='stroke-[2.5]' />
                <div className='w-[18px] h-[9px] border-[1.5px] border-black rounded-[2.5px] relative'>
                  <div className='absolute top-[1.5px] left-[1.5px] bottom-[1.5px] right-[4px] bg-black rounded-[1px]' />
                  <div className='absolute -right-1 top-1/2 -translate-y-1/2 w-0.5 h-1 bg-black rounded-full' />
                </div>
              </div>
            </div>
            {/* Dynamic Island */}
            <div className='absolute top-3 left-1/2 -translate-x-1/2 w-[140px] h-8 bg-slate-900 rounded-full z-50 flex items-center justify-center gap-2 px-4 shadow-sm border border-slate-800/50 backdrop-blur-3xl'>
              <div className='w-10 h-1 bg-slate-800 rounded-full opacity-60' />
              <div className='w-2 h-2 bg-slate-800 rounded-full opacity-60' />
            </div>
          </>
        )}

        {/* Content Viewport */}
        <div
          className={cn(
            "w-full bg-white flex flex-col flex-1 overflow-y-auto",
            isDesktop ? "custom-scrollbar" : "scrollbar-hide pt-16",
          )}
        >
          <div className='flex flex-col gap-10 md:gap-16 lg:gap-24 w-full'>
            {modules
              .filter((m) => m.isVisible)
              .map((module, index) => (
                <div key={module.id || index} className='w-full shrink-0'>
                  {module.type === "HERO" ? (
                    <HeroSection content={module.content} locale={locale} t={t} />
                  ) : module.type === "STATS" ? (
                    <StatsSection content={module.content} locale={locale} />
                  ) : module.type === "WHY_VIVU" ? (
                    <WhyVivuSection t={t} />
                  ) : module.type === "DESTINATIONS" ? (
                    <DestinationsSection
                      content={module.content}
                      locale={locale}
                      t={t}
                      allDestinations={allDestinations}
                    />
                  ) : module.type === "PROMOTION" ? (
                    <PromotionSection content={module.content} locale={locale} />
                  ) : module.type === "PROMO" ? (
                    <PromoSection t={t} />
                  ) : null}
                </div>
              ))}
          </div>

          <div className='mt-32 p-12 text-center text-[10px] font-black text-slate-300 uppercase tracking-widest bg-slate-50 border-t border-slate-100'>
            Vivuvietnam © 2026 - Premium Travel Experiences
          </div>
        </div>
      </div>
    </div>
  );
}
