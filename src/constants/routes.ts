export const ROUTES = {
  HOME: "/",
  LOGIN: "/dang-nhap",
  REGISTER: "/dang-ky",
  REGISTER_VERIFY: "/dang-ky/xac-nhan-email",
  FORGOT_PASSWORD: "/quen-mat-khau",
  RESET_PASSWORD: "/dat-lai-mat-khau",
  DESTINATIONS: "/diem-den",
  HOTELS: "/khach-san",
  TOURS: "/tours",
  CONTACT: "/lien-he",
  TERMS: "/dieu-khoan-dich-vu",
  PRIVACY: "/chinh-sach-bao-mat",

  USER: {
    PROFILE: "/tai-khoan",
    MY_BOOKINGS: "/don-dat",
  },

  ADMIN: {
    HOME: "/portal",
    LOGIN: "/portal/login",
    TOURS: "/portal/tours",
    DESTINATIONS: "/portal/destinations",
    PRODUCTS: "/portal/products",
    CUSTOMERS: "/portal/customers",
    BOOKINGS: "/portal/bookings",
    SEO: "/portal/seo",
    SETTINGS: "/portal/settings",
    SETTINGS_HOMEPAGE: "/portal/settings/homepage",
    SETTINGS_HOMEPAGE_PREVIEW: "/portal/settings/homepage/preview",
    LEGAL: "/portal/legal",
  },
} as const;

/** Path builder — keep outside `as const` ROUTES (functions are stripped on client bundles). */
export function destinationDetailPath(slug: string): string {
  return `${ROUTES.DESTINATIONS}/${slug}`;
}

export type AppLink = typeof ROUTES;
