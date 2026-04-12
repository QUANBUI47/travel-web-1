import type { LucideIcon } from "lucide-react";

import {
  BarChart3,
  Box,
  Flame,
  Heart,
  Instagram,
  Layers,
  Mail,
  MapIcon,
  MapPin,
  Monitor,
  ShieldCheck,
  Zap,
} from "lucide-react";

import { ModuleType } from "@/types";

export interface ModuleMeta {
  type: ModuleType;
  /** Key trong namespace Admin.Builder.modules */
  labelKey: ModuleType;
  icon: LucideIcon;
  /** Có thể thêm từ sidebar (HERO luôn có sẵn, không addable). */
  addable: boolean;
  /** Module cố định đầu danh sách, không reorder. */
  locked?: boolean;
}

/** Thứ tự mặc định khi migrate / sort modules. */
export const MODULE_ORDER: ModuleType[] = [
  "HERO",
  "STATS",
  "TRENDING",
  "DESTINATIONS",
  "MAP_EXPLORATION",
  "WHY_VIVU",
  "STORYTELLING",
  "TESTIMONIALS",
  "FLASH_SALE",
  "PROMOTION",
  "SOCIAL_FEED",
  "CURATED_COLLECTIONS",
  "NEWSLETTER",
];

export const MODULE_REGISTRY: ModuleMeta[] = [
  {
    type: "HERO",
    labelKey: "HERO",
    icon: Monitor,
    addable: false,
    locked: true,
  },
  {
    type: "STATS",
    labelKey: "STATS",
    icon: BarChart3,
    addable: true,
  },
  {
    type: "TRENDING",
    labelKey: "TRENDING",
    icon: Flame,
    addable: true,
  },
  {
    type: "DESTINATIONS",
    labelKey: "DESTINATIONS",
    icon: MapPin,
    addable: true,
  },
  {
    type: "MAP_EXPLORATION",
    labelKey: "MAP_EXPLORATION",
    icon: MapIcon,
    addable: true,
  },
  {
    type: "WHY_VIVU",
    labelKey: "WHY_VIVU",
    icon: ShieldCheck,
    addable: true,
  },
  {
    type: "STORYTELLING",
    labelKey: "STORYTELLING",
    icon: Heart,
    addable: true,
  },
  {
    type: "TESTIMONIALS",
    labelKey: "TESTIMONIALS",
    icon: Heart,
    addable: true,
  },
  {
    type: "FLASH_SALE",
    labelKey: "FLASH_SALE",
    icon: Zap,
    addable: false,
  },
  {
    type: "PROMOTION",
    labelKey: "PROMOTION",
    icon: Zap,
    addable: true,
  },
  {
    type: "SOCIAL_FEED",
    labelKey: "SOCIAL_FEED",
    icon: Instagram,
    addable: true,
  },
  {
    type: "CURATED_COLLECTIONS",
    labelKey: "CURATED_COLLECTIONS",
    icon: Layers,
    addable: true,
  },
  {
    type: "NEWSLETTER",
    labelKey: "NEWSLETTER",
    icon: Mail,
    addable: true,
  },
];

export const MODULE_META_BY_TYPE = Object.fromEntries(
  MODULE_REGISTRY.map((m) => [m.type, m]),
) as Record<ModuleType, ModuleMeta>;

export const ADDABLE_MODULES = MODULE_REGISTRY.filter((m) => m.addable);

export function getModuleMeta(type: ModuleType): ModuleMeta {
  return (
    MODULE_META_BY_TYPE[type] ?? {
      type,
      labelKey: type,
      icon: Box,
      addable: false,
    }
  );
}

export function sortModulesByOrder<T extends { type: ModuleType }>(
  modules: T[],
): T[] {
  return [...modules].sort(
    (a, b) => MODULE_ORDER.indexOf(a.type) - MODULE_ORDER.indexOf(b.type),
  );
}

/** Module mặc định được migrate thêm nếu thiếu (theo thứ tự ưu tiên). */
export const DEFAULT_MIGRATE_TYPES: ModuleType[] = [
  "TRENDING",
  "DESTINATIONS",
  "MAP_EXPLORATION",
  "WHY_VIVU",
  "PROMOTION",
  "STORYTELLING",
  "SOCIAL_FEED",
  "CURATED_COLLECTIONS",
  "NEWSLETTER",
];
