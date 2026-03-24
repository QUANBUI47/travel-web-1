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
  let modules: HomeModule[] = [];

  if (oldData?.modules && Array.isArray(oldData.modules)) {
    modules = [...oldData.modules];
  } else {
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

    // 3. Destinations
    modules.push({
        id: 'destinations_default',
        type: 'DESTINATIONS',
        isVisible: true,
        content: { sectionTitle: { vi: 'Điểm đến hàng đầu', en: 'Top Destinations' } }
    });

    // 4. Why Vivu
    modules.push({
        id: 'why_vivu_default',
        type: 'WHY_VIVU',
        isVisible: true,
        content: {} // Sẽ được patch bên dưới
    });

    // 5. Promotion
    modules.push({
        id: 'promotion_default',
        type: 'PROMOTION',
        isVisible: true,
        content: {
            content: { vi: 'Mùa hè rực rỡ tại Phú Quốc - Giảm đến 45%', en: 'Vibrant Summer in Phu Quoc - Up to 45% Off' },
            deadline: '2026-03-30 23:59:59',
            theme: 'gold',
            backgroundImage: ''
        }
    });
  }

  // PATCHING: Đảm bảo các module luôn có dữ liệu mặc định nếu content trống
  return modules.map(m => {
      // Patch Why Vivu
      if (m.type === 'WHY_VIVU' && (!m.content?.items || m.content.items.length === 0)) {
          return {
              ...m,
              content: {
                  ...m.content,
                  sectionTitle: m.content?.sectionTitle || { vi: 'Tại sao nên chọn Vivu?', en: 'Why Choose Vivu?' },
                  sectionSubtitle: m.content?.sectionSubtitle || { vi: 'Hành trình tuyệt vời bắt đầu từ sự tin tưởng và trọn vẹn trong từng dịch vụ.', en: 'Great journeys start with trust and perfection in every service.' },
                  items: m.content?.items?.length > 0 ? m.content.items : [
                    { 
                        icon: 'ShieldCheck', 
                        imageUrl: '',
                        title: { vi: 'An tâm tuyệt đối', en: 'Total Peace of Mind' }, 
                        desc: { vi: 'Mọi giao dịch và dịch vụ đều được bảo mật và cam kết chất lượng cao nhất.', en: 'Every transaction and service is secured with our highest quality commitment.' } 
                    },
                    { 
                        icon: 'Clock', 
                        imageUrl: '',
                        title: { vi: 'Hỗ trợ 24/7', en: '24/7 Support' }, 
                        desc: { vi: 'Đội ngũ chuyên gia luôn sẵn sàng đồng hành cùng bạn trên mọi hành trình.', en: 'Our team of experts is always ready to accompany you on every journey.' } 
                    },
                    { 
                        icon: 'Map', 
                        imageUrl: '',
                        title: { vi: 'Trải nghiệm bản địa', en: 'Local Experiences' }, 
                        desc: { vi: 'Khám phá những góc nhìn chân thực và độc đáo nhất tại mỗi điểm đến.', en: 'Discover the most authentic and unique perspectives at every destination.' } 
                    },
                  ]
              }
          };
      }
      return m;
  });
}
