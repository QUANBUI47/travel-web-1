import { ROUTES } from "@/constants";

export type SiteConfig = typeof siteConfig;

/** Keys trong namespace `Navbar` (messages vi/en). */
export type NavbarLabelKey =
  | "destinations"
  | "tours"
  | "tours_heritage"
  | "tours_resort"
  | "tours_adventure"
  | "tours_event"
  | "region_north"
  | "region_central"
  | "region_south"
  | "region_international"
  | "promo"
  | "inspiration";

export interface NavChildItem {
  /** Display text or Navbar i18n key for static menus */
  label: string;
  href: string;
  imageUrl?: string;
}

export interface NavItem {
  label: NavbarLabelKey;
  href: string;
  children?: NavChildItem[];
}

export interface AdminNavItem {
  /** Translation key trong namespace Admin.Nav */
  labelKey: string;
  href: string;
  icon?: string;
  children?: { labelKey: string; href: string }[];
}

export const siteConfig = {
  name: "Vivu",
  /** Legacy default; prefer `Common.site_description` via next-intl */
  description: "Vivu — Book hotels, tours and experiences across Vietnam.",
  navItems: [
    {
      label: "destinations",
      href: "/diem-den",
      children: [
        { label: "region_north", href: "/diem-den?region=north" },
        { label: "region_central", href: "/diem-den?region=central" },
        { label: "region_south", href: "/diem-den?region=south" },
        {
          label: "region_international",
          href: "/diem-den?region=international",
        },
      ],
    },
    {
      label: "tours",
      href: "/tours",
      children: [
        { label: "tours_heritage", href: "/tours?type=heritage" },
        { label: "tours_resort", href: "/tours?type=resort" },
        { label: "tours_adventure", href: "/tours?type=adventure" },
        { label: "tours_event", href: "/tours?type=event" },
      ],
    },
    { label: "promo", href: "/khuyen-mai" },
    { label: "inspiration", href: "/cam-hung" },
  ] as NavItem[],
  navMenuItems: [
    { label: "account", href: ROUTES.USER.PROFILE },
    { label: "bookings", href: ROUTES.USER.MY_BOOKINGS },
    { label: "logout", href: "/dang-xuat" },
  ],
  adminNavItems: [
    {
      labelKey: "dashboard",
      href: ROUTES.ADMIN.HOME,
      icon: "LayoutDashboard",
    },
    { labelKey: "tours", href: ROUTES.ADMIN.TOURS, icon: "Palmtree" },
    {
      labelKey: "destinations",
      href: ROUTES.ADMIN.DESTINATIONS,
      icon: "MapPin",
    },
    { labelKey: "bookings", href: ROUTES.ADMIN.BOOKINGS, icon: "BookCheck" },
    { labelKey: "customers", href: ROUTES.ADMIN.CUSTOMERS, icon: "Users" },
    {
      labelKey: "legal",
      href: ROUTES.ADMIN.LEGAL,
      icon: "ShieldCheck",
    },
    {
      labelKey: "settings",
      href: ROUTES.ADMIN.SETTINGS,
      icon: "Settings",
      children: [
        {
          labelKey: "settings_homepage",
          href: `${ROUTES.ADMIN.SETTINGS}/homepage`,
        },
        { labelKey: "settings_seo", href: ROUTES.ADMIN.SEO },
        {
          labelKey: "settings_system",
          href: `${ROUTES.ADMIN.SETTINGS}/system`,
        },
      ],
    },
  ] as AdminNavItem[],
  links: {
    facebook: "#",
    zalo: "#",
  },
};
