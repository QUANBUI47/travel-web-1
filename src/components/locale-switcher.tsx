"use client";

import { useLocale } from "next-intl";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/dropdown";
import { Button } from "@heroui/button";
import { useRouter } from "next/navigation";

export function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();

  const handleLocaleChange = (newLocale: React.Key) => {
    // Set cookie NEXT_LOCALE với thời hạn 1 năm
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000`;
    // Reload để Next.js nhận diện locale mới từ cookie
    router.refresh();
  };

  const languages = [
    { code: "vi", name: "Tiếng Việt", flag: "🇻🇳" },
    { code: "en", name: "English", flag: "🇺🇸" },
  ];

  return (
    <Dropdown placement="bottom-end">
      <DropdownTrigger>
        <Button 
          variant="ghost" 
          size="sm"
          className="font-bold min-w-10 px-0 h-9 rounded-lg border-default-200 hover:bg-default-100"
        >
          {locale.toUpperCase()}
        </Button>
      </DropdownTrigger>
      <DropdownMenu 
        aria-label="Language selection"
        onAction={(key) => handleLocaleChange(key)}
        selectedKeys={[locale]}
        selectionMode="single"
        variant="flat"
        className="min-w-[120px]"
      >
        {languages.map((lang) => (
          <DropdownItem 
            key={lang.code}
            startContent={<span className="text-lg">{lang.flag}</span>}
            description={lang.code.toUpperCase()}
          >
            {lang.name}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
}
