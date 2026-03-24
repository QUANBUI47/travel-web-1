"use client";

import { useMemo, useState, useEffect } from "react";
import {
  Search,
  MapPin,
  Calendar,
  Users,
  ShieldCheck,
  Clock,
  Map,
  Star,
  ChevronRight,
} from "lucide-react";
import { Button } from "@heroui/button";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { getLocalizedValue } from "@/lib/utils/i18n";
import { HomeModule, migrateToModules } from "@/lib/types/builder";
import { HeroSection } from "@/components/home/hero-section";
import { StatsSection } from "@/components/home/stats-section";
import { WhyVivuSection } from "@/components/home/why-vivu-section";
import { DestinationsSection } from "@/components/home/destinations-section";
import { PromotionSection } from "@/components/home/promotion-section";
import { PromoSection } from "@/components/home/promotion-section";
import { StorytellingSection } from "@/components/home/storytelling-section";

interface HomeClientProps {
  initialData: any;
  allDestinations: any[];
}

export function HomeClient({ initialData, allDestinations }: HomeClientProps) {
  const locale = useLocale();
  const modules = useMemo(() => migrateToModules(initialData), [initialData]);

  return (
    <div className='flex flex-col py-4 md:py-6 pb-12 md:pb-16'>
      {modules.filter(m => m.isVisible).map((module, index) => (
        <ModuleRenderer 
            key={module.id || index} 
            module={module} 
            locale={locale} 
            allDestinations={allDestinations}
        />
      ))}
    </div>
  );
}

function ModuleRenderer({ 
    module, 
    locale, 
    allDestinations 
}: { 
    module: HomeModule; 
    locale: string;
    allDestinations: any[];
}) {
  const t = useTranslations("HomePage");

  switch (module.type) {
    case 'HERO':
      return <HeroSection content={module.content} locale={locale} t={t} />;
    case 'STATS':
      return <StatsSection content={module.content} locale={locale} />;
    case 'WHY_VIVU':
      return <WhyVivuSection content={module.content} locale={locale} />;
    case 'DESTINATIONS':
      return (
        <DestinationsSection 
            content={module.content} 
            locale={locale} 
            t={t} 
            allDestinations={allDestinations}
        />
      );
    case 'FLASH_SALE':
    case 'PROMOTION':
      return <PromotionSection content={module.content} locale={locale} />;
    case 'PROMO':
      return <PromoSection t={t} />;
    case 'STORYTELLING':
      return <StorytellingSection content={module.content} locale={locale} />;
    default:
      return null;
  }
}
