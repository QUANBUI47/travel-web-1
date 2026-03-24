"use client";

import { Reorder, useDragControls } from "framer-motion";
import { HomeModule } from "@/lib/types/builder";
import * as LucideIcons from "lucide-react";
import { cn } from "@/lib/utils/index";
import { Button } from "@heroui/button";

interface ModuleSidebarProps {
  modules: HomeModule[];
  setModules: (modules: HomeModule[]) => void;
  activeId: string | null;
  onSelect: (id: string) => void;
  onToggleVisibility: (id: string) => void;
}

export function ModuleSidebar({
  modules,
  setModules,
  activeId,
  onSelect,
  onToggleVisibility,
}: ModuleSidebarProps) {
  
  const getIcon = (type: string) => {
    switch (type) {
      case 'HERO': return <LucideIcons.Tv2 size={16} />;
      case 'STATS': return <LucideIcons.Hash size={16} />;
      case 'DESTINATIONS': return <LucideIcons.MapPin size={16} />;
      case 'WHY_VIVU': return <LucideIcons.ShieldCheck size={16} />;
      case 'STORYTELLING': return <LucideIcons.Heart size={16} />;
      case 'FLASH_SALE': 
      case 'PROMOTION': 
        return <LucideIcons.Zap size={16} />;
      default: return <LucideIcons.Box size={16} />;
    }
  };

  const getName = (type: string) => {
    switch (type) {
      case 'HERO': return 'Banner chính';
      case 'STATS': return 'Số liệu uy tín';
      case 'DESTINATIONS': return 'Điểm đến Hot';
      case 'WHY_VIVU': return 'Tại sao chọn Vivu';
      case 'STORYTELLING': return 'Cảm hứng lữ hành';
      case 'FLASH_SALE': 
      case 'PROMOTION': 
        return 'Khuyến mại Flash Sale';
      default: return type;
    }
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between px-2">
        <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Thứ tự các Module</h3>
        <Button isIconOnly size="sm" variant="light" className="text-primary"><LucideIcons.Plus size={16}/></Button>
      </div>

      <Reorder.Group 
        axis="y" 
        values={modules} 
        onReorder={setModules}
        className="space-y-3"
      >
        {modules.map((item) => (
          <Reorder.Item 
            key={item.id} 
            value={item}
            className="focus:outline-none"
          >
            <div 
              onClick={() => onSelect(item.id)}
              className={cn(
                "group relative flex items-center justify-between p-4 rounded-[1.5rem] border transition-all cursor-pointer",
                activeId === item.id 
                  ? "bg-white text-primary border-primary shadow-sm ring-1 ring-primary/10" 
                  : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-white hover:border-slate-300"
              )}
            >
              <div className="flex items-center gap-3">
                <LucideIcons.GripVertical 
                    size={16} 
                    className={cn(
                        "text-slate-300",
                        activeId === item.id ? "text-primary/30" : "group-hover:text-primary/30"
                    )} 
                />
                <div className="flex items-center gap-2">
                  <span className={cn(
                      "p-2 rounded-xl",
                      activeId === item.id ? "bg-primary/10 text-primary" : "bg-white text-slate-400"
                  )}>
                    {getIcon(item.type)}
                  </span>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-widest leading-none mb-1 opacity-50">{item.type}</span>
                    <span className="text-xs font-black tracking-tight leading-none">{getName(item.type)}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-1">
                 <button 
                    onClick={(e) => {
                        e.stopPropagation();
                        onToggleVisibility(item.id);
                    }}
                    className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center transition-all",
                        activeId === item.id ? "text-primary hover:bg-primary/5" : "text-slate-400 hover:bg-slate-100"
                    )}
                >
                    {item.isVisible ? <LucideIcons.Eye size={14}/> : <LucideIcons.EyeOff size={14}/>}
                </button>
              </div>
            </div>
          </Reorder.Item>
        ))}
      </Reorder.Group>
    </div>
  );
}
