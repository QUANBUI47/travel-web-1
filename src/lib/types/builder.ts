import { LocalizedValue } from "../utils/i18n";

export type ModuleType = 
  | 'HERO' 
  | 'STATS' 
  | 'FLASH_SALE' 
  | 'DESTINATIONS' 
  | 'WHY_VIVU' 
  | 'PROMO' 
  | 'PROMOTION'
  | 'TESTIMONIALS';

export interface HomeModule {
  id: string;
  type: ModuleType;
  isVisible: boolean;
  content: any;
}

export interface HomeBuilderData {
  modules: HomeModule[];
}

/**
 * Chuyển đổi dữ liệu phẳng cũ sang cấu trúc Module mới
 */
export function migrateToModules(oldData: any): HomeModule[] {
  if (oldData?.modules && Array.isArray(oldData.modules)) {
    return oldData.modules;
  }

  const modules: HomeModule[] = [];

  // 1. Hero Module
  if (oldData?.heroTitle || oldData?.heroDescription || oldData?.heroImages) {
    modules.push({
      id: 'hero_default',
      type: 'HERO',
      isVisible: true,
      content: {
        type: oldData.heroType || 'image',
        heroTitle: oldData.heroTitle,
        heroDescription: oldData.heroDescription,
        heroImages: oldData.heroImages || [],
        videoUrl: oldData.videoUrl || '',
        posterUrl: oldData.posterUrl || (oldData.heroImages?.length > 0 ? oldData.heroImages[0] : ''),
        ctaText: oldData.ctaText || 'Bạn muốn đi đâu?',
        buttonText: oldData.buttonText || 'Tìm kiếm'
      }
    });
  }

  // 2. Stats Module
  if (oldData?.statCustomers || oldData?.statTours || oldData?.items) {
    const items = oldData.items || [
        { label: { vi: 'Khách hàng', en: 'Customers' }, value: oldData.statCustomers || '10,000+' },
        { label: { vi: 'Tour du lịch', en: 'Tours' }, value: oldData.statTours || '500+' },
        { label: { vi: 'Tỉnh thành', en: 'Provinces' }, value: '63+' },
        { label: { vi: 'Đánh giá', en: 'Reviews' }, value: '4.9★' }
    ];

    modules.push({
      id: 'stats_default',
      type: 'STATS',
      isVisible: true,
      content: { items }
    });
  }

  // 3. Destinations (Default visible)
  modules.push({
    id: 'destinations_default',
    type: 'DESTINATIONS',
    isVisible: true,
    content: {
        sectionTitle: { vi: 'Điểm đến hàng đầu', en: 'Top Destinations' }
    }
  });

  // 4. Why Vivu (Default visible)
  modules.push({
    id: 'why_vivu_default',
    type: 'WHY_VIVU',
    isVisible: true,
    content: {}
  });

  // 5. Promotion (Default visible)
  modules.push({
    id: 'promotion_default',
    type: 'PROMOTION',
    isVisible: true,
    content: {
        content: { vi: 'Mùa hè rực rỡ tại Phú Quốc - Giảm đến 45%', en: 'Vibrant Summer in Phu Quoc - Up to 45% Off' },
        deadline: '2026-03-30 23:59:59',
        theme: 'gold'
    }
  });

  return modules;
}
