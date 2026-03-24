"use client";

import { useEffect } from "react";
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
  
  // Sync state to iframe when modules or destinations change
  useEffect(() => {
    const iframe = document.getElementById("preview-iframe") as HTMLIFrameElement;
    if (iframe?.contentWindow) {
      iframe.contentWindow.postMessage({
        type: "VIVU_BUILDER_UPDATE",
        modules,
        allDestinations
      }, "*");
    }
  }, [modules, allDestinations]);

  // Handle ready message from iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === "VIVU_BUILDER_READY") {
        const iframe = document.getElementById("preview-iframe") as HTMLIFrameElement;
        if (iframe?.contentWindow) {
          iframe.contentWindow.postMessage({
            type: "VIVU_BUILDER_UPDATE",
            modules,
            allDestinations
          }, "*");
        }
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [modules, allDestinations]);

  return (
    <div className='w-full h-full flex items-center justify-center animate-in fade-in duration-500 overflow-hidden p-0'>
      <div
        className={cn(
          "relative bg-white transition-all duration-500 flex flex-col mx-auto shrink-0 shadow-[0_48px_96px_-24px_rgba(0,0,0,0.35)]",
           isDesktop
            ? "w-full h-full"
            : "h-full max-h-full w-[400px] max-w-full aspect-[400/860] rounded-[3rem] border-[8px] border-slate-950 overflow-hidden ring-1 ring-slate-800 shadow-2xl",
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
            <div className='absolute top-0 left-0 right-0 h-12 flex items-center justify-between px-10 z-[60] text-black font-black text-[12px] tracking-tight pointer-events-none'>
              <div className='pl-2'>9:41</div>
              <div className='flex items-center gap-1.5 pr-2'>
                <LucideIcons.Signal size={14} className='stroke-[2.8]' />
                <LucideIcons.Wifi size={14} className='stroke-[2.8]' />
                <div className='w-[22px] h-[11px] border-[1.5px] border-black rounded-[3px] relative'>
                  <div className='absolute top-[1.5px] left-[1.5px] bottom-[1.5px] right-[4px] bg-black rounded-[1px]' />
                  <div className='absolute -right-1 top-1/2 -translate-y-1/2 w-0.5 h-1 bg-black rounded-full' />
                </div>
              </div>
            </div>
            {/* Dynamic Island */}
            <div className='absolute top-3 left-1/2 -translate-x-1/2 w-[120px] h-7 bg-black rounded-full z-[70] flex items-center justify-center gap-2 px-4 shadow-sm pointer-events-none'>
                <div className="absolute right-3 w-2 h-2 rounded-full bg-[#1a1a1a] border border-white/5" />
            </div>
          </>
        )}

        {/* Content Viewport - Using Iframe for media query isolation */}
        <iframe
          id="preview-iframe"
          src="/admin/settings/homepage/preview"
          className={cn(
            "w-full bg-white flex-1 border-none",
            isDesktop ? "" : "pt-12 rounded-b-[3.5rem]"
          )}
        />
      </div>
    </div>
  );
}
