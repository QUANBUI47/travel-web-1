"use client";

import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";

export function AuthQueryAlerts() {
  const searchParams = useSearchParams();
  const t = useTranslations("Auth");

  const error = searchParams.get("error");
  const reset = searchParams.get("reset");
  const verified = searchParams.get("verified");

  if (verified === "1") {
    return (
      <div className="border-l-4 border-emerald-500 px-4 py-3 text-emerald-700 dark:text-emerald-400 text-sm font-bold mb-5 xl:mb-6 rounded-r bg-emerald-50 dark:bg-emerald-900/20">
        {t("verify.success_login")}
      </div>
    );
  }

  if (error === "auth_callback_failed") {
    return (
      <div className="border-l-4 border-danger px-4 py-3 text-danger text-sm font-bold mb-5 xl:mb-6 rounded-r bg-red-50 dark:bg-danger-900/20">
        {t("callback_failed")}
      </div>
    );
  }

  if (reset === "success") {
    return (
      <div className="border-l-4 border-emerald-500 px-4 py-3 text-emerald-700 dark:text-emerald-400 text-sm font-bold mb-5 xl:mb-6 rounded-r bg-emerald-50 dark:bg-emerald-900/20">
        {t("reset.success_login")}
      </div>
    );
  }

  return null;
}
