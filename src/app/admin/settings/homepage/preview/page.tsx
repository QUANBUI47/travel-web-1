"use client";

import { useState, useEffect } from "react";
import { HomeModule } from "@/lib/types/builder";
import { useTranslations, useLocale } from "next-intl";
import { HeroSection } from "@/components/home/hero-section";
import { StatsSection } from "@/components/home/stats-section";
import { WhyVivuSection } from "@/components/home/why-vivu-section";
import { DestinationsSection } from "@/components/home/destinations-section";
import { PromotionSection, PromoSection } from "@/components/home/promotion-section";
import { StorytellingSection } from "@/components/home/storytelling-section";

export default function HomePreviewPage() {
  const [modules, setModules] = useState<HomeModule[]>([]);
  const [allDestinations, setAllDestinations] = useState<any[]>([]);
  const locale = useLocale();
  const t = useTranslations("HomePage");

  useEffect(() => {
    // Listen for messages from the parent window
    const handleMessage = (event: MessageEvent) => {
      // Security check in production would go here
      if (event.data?.type === "VIVU_BUILDER_UPDATE") {
        setModules(event.data.modules || []);
        setAllDestinations(event.data.allDestinations || []);
      }
    };

    window.addEventListener("message", handleMessage);
    
    // Request initial data
    window.parent.postMessage({ type: "VIVU_BUILDER_READY" }, "*");

    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return (
    <div className='w-full bg-white flex flex-col min-h-screen pb-32 overflow-x-hidden custom-scrollbar-hidden'>
      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar-hidden::-webkit-scrollbar {
          display: none;
        }
        .custom-scrollbar-hidden {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        body::-webkit-scrollbar {
          display: none;
        }
        body {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
      <div className='flex flex-col w-full'>
        {modules
          .filter((m) => m.isVisible)
          .map((module, index) => (
            <div key={module.id || index} className='w-full shrink-0'>
              {module.type === "HERO" ? (
                <HeroSection content={module.content} locale={locale} t={t} />
              ) : module.type === "STATS" ? (
                <StatsSection content={module.content} locale={locale} />
              ) : module.type === "WHY_VIVU" ? (
                <WhyVivuSection content={module.content} locale={locale} />
              ) : module.type === "DESTINATIONS" ? (
                <DestinationsSection
                  content={module.content}
                  locale={locale}
                  t={t}
                  allDestinations={allDestinations}
                />
              ) : module.type === "PROMOTION" || module.type === "FLASH_SALE" ? (
                <PromotionSection content={module.content} locale={locale} />
              ) : module.type === "STORYTELLING" ? (
                <StorytellingSection content={module.content} locale={locale} />
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
  );
}
