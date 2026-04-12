import type { NavItem } from "@/config/site";

import { getTranslations, getLocale } from "next-intl/server";

import { NavbarUserActions } from "./navbar/navbar-user-actions";
import { NavbarClient } from "./navbar/navbar-client";

import {
  getCachedNavFeaturedDestinations,
  getCachedNavFeaturedTours,
  getCachedNavRegions,
} from "@/lib/cache/nav-cache";
import { destinationDetailPath } from "@/constants";
import { AuthService } from "@/services/auth.service";
import { AUTH_COOKIES } from "@/constants";

export async function Navbar() {
  const t = await getTranslations("Navbar");
  const locale = await getLocale();
  const { user: sessionUser, profile } = await AuthService.getCurrentSession(
    AUTH_COOKIES.PUBLIC,
  );

  // Fetch dynamic data for Navbar
  const [regions, latestTours, featuredDestinations] = await Promise.all([
    getCachedNavRegions(),
    getCachedNavFeaturedTours(),
    getCachedNavFeaturedDestinations(),
  ]);

  // TÁCH BIỆT: Admin sẽ KHÔNG ĐƯỢC tính là đã đăng nhập ở khu vực Client Navbar
  const isClientUser = sessionUser && profile?.role !== "ADMIN";
  const user = isClientUser ? sessionUser : null;

  // Construct dynamic nav items
  const dynamicNavItems: NavItem[] = [
    {
      label: "destinations" as const,
      href: "/diem-den",
      children: [
        ...regions.map((region) => ({
          label:
            locale === "vi" ? region.nameVi : region.nameEn || region.nameVi,
          href: `/diem-den?region=${region.slug}`,
          imageUrl:
            region.imageUrl ||
            "https://images.unsplash.com/photo-1599312151608-51f7871b67f3?q=80&w=2000",
        })),
        ...featuredDestinations.map((destination) => ({
          label:
            locale === "vi"
              ? destination.nameVi
              : destination.nameEn || destination.nameVi,
          href: destinationDetailPath(destination.slug),
          imageUrl: destination.imageUrl ?? undefined,
        })),
      ],
    },
    {
      label: "tours" as const,
      href: "/tours",
      children: latestTours.map((tour) => {
        const name = locale === "vi" ? tour.nameVi : tour.nameEn || tour.nameVi;
        const truncatedName =
          name.length > 35 ? name.substring(0, 35) + "..." : name;

        return {
          label: truncatedName,
          href: `/tours/${tour.slug}`,
          imageUrl: tour.imageUrls?.[0],
        };
      }),
    },
    { label: "promo" as const, href: "/khuyen-mai" },
    { label: "inspiration" as const, href: "/cam-hung" },
  ];

  return (
    <NavbarClient
      items={dynamicNavItems}
      userActions={<NavbarUserActions profile={profile} t={t} user={user} />}
    />
  );
}
