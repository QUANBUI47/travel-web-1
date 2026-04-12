import "@/styles/globals.css";
import { Metadata, Viewport } from "next";
import clsx from "clsx";
import { getLocale, getMessages, getTranslations } from "next-intl/server";

import { Providers } from "./providers";

import { I18nProvider } from "@/components/i18n-provider";
import { fontSans, fontHeading } from "@/config/fonts";
import { SystemService } from "@/services/system.service";
import { I18nString } from "@/types";

function resolveI18nValue(
  value: unknown,
  locale: string,
  fallback: string,
): string {
  if (!value) return fallback;
  if (typeof value === "string") return value;
  if (typeof value === "object" && value !== null) {
    const i18n = value as Partial<I18nString>;
    const localized = locale === "en" ? i18n.en : i18n.vi;

    if (typeof localized === "string" && localized.trim()) {
      return localized;
    }
  }

  return fallback;
}

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: "HomePage.Hero" });
  const settings = await SystemService.getSettings();

  const tMeta = await getTranslations({ locale, namespace: "Metadata" });
  const defaultTitle = `Vivu Travel | ${tMeta("default_title_suffix")}`;
  const defaultDescription = t("description");

  const title = resolveI18nValue(settings.siteTitle, locale, defaultTitle);
  const description = resolveI18nValue(
    settings.metaDescription,
    locale,
    defaultDescription,
  );
  const favicon =
    typeof settings.faviconUrl === "string" && settings.faviconUrl.trim()
      ? settings.faviconUrl
      : "/favicon-vivu.svg";
  const metadataBase = process.env.NEXT_PUBLIC_SITE_URL
    ? new URL(process.env.NEXT_PUBLIC_SITE_URL)
    : undefined;

  return {
    metadataBase,
    title: {
      default: title,
      template: `%s | ${title}`,
    },
    description: description,
    openGraph: {
      title: title,
      description: description,
      type: "website",
    },
    icons: {
      icon: favicon,
    },
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html suppressHydrationWarning lang={locale}>
      <head />
      <body
        className={clsx(
          "min-h-screen text-foreground bg-background font-sans antialiased",
          fontSans.variable,
          fontHeading.variable,
        )}
      >
        <I18nProvider locale={locale} messages={messages}>
          <Providers
            themeProps={{ attribute: "class", defaultTheme: "system" }}
          >
            {children}
          </Providers>
        </I18nProvider>
      </body>
    </html>
  );
}
