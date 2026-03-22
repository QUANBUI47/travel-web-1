import { title } from "@/components/primitives";
import { useTranslations } from "next-intl";

export default function AboutPage() {
  const t = useTranslations("About");
  return (
    <div>
      <h1 className={title()}>{t("title")}</h1>
    </div>
  );
}
