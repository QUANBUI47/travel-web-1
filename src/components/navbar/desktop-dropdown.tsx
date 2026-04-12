"use client";

import { useState } from "react";
import NextLink from "next/link";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";
import { useTranslations } from "next-intl";

import { NavItem } from "@/config/site";

interface DesktopDropdownProps {
  item: NavItem;
  isActive: boolean;
  isTransparent: boolean;
  label: string;
}

export function DesktopDropdown({
  item,
  isActive,
  isTransparent,
  label,
}: DesktopDropdownProps) {
  const t = useTranslations("Navbar");
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      {/* Trigger */}
      <button
        aria-expanded={isOpen}
        aria-haspopup="true"
        className={clsx(
          "flex items-center gap-1 text-xs font-black uppercase transition-all duration-300 relative group cursor-pointer",
          isActive
            ? "text-primary"
            : isTransparent
              ? "text-white/80 hover:text-white"
              : "text-foreground/60 hover:text-primary",
        )}
      >
        {label}
        <ChevronDown
          className={clsx(
            "transition-transform duration-200",
            isOpen ? "rotate-180" : "rotate-0",
          )}
          size={12}
          strokeWidth={3}
        />
        {/* Underline indicator */}
        <span
          className={clsx(
            "absolute -bottom-1 left-0 h-0.5 bg-primary transition-all duration-300",
            isActive ? "w-full" : "w-0 group-hover:w-full",
          )}
        />
      </button>

      {/* Dropdown Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-full left-1/2 -translate-x-1/2 pt-4 z-50 [&_a]:cursor-pointer"
            exit={{ opacity: 0, y: -8 }}
            initial={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
          >
            <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-100/80 dark:border-white/10 p-2 min-w-[220px] overflow-hidden">
              {/* Arrow pointer */}
              <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white dark:bg-slate-900 border-l border-t border-slate-100 dark:border-white/10 rotate-45" />

              {item.children?.map((child) => (
                <NextLink
                  key={child.href}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-200 hover:text-primary dark:hover:text-primary hover:bg-primary/5 dark:hover:bg-primary/10 transition-all group/item cursor-pointer"
                  href={child.href}
                  onClick={() => setIsOpen(false)}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 group-hover/item:bg-primary transition-colors flex-shrink-0" />
                  {child.label}
                </NextLink>
              ))}

              {/* View all link */}
              <div className="mt-1 pt-1 border-t border-slate-100 dark:border-white/5">
                <NextLink
                  className="flex items-center justify-center gap-1 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider text-primary hover:bg-primary/5 dark:hover:bg-primary/10 transition-all cursor-pointer"
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                >
                  {t("megamenu.view_all_arrow")}
                </NextLink>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
