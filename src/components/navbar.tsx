import {
  Navbar as HeroUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarMenuToggle,
} from "@heroui/navbar";
import { NavbarItem } from "@heroui/navbar";
import { ThemeSwitch } from "@/components/theme-switch";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { siteConfig } from "@/config/site";
import { DesktopNavLinks, MobileNavLinks } from "@/components/nav-links";
import { AuthService } from "@/services/auth.service";
import { getTranslations } from "next-intl/server";
import { BrandLogo } from "./navbar/brand-logo";
import { NavbarUserActions } from "./navbar/navbar-user-actions";

export async function Navbar() {
  const t = await getTranslations("Navbar");
  const { user: sessionUser, profile } = await AuthService.getCurrentSession();
  
  // TÁCH BIỆT: Admin sẽ KHÔNG ĐƯỢC tính là đã đăng nhập ở khu vực Client Navbar
  const isClientUser = sessionUser && profile?.role !== "ADMIN";
  const user = isClientUser ? sessionUser : null;

  return (
    <HeroUINavbar
      maxWidth='xl'
      position='sticky'
      height='5rem'
      classNames={{
        base: "border-b border-divider/40 backdrop-blur-xl bg-background/60",
        wrapper: "px-6",
      }}
    >
      {/* Brand + Nav Links */}
      <NavbarContent className='basis-1/5 sm:basis-full' justify='start'>
        <BrandLogo />
        <DesktopNavLinks items={siteConfig.navItems} />
      </NavbarContent>

      {/* Right side */}
      <NavbarContent
        className='hidden sm:flex basis-1/5 sm:basis-full'
        justify='end'
      >
        <NavbarItem className='flex items-center gap-2' suppressHydrationWarning>
          <LocaleSwitcher />
          <ThemeSwitch />
        </NavbarItem>

        <NavbarUserActions user={user} profile={profile} t={t} />
      </NavbarContent>

      {/* Mobile */}
      <NavbarContent className='sm:hidden basis-1 pl-4' justify='end'>
        <ThemeSwitch />
        <NavbarUserActions user={user} profile={profile} t={t} />
        <NavbarMenuToggle />
      </NavbarContent>

      {/* Mobile Menu */}
      <NavbarMenu>
        <MobileNavLinks items={siteConfig.navItems} />
      </NavbarMenu>
    </HeroUINavbar>
  );
}
