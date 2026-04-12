import { IMAGES } from "@/constants";
import { HomeModuleByType } from "@/types";

type HomeModuleContentByType = {
  [K in keyof HomeModuleByType]: HomeModuleByType[K]["content"];
};

export function createDefaultModule<T extends keyof HomeModuleByType>(
  type: T,
  id: string,
): HomeModuleByType[T] {
  const defaults: HomeModuleContentByType = {
    HERO: {
      type: "image",
      layoutVariant: "fullscreen",
      heroTitle: { vi: "Hành trình di sản", en: "Heritage Journey" },
      heroDescription: {
        vi: "Khám phá vẻ đẹp Việt Nam",
        en: "Discover Vietnam",
      },
      heroImages: [IMAGES.PLACEHOLDERS.HERO],
      ctaText: { vi: "Bạn muốn đi đâu?", en: "Where do you want to go?" },
      buttonText: { vi: "Khám phá ngay", en: "Explore Now" },
      searchSuggestions: [],
    },
    STATS: {
      items: [
        {
          label: { vi: "Khách hàng", en: "Customers" },
          value: "10,000+",
          icon: "Users",
        },
      ],
    },
    DESTINATIONS: {
      sectionTitle: { vi: "Điểm đến Hot", en: "Top Destinations" },
      selectedIds: [],
      layoutPattern: "grid",
    },
    WHY_VIVU: {
      sectionTitle: { vi: "Tại sao chọn Vivu?", en: "Why Choose Vivu?" },
      sectionSubtitle: { vi: "Hành trình tuyệt vời", en: "Great journeys" },
      featuredImage: IMAGES.PLACEHOLDERS.HERO,
      items: [
        {
          icon: "ShieldCheck",
          title: { vi: "An tâm", en: "Peace of Mind" },
          desc: { vi: "Bảo mật", en: "Secured" },
        },
      ],
    },
    PROMOTION: {
      content: { vi: "Khuyến mãi", en: "Promo" },
      deadline: "2026-12-31T23:59",
      theme: "gold",
      backgroundImage: IMAGES.PLACEHOLDERS.HERO,
    },
    FLASH_SALE: {
      content: { vi: "Flash Sale", en: "Flash Sale" },
      deadline: "2026-12-31T23:59",
      theme: "red",
      backgroundImage: IMAGES.PLACEHOLDERS.HERO,
    },
    STORYTELLING: {
      title: { vi: "Câu chuyện", en: "Stories" },
      items: [],
    },
    TESTIMONIALS: {
      title: { vi: "Đánh giá khách hàng", en: "Customer Testimonials" },
      items: [],
    },
    TRENDING: {
      title: { vi: "Xu hướng săn đón", en: "Trending Now" },
      subtitle: { vi: "Đừng bỏ lỡ", en: "Don't miss out" },
      selectedTourIds: [],
    },
    MAP_EXPLORATION: {
      title: { vi: "Bản đồ khám phá", en: "Interactive Map" },
      points: [],
    },
    SOCIAL_FEED: {
      title: { vi: "Vivu qua ống kính", en: "Vivu through the lens" },
      platform: "instagram",
      feedUrls: [],
    },
    CURATED_COLLECTIONS: {
      title: { vi: "Bộ sưu tập chọn lọc", en: "Curated Collections" },
      collections: [],
    },
    NEWSLETTER: {
      title: { vi: "Đăng ký nhận tin", en: "Join our newsletter" },
      subtitle: {
        vi: "Nhận ưu đãi 10% cho chuyến đi đầu tiên",
        en: "Get 10% off your first trip",
      },
      placeholder: {
        vi: "Nhập email của bạn",
        en: "Enter your email",
      },
      buttonText: {
        vi: "Đăng ký",
        en: "Subscribe",
      },
    },
  };

  return {
    id,
    type,
    isVisible: true,
    content: defaults[type],
  } as HomeModuleByType[T];
}
