import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import NextLink from "next/link";
import { getTranslations } from "next-intl/server";

import { ROUTES } from "@/constants";

export async function generateMetadata() {
  const t = await getTranslations("Admin.Seo");

  return {
    title: t("page_title"),
    description: t("page_desc"),
  };
}

export default async function AdminSeoPage() {
  const t = await getTranslations("Admin.Seo");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t("page_title")}</h1>
        <Button as={NextLink} color="primary" href={`${ROUTES.ADMIN.SEO}/new`}>
          {t("add_page")}
        </Button>
      </div>
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">{t("list_title")}</h2>
        </CardHeader>
        <CardBody>
          <p className="text-default-600 text-sm mb-4">{t("list_hint")}</p>
          <div className="rounded-lg border border-default-200 p-4 text-center text-default-500">
            {t("empty")}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
