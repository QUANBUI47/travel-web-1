"use client";

import * as LucideIcons from "lucide-react";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { useTranslations } from "next-intl";

import adminEn from "@/messages/admin/en.json";
import adminVi from "@/messages/admin/vi.json";
import { CuratedCollectionsContent, CuratedCollectionItem } from "@/types";
import { BilingualInput } from "@/components/admin/bilingual-input";
import { MediaUploader } from "@/components/ui/media-uploader";

const editorsVi = adminVi.Builder.editors;
const editorsEn = adminEn.Builder.editors;

interface CuratedCollectionsEditorProps {
  content: CuratedCollectionsContent;
  onUpdate: (content: Partial<CuratedCollectionsContent>) => void;
}

export function CuratedCollectionsEditor({
  content,
  onUpdate,
}: CuratedCollectionsEditorProps) {
  const t = useTranslations("Admin.Builder.editors");

  const updateCollection = (
    idx: number,
    updates: Partial<CuratedCollectionItem>,
  ) => {
    const collections = [...content.collections];

    collections[idx] = { ...collections[idx], ...updates };
    onUpdate({ collections });
  };

  const addCollection = () => {
    onUpdate({
      collections: [
        ...content.collections,
        {
          title: {
            vi: editorsVi.new_collection,
            en: editorsEn.new_collection,
          },
          description: { vi: "", en: "" },
          imageUrl: "",
          link: "/tours",
        },
      ],
    });
  };

  const removeCollection = (idx: number) => {
    onUpdate({ collections: content.collections.filter((_, i) => i !== idx) });
  };

  return (
    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <BilingualInput
        label={t("collections_title")}
        name="curated_collections_title"
        value={content.title}
        onValueChange={(val) => onUpdate({ title: val })}
      />

      <div className="space-y-4">
        <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">
          {t("collections_list", { count: content.collections.length })}
        </div>

        <div className="space-y-4">
          {content.collections.map((collection, idx) => (
            <div
              key={idx}
              className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm relative group space-y-4"
            >
              <button
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                onClick={() => removeCollection(idx)}
              >
                <LucideIcons.X size={12} />
              </button>

              <BilingualInput
                label={t("item_title")}
                name={`collection_title_${idx}`}
                value={collection.title}
                onValueChange={(val) => updateCollection(idx, { title: val })}
              />

              <BilingualInput
                label={t("item_desc")}
                name={`collection_desc_${idx}`}
                value={collection.description || { vi: "", en: "" }}
                onValueChange={(val) =>
                  updateCollection(idx, { description: val })
                }
              />

              <Input
                classNames={{
                  inputWrapper:
                    "bg-slate-50 dark:bg-slate-800 border-none h-11",
                }}
                label={t("item_link")}
                value={collection.link}
                onChange={(e) =>
                  updateCollection(idx, { link: e.target.value })
                }
              />

              <div className="space-y-2">
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  {t("collection_image")}
                </div>
                <MediaUploader
                  accept="image/*"
                  value={collection.imageUrl}
                  onChange={(val) => updateCollection(idx, { imageUrl: val })}
                />
              </div>
            </div>
          ))}
        </div>

        <Button
          className="w-full h-14 border-dashed border-2 border-slate-200 dark:border-slate-800 rounded-2xl text-slate-400 hover:border-primary hover:text-primary transition-all font-bold"
          startContent={<LucideIcons.Plus size={18} />}
          variant="bordered"
          onClick={addCollection}
        >
          {t("add_collection")}
        </Button>
      </div>
    </div>
  );
}
