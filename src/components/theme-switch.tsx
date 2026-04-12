"use client";

import { FC, useState, useEffect } from "react";
import { useTheme } from "next-themes";
import clsx from "clsx";
import { Button } from "@heroui/button";

import { SunFilledIcon, MoonFilledIcon } from "@/components/icons";

export interface ThemeSwitchProps {
  className?: string;
  isTransparent?: boolean;
}

export const ThemeSwitch: FC<ThemeSwitchProps> = ({
  className,
  isTransparent,
}) => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const onChange = () => {
    const currentTheme = resolvedTheme || theme;

    currentTheme === "light" ? setTheme("dark") : setTheme("light");
  };

  if (!mounted) {
    return <div className={clsx("w-10 h-10 px-px mx-2", className)} />;
  }

  const isLight = resolvedTheme === "light" || theme === "light";

  return (
    <Button
      isIconOnly
      aria-label="Toggle theme"
      className={clsx(
        "rounded-full transition-colors cursor-pointer",
        isTransparent
          ? "text-white hover:bg-white/10"
          : "text-slate-800 dark:text-white hover:bg-slate-100/50 dark:hover:bg-slate-800/50",
        className,
      )}
      onPress={onChange}
    >
      {isLight ? (
        <MoonFilledIcon
          className={isTransparent ? "text-white" : "text-slate-700"}
          size={20}
        />
      ) : (
        <SunFilledIcon className="text-amber-400" size={20} />
      )}
    </Button>
  );
};
