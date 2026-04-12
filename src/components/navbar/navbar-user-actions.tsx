import type { UserProfile } from "@/types/auth";

import { NavbarItem } from "@heroui/navbar";
import { Button } from "@heroui/button";
import NextLink from "next/link";
import { User } from "@supabase/supabase-js";

import { ROUTES } from "@/constants";
import { UserMenu } from "@/components/user-menu";

interface NavbarUserActionsProps {
  user: User | null;
  profile: UserProfile | null;
  t: (key: string) => string;
}

export function NavbarUserActions({
  user,
  profile,
  t,
}: NavbarUserActionsProps) {
  if (user) {
    return (
      <div className="flex items-center gap-4">
        <NavbarItem>
          <UserMenu
            avatarUrl={profile?.avatarUrl ?? null}
            displayName={profile?.displayName ?? null}
            email={user.email ?? null}
          />
        </NavbarItem>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <NavbarItem className="hidden md:flex">
        <Button
          as={NextLink}
          className="font-black text-xs uppercase px-6 h-10 border-2 border-transparent hover:border-slate-200 dark:hover:border-white/20 hover:bg-slate-100 dark:hover:bg-white/10 transition-all text-slate-700 dark:text-slate-300 login-ghost-btn cursor-pointer"
          href={ROUTES.LOGIN}
          radius="full"
          variant="light"
        >
          {t("login")}
        </Button>
      </NavbarItem>
      <NavbarItem>
        <Button
          as={NextLink}
          className="font-black text-xs uppercase px-8 h-10 shadow-lg shadow-primary/10 hover:shadow-primary/20 hover:-translate-y-0.5 transition-all bg-gradient-to-r from-blue-600 to-indigo-600 border-none text-white cursor-pointer"
          color="primary"
          href={ROUTES.REGISTER}
          radius="full"
        >
          {t("signup")}
        </Button>
      </NavbarItem>
    </div>
  );
}
