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

import { logout } from "@/app/(auth)/actions";

interface UserMenuProps {
  displayName: string | null;
  email: string | null;
  avatarUrl: string | null;
}

import { useTranslations } from "next-intl";

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
    : email?.[0]?.toUpperCase() ?? "U";

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
        className="min-w-[200px]"
        variant="flat"
      >
        <DropdownSection showDivider title={displayName ?? email ?? t("account")}>
          <DropdownItem
            key="profile"
            description={email ?? ""}
            startContent={<User2 size={16} />}
            href="/tai-khoan"
          >
            {t("profile")}
          </DropdownItem>
          <DropdownItem
            key="bookings"
            startContent={<CalendarCheck size={16} />}
            href="/don-dat"
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
