import { CalendarCheck } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";

import { AuthService } from "@/services/auth.service";
import { ROUTES } from "@/constants";

export default async function MyBookingsPage() {
  const t = await getTranslations("Account");
  const { user } = await AuthService.getCurrentSession();

  if (!user) {
    redirect(
      `${ROUTES.LOGIN}?returnTo=${encodeURIComponent(ROUTES.USER.MY_BOOKINGS)}`,
    );
  }

  return (
    <div className="container mx-auto max-w-3xl px-4 py-12 text-center">
      <CalendarCheck className="w-12 h-12 text-primary mx-auto mb-4" />
      <h1 className="text-2xl font-black font-serif mb-2">
        {t("bookings_title")}
      </h1>
      <p className="text-slate-500">{t("bookings_empty")}</p>
    </div>
  );
}
