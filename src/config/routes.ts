/**
 * Centralized routes for the application
 */
export const ROUTES = {
  HOME: "/",
  DESTINATIONS: "/diem-den",
  HOTELS: "/khach-san",
  TOURS: "/tour",
  CONTACT: "/lien-he",
  
  // Auth
  LOGIN: "/dang-nhap",
  SIGNUP: "/dang-ky",
  
  // Admin
  ADMIN: {
    DASHBOARD: "/admin",
    LOGIN: "/admin/login",
    DESTINATIONS: "/admin/destinations",
    PRODUCTS: "/admin/products",
    BOOKINGS: "/admin/bookings",
    SEO: "/admin/seo",
  },
  
  // User
  USER: {
    PROFILE: "/tai-khoan",
    MY_BOOKINGS: "/don-dat",
  }
} as const;

export type AppLink = typeof ROUTES;
