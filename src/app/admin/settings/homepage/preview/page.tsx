"use client";

import type { AbstractIntlMessages } from "next-intl";

import { useState, useEffect } from "react";
import { NextIntlClientProvider, useTranslations } from "next-intl";

import { Destination, HomeModule } from "@/types";
import { HeroSection } from "@/components/home/hero-section";
import { StatsSection } from "@/components/home/stats-section";
import { WhyVivuSection } from "@/components/home/why-vivu-section";
import { DestinationsSection } from "@/components/home/destinations-section";
import { PromotionSection } from "@/components/home/promotion-section";
import { StorytellingSection } from "@/components/home/storytelling-section";

export default function HomePreviewPage() {
  const [modules, setModules] = useState<HomeModule[]>([]);
  const [allDestinations, setAllDestinations] = useState<Destination[]>([]);
  const [currentLocale, setCurrentLocale] = useState("vi");
  const [messages, setMessages] = useState<AbstractIntlMessages | null>(null);

  useEffect(() => {
    // Load messages dynamically when locale changes
    const loadMessages = async (lang: string) => {
      const msg = (await import(`@/messages/${lang}.json`)).default;

      setMessages(msg);
    };

    loadMessages(currentLocale);
  }, [currentLocale]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === "VIVU_BUILDER_UPDATE") {
        setModules(event.data.modules || []);
        setAllDestinations(event.data.allDestinations || []);
        if (event.data.locale) {
          setCurrentLocale(event.data.locale);
        }
      }
    };

    window.addEventListener("message", handleMessage);

    // Request initial data
    window.parent.postMessage(
      { type: "VIVU_BUILDER_READY" },
      window.location.origin,
    );

    return () => window.removeEventListener("message", handleMessage);
  }, []);

  if (!messages) return null;

  return (
    <NextIntlClientProvider locale={currentLocale} messages={messages}>
      <PreviewContent
        allDestinations={allDestinations}
        locale={currentLocale}
        modules={modules}
      />
    </NextIntlClientProvider>
  );
}

function PreviewContent({
  modules,
  allDestinations,
  locale,
}: {
  modules: HomeModule[];
  allDestinations: Destination[];
  locale: string;
}) {
  const t = useTranslations("HomePage");

  return (
    <div className="w-full bg-white flex flex-col min-h-screen pb-32 overflow-x-hidden custom-scrollbar-hidden">
      <style
        dangerouslySetInnerHTML={{
          __html: `
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
      `,
        }}
      />
      <div className="flex flex-col w-full">
        {modules
          .filter((m) => m.isVisible)
          .map((module, index) => (
            <div key={module.id || index} className="w-full shrink-0">
              {module.type === "HERO" ? (
                <HeroSection
                  content={module.content}
                  layoutVariant={module.content.layoutVariant}
                  locale={locale}
                />
              ) : module.type === "STATS" ? (
                <StatsSection content={module.content} locale={locale} />
              ) : module.type === "WHY_VIVU" ? (
                <WhyVivuSection content={module.content} locale={locale} />
              ) : module.type === "DESTINATIONS" ? (
                <DestinationsSection
                  allDestinations={allDestinations}
                  content={module.content}
                  layoutPattern={module.content.layoutPattern}
                  locale={locale}
                  t={t}
                />
              ) : module.type === "PROMOTION" ||
                module.type === "FLASH_SALE" ? (
                <PromotionSection content={module.content} locale={locale} />
              ) : module.type === "STORYTELLING" ? (
                <StorytellingSection content={module.content} locale={locale} />
              ) : null}
            </div>
          ))}
      </div>

      <div className="mt-32 p-12 text-center text-[10px] font-black text-slate-300 uppercase tracking-widest bg-slate-50 border-t border-slate-100">
        Vivuvietnam © 2026 - Premium Travel Experiences
      </div>
    </div>
  );
}
