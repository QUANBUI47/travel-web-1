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

interface HomeClientProps {
  initialData: any;
  allDestinations: any[];
}

export function HomeClient({ initialData, allDestinations }: HomeClientProps) {
  const locale = useLocale();
  const modules = useMemo(() => migrateToModules(initialData), [initialData]);

  return (
    <div className='flex flex-col gap-16 md:gap-20 xl:gap-24 py-6 md:py-8 pb-32 md:pb-40'>
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
      return <WhyVivuSection t={t} />;
    case 'DESTINATIONS':
      return (
        <DestinationsSection 
            content={module.content} 
            locale={locale} 
            t={t} 
            allDestinations={allDestinations}
        />
      );
    case 'PROMOTION':
      return <PromotionSection content={module.content} locale={locale} />;
    case 'PROMO':
      return <PromoSection t={t} />;
    default:
      return null;
  }
}
