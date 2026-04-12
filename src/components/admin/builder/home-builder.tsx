"use client";

import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@heroui/button";
import { addToast } from "@heroui/toast";
import { useRouter } from "next/navigation";
import * as LucideIcons from "lucide-react";
import { NextIntlClientProvider, useTranslations } from "next-intl";

import { ModuleSidebar } from "./module-sidebar";
import { ModuleEditor } from "./module-editor";
import { DevicePreview } from "./device-preview";

import { HomeModule, HomeSetting, Destination } from "@/types";
import { cn } from "@/lib/utils/index";
import { migrateToModules } from "@/lib/builder/migrate";
import { updateHomeSettingsAction } from "@/actions/home.actions";
import { getSafeActionErrorMessage } from "@/lib/utils/action-result";
import { useDestinationsPicklist } from "@/hooks/queries";
import { queryKeys } from "@/lib/query-keys";

interface HomeBuilderProps {
  initialData: HomeSetting;
  // next-intl JSON messages có cấu trúc lồng theo namespace (API, Common, MediaUploader, ...)
  // nên không thể ép kiểu thành Record<string, Record<string, string>>.
  messages: Record<"vi" | "en", Record<string, unknown>>;
}

export function HomeBuilder({ initialData, messages }: HomeBuilderProps) {
  const [modules, setModules] = useState<HomeModule[]>([]);
  const [activeModuleId, setActiveModuleId] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const [previewLocale, setPreviewLocale] = useState<"vi" | "en">("vi");
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isPreviewMaximized, setIsPreviewMaximized] = useState(false);
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">(
    "desktop",
  );
  const { data: destinationsPicklist } = useDestinationsPicklist();
  const allDestinations: Destination[] = destinationsPicklist?.success
    ? destinationsPicklist.data
    : [];
  const router = useRouter();
  const tCommon = useTranslations("Common");
  const tApi = useTranslations("API");
  const tBuilder = useTranslations("Admin.Builder");

  // Resize States
  const [sidebarWidth, setSidebarWidth] = useState(240);
  const [editorWidth, setEditorWidth] = useState(500);
  const [resizing, setResizing] = useState<"sidebar" | "editor" | null>(null);

  useEffect(() => {
    const migrated = migrateToModules(initialData);

    setModules(migrated);
    setActiveModuleId((current) => {
      if (current && migrated.some((m) => m.id === current)) {
        return current;
      }

      return migrated[0]?.id ?? null;
    });
  }, [initialData]);

  // Handle Resizing
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!resizing) return;
      if (resizing === "sidebar") {
        const newWidth = Math.max(200, Math.min(400, e.clientX));

        setSidebarWidth(newWidth);
      } else if (resizing === "editor") {
        const leftOffset = isPreviewMaximized ? 0 : sidebarWidth;
        const newWidth = Math.max(300, Math.min(800, e.clientX - leftOffset));

        setEditorWidth(newWidth);
      }
    };

    const handleMouseUp = () => setResizing(null);

    if (resizing) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "col-resize";
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "default";
    };
  }, [resizing, sidebarWidth, isPreviewMaximized]);

  const activeModule = modules.find((m) => m.id === activeModuleId);

  const saveMutation = useMutation({
    mutationFn: () => updateHomeSettingsAction(modules),
    onSuccess: (result) => {
      if (result?.data?.success) {
        void queryClient.invalidateQueries({
          queryKey: queryKeys.home.settings(),
        });
        addToast({
          title: tCommon("success"),
          color: "success",
          description: tCommon("toast_homepage_saved"),
        });
        router.refresh();
      } else {
        addToast({
          title: tCommon("error"),
          color: "danger",
          description: getSafeActionErrorMessage(
            result ?? {},
            tApi,
            tCommon("toast_cannot_save_config"),
          ),
        });
      }
    },
    onError: (error: Error) => {
      addToast({
        title: tCommon("error"),
        color: "danger",
        description: error.message || tCommon("toast_cannot_save_config"),
      });
    },
  });

  const handleSave = () => {
    saveMutation.mutate();
  };

  const updateModuleContent = (
    id: string,
    newContent: Partial<HomeModule["content"]>,
  ) => {
    setModules((prev) =>
      prev.map((m) =>
        m.id === id
          ? ({
              ...m,
              // Content shape depends on module.type; editors ensure the right fields.
              content: { ...m.content, ...newContent },
            } as HomeModule)
          : m,
      ),
    );
  };

  const toggleVisibility = (id: string) => {
    setModules((prev) =>
      prev.map((m) => (m.id === id ? { ...m, isVisible: !m.isVisible } : m)),
    );
  };

  const handleDeleteModule = (id: string) => {
    setModules((prev) => {
      const filtered = prev.filter((m) => m.id !== id);

      if (activeModuleId === id && filtered.length > 0) {
        setActiveModuleId(filtered[0].id);
      }

      return filtered;
    });
  };

  return (
    <div
      className={cn(
        "flex flex-col overflow-hidden bg-[#f8fafc]",
        isFullScreen
          ? "fixed inset-0 z-[100] h-screen w-screen"
          : "h-[calc(100vh-64px)] w-full",
      )}
    >
      {/* Resizing Overlay (Captures mouse moves even over iframe) */}
      {resizing && (
        <div
          className="fixed inset-0 z-[100] cursor-col-resize select-none"
          role="presentation"
          onMouseUp={() => setResizing(null)}
        />
      )}

      {/* Header */}
      <nav className="flex items-center justify-between px-4 py-2 bg-white border-b border-slate-100 shrink-0 select-none">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 text-primary rounded-xl">
            <LucideIcons.Layout size={18} />
          </div>
          <div>
            <h1 className="text-sm font-black tracking-tight text-slate-800 uppercase">
              {tBuilder("homepage")}
            </h1>
            <p className="text-[9px] font-bold text-slate-400 border-l border-slate-200 ml-2 pl-2 uppercase tracking-widest leading-none">
              {tBuilder("brand_subtitle")}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex p-1 bg-slate-100 rounded-xl border border-slate-200/50">
            <button
              className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center transition-all",
                previewMode === "desktop"
                  ? "bg-white shadow-sm text-primary"
                  : "text-slate-400 hover:text-slate-600",
              )}
              title={tBuilder("preview_desktop")}
              onClick={() => setPreviewMode("desktop")}
            >
              <LucideIcons.Monitor size={14} />
            </button>
            <button
              className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center transition-all",
                previewMode === "mobile"
                  ? "bg-white shadow-sm text-primary"
                  : "text-slate-400 hover:text-slate-600",
              )}
              title={tBuilder("preview_mobile")}
              onClick={() => setPreviewMode("mobile")}
            >
              <LucideIcons.Smartphone size={14} />
            </button>
            <div className="w-[1px] h-4 bg-slate-200 mx-1 my-auto" />
            <div className="flex bg-slate-200/50 rounded-lg p-0.5">
              <button
                className={cn(
                  "px-2 py-1 rounded-md text-[9px] font-black transition-all",
                  previewLocale === "vi"
                    ? "bg-white text-primary shadow-sm"
                    : "text-slate-400",
                )}
                onClick={() => setPreviewLocale("vi")}
              >
                VI
              </button>
              <button
                className={cn(
                  "px-2 py-1 rounded-md text-[9px] font-black transition-all",
                  previewLocale === "en"
                    ? "bg-white text-primary shadow-sm"
                    : "text-slate-400",
                )}
                onClick={() => setPreviewLocale("en")}
              >
                EN
              </button>
            </div>
            <div className="w-[1px] h-4 bg-slate-200 mx-1 my-auto" />
            <button
              className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center transition-all",
                isPreviewMaximized
                  ? "bg-primary text-white shadow-md shadow-primary/20"
                  : "text-slate-400 hover:text-slate-600",
              )}
              title={
                isPreviewMaximized
                  ? tBuilder("preview_show_panels")
                  : tBuilder("preview_maximize")
              }
              onClick={() => {
                setIsPreviewMaximized(!isPreviewMaximized);
                if (!isPreviewMaximized) setPreviewMode("desktop");
              }}
            >
              <LucideIcons.Maximize2 size={14} />
            </button>
            <button
              className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center transition-all",
                isFullScreen
                  ? "bg-slate-800 text-white"
                  : "text-slate-400 hover:text-slate-600",
              )}
              title={
                isFullScreen
                  ? tBuilder("fullscreen_exit")
                  : tBuilder("fullscreen_enter")
              }
              onClick={() => setIsFullScreen(!isFullScreen)}
            >
              {isFullScreen ? (
                <LucideIcons.Minimize size={14} />
              ) : (
                <LucideIcons.Expand size={14} />
              )}
            </button>
          </div>

          <div className="h-8 w-[1px] bg-slate-100" />

          <div className="flex items-center gap-2">
            <button className="px-4 py-2 rounded-xl text-[10px] font-black uppercase text-slate-400 hover:text-danger tracking-widest transition-colors">
              {tBuilder("cancel")}
            </button>
            <Button
              className="font-black px-6 py-5 rounded-xl shadow-lg shadow-primary/25 text-[10px] tracking-widest"
              color="primary"
              isLoading={saveMutation.isPending}
              size="sm"
              startContent={<LucideIcons.Save size={16} strokeWidth={2.5} />}
              onPress={handleSave}
            >
              {tBuilder("save")}
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content Areas */}
      <main className="flex flex-1 overflow-hidden">
        {/* Left Side: Module Order */}
        {!isPreviewMaximized && (
          <>
            <div
              className="border-r border-slate-100 bg-slate-50/50 backdrop-blur-xl overflow-y-auto shrink-0 z-10 transition-all duration-500 animate-in slide-in-from-left-4"
              style={{ width: sidebarWidth }}
            >
              <ModuleSidebar
                activeId={activeModuleId}
                modules={modules}
                setModules={setModules}
                onSelect={setActiveModuleId}
                onToggleVisibility={toggleVisibility}
              />
            </div>
            {/* Sidebar Resize Handle (Improved) */}
            <div
              aria-label="Sidebar resize handle"
              aria-valuemax={400}
              aria-valuemin={200}
              aria-valuenow={sidebarWidth}
              className={cn(
                "w-6 -mx-3 cursor-col-resize z-50 transition-colors group relative shrink-0",
                resizing === "sidebar" ? "z-[101]" : "",
              )}
              role="slider"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "ArrowLeft")
                  setSidebarWidth((prev) => Math.max(200, prev - 10));
                if (e.key === "ArrowRight")
                  setSidebarWidth((prev) => Math.min(400, prev + 10));
              }}
              onMouseDown={() => setResizing("sidebar")}
            >
              <div
                className={cn(
                  "absolute inset-y-0 left-1/2 -translate-x-1/2 w-[2px] transition-colors",
                  resizing === "sidebar"
                    ? "bg-primary"
                    : "bg-slate-100 group-hover:bg-primary/30",
                )}
              />
              <div
                className={cn(
                  "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-8 bg-white border border-slate-200 rounded-md shadow-sm flex items-center justify-center transition-all z-50",
                  resizing === "sidebar"
                    ? "opacity-100 scale-110 border-primary shadow-primary/20"
                    : "opacity-0 group-hover:opacity-100",
                )}
              >
                <LucideIcons.GripVertical
                  className={cn(
                    "transition-colors",
                    resizing === "sidebar" ? "text-primary" : "text-slate-400",
                  )}
                  size={10}
                />
              </div>
            </div>
          </>
        )}

        {/* Middle: Detailed Settings */}
        {!isPreviewMaximized && (
          <>
            <div
              className="overflow-y-auto bg-white p-8 border-r border-slate-100 custom-scrollbar shrink-0 shadow-[20px_0_40px_-20px_rgba(0,0,0,0.05)] z-10 animate-in fade-in duration-700"
              style={{ width: editorWidth }}
            >
              {activeModule ? (
                <ModuleEditor
                  allDestinations={allDestinations}
                  module={activeModule}
                  onDelete={handleDeleteModule}
                  onUpdate={(content) =>
                    updateModuleContent(activeModule.id, content)
                  }
                />
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-300 gap-6 opacity-50">
                  <div className="p-8 border-4 border-dashed border-slate-100 rounded-[3rem]">
                    <LucideIcons.MousePointer2
                      className="animate-bounce"
                      size={64}
                      strokeWidth={1}
                    />
                  </div>
                  <p className="text-xs font-black uppercase tracking-[0.25em]">
                    {tBuilder("select_module")}
                  </p>
                </div>
              )}
            </div>
            {/* Editor Resize Handle (Improved) */}
            <div
              aria-label="Editor resize handle"
              aria-valuemax={800}
              aria-valuemin={300}
              aria-valuenow={editorWidth}
              className={cn(
                "w-6 -mx-3 cursor-col-resize z-50 transition-colors group relative shrink-0",
                resizing === "editor" ? "z-[101]" : "",
              )}
              role="slider"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "ArrowLeft")
                  setEditorWidth((prev) => Math.max(300, prev - 10));
                if (e.key === "ArrowRight")
                  setEditorWidth((prev) => Math.min(800, prev + 10));
              }}
              onMouseDown={() => setResizing("editor")}
            >
              <div
                className={cn(
                  "absolute inset-y-0 left-1/2 -translate-x-1/2 w-[2px] transition-colors",
                  resizing === "editor"
                    ? "bg-primary"
                    : "bg-slate-100 group-hover:bg-primary/30",
                )}
              />
              <div
                className={cn(
                  "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-8 bg-white border border-slate-200 rounded-md shadow-sm flex items-center justify-center transition-all z-50",
                  resizing === "editor"
                    ? "opacity-100 scale-110 border-primary shadow-primary/20"
                    : "opacity-0 group-hover:opacity-100",
                )}
              >
                <LucideIcons.GripVertical
                  className={cn(
                    "transition-colors",
                    resizing === "editor" ? "text-primary" : "text-slate-400",
                  )}
                  size={10}
                />
              </div>
            </div>
          </>
        )}

        {/* Right Side: Virtual Preview */}
        <div
          className={cn(
            "flex-1 min-w-0 bg-[#f8fafc] flex flex-col items-center justify-center transition-all duration-300 overflow-hidden relative",
            previewMode === "mobile" ? "p-10" : "p-0",
          )}
        >
          <NextIntlClientProvider
            locale={previewLocale}
            messages={messages[previewLocale]}
          >
            <DevicePreview
              allDestinations={allDestinations}
              locale={previewLocale}
              mode={previewMode}
              modules={modules}
            />
          </NextIntlClientProvider>
        </div>
      </main>
    </div>
  );
}
