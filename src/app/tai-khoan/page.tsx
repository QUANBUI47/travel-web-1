import { Avatar } from "@heroui/avatar";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Mail, User2, CalendarCheck } from "lucide-react";
import NextLink from "next/link";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";

import { AuthService } from "@/services/auth.service";
import { ROUTES } from "@/constants";

export default async function AccountPage() {
  const t = await getTranslations("Account");
  const { user, profile } = await AuthService.getCurrentSession();

  if (!user) {
    redirect(
      `${ROUTES.LOGIN}?returnTo=${encodeURIComponent(ROUTES.USER.PROFILE)}`,
    );
  }

  const displayName =
    profile?.displayName ??
    (user.user_metadata?.full_name as string | undefined) ??
    user.email?.split("@")[0] ??
    t("guest");

  return (
    <div className="container mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-black font-serif text-slate-900 dark:text-white mb-2">
        {t("title")}
      </h1>
      <p className="text-slate-500 mb-8">{t("desc")}</p>

      <Card className="border border-slate-100 dark:border-slate-800 shadow-sm mb-6">
        <CardBody className="flex flex-row items-center gap-5 p-6">
          <Avatar
            isBordered
            className="ring-primary"
            color="primary"
            name={displayName.slice(0, 2).toUpperCase()}
            size="lg"
            src={profile?.avatarUrl ?? undefined}
          />
          <div className="flex-1 min-w-0">
            <p className="font-black text-lg text-slate-900 dark:text-white truncate">
              {displayName}
            </p>
            <p className="text-sm text-slate-500 flex items-center gap-1.5 mt-1">
              <Mail size={14} />
              {user.email}
            </p>
          </div>
        </CardBody>
      </Card>

      <div className="grid sm:grid-cols-2 gap-4">
        <Button
          as={NextLink}
          className="h-auto py-5 justify-start"
          href={ROUTES.USER.MY_BOOKINGS}
          startContent={<CalendarCheck className="text-primary" />}
          variant="bordered"
        >
          <div className="text-left">
            <p className="font-bold">{t("bookings_title")}</p>
            <p className="text-xs text-slate-500 font-normal">
              {t("bookings_desc")}
            </p>
          </div>
        </Button>
        <Button
          isDisabled
          className="h-auto py-5 justify-start opacity-60"
          startContent={<User2 className="text-slate-400" />}
          variant="bordered"
        >
          <div className="text-left">
            <p className="font-bold">{t("edit_profile")}</p>
            <p className="text-xs text-slate-500 font-normal">
              {t("coming_soon")}
            </p>
          </div>
        </Button>
      </div>

      <p className="mt-8 text-xs text-slate-400 text-center">
        {t("security_note")}
      </p>
    </div>
  );
}
