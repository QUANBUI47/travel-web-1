"use client";

import { useState, useEffect } from "react";
import {
  Navbar as HeroUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarMenuToggle,
} from "@heroui/navbar";
import { usePathname } from "next/navigation";

import { BrandLogo } from "./brand-logo";

import { ThemeSwitch } from "@/components/theme-switch";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { cn } from "@/lib/utils";
import { NavItem } from "@/config/site";
import { DesktopNavLinks, MobileNavLinks } from "@/components/nav-links";

interface NavbarClientProps {
  items: NavItem[];
  userActions: React.ReactNode;
}

export function NavbarClient({ items, userActions }: NavbarClientProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const isHomePage =
    pathname === "/" ||
    pathname?.startsWith("/vi") ||
    pathname?.startsWith("/en");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Chỉ áp dụng hiệu ứng trong suốt trên trang chủ
  const isTransparent = isHomePage && !isScrolled;

  return (
    <HeroUINavbar
      className={cn(
        "fixed top-0 w-full transition-all duration-700 ease-in-out z-[100]",
        isTransparent
          ? "bg-transparent border-transparent"
          : "bg-white/70 dark:bg-slate-900/70 backdrop-blur-2xl border-b border-white/10 dark:border-slate-800/10 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)]",
      )}
      classNames={{
        wrapper:
          "px-6 lg:px-12 max-w-[1440px] mx-auto transition-all duration-500 [&_a]:cursor-pointer [&_button]:cursor-pointer [&_[role=button]]:cursor-pointer",
        menu: "[&_a]:cursor-pointer [&_button]:cursor-pointer",
      }}
      height={isScrolled ? "4rem" : "5rem"}
      maxWidth="full"
    >
      {/* Brand + Nav Links */}
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <div className="transition-all">
          {/* Logic: We assume brandLogo is a ReactElement that accepts props or we wrap it carefully */}
          {/* Since brandLogo was passed as <BrandLogo />, we need to clone it if we want to pass props 
                But to be simpler, let's just make it a component call in NavbarClient if needed, 
                or pass it as a function. 
                For now, let's just use the rendered element as is, but I'll update how it's passed.
            */}
          <BrandLogo isTransparent={isTransparent} />
        </div>
        <div className="flex items-center ml-4">
          <DesktopNavLinks isTransparent={isTransparent} items={items} />
        </div>
      </NavbarContent>

      {/* Right side */}
      <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full"
        justify="end"
      >
        <div suppressHydrationWarning className="flex items-center gap-2">
          <LocaleSwitcher isTransparent={isTransparent} />
          <ThemeSwitch isTransparent={isTransparent} />
        </div>
        <div
          className={cn(
            "transition-all",
            isTransparent
              ? "is-on-hero [&_.login-ghost-btn]:!text-white hover:[&_.login-ghost-btn]:!text-white"
              : "",
          )}
        >
          {userActions}
        </div>
      </NavbarContent>

      {/* Mobile */}
      <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
        <ThemeSwitch isTransparent={isTransparent} />
        {userActions}
        <NavbarMenuToggle />
      </NavbarContent>

      {/* Mobile Menu */}
      <NavbarMenu className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md pt-6 [&_a]:cursor-pointer [&_button]:cursor-pointer">
        <MobileNavLinks items={items} />
      </NavbarMenu>
    </HeroUINavbar>
  );
}
