export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Vivu",
  description:
    "Vivu — Đặt khách sạn, tour du lịch và trải nghiệm điểm đến Việt Nam. Giá tốt, đặt chỗ dễ dàng.",
  navItems: [
    { label: "home", href: "/" },
    { label: "destinations", href: "/#destinations" },
    { label: "promo", href: "/#promo" },
    { label: "why_vivu", href: "/#why-vivu" },
    { label: "contact", href: "/#footer" },
  ],
  navMenuItems: [
    { label: "account", href: "/tai-khoan" },
    { label: "bookings", href: "/don-dat" },
    { label: "logout", href: "/dang-xuat" },
  ],
  adminNavItems: [
    { label: "Bảng điều khiển", href: "/admin", icon: "LayoutDashboard" },
    { label: "Quản lý Tour", href: "/admin/tours", icon: "Palmtree" },
    { label: "Quản lý Điểm đến", href: "/admin/destinations", icon: "MapPin" },
    { label: "Đơn đặt chỗ", href: "/admin/bookings", icon: "BookCheck" },
    { label: "Khách hàng", href: "/admin/customers", icon: "Users" },
    { label: "Pháp lý & Bảo mật", href: "/admin/legal", icon: "ShieldCheck" },
    { 
      label: "Cài đặt hệ thống", 
      href: "/admin/settings", 
      icon: "Settings",
      children: [
        { label: "Trang chủ", href: "/admin/settings/homepage" },
        { label: "SEO & Meta", href: "/admin/settings/seo" },
        { label: "Hệ thống", href: "/admin/settings/system" },
      ]
    },
  ],
  links: {
    facebook: "#",
    zalo: "#",
  },
};
