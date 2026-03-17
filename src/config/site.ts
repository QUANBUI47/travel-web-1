export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Vivu",
  description:
    "Vivu — Đặt khách sạn, tour du lịch và trải nghiệm điểm đến Việt Nam. Giá tốt, đặt chỗ dễ dàng.",
  navItems: [
    { label: "Trang chủ", href: "/" },
    { label: "Điểm đến", href: "/#destinations" },
    { label: "Ưu đãi", href: "/#promo" },
    { label: "Tại sao chọn Vivu", href: "/#why-vivu" },
    { label: "Liên hệ", href: "/#footer" },
  ],
  navMenuItems: [
    { label: "Tài khoản", href: "/tai-khoan" },
    { label: "Đơn đặt của tôi", href: "/don-dat" },
    { label: "Đăng xuất", href: "/dang-xuat" },
  ],
  adminNavItems: [
    { label: "Tổng quan", href: "/admin" },
    { label: "Điểm đến", href: "/admin/destinations" },
    { label: "Khách sạn & Tour", href: "/admin/products" },
    { label: "Đơn đặt", href: "/admin/bookings" },
    { label: "SEO", href: "/admin/seo" },
  ],
  links: {
    facebook: "#",
    zalo: "#",
  },
};
