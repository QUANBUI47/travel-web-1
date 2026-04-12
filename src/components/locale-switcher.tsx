"use client";

import { useLocale, useTranslations } from "next-intl";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/dropdown";
import { Button } from "@heroui/button";
import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";

export function LocaleSwitcher({ isTransparent }: { isTransparent?: boolean }) {
  const locale = useLocale();
  const router = useRouter();
  const t = useTranslations("Common");

  const handleLocaleChange = (newLocale: React.Key) => {
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000`;
    router.refresh();
  };

  const languages = [
    { code: "vi", name: t("locale_vi"), flag: "🇻🇳" },
    { code: "en", name: t("locale_en"), flag: "🇺🇸" },
  ];

  return (
    <Dropdown placement="bottom-end">
      <DropdownTrigger>
        <Button
          suppressHydrationWarning
          className={cn(
            "font-bold min-w-8 px-0 h-9 rounded-full transition-colors cursor-pointer",
            isTransparent
              ? "text-white hover:bg-white/10"
              : "hover:bg-slate-100/50 dark:hover:bg-slate-800/50",
          )}
          id="locale-switcher-button"
          size="sm"
          variant="light"
        >
          {locale.toUpperCase()}
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Language selection"
        className="min-w-[120px] [&_[role=menuitem]]:cursor-pointer"
        selectedKeys={[locale]}
        selectionMode="single"
        variant="flat"
        onAction={(key) => handleLocaleChange(key)}
      >
        {languages.map((lang) => (
          <DropdownItem
            key={lang.code}
            description={lang.code.toUpperCase()}
            startContent={<span className="text-lg">{lang.flag}</span>}
          >
            {lang.name}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
}
