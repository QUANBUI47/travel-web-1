import { title } from "@/components/primitives";
import { useTranslations } from "next-intl";

export default function DocsPage() {
  const t = useTranslations("Docs");
  return (
    <div>
      <h1 className={title()}>{t("title")}</h1>
    </div>
  );
}
