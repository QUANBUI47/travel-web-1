"use client";

import type { User as SupabaseUser } from "@supabase/supabase-js";
import type { UserProfile } from "@/types/auth";

import { usePathname } from "next/navigation";
import {
  Navbar,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
} from "@heroui/navbar";
import { User } from "@heroui/user";
import { useState } from "react";
import * as LucideIcons from "lucide-react";
import NextLink from "next/link";
import { clsx } from "clsx";
import { useTranslations } from "next-intl";

import { AdminSidebar } from "./sidebar";

import { siteConfig, type AdminNavItem } from "@/config/site";
import { ROUTES } from "@/constants";
import { getAdminNavIcon } from "@/lib/admin/nav-icon";

export default function AdminLayoutClient({
  children,
  user,
  profile,
}: {
  children: React.ReactNode;
  user?: SupabaseUser | null;
  profile?: UserProfile | null;
}) {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const t = useTranslations("Admin.Layout");
  const tNav = useTranslations("Admin.Nav");

  const isLoginPage = pathname === ROUTES.ADMIN.LOGIN;
  const isPreviewPage =
    pathname === `${ROUTES.ADMIN.SETTINGS}/homepage/preview`;

  if (isLoginPage || isPreviewPage) {
    return <>{children}</>;
  }

  const displayName = profile?.displayName || "Administrator";
  const email = user?.email || "admin@vivu.com";
  const avatarUrl =
    profile?.avatarUrl ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=random`;

  return (
    <div className="flex bg-default-50/30 min-h-screen">
      <AdminSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar
          className="bg-white/70 backdrop-blur-md border-b border-default-100 h-16 px-6"
          isBordered={false}
          isMenuOpen={isMenuOpen}
          maxWidth="full"
          position="sticky"
          onMenuOpenChange={setIsMenuOpen}
        >
          <NavbarContent className="lg:hidden" justify="start">
            <NavbarMenuToggle />
          </NavbarContent>

          <NavbarContent className="hidden lg:flex gap-4" justify="start">
            <NavbarItem className="font-medium text-default-500">
              {t("navbar_tagline")}
            </NavbarItem>
          </NavbarContent>

          <NavbarContent className="gap-4" justify="end">
            <NavbarItem>
              <User
                avatarProps={{
                  src: avatarUrl,
                  size: "sm",
                  isBordered: true,
                  color: "primary",
                }}
                className="cursor-pointer hover:opacity-80 transition-opacity"
                description={email}
                name={displayName}
              />
            </NavbarItem>
          </NavbarContent>

          {/* Mobile Menu (Drawer) */}
          <NavbarMenu className="pt-6 gap-2">
            {siteConfig.adminNavItems.map((item: AdminNavItem) => {
              const Icon = getAdminNavIcon(item.icon);
              const items = item.children || [];
              const hasChildren = items.length > 0;
              const isActive =
                pathname === item.href ||
                (item.href !== ROUTES.ADMIN.HOME &&
                  pathname.startsWith(item.href));

              return (
                <div key={item.href} className="w-full">
                  <NextLink
                    className={clsx(
                      "flex items-center gap-3 px-4 py-3 rounded-xl w-full font-medium transition-all",
                      isActive && !hasChildren
                        ? "bg-primary text-white"
                        : isActive
                          ? "text-primary bg-primary/5"
                          : "text-default-600 hover:bg-default-100",
                    )}
                    href={item.href}
                    onClick={() => !hasChildren && setIsMenuOpen(false)}
                  >
                    <Icon size={20} />
                    <span className="flex-1">{tNav(item.labelKey)}</span>
                    {hasChildren && (
                      <LucideIcons.ChevronDown
                        className={isActive ? "" : "-rotate-90"}
                        size={14}
                      />
                    )}
                  </NextLink>

                  {hasChildren && isActive && (
                    <div className="ml-9 mt-1 space-y-1">
                      {items.map((subItem) => (
                        <NextLink
                          key={subItem.href}
                          className={clsx(
                            "flex items-center gap-3 px-4 py-2 rounded-xl w-full text-sm transition-all",
                            pathname +
                              (typeof window !== "undefined"
                                ? window.location.search
                                : "") ===
                              subItem.href
                              ? "text-primary font-bold"
                              : "text-default-500 hover:bg-default-50",
                          )}
                          href={subItem.href}
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {tNav(subItem.labelKey)}
                        </NextLink>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
            <NavbarMenuItem className="mt-auto pb-8">
              <button
                className="flex items-center gap-3 px-4 py-3 text-danger font-bold w-full"
                onClick={async () => {
                  const { logoutAdmin } = await import(
                    "@/actions/auth.actions"
                  );

                  await logoutAdmin();
                }}
              >
                <LucideIcons.LogOut size={20} />
                {t("logout")}
              </button>
            </NavbarMenuItem>
          </NavbarMenu>
        </Navbar>

        <main
          className={clsx(
            "flex-1 overflow-auto w-full",
            pathname === `${ROUTES.ADMIN.SETTINGS}/homepage`
              ? "p-0"
              : "p-6 lg:p-10",
            !pathname.startsWith(ROUTES.ADMIN.SETTINGS) && "max-w-7xl mx-auto",
          )}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
