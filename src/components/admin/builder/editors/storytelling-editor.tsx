"use client";

import * as LucideIcons from "lucide-react";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { useLocale, useTranslations } from "next-intl";

import adminEn from "@/messages/admin/en.json";
import adminVi from "@/messages/admin/vi.json";
import { StorytellingContent, StoryItem } from "@/types";
import { BilingualInput } from "@/components/admin/bilingual-input";

const editorsVi = adminVi.Builder.editors;
const editorsEn = adminEn.Builder.editors;

interface StorytellingEditorProps {
  content: StorytellingContent;
  onUpdate: (content: Partial<StorytellingContent>) => void;
}

export function StorytellingEditor({
  content,
  onUpdate,
}: StorytellingEditorProps) {
  const t = useTranslations("Admin.Builder.editors");
  const locale = useLocale();

  const updateStory = (idx: number, updates: Partial<StoryItem>) => {
    const newItems = [...content.items];

    newItems[idx] = { ...newItems[idx], ...updates };
    onUpdate({ items: newItems });
  };

  const removeStory = (idx: number) => {
    onUpdate({ items: content.items.filter((_, i) => i !== idx) });
  };

  const addStory = () => {
    const defaults =
      locale === "vi"
        ? {
            author: editorsVi.new_user,
            role: editorsVi.traveler,
            quote: editorsVi.default_quote,
          }
        : {
            author: editorsEn.new_user,
            role: editorsEn.traveler,
            quote: editorsEn.default_quote,
          };

    onUpdate({
      items: [
        ...content.items,
        {
          ...defaults,
          rating: 5,
        },
      ],
    });
  };

  return (
    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <BilingualInput
        label={t("story_title")}
        name="story_title"
        value={content.title}
        onValueChange={(val) => onUpdate({ title: val })}
      />

      <div className="space-y-4">
        <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">
          {t("stories_list", { count: content.items.length })}
        </div>
        <div className="space-y-4">
          {content.items.map((story, idx) => (
            <div
              key={idx}
              className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm relative group space-y-4"
            >
              <button
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                onClick={() => removeStory(idx)}
              >
                <LucideIcons.X size={12} />
              </button>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    {t("author")}
                  </div>
                  <Input
                    classNames={{
                      inputWrapper:
                        "bg-slate-50 dark:bg-slate-800 border-none h-11",
                    }}
                    value={story.author}
                    onChange={(e) =>
                      updateStory(idx, { author: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    {t("role")}
                  </div>
                  <Input
                    classNames={{
                      inputWrapper:
                        "bg-slate-50 dark:bg-slate-800 border-none h-11",
                    }}
                    value={story.role}
                    onChange={(e) => updateStory(idx, { role: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  {t("quote")}
                </div>
                <textarea
                  className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-xl text-sm border-none outline-none focus:ring-2 focus:ring-primary/20 transition-all min-h-[100px]"
                  value={story.quote}
                  onChange={(e) => updateStory(idx, { quote: e.target.value })}
                />
              </div>
            </div>
          ))}
        </div>

        <Button
          className="w-full h-14 border-dashed border-2 border-slate-200 dark:border-slate-800 rounded-2xl text-slate-400 hover:border-primary hover:text-primary transition-all font-bold"
          startContent={<LucideIcons.Plus size={18} />}
          variant="bordered"
          onClick={addStory}
        >
          {t("add_story")}
        </Button>
      </div>
    </div>
  );
}
