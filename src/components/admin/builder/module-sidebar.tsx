"use client";

import * as LucideIcons from "lucide-react";
import { Reorder } from "framer-motion";
import { useTranslations } from "next-intl";

import { HomeModule, ModuleType } from "@/types";
import { cn } from "@/lib/utils";
import { createDefaultModule } from "@/lib/builder/defaults";
import { ADDABLE_MODULES, getModuleMeta } from "@/lib/builder/module-registry";

interface ModuleSidebarProps {
  modules: HomeModule[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onToggleVisibility: (id: string) => void;
  setModules: (modules: HomeModule[]) => void;
}

export function ModuleSidebar({
  modules,
  activeId,
  onSelect,
  onToggleVisibility,
  setModules,
}: ModuleSidebarProps) {
  const t = useTranslations("Admin.Builder");
  const tCommon = useTranslations("Admin.Common");

  const renderModuleRow = (item: HomeModule, draggable: boolean) => {
    const meta = getModuleMeta(item.type);
    const Icon = meta.icon;
    const label = t(`modules.${meta.labelKey}`);

    return (
      <div
        className={cn(
          "flex items-center p-2.5 gap-1 rounded-2xl border transition-all overflow-hidden",
          activeId === item.id
            ? "bg-white border-primary shadow-sm ring-1 ring-primary/10"
            : "bg-slate-50 border-slate-200 hover:bg-white hover:border-slate-300",
        )}
      >
        <div className="w-8 shrink-0 flex justify-center text-slate-300">
          {draggable ? (
            <LucideIcons.GripVertical
              className="group-hover:text-primary/30 transition-colors cursor-grab active:cursor-grabbing"
              size={16}
            />
          ) : (
            <LucideIcons.Lock className="opacity-50" size={14} />
          )}
        </div>

        <button
          className="flex-1 flex items-center gap-1.5 min-w-0 text-left outline-none group"
          type="button"
          onClick={() => onSelect(item.id)}
        >
          <div
            className={cn(
              "w-8 h-8 shrink-0 rounded-xl flex items-center justify-center transition-colors",
              activeId === item.id
                ? "bg-primary/10 text-primary"
                : "bg-white text-slate-400",
            )}
          >
            <Icon size={14} />
          </div>
          <div className="flex-1 min-w-0">
            <p
              className={cn(
                "text-xs font-black tracking-tight leading-tight line-clamp-2",
                activeId === item.id ? "text-primary" : "text-slate-600",
              )}
            >
              {label}
            </p>
            <p className="text-[8px] font-bold uppercase tracking-widest opacity-40 leading-none mt-0.5">
              {item.type}
            </p>
          </div>
        </button>

        <button
          aria-label={item.isVisible ? tCommon("visible") : tCommon("hidden")}
          className={cn(
            "w-8 h-8 shrink-0 rounded-full flex items-center justify-center transition-all hover:bg-slate-100",
            activeId === item.id ? "text-primary/60" : "text-slate-300",
          )}
          type="button"
          onClick={() => onToggleVisibility(item.id)}
        >
          {item.isVisible ? (
            <LucideIcons.Eye size={14} />
          ) : (
            <LucideIcons.EyeOff size={14} />
          )}
        </button>
      </div>
    );
  };

  return (
    <div className="p-2.5 space-y-2.5">
      <div className="flex items-center justify-between px-1.5">
        <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">
          {tCommon("module_order")}
        </h3>
        <div className="relative group/add">
          <button
            className="flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-[9px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all shadow-sm"
            type="button"
          >
            <LucideIcons.Plus size={12} strokeWidth={3} /> {t("add_module")}
          </button>

          <div className="absolute right-0 top-full mt-2 w-52 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-white/10 shadow-2xl opacity-0 translate-y-2 pointer-events-none group-hover/add:opacity-100 group-hover/add:translate-y-0 group-hover/add:pointer-events-auto transition-all z-50 p-1.5">
            <div className="grid grid-cols-1 gap-0.5">
              {ADDABLE_MODULES.map((meta) => {
                const Icon = meta.icon;

                return (
                  <button
                    key={meta.type}
                    className="flex items-center gap-2.5 w-full p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 text-left transition-colors"
                    type="button"
                    onClick={() => {
                      const newId = `${meta.type.toLowerCase()}_${Date.now()}`;
                      const newModule = createDefaultModule(
                        meta.type as ModuleType,
                        newId,
                      );

                      setModules([...modules, newModule]);
                      onSelect(newId);
                    }}
                  >
                    <div className="p-1.5 bg-slate-100 dark:bg-white/5 rounded-lg text-slate-500">
                      <Icon size={12} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-700 dark:text-slate-300">
                      {t(`modules.${meta.labelKey}`)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {modules
        .filter((m) => m.type === "HERO")
        .map((item) => (
          <div key={item.id}>{renderModuleRow(item, false)}</div>
        ))}

      <Reorder.Group
        axis="y"
        className="space-y-2.5"
        values={modules.filter((m) => m.type !== "HERO")}
        onReorder={(newOrder) => {
          const hero = modules.find((m) => m.type === "HERO");

          setModules(hero ? [hero, ...newOrder] : newOrder);
        }}
      >
        {modules
          .filter((m) => m.type !== "HERO")
          .map((item) => (
            <Reorder.Item
              key={item.id}
              className="focus:outline-none"
              value={item}
            >
              {renderModuleRow(item, true)}
            </Reorder.Item>
          ))}
      </Reorder.Group>
    </div>
  );
}
