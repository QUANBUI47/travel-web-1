"use client";

import * as LucideIcons from "lucide-react";
import { useTranslations } from "next-intl";

// Import individual editors
import { HeroEditor } from "./editors/hero-editor";
import { StatsEditor } from "./editors/stats-editor";
import { DestinationsEditor } from "./editors/destinations-editor";
import { WhyVivuEditor } from "./editors/why-vivu-editor";
import { PromotionEditor } from "./editors/promotion-editor";
import { StorytellingEditor } from "./editors/storytelling-editor";
import { TrendingEditor } from "./editors/trending-editor";
import { MapExplorationEditor } from "./editors/map-exploration-editor";
import { SocialFeedEditor } from "./editors/social-feed-editor";
import { CuratedCollectionsEditor } from "./editors/curated-collections-editor";
import { NewsletterEditor } from "./editors/newsletter-editor";

import {
  HomeModule,
  Destination,
  HeroContent,
  StatsContent,
  DestinationsContent,
  WhyVivuContent,
  PromotionContent,
  StorytellingContent,
  TrendingContent,
  MapExplorationContent,
  SocialFeedContent,
  CuratedCollectionsContent,
  NewsletterContent,
} from "@/types";

interface ModuleEditorProps {
  module: HomeModule;
  onUpdate: (content: Partial<HomeModule["content"]>) => void;
  onDelete?: (id: string) => void;
  allDestinations?: Destination[];
}

export function ModuleEditor({
  module,
  onUpdate,
  onDelete,
  allDestinations = [],
}: ModuleEditorProps) {
  const tAdmin = useTranslations("Admin.Common");

  const handleUpdate = (newContent: Partial<HomeModule["content"]>) => {
    onUpdate({ ...module.content, ...newContent });
  };

  const renderEditor = () => {
    switch (module.type) {
      case "HERO":
        return (
          <HeroEditor
            allDestinations={allDestinations}
            content={module.content as HeroContent}
            onUpdate={(content) =>
              handleUpdate(content as Partial<HomeModule["content"]>)
            }
          />
        );
      case "STATS":
        return (
          <StatsEditor
            content={module.content as StatsContent}
            onUpdate={(content) =>
              handleUpdate(content as Partial<HomeModule["content"]>)
            }
          />
        );
      case "DESTINATIONS":
        return (
          <DestinationsEditor
            allDestinations={allDestinations}
            content={module.content as DestinationsContent}
            onUpdate={(content) =>
              handleUpdate(content as Partial<HomeModule["content"]>)
            }
          />
        );
      case "WHY_VIVU":
        return (
          <WhyVivuEditor
            content={module.content as WhyVivuContent}
            onUpdate={(content) =>
              handleUpdate(content as Partial<HomeModule["content"]>)
            }
          />
        );
      case "PROMOTION":
      case "FLASH_SALE":
        return (
          <PromotionEditor
            content={module.content as PromotionContent}
            onUpdate={(content) =>
              handleUpdate(content as Partial<HomeModule["content"]>)
            }
          />
        );
      case "STORYTELLING":
      case "TESTIMONIALS":
        return (
          <StorytellingEditor
            content={module.content as StorytellingContent}
            onUpdate={(content) =>
              handleUpdate(content as Partial<HomeModule["content"]>)
            }
          />
        );
      case "TRENDING":
        return (
          <TrendingEditor
            content={module.content as TrendingContent}
            onUpdate={(content) =>
              handleUpdate(content as Partial<HomeModule["content"]>)
            }
          />
        );
      case "MAP_EXPLORATION":
        return (
          <MapExplorationEditor
            content={module.content as MapExplorationContent}
            onUpdate={(content) =>
              handleUpdate(content as Partial<HomeModule["content"]>)
            }
          />
        );
      case "SOCIAL_FEED":
        return (
          <SocialFeedEditor
            content={module.content as SocialFeedContent}
            onUpdate={(content) =>
              handleUpdate(content as Partial<HomeModule["content"]>)
            }
          />
        );
      case "CURATED_COLLECTIONS":
        return (
          <CuratedCollectionsEditor
            content={module.content as CuratedCollectionsContent}
            onUpdate={(content) =>
              handleUpdate(content as Partial<HomeModule["content"]>)
            }
          />
        );
      case "NEWSLETTER":
        return (
          <NewsletterEditor
            content={module.content as NewsletterContent}
            onUpdate={(content) =>
              handleUpdate(content as Partial<HomeModule["content"]>)
            }
          />
        );
      default:
        return (
          <div className="flex flex-col items-center justify-center py-20 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-400 mb-4">
              <LucideIcons.Settings2 size={32} />
            </div>
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-500">
              {tAdmin("editor_missing")}
            </h3>
            <p className="text-xs text-slate-400 mt-2">
              {tAdmin("editor_developing")}
            </p>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden bg-white dark:bg-slate-950">
      {/* Header */}
      <div className="flex items-center justify-between px-8 py-6 border-b border-slate-100 dark:border-slate-800 shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shadow-sm shadow-primary/5">
            <LucideIcons.Layout className="stroke-[2.5]" size={20} />
          </div>
          <div>
            <h2 className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white">
              {tAdmin("configure_module")}
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-tighter text-slate-400">
                {tAdmin("mode_id", {
                  type: module.type,
                  id: module.id.slice(0, 8),
                })}
              </span>
            </div>
          </div>
        </div>

        {onDelete && (
          <button
            className="w-10 h-10 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-xl flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-sm active:scale-90"
            onClick={() => onDelete(module.id)}
          >
            <LucideIcons.Trash2 size={18} />
          </button>
        )}
      </div>

      {/* Editor Content */}
      <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
        {renderEditor()}
      </div>
    </div>
  );
}
