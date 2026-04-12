"use client";

import { useState } from "react";
import NextLink from "next/link";
import { NavbarItem, NavbarMenuItem } from "@heroui/navbar";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

import { Megamenu } from "@/components/navbar/megamenu";
import { NavItem } from "@/config/site";
import { ROUTES } from "@/constants";

interface NavLinksProps {
  items: NavItem[];
  isTransparent?: boolean;
}

// ── DESKTOP ────────────────────────────────────────────────────────────────────
export function DesktopNavLinks({
  items,
  isTransparent = false,
}: NavLinksProps) {
  const t = useTranslations("Navbar");
  const pathname = usePathname();

  return (
    <ul className="hidden lg:flex gap-8 justify-start ml-20 items-center">
      {items.map((item) => {
        const isActive =
          pathname === item.href ||
          (item.children?.some((c) => pathname.startsWith(c.href)) ?? false);

        const label = t(item.label);

        // Items with children → render Megamenu
        if (item.children && item.children.length > 0) {
          return (
            <NavbarItem key={item.href}>
              <Megamenu
                isActive={isActive}
                isTransparent={isTransparent}
                item={item}
                label={label}
              />
            </NavbarItem>
          );
        }

        // Simple link
        return (
          <NavbarItem key={item.href}>
            <NextLink
              className={clsx(
                "text-xs font-black uppercase transition-all duration-300 relative group cursor-pointer",
                isActive
                  ? "text-primary"
                  : isTransparent
                    ? "text-white/80 hover:text-white"
                    : "text-foreground/60 hover:text-primary",
              )}
              href={item.href}
            >
              {label}
              <span
                className={clsx(
                  "absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full",
                  isActive ? "w-full" : "",
                )}
              />
            </NextLink>
          </NavbarItem>
        );
      })}
    </ul>
  );
}

// ── MOBILE ─────────────────────────────────────────────────────────────────────
export function MobileNavLinks({ items }: NavLinksProps) {
  const t = useTranslations("Navbar");
  const pathname = usePathname();
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);

  const toggleAccordion = (href: string) => {
    setOpenAccordion((prev) => (prev === href ? null : href));
  };

  return (
    <div className="mx-4 mt-1 flex flex-col gap-1">
      {items.map((item, index) => {
        const isActive =
          pathname === item.href ||
          (item.children?.some((c) => pathname.startsWith(c.href)) ?? false);

        const label = t(item.label);
        const isExpanded = openAccordion === item.href;

        // Items with children → Accordion
        if (item.children && item.children.length > 0) {
          return (
            <NavbarMenuItem key={`${item.href}-${index}`}>
              {/* Accordion header */}
              <button
                aria-expanded={isExpanded}
                className={clsx(
                  "flex items-center justify-between w-full text-lg py-3 font-bold transition-colors cursor-pointer",
                  isActive ? "text-primary" : "text-foreground",
                )}
                onClick={() => toggleAccordion(item.href)}
              >
                {label}
                <ChevronDown
                  className={clsx(
                    "transition-transform duration-200",
                    isExpanded ? "rotate-180" : "rotate-0",
                  )}
                  size={18}
                />
              </button>

              {/* Accordion body */}
              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div
                    key="accordion-content"
                    animate={{ height: "auto", opacity: 1 }}
                    className="overflow-hidden"
                    exit={{ height: 0, opacity: 0 }}
                    initial={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                  >
                    <div className="pl-4 pb-2 flex flex-col gap-1 border-l-2 border-primary/20 ml-2">
                      {item.children.map((child) => (
                        <NextLink
                          key={child.href}
                          className={clsx(
                            "text-base py-2 px-3 rounded-xl font-semibold transition-colors cursor-pointer",
                            pathname === child.href
                              ? "text-primary bg-primary/5"
                              : "text-foreground/70 hover:text-primary hover:bg-primary/5",
                          )}
                          href={child.href}
                        >
                          {child.label}
                        </NextLink>
                      ))}
                      <NextLink
                        className="text-xs font-black uppercase tracking-wider text-primary/60 hover:text-primary px-3 py-1.5 mt-1 cursor-pointer"
                        href={item.href}
                      >
                        {t("megamenu.view_all_arrow")}
                      </NextLink>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </NavbarMenuItem>
          );
        }

        // Simple link
        return (
          <NavbarMenuItem key={`${item.href}-${index}`}>
            <NextLink
              className={clsx(
                "text-lg block py-2 cursor-pointer",
                isActive ? "text-primary font-bold" : "text-foreground",
              )}
              href={item.href}
            >
              {label}
            </NextLink>
          </NavbarMenuItem>
        );
      })}

      {/* Login / Signup always at bottom */}
      <NavbarMenuItem>
        <NextLink
          className="text-lg block py-2 text-primary font-bold cursor-pointer"
          href={ROUTES.LOGIN}
        >
          {t("login")} / {t("signup")}
        </NextLink>
      </NavbarMenuItem>
    </div>
  );
}
