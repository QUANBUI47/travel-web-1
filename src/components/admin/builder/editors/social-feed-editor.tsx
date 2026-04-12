"use client";

import { Input } from "@heroui/input";
import { useTranslations } from "next-intl";

import { SocialFeedContent } from "@/types";
import { BilingualInput } from "@/components/admin/bilingual-input";

interface SocialFeedEditorProps {
  content: SocialFeedContent;
  onUpdate: (content: Partial<SocialFeedContent>) => void;
}

export function SocialFeedEditor({ content, onUpdate }: SocialFeedEditorProps) {
  const t = useTranslations("Admin.Builder.editors");

  return (
    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <BilingualInput
        label={t("social_feed_title")}
        name="social_feed_title"
        value={content.title}
        onValueChange={(val) => onUpdate({ title: val })}
      />

      <div className="space-y-2">
        <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">
          {t("platform_label")}
        </div>
        <select
          className="w-full h-11 px-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-sm font-medium border-none outline-none focus:ring-2 focus:ring-primary/20 transition-all appearance-none"
          value={content.platform}
          onChange={(e) =>
            onUpdate({
              platform: e.target.value as SocialFeedContent["platform"],
            })
          }
        >
          <option value="instagram">Instagram</option>
          <option value="facebook">Facebook</option>
          <option value="tiktok">TikTok</option>
        </select>
      </div>

      <div className="space-y-2">
        <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">
          {t("feed_urls_label")}
        </div>
        <Input
          classNames={{
            inputWrapper: "bg-slate-50 dark:bg-slate-800 border-none h-11",
          }}
          placeholder="https://instagram.com/..."
          value={(content.feedUrls || []).join(",")}
          onChange={(e) =>
            onUpdate({
              feedUrls: e.target.value
                .split(",")
                .map((url) => url.trim())
                .filter(Boolean),
            })
          }
        />
      </div>
    </div>
  );
}
