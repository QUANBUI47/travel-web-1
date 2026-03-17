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
import { UserMenu } from "@/components/user-menu";
import { createClient } from "@/lib/supabase/server";

export async function Navbar() {
  // Server-side: lấy session và profile
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let profile = null;

  if (user) {
    const { data } = await supabase
      .from("profiles")
      .select("display_name, avatar_url")
      .eq("id", user.id)
      .single();

    profile = data;
  }

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

        <ul className='hidden lg:flex gap-10 justify-start ml-16'>
          {siteConfig.navItems.map((item) => (
            <NavbarItem key={item.href}>
              <NextLink
                className={clsx(
                  "text-[15px] font-bold tracking-tight transition-all duration-200",
                  // Placeholder logic for active state - can be improved with usePathname
                  item.href === "/"
                    ? "text-primary"
                    : "text-foreground/70 hover:text-primary hover:opacity-100",
                )}
                href={item.href}
              >
                {item.label}
              </NextLink>
            </NavbarItem>
          ))}
        </ul>
      </NavbarContent>

      {/* Right side */}
      <NavbarContent
        className='hidden sm:flex basis-1/5 sm:basis-full'
        justify='end'
      >
        <NavbarItem className='flex items-center gap-4'>
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
                Admin Panel
              </Button>
            </NavbarItem>
            <NavbarItem>
              <UserMenu
                displayName={profile?.display_name ?? null}
                email={user.email ?? null}
                avatarUrl={profile?.avatar_url ?? null}
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
                Đăng nhập
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
                Đăng ký
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
            displayName={profile?.display_name ?? null}
            email={user.email ?? null}
            avatarUrl={profile?.avatar_url ?? null}
          />
        ) : (
          <Button as={NextLink} href='/dang-nhap' size='sm' variant='flat'>
            Đăng nhập
          </Button>
        )}
        <NavbarMenuToggle />
      </NavbarContent>

      {/* Mobile Menu */}
      <NavbarMenu>
        <div className='mx-4 mt-2 flex flex-col gap-2'>
          {siteConfig.navItems.map((item, index) => (
            <NavbarMenuItem key={`${item.href}-${index}`}>
              <Link color='foreground' href={item.href} size='lg'>
                {item.label}
              </Link>
            </NavbarMenuItem>
          ))}
          <NavbarMenuItem>
            <Link
              color='primary'
              href={ROUTES.LOGIN}
              size='lg'
              className='font-bold'
            >
              Đăng nhập / Đăng ký
            </Link>
          </NavbarMenuItem>
        </div>
      </NavbarMenu>
    </HeroUINavbar>
  );
}
