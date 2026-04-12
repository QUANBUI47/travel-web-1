import { getRequestConfig } from "next-intl/server";
import { headers, cookies } from "next/headers";

// Configure the default locales and messages
export const locales = ["vi", "en"];
export const defaultLocale = "vi";

export default getRequestConfig(async () => {
  const headersList = await headers();
  const cookieStore = await cookies();

  // Ưu tiên lấy locale từ cookie NEXT_LOCALE (do LocaleSwitcher set)
  let locale = cookieStore.get("NEXT_LOCALE")?.value || "";

  // Nếu không có cookie, kiểm tra header accept-language
  if (!locale || !locales.includes(locale)) {
    const acceptLanguage = headersList.get("accept-language");

    if (acceptLanguage) {
      if (acceptLanguage.includes("en")) locale = "en";
      else if (acceptLanguage.includes("vi")) locale = "vi";
    }
  }

  // Fallback về mặc định
  if (!locale || !locales.includes(locale)) {
    locale = defaultLocale;
  }

  const [baseMessages, adminMessages] = await Promise.all([
    import(`../messages/${locale}.json`),
    import(`../messages/admin/${locale}.json`),
  ]);

  return {
    locale,
    messages: {
      ...baseMessages.default,
      Admin: adminMessages.default,
    },
  };
});
