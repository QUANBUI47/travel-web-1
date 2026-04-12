"use client";

import { useTranslations } from "next-intl";

import { NewsletterContent } from "@/types";
import { BilingualInput } from "@/components/admin/bilingual-input";

interface NewsletterEditorProps {
  content: NewsletterContent;
  onUpdate: (content: Partial<NewsletterContent>) => void;
}

export function NewsletterEditor({ content, onUpdate }: NewsletterEditorProps) {
  const t = useTranslations("Admin.Builder.editors");

  return (
    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <BilingualInput
        label={t("section_title")}
        name="newsletter_title"
        value={content.title}
        onValueChange={(val) => onUpdate({ title: val })}
      />

      <BilingualInput
        label={t("short_desc")}
        name="newsletter_subtitle"
        value={content.subtitle}
        onValueChange={(val) => onUpdate({ subtitle: val })}
      />

      <BilingualInput
        label={t("newsletter_placeholder")}
        name="newsletter_placeholder"
        value={content.placeholder || { vi: "", en: "" }}
        onValueChange={(val) => onUpdate({ placeholder: val })}
      />

      <BilingualInput
        label={t("newsletter_button")}
        name="newsletter_button_text"
        value={content.buttonText || { vi: "", en: "" }}
        onValueChange={(val) => onUpdate({ buttonText: val })}
      />
    </div>
  );
}
