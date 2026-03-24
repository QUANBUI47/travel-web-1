"use client";

import { useState, useEffect } from "react";
import { Button } from "@heroui/button";
import { HomeModule, migrateToModules } from "@/lib/types/builder";
import { ModuleSidebar } from "./module-sidebar";
import { ModuleEditor } from "./module-editor";
import { DevicePreview } from "./device-preview";
import { addToast } from "@heroui/toast";
import { useRouter } from "next/navigation";
import * as LucideIcons from "lucide-react";
import { cn } from "@/lib/utils/index";

interface HomeBuilderProps {
  initialData: any;
}

export function HomeBuilder({ initialData }: HomeBuilderProps) {
  const [modules, setModules] = useState<HomeModule[]>([]);
  const [activeModuleId, setActiveModuleId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isPreviewMaximized, setIsPreviewMaximized] = useState(false);
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">(
    "mobile",
  );
  const [allDestinations, setAllDestinations] = useState<any[]>([]);
  const router = useRouter();

  // Resize States
  const [sidebarWidth, setSidebarWidth] = useState(256);
  const [editorWidth, setEditorWidth] = useState(420);
  const [resizing, setResizing] = useState<"sidebar" | "editor" | null>(null);

  useEffect(() => {
    const migrated = migrateToModules(initialData);
    setModules(migrated);
    if (migrated.length > 0 && !activeModuleId) {
      setActiveModuleId(migrated[0].id);
    }

    // Fetch destinations for preview
    const fetchDests = async () => {
      try {
        const res = await fetch("/api/v1/destinations");
        const data = await res.json();
        if (data.success) setAllDestinations(data.data);
      } catch (e) {
        console.error("Failed to fetch destinations", e);
      }
    };
    fetchDests();
  }, [initialData, activeModuleId]);

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

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch("/api/v1/settings/home", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ modules }),
      });

      if (response.ok) {
        addToast({
          title: "Thành công",
          color: "success",
          description: "Đã lưu cấu hình trang chủ",
        });
        router.refresh();
      } else {
        throw new Error("Lỗi lưu dữ liệu");
      }
    } catch (error) {
      addToast({
        title: "Lỗi",
        color: "danger",
        description: "Không thể lưu cấu hình",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const updateModuleContent = (id: string, newContent: any) => {
    setModules((prev) =>
      prev.map((m) =>
        m.id === id ? { ...m, content: { ...m.content, ...newContent } } : m,
      ),
    );
  };

  const toggleVisibility = (id: string) => {
    setModules((prev) =>
      prev.map((m) => (m.id === id ? { ...m, isVisible: !m.isVisible } : m)),
    );
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
          onMouseMove={(e) => {
            // Mouse move handled by window listener in useEffect
          }}
          onMouseUp={() => setResizing(null)}
        />
      )}

      {/* Header */}
      <nav className='flex items-center justify-between px-4 py-2 bg-white border-b border-slate-100 shrink-0 select-none'>
        <div className='flex items-center gap-3'>
          <div className='p-2 bg-primary/10 text-primary rounded-xl'>
            <LucideIcons.Layout size={18} />
          </div>
          <div>
            <h1 className='text-sm font-black tracking-tight text-slate-800 uppercase'>
              Trang chủ
            </h1>
            <p className='text-[9px] font-bold text-slate-400 border-l border-slate-200 ml-2 pl-2 uppercase tracking-widest leading-none'>
              Vivu Builder
            </p>
          </div>
        </div>

        <div className='flex items-center gap-6'>
          <div className='flex p-1 bg-slate-100 rounded-xl border border-slate-200/50'>
            <button
              onClick={() => setPreviewMode("desktop")}
              title='Desktop Preview'
              className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center transition-all",
                previewMode === "desktop"
                  ? "bg-white shadow-sm text-primary"
                  : "text-slate-400 hover:text-slate-600",
              )}
            >
              <LucideIcons.Monitor size={14} />
            </button>
            <button
              onClick={() => setPreviewMode("mobile")}
              title='Mobile Preview'
              className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center transition-all",
                previewMode === "mobile"
                  ? "bg-white shadow-sm text-primary"
                  : "text-slate-400 hover:text-slate-600",
              )}
            >
              <LucideIcons.Smartphone size={14} />
            </button>
            <div className='w-[1px] h-4 bg-slate-200 mx-1 my-auto' />
            <button
              onClick={() => {
                setIsPreviewMaximized(!isPreviewMaximized);
                if (!isPreviewMaximized) setPreviewMode("desktop");
              }}
              title={isPreviewMaximized ? "Show Panels" : "Maximize Preview"}
              className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center transition-all",
                isPreviewMaximized
                  ? "bg-primary text-white shadow-md shadow-primary/20"
                  : "text-slate-400 hover:text-slate-600",
              )}
            >
              <LucideIcons.Maximize2 size={14} />
            </button>
            <button
              onClick={() => setIsFullScreen(!isFullScreen)}
              title={isFullScreen ? "Exit Fullscreen" : "Fullscreen Workspace"}
              className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center transition-all",
                isFullScreen
                  ? "bg-slate-800 text-white"
                  : "text-slate-400 hover:text-slate-600",
              )}
            >
              {isFullScreen ? (
                <LucideIcons.Minimize size={14} />
              ) : (
                <LucideIcons.Expand size={14} />
              )}
            </button>
          </div>

          <div className='h-8 w-[1px] bg-slate-100' />

          <div className='flex items-center gap-2'>
            <button className='px-4 py-2 rounded-xl text-[10px] font-black uppercase text-slate-400 hover:text-danger tracking-widest transition-colors'>
              Hủy bỏ
            </button>
            <Button
              color='primary'
              size='sm'
              className='font-black px-6 py-5 rounded-xl shadow-lg shadow-primary/25 text-[10px] tracking-widest'
              startContent={<LucideIcons.Save size={16} strokeWidth={2.5} />}
              onPress={handleSave}
              isLoading={isSaving}
            >
              LƯU THIẾT LẬP
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content Areas */}
      <main className='flex flex-1 overflow-hidden'>
        {/* Left Side: Module Order */}
        {!isPreviewMaximized && (
          <>
            <div
              style={{ width: sidebarWidth }}
              className='border-r border-slate-100 bg-white/40 backdrop-blur-sm overflow-y-auto shrink-0 z-10'
            >
              <ModuleSidebar
                modules={modules}
                setModules={setModules}
                activeId={activeModuleId}
                onSelect={setActiveModuleId}
                onToggleVisibility={toggleVisibility}
              />
            </div>
            {/* Sidebar Resize Handle (Improved) */}
            <div
              onMouseDown={() => setResizing("sidebar")}
              className={cn(
                "w-6 -mx-3 cursor-col-resize z-50 transition-colors group relative shrink-0",
                resizing === "sidebar" ? "z-[101]" : ""
              )}
            >
              <div className={cn(
                "absolute inset-y-0 left-1/2 -translate-x-1/2 w-[2px] transition-colors",
                resizing === "sidebar" ? "bg-primary" : "bg-slate-100 group-hover:bg-primary/30"
              )} />
              <div className={cn(
                "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-8 bg-white border border-slate-200 rounded-md shadow-sm flex items-center justify-center transition-all z-50",
                resizing === "sidebar" ? "opacity-100 scale-110 border-primary shadow-primary/20" : "opacity-0 group-hover:opacity-100"
              )}>
                <LucideIcons.GripVertical
                  size={10}
                  className={cn("transition-colors", resizing === "sidebar" ? "text-primary" : "text-slate-400")}
                />
              </div>
            </div>
          </>
        )}

        {/* Middle: Detailed Settings */}
        {!isPreviewMaximized && (
          <>
            <div
              style={{ width: editorWidth }}
              className='overflow-y-auto bg-white p-6 border-r border-slate-100 custom-scrollbar shrink-0 shadow-sm z-10'
            >
              {activeModule ? (
                <ModuleEditor
                  module={activeModule}
                  onUpdate={(content) =>
                    updateModuleContent(activeModule.id, content)
                  }
                  allDestinations={allDestinations}
                />
              ) : (
                <div className='h-full flex flex-col items-center justify-center text-slate-300 gap-6 opacity-50'>
                  <div className='p-8 border-4 border-dashed border-slate-100 rounded-3xl'>
                    <LucideIcons.MousePointer2
                      size={64}
                      strokeWidth={1}
                      className='animate-bounce'
                    />
                  </div>
                  <p className='text-xs font-black uppercase tracking-[0.2em]'>
                    Chọn một module để bắt đầu thiết kế
                  </p>
                </div>
              )}
            </div>
            {/* Editor Resize Handle (Improved) */}
            <div
              onMouseDown={() => setResizing("editor")}
              className={cn(
                "w-6 -mx-3 cursor-col-resize z-50 transition-colors group relative shrink-0",
                resizing === "editor" ? "z-[101]" : ""
              )}
            >
              <div className={cn(
                "absolute inset-y-0 left-1/2 -translate-x-1/2 w-[2px] transition-colors",
                resizing === "editor" ? "bg-primary" : "bg-slate-100 group-hover:bg-primary/30"
              )} />
              <div className={cn(
                "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-8 bg-white border border-slate-200 rounded-md shadow-sm flex items-center justify-center transition-all z-50",
                resizing === "editor" ? "opacity-100 scale-110 border-primary shadow-primary/20" : "opacity-0 group-hover:opacity-100"
              )}>
                <LucideIcons.GripVertical
                  size={10}
                  className={cn("transition-colors", resizing === "editor" ? "text-primary" : "text-slate-400")}
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
          <DevicePreview
            modules={modules}
            mode={previewMode}
            allDestinations={allDestinations}
          />
        </div>
      </main>
    </div>
  );
}
