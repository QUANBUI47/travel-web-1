import { z } from "zod";

/** Khớp với `ModuleType` trong `@/types/builder` */
const moduleTypeEnum = z.enum([
  "HERO",
  "STATS",
  "FLASH_SALE",
  "DESTINATIONS",
  "WHY_VIVU",
  "PROMOTION",
  "STORYTELLING",
  "TESTIMONIALS",
  "TRENDING",
  "MAP_EXPLORATION",
  "SOCIAL_FEED",
  "CURATED_COLLECTIONS",
  "NEWSLETTER",
]);

export const homeModuleSchema = z.object({
  id: z.string().min(1),
  type: moduleTypeEnum,
  isVisible: z.boolean(),
  /** Nội dung module (cấu trúc phụ thuộc `type`) */
  content: z.any(),
});

export const homeSettingsModulesSchema = z.array(homeModuleSchema);
