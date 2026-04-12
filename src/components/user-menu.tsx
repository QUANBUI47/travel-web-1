"use client";

import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  DropdownSection,
} from "@heroui/dropdown";
import { Avatar } from "@heroui/avatar";
import { User2, LogOut, CalendarCheck } from "lucide-react";
import { useTransition } from "react";
import { useTranslations } from "next-intl";

import { logout } from "@/actions/auth.actions";
import { ROUTES } from "@/constants";

interface UserMenuProps {
  displayName: string | null;
  email: string | null;
  avatarUrl: string | null;
}

export function UserMenu({ displayName, email, avatarUrl }: UserMenuProps) {
  const t = useTranslations("UserMenu");
  const [isPending, startTransition] = useTransition();

  const initials = displayName
    ? displayName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : (email?.[0]?.toUpperCase() ?? "U");

  function handleLogout() {
    startTransition(async () => {
      await logout();
    });
  }

  return (
    <Dropdown placement="bottom-end">
      <DropdownTrigger>
        <Avatar
          isBordered
          as="button"
          className="transition-all hover:scale-105 cursor-pointer ring-cyan-400"
          color="primary"
          name={initials}
          size="md"
          src={avatarUrl ?? undefined}
        />
      </DropdownTrigger>
      <DropdownMenu
        aria-label={t("account")}
        className="min-w-[200px] [&_[role=menuitem]]:cursor-pointer"
        variant="flat"
      >
        <DropdownSection
          showDivider
          title={displayName ?? email ?? t("account")}
        >
          <DropdownItem
            key="profile"
            description={email ?? ""}
            href={ROUTES.USER.PROFILE}
            startContent={<User2 size={16} />}
          >
            {t("profile")}
          </DropdownItem>
          <DropdownItem
            key="bookings"
            href={ROUTES.USER.MY_BOOKINGS}
            startContent={<CalendarCheck size={16} />}
          >
            {t("bookings")}
          </DropdownItem>
        </DropdownSection>
        <DropdownSection>
          <DropdownItem
            key="logout"
            className="text-danger"
            color="danger"
            isDisabled={isPending}
            startContent={<LogOut size={16} />}
            onPress={handleLogout}
          >
            {isPending ? t("logout") + "..." : t("logout")}
          </DropdownItem>
        </DropdownSection>
      </DropdownMenu>
    </Dropdown>
  );
}
