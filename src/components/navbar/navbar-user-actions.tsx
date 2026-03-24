import { NavbarItem } from "@heroui/navbar";
import { Button } from "@heroui/button";
import NextLink from "next/link";
import { ROUTES } from "@/config/routes";
import { UserMenu } from "@/components/user-menu";
import { User } from "@supabase/supabase-js";

interface NavbarUserActionsProps {
  user: User | null;
  profile: any;
  t: (key: string) => string;
}

export function NavbarUserActions({ user, profile, t }: NavbarUserActionsProps) {
  if (user) {
    return (
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
    );
  }

  return (
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
  );
}
