"use client";

import { usePathname } from "next/navigation";
import NextLink from "next/link";
import { clsx } from "clsx";
import * as LucideIcons from "lucide-react";
import { ScrollShadow } from "@heroui/scroll-shadow";
import { Divider } from "@heroui/divider";
import Image from "next/image";
import { useTranslations } from "next-intl";

import { siteConfig, type AdminNavItem } from "@/config/site";
import { ROUTES } from "@/constants";
import { getAdminNavIcon } from "@/lib/admin/nav-icon";

export function AdminSidebar() {
  const pathname = usePathname();
  const t = useTranslations("Admin.Nav");

  return (
    <aside className="hidden lg:flex flex-col w-64 h-screen sticky top-0 border-r border-default-200 bg-default-50/50 backdrop-blur-xl">
      <div className="p-6">
        <NextLink
          className="flex items-center gap-2 group"
          href={ROUTES.ADMIN.HOME}
        >
          <Image
            alt="Vivu Admin Logo"
            className="group-hover:scale-110 transition-transform drop-shadow-md"
            height={32}
            src="/images/mini-logo-vivu.svg"
            width={32}
          />
          <span className="font-bold text-xl tracking-tight text-default-900">
            Vivu <span className="text-primary">{t("brand_admin")}</span>
          </span>
        </NextLink>
      </div>

      <Divider className="mx-6 w-auto" />

      <ScrollShadow className="flex-1 py-4 px-4 overflow-y-auto">
        <nav className="space-y-1">
          {siteConfig.adminNavItems.map((item: AdminNavItem) => {
            const Icon = getAdminNavIcon(item.icon);
            const items = item.children ?? [];
            const hasChildren = items.length > 0;
            const isActive =
              pathname === item.href ||
              (item.href !== ROUTES.ADMIN.HOME &&
                pathname.startsWith(item.href));

            return (
              <div key={item.href} className="space-y-1">
                <NextLink
                  className={clsx(
                    "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all group",
                    isActive && !hasChildren
                      ? "bg-primary text-white shadow-md shadow-primary/20"
                      : isActive
                        ? "text-primary bg-primary/5"
                        : "text-default-600 hover:bg-default-100 hover:text-default-900",
                  )}
                  href={item.href}
                >
                  <Icon
                    className={clsx(
                      isActive && !hasChildren
                        ? "text-white"
                        : "text-default-400 group-hover:text-primary",
                    )}
                    size={20}
                  />
                  <span className="flex-1">{t(item.labelKey)}</span>
                  {hasChildren && (
                    <LucideIcons.ChevronDown
                      className={clsx(
                        "transition-transform",
                        isActive ? "rotate-0" : "-rotate-90",
                      )}
                      size={14}
                    />
                  )}
                </NextLink>

                {hasChildren && isActive && (
                  <div className="ml-9 space-y-1 animate-in slide-in-from-top-2 duration-300">
                    {items.map((subItem) => {
                      const search =
                        typeof window !== "undefined"
                          ? window.location.search
                          : "";
                      const isSubActive =
                        pathname + search === subItem.href ||
                        (subItem.href.includes("?") &&
                          pathname === subItem.href.split("?")[0] &&
                          search === "?" + subItem.href.split("?")[1]);

                      return (
                        <NextLink
                          key={subItem.href}
                          className={clsx(
                            "flex items-center gap-3 px-4 py-2 rounded-lg text-xs font-medium transition-all",
                            isSubActive
                              ? "text-primary font-bold"
                              : "text-default-500 hover:text-default-900",
                          )}
                          href={subItem.href}
                        >
                          {t(subItem.labelKey)}
                        </NextLink>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </ScrollShadow>

      <div className="p-4 mt-auto">
        <button
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-default-500 hover:bg-danger/10 hover:text-danger transition-colors group w-full"
          onClick={async () => {
            const { logoutAdmin } = await import("@/actions/auth.actions");

            await logoutAdmin();
          }}
        >
          <LucideIcons.LogOut
            className="group-hover:rotate-180 transition-transform"
            size={20}
          />
          {t("logout")}
        </button>
      </div>
    </aside>
  );
}
