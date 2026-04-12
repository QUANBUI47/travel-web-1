import { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

import { ROUTES } from "@/constants";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("StaticPages");

  return {
    title: t("promo_title"),
    description: t("promo_description"),
  };
}

export default async function PromoPage() {
  const t = await getTranslations("StaticPages");

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-6 py-24 text-center">
      <h1 className="text-4xl font-black uppercase tracking-tight text-slate-900 dark:text-white mb-4">
        {t("promo_title")}
      </h1>
      <p className="text-slate-500 max-w-lg mb-8">{t("promo_description")}</p>
      <Link
        className="text-primary font-bold uppercase tracking-widest text-sm hover:underline"
        href={ROUTES.TOURS}
      >
        {t("view_tours")}
      </Link>
    </div>
  );
}
