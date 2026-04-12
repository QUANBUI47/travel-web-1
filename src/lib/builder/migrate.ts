import { createDefaultModule } from "./defaults";
import { DEFAULT_MIGRATE_TYPES, sortModulesByOrder } from "./module-registry";

import { HomeModule, HeroContent, I18nString, StatsItem } from "@/types";

interface LegacyHomeData {
  modules?: HomeModule[];
  heroType?: HeroContent["type"];
  heroTitle?: I18nString;
  heroDescription?: I18nString;
  heroImages?: string[];
  videoUrl?: string;
  posterUrl?: string;
  ctaText?: I18nString;
  buttonText?: I18nString;
  statCustomers?: string;
  statTours?: string;
  items?: StatsItem[];
}

export function migrateToModules(oldData: unknown): HomeModule[] {
  let modules: HomeModule[] = [];
  const safeData = (oldData || {}) as LegacyHomeData;
  const hasSavedModules =
    Array.isArray(safeData.modules) && safeData.modules.length > 0;

  if (hasSavedModules) {
    modules = [...safeData.modules!];
  } else if (safeData.modules && Array.isArray(safeData.modules)) {
    modules = [];
  } else {
    if (safeData.heroTitle || safeData.heroDescription || safeData.heroImages) {
      const legacyHeroImages = safeData.heroImages || [];

      modules.push({
        id: "hero_default",
        type: "HERO",
        isVisible: true,
        content: {
          type: safeData.heroType || "image",
          layoutVariant: "fullscreen",
          heroTitle: safeData.heroTitle || { vi: "", en: "" },
          heroDescription: safeData.heroDescription || { vi: "", en: "" },
          heroImages: legacyHeroImages,
          videoUrl: safeData.videoUrl || "",
          posterUrl:
            safeData.posterUrl ||
            (legacyHeroImages.length > 0 ? legacyHeroImages[0] : ""),
          ctaText: safeData.ctaText || {
            vi: "Bạn muốn đi đâu?",
            en: "Where to?",
          },
          buttonText: safeData.buttonText || { vi: "Tìm kiếm", en: "Search" },
          searchSuggestions: [],
        },
      });
    }

    if (safeData.statCustomers || safeData.statTours || safeData.items) {
      const items = safeData.items || [
        {
          label: { vi: "Khách hàng", en: "Customers" },
          value: safeData.statCustomers || "10,000+",
        },
        {
          label: { vi: "Tour du lịch", en: "Tours" },
          value: safeData.statTours || "500+",
        },
        {
          label: { vi: "Tỉnh, thành phố", en: "Provinces & cities" },
          value: "34",
        },
        { label: { vi: "Đánh giá", en: "Reviews" }, value: "4.9★" },
      ];

      modules.push({
        id: "stats_default",
        type: "STATS",
        isVisible: true,
        content: { items },
      });
    }
  }

  if (!modules.some((m) => m.type === "HERO")) {
    modules.unshift(createDefaultModule("HERO", "hero_default"));
  }

  modules = modules.map((m) => {
    if (m.type !== "HERO") return m;

    const hasLayout = !!m.content.layoutVariant;
    const hasSuggestions =
      !!m.content.searchSuggestions && m.content.searchSuggestions.length > 0;

    if (!hasLayout || !hasSuggestions) {
      return {
        ...m,
        content: {
          ...m.content,
          layoutVariant: m.content.layoutVariant || "fullscreen",
          searchSuggestions: m.content.searchSuggestions || [],
        },
      };
    }

    return m;
  });

  for (const type of DEFAULT_MIGRATE_TYPES) {
    if (!modules.some((m) => m.type === type)) {
      modules.push(createDefaultModule(type, `${type.toLowerCase()}_default`));
    }
  }

  // Saved builder config keeps drag-and-drop order; legacy flat data uses registry order.
  if (hasSavedModules) {
    return modules;
  }

  return sortModulesByOrder(modules);
}
