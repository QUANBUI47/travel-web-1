export type ModuleType =
  | "HERO"
  | "STATS"
  | "FLASH_SALE"
  | "DESTINATIONS"
  | "WHY_VIVU"
  | "PROMOTION"
  | "STORYTELLING"
  | "TESTIMONIALS"
  | "TRENDING"
  | "MAP_EXPLORATION"
  | "SOCIAL_FEED"
  | "CURATED_COLLECTIONS"
  | "NEWSLETTER";

export interface I18nString {
  vi: string;
  en: string;
}

export type HeroLayoutVariant = "fullscreen" | "split" | "cinematic";

export interface HeroContent {
  type: "image" | "video";
  layoutVariant: HeroLayoutVariant;
  heroTitle: I18nString;
  heroDescription: I18nString;
  heroImages: string[];
  videoUrl?: string;
  posterUrl?: string;
  ctaText: I18nString;
  buttonText: I18nString;
  searchSuggestions: I18nString[];
  showPagination?: boolean;
  searchLocationLabel?: I18nString;
  searchLocationPlaceholder?: I18nString;
  searchDateLabel?: I18nString;
  searchDatePlaceholder?: I18nString;
}

export interface StatsItem {
  label: I18nString;
  value: string;
  icon?: string;
}

export interface StatsContent {
  items: StatsItem[];
}

export type DestinationsLayoutPattern = "grid" | "masonry" | "carousel";

export interface DestinationsContent {
  sectionTitle: I18nString;
  selectedIds: string[];
  layoutPattern: DestinationsLayoutPattern;
}

export interface WhyVivuItem {
  icon: string;
  title: I18nString;
  desc: I18nString;
  imageUrl?: string;
}

export interface WhyVivuContent {
  sectionTitle: I18nString;
  sectionSubtitle: I18nString;
  featuredImage: string;
  items: WhyVivuItem[];
}

export interface PromotionContent {
  content: I18nString;
  deadline: string;
  theme: "gold" | "red" | "blue" | string;
  backgroundImage?: string;
}

export interface StoryItem {
  author: string;
  role: string;
  quote: string;
  rating: number;
}

export interface StorytellingContent {
  title: I18nString;
  items: StoryItem[];
}

export interface TrendingContent {
  title: I18nString;
  subtitle?: I18nString;
  selectedTourIds: string[];
}

export interface MapPoint {
  id: string;
  lat: number;
  lng: number;
  title: I18nString;
  destinationId?: string;
}

export interface MapExplorationContent {
  title: I18nString;
  points: MapPoint[];
}

export interface SocialFeedContent {
  title: I18nString;
  platform: "instagram" | "facebook" | "tiktok";
  feedUrls: string[];
}

export interface CuratedCollectionItem {
  title: I18nString;
  description?: I18nString;
  imageUrl: string;
  link: string;
}

export interface CuratedCollectionsContent {
  title: I18nString;
  collections: CuratedCollectionItem[];
}

export interface NewsletterContent {
  title: I18nString;
  subtitle: I18nString;
  placeholder?: I18nString;
  buttonText?: I18nString;
}

export type HomeModule =
  | { id: string; type: "HERO"; isVisible: boolean; content: HeroContent }
  | { id: string; type: "STATS"; isVisible: boolean; content: StatsContent }
  | {
      id: string;
      type: "DESTINATIONS";
      isVisible: boolean;
      content: DestinationsContent;
    }
  | {
      id: string;
      type: "WHY_VIVU";
      isVisible: boolean;
      content: WhyVivuContent;
    }
  | {
      id: string;
      type: "PROMOTION";
      isVisible: boolean;
      content: PromotionContent;
    }
  | {
      id: string;
      type: "FLASH_SALE";
      isVisible: boolean;
      content: PromotionContent;
    }
  | {
      id: string;
      type: "STORYTELLING";
      isVisible: boolean;
      content: StorytellingContent;
    }
  | {
      id: string;
      type: "TESTIMONIALS";
      isVisible: boolean;
      content: StorytellingContent;
    }
  | {
      id: string;
      type: "TRENDING";
      isVisible: boolean;
      content: TrendingContent;
    }
  | {
      id: string;
      type: "MAP_EXPLORATION";
      isVisible: boolean;
      content: MapExplorationContent;
    }
  | {
      id: string;
      type: "SOCIAL_FEED";
      isVisible: boolean;
      content: SocialFeedContent;
    }
  | {
      id: string;
      type: "CURATED_COLLECTIONS";
      isVisible: boolean;
      content: CuratedCollectionsContent;
    }
  | {
      id: string;
      type: "NEWSLETTER";
      isVisible: boolean;
      content: NewsletterContent;
    };

export interface HomeBuilderData {
  modules: HomeModule[];
}

export type HomeModuleByType = {
  HERO: Extract<HomeModule, { type: "HERO" }>;
  STATS: Extract<HomeModule, { type: "STATS" }>;
  DESTINATIONS: Extract<HomeModule, { type: "DESTINATIONS" }>;
  WHY_VIVU: Extract<HomeModule, { type: "WHY_VIVU" }>;
  PROMOTION: Extract<HomeModule, { type: "PROMOTION" }>;
  FLASH_SALE: Extract<HomeModule, { type: "FLASH_SALE" }>;
  STORYTELLING: Extract<HomeModule, { type: "STORYTELLING" }>;
  TESTIMONIALS: Extract<HomeModule, { type: "TESTIMONIALS" }>;
  TRENDING: Extract<HomeModule, { type: "TRENDING" }>;
  MAP_EXPLORATION: Extract<HomeModule, { type: "MAP_EXPLORATION" }>;
  SOCIAL_FEED: Extract<HomeModule, { type: "SOCIAL_FEED" }>;
  CURATED_COLLECTIONS: Extract<HomeModule, { type: "CURATED_COLLECTIONS" }>;
  NEWSLETTER: Extract<HomeModule, { type: "NEWSLETTER" }>;
};
