"use client";

import { useTranslations } from "next-intl";

import { HeroSection } from "@/components/home/hero-section";
import { StatsSection } from "@/components/home/stats-section";
import { WhyVivuSection } from "@/components/home/why-vivu-section";
import { DestinationsSection } from "@/components/home/destinations-section";
import { PromotionSection } from "@/components/home/promotion-section";
import { StorytellingSection } from "@/components/home/storytelling-section";
import { TrendingSection } from "@/components/home/trending-section";
import { MapExplorationSection } from "@/components/home/map-exploration-section";
import { SocialFeedSection } from "@/components/home/social-feed-section";
import { CuratedCollectionsSection } from "@/components/home/curated-collections-section";
import { NewsletterSection } from "@/components/home/newsletter-section";
import { Destination, HomeModule, Tour } from "@/types";

type ModuleSectionProps = {
  module: HomeModule;
  locale: string;
  allDestinations: Destination[];
  featuredTours: Tour[];
};

export function HomeModuleSection({
  module,
  locale,
  allDestinations,
  featuredTours,
}: ModuleSectionProps) {
  const t = useTranslations("HomePage");

  switch (module.type) {
    case "HERO":
      return (
        <HeroSection
          content={module.content}
          destinations={allDestinations}
          layoutVariant={module.content.layoutVariant}
          locale={locale}
        />
      );
    case "STATS":
      return <StatsSection content={module.content} locale={locale} />;
    case "WHY_VIVU":
      return <WhyVivuSection content={module.content} locale={locale} />;
    case "DESTINATIONS":
      return (
        <DestinationsSection
          allDestinations={allDestinations}
          content={module.content}
          layoutPattern={module.content.layoutPattern}
          locale={locale}
          t={t}
        />
      );
    case "FLASH_SALE":
    case "PROMOTION":
      return <PromotionSection content={module.content} locale={locale} />;
    case "STORYTELLING":
    case "TESTIMONIALS":
      return <StorytellingSection content={module.content} locale={locale} />;
    case "TRENDING":
      return (
        <TrendingSection
          content={module.content}
          locale={locale}
          tours={featuredTours}
        />
      );
    case "MAP_EXPLORATION":
      return (
        <MapExplorationSection
          content={module.content}
          destinations={allDestinations}
        />
      );
    case "SOCIAL_FEED":
      return <SocialFeedSection content={module.content} locale={locale} />;
    case "CURATED_COLLECTIONS":
      return (
        <CuratedCollectionsSection
          content={module.content}
          locale={locale}
          tours={featuredTours}
        />
      );
    case "NEWSLETTER":
      return <NewsletterSection content={module.content} locale={locale} />;
    default:
      return null;
  }
}
