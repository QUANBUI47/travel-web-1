export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "ViVu",
  description:
    "ViVu — Đặt khách sạn, tour du lịch và trải nghiệm điểm đến Việt Nam. Giá tốt, đặt chỗ dễ dàng.",
  navItems: [
    { label: "Trang chủ", href: "/" },
    { label: "Điểm đến", href: "/diem-den" },
    { label: "Khách sạn", href: "/khach-san" },
    { label: "Tour", href: "/tour" },
    { label: "Liên hệ", href: "/lien-he" },
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
