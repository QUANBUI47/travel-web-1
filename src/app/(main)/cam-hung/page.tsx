import { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

import { ROUTES } from "@/constants";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("StaticPages");

  return {
    title: t("inspiration_title"),
    description: t("inspiration_description"),
  };
}

export default async function InspirationPage() {
  const t = await getTranslations("StaticPages");

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-6 py-24 text-center">
      <h1 className="text-4xl font-black uppercase tracking-tight text-slate-900 dark:text-white mb-4">
        {t("inspiration_title")}
      </h1>
      <p className="text-slate-500 max-w-lg mb-8">
        {t("inspiration_description")}
      </p>
      <Link
        className="text-primary font-bold uppercase tracking-widest text-sm hover:underline"
        href={ROUTES.HOME}
      >
        {t("back_home")}
      </Link>
    </div>
  );
}
