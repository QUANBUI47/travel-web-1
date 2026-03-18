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
    { label: "Bảng điều khiển", href: "/admin", icon: "LayoutDashboard" },
    { label: "Quản lý Tour", href: "/admin/tours", icon: "Palmtree" },
    { label: "Đơn đặt chỗ", href: "/admin/bookings", icon: "BookCheck" },
    { label: "Khách hàng", href: "/admin/customers", icon: "Users" },
    { label: "Pháp lý & Bảo mật", href: "/admin/legal", icon: "ShieldCheck" },
    { label: "Cài đặt hệ thống", href: "/admin/settings", icon: "Settings" },
  ],
  links: {
    facebook: "#",
    zalo: "#",
  },
};
