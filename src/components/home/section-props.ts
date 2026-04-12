import type {
  CuratedCollectionsContent,
  HeroContent,
  MapExplorationContent,
  NewsletterContent,
  PromotionContent,
  SocialFeedContent,
  StatsContent,
  StorytellingContent,
  TrendingContent,
  WhyVivuContent,
} from "@/types/builder";
import type { Destination, Tour } from "@/types";

export type BaseSectionProps<T> = {
  content: T;
  locale: string;
};

export type HeroSectionProps = BaseSectionProps<HeroContent> & {
  layoutVariant?: HeroContent["layoutVariant"];
  destinations?: Destination[];
};

export type StatsSectionProps = BaseSectionProps<StatsContent>;

export type WhyVivuSectionProps = BaseSectionProps<WhyVivuContent>;

export type PromotionSectionProps = BaseSectionProps<PromotionContent>;

export type StorytellingSectionProps = BaseSectionProps<StorytellingContent>;

export type TrendingSectionProps = BaseSectionProps<TrendingContent> & {
  tours?: Tour[];
};

export type MapExplorationSectionProps =
  BaseSectionProps<MapExplorationContent> & {
    destinations?: Destination[];
  };

export type SocialFeedSectionProps = BaseSectionProps<SocialFeedContent>;

export type CuratedCollectionsSectionProps =
  BaseSectionProps<CuratedCollectionsContent> & {
    tours?: Pick<Tour, "slug">[];
  };

export type NewsletterSectionProps = BaseSectionProps<NewsletterContent>;
