export const IMAGES = {
  // Brand
  LOGO: {
    LIGHT: "/images/vivu-logo.svg",
    DARK: "/images/vivu-logo-dark.svg",
  },

  // UI standard placeholders (Sạch, tone xám/neutral)
  PLACEHOLDERS: {
    // Avatar người dùng khi chưa có ảnh
    AVATAR:
      "https://ui-avatars.com/api/?name=User&background=F1F5F9&color=64748B",

    // Ảnh địa danh bị trống
    DESTINATION:
      "https://images.unsplash.com/photo-1549880338-65ddcdfd017b?q=80&w=1200&auto=format&fit=crop&blur=100", // Soft generic mountain placeholder

    // Ảnh module hero tĩnh mờ
    HERO: "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?q=80&w=2670&auto=format&fit=crop&blur=100", // Soft abstract background

    // Ảnh trống cho Tour (nếu có sau này)
    TOUR: "https://images.unsplash.com/photo-1549880338-65ddcdfd017b?q=80&w=1200&auto=format&fit=crop&blur=100",
  },
} as const;
