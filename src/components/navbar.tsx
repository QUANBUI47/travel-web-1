import {
  Navbar as HeroUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
  NavbarMenuItem,
} from "@heroui/navbar";
import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import NextLink from "next/link";
import clsx from "clsx";
import Image from "next/image";

import { siteConfig } from "@/config/site";
import { ROUTES } from "@/config/routes";
import { ThemeSwitch } from "@/components/theme-switch";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { UserMenu } from "@/components/user-menu";
import { createClient } from "@/lib/supabase/server";
import { DesktopNavLinks, MobileNavLinks } from "@/components/nav-links";

import { AuthService } from "@/services/auth.service";

import { getTranslations } from "next-intl/server";

export async function Navbar() {
  const t = await getTranslations("Navbar");
  // Lấy dữ liệu phiên thông qua Service Layer duy nhất
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
        <NavbarBrand as='li' className='gap-3 max-w-fit'>
          <NextLink
            className='flex justify-start items-center gap-2 group'
            href={ROUTES.HOME}
          >
            <div className='relative h-10 w-32'>
              <Image
                src='/images/vivu-logo-light.svg'
                alt='Vivu Logo'
                fill
                className='dark:hidden object-contain'
                priority
              />
              <Image
                src='/images/vivu-logo-dark.svg'
                alt='Vivu Logo'
                fill
                className='hidden dark:block object-contain'
                priority
              />
            </div>
          </NextLink>
        </NavbarBrand>

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

        {user ? (
          <div className='flex items-center gap-4'>
            <NavbarItem className='hidden md:flex'>
              <Button
                as={NextLink}
                href={ROUTES.ADMIN.DASHBOARD}
                variant='flat'
                color='primary'
                className='font-bold h-10 px-6 rounded-full'
                size='sm'
              >
                {t("admin_panel")}
              </Button>
            </NavbarItem>
            <NavbarItem>
              <UserMenu
                displayName={profile?.displayName ?? null}
                email={user.email ?? null}
                avatarUrl={profile?.avatarUrl ?? null}
              />
            </NavbarItem>
          </div>
        ) : (
          <div className='flex items-center gap-2'>
            <NavbarItem className='hidden md:flex'>
              <Button
                as={NextLink}
                href={ROUTES.LOGIN}
                variant='light'
                className='font-bold text-[15px] px-6 text-foreground/80 hover:text-primary'
                radius='full'
              >
                {t("login")}
              </Button>
            </NavbarItem>
            <NavbarItem>
              <Button
                as={NextLink}
                href={ROUTES.SIGNUP}
                color='primary'
                radius='full'
                className='font-bold text-[15px] px-8 h-11 shadow-xl shadow-primary/20 hover:scale-105 transition-all'
              >
                {t("signup")}
              </Button>
            </NavbarItem>
          </div>
        )}
      </NavbarContent>

      {/* Mobile */}
      <NavbarContent className='sm:hidden basis-1 pl-4' justify='end'>
        <ThemeSwitch />
        {user ? (
          <UserMenu
            displayName={profile?.displayName ?? null}
            email={user.email ?? null}
            avatarUrl={profile?.avatarUrl ?? null}
          />
        ) : (
          <Button as={NextLink} href='/dang-nhap' size='sm' variant='flat'>
            {t("login")}
          </Button>
        )}
        <NavbarMenuToggle />
      </NavbarContent>

      {/* Mobile Menu */}
      <NavbarMenu>
        <MobileNavLinks items={siteConfig.navItems} />
      </NavbarMenu>
    </HeroUINavbar>
  );
}
