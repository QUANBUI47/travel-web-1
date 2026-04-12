"use client";

import { Image as HeroUI_Image } from "@heroui/image";
import NextLink from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { Suspense } from "react";
import { useTranslations } from "next-intl";

import { AuthQueryAlerts } from "./auth-query-alerts";

import { ROUTES } from "@/constants";

type AuthFormShellProps = {
  title: string;
  description: string;
  children: React.ReactNode;
  trustBadge?: string;
  footer?: React.ReactNode;
};

export function AuthFormShell({
  title,
  description,
  children,
  trustBadge,
  footer,
}: AuthFormShellProps) {
  const t = useTranslations("Auth");

  return (
    <div className="min-h-[100dvh] w-full flex items-center justify-center p-8 sm:p-12 bg-slate-100 dark:bg-slate-950 font-sans">
      <div className="w-full max-w-[460px] flex flex-col py-2 relative bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-8 sm:p-10">
        <NextLink
          className="absolute top-6 left-6 inline-flex items-center text-[13px] font-bold text-slate-500 hover:text-primary transition-colors group"
          href={ROUTES.HOME}
        >
          <ArrowLeft className="w-4 h-4 mr-1.5 transition-transform group-hover:-translate-x-1" />
          {t("back_to_home")}
        </NextLink>

        <div className="mt-10 mb-8 text-center">
          <NextLink className="inline-block mb-6" href={ROUTES.HOME}>
            <HeroUI_Image
              removeWrapper
              alt="Vivu"
              className="object-contain mx-auto"
              src="/images/vivu-logo-dark.svg"
              width={100}
            />
          </NextLink>
          <h1 className="text-2xl sm:text-3xl font-black font-serif text-slate-900 dark:text-white tracking-tight mb-2">
            {title}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
            {description}
          </p>
        </div>

        <Suspense fallback={null}>
          <AuthQueryAlerts />
        </Suspense>

        {children}

        {trustBadge && (
          <div className="mt-8 flex justify-center w-full">
            <div className="flex items-center justify-center gap-2 bg-[#f0fbf4] dark:bg-emerald-900/20 text-[#138e4b] dark:text-emerald-400 border border-[#e1f5eb] dark:border-emerald-800/30 py-2.5 px-4 rounded-xl w-full">
              <ShieldCheck size={16} />
              <span className="text-[8px] xl:text-[9px] font-black uppercase tracking-widest text-center">
                {trustBadge}
              </span>
            </div>
          </div>
        )}

        {footer}
      </div>
    </div>
  );
}
