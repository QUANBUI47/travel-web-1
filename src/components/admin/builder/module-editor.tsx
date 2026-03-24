import React, { ReactNode, useState, useEffect } from "react";

import { HomeModule, ModuleType } from "@/lib/types/builder";
import * as LucideIcons from "lucide-react";
import { BilingualInput } from "@/components/admin/bilingual-input";
import { BilingualTextarea } from "@/components/admin/bilingual-textarea";
import { ImageUploader } from "@/components/ui/image-uploader";

interface ModuleEditorProps {
  module: HomeModule;
  onUpdate: (content: any) => void;
  allDestinations?: any[];
}

export function ModuleEditor({ module, onUpdate, allDestinations = [] }: ModuleEditorProps) {
  
  const renderEditor = () => {
    switch (module.type) {
      case 'HERO':
        return (
          <div className="space-y-8 animate-in fade-in duration-500">
            <BilingualInput 
              label="Tiêu đề chính (H1)" 
              name="heroTitle" 
              defaultValue={module.content?.heroTitle} 
              onValueChange={(val) => onUpdate({ heroTitle: val })}
            />
            <BilingualTextarea 
              label="Mô tả phụ" 
              name="heroDescription" 
              defaultValue={module.content?.heroDescription} 
              onValueChange={(val) => onUpdate({ heroDescription: val })}
            />
            
            <div className="grid gap-2">
               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Loại Banner</label>
               <div className="flex gap-2 p-1 bg-slate-100 rounded-xl w-fit">
                  <button 
                    onClick={() => onUpdate({ type: 'video' })} 
                    className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${module.content?.type === 'video' ? 'bg-white shadow-sm text-primary' : 'text-slate-400'}`}
                  >
                    Video
                  </button>
                  <button 
                    onClick={() => onUpdate({ type: 'image' })} 
                    className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${module.content?.type === 'image' ? 'bg-white shadow-sm text-primary' : 'text-slate-400'}`}
                  >
                    Hình ảnh
                  </button>
               </div>
            </div>

            <div className="grid gap-2">
               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                 URL Tài nguyên ({module.content?.type === 'video' ? 'MP4' : 'Hình ảnh'})
               </label>
               <div className="relative">
                  <LucideIcons.UploadCloud size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                  <input 
                    type="text" 
                    value={module.content?.type === 'video' ? module.content?.videoUrl : module.content?.posterUrl}
                    onChange={(e) => onUpdate(module.content?.type === 'video' ? { videoUrl: e.target.value } : { posterUrl: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 pl-12 text-xs font-mono outline-none focus:border-primary transition-colors"
                    placeholder="https://..."
                  />
               </div>
            </div>

            {(module.content?.type === 'image' || !module.content?.type) && (
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Bộ sưu tập hình ảnh</label>
                    <ImageUploader 
                        value={module.content?.heroImages || []} 
                        onChange={(urls) => onUpdate({ heroImages: urls })} 
                    />
                </div>
            )}

            <div className="grid grid-cols-2 gap-6">
                <BilingualInput 
                    label="Text nút bấm" 
                    name="buttonText" 
                    defaultValue={module.content?.buttonText} 
                    onValueChange={(val) => onUpdate({ buttonText: val })}
                />
                <BilingualInput 
                    label="Text Placeholder tìm kiếm" 
                    name="ctaText" 
                    defaultValue={module.content?.ctaText} 
                    onValueChange={(val) => onUpdate({ ctaText: val })}
                />
            </div>
          </div>
        );
      
      case 'WHY_VIVU':
        const iconList = [
          'ShieldCheck', 'Clock', 'Map', 'Zap', 'Star', 'Heart', 
          'Rocket', 'Search', 'Globe', 'Camera', 'Compass', 'Smile'
        ];
        
        return (
          <div className="space-y-8 animate-in fade-in duration-500">
             {/* Section Header Editor */}
             <div className="p-6 bg-primary/5 rounded-[2rem] border border-primary/10 space-y-6">
                <div className="flex items-center gap-2 mb-2">
                    <LucideIcons.Layout size={18} className="text-primary" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-primary">Cấu hình tiêu đề vùng</span>
                </div>
                <BilingualInput 
                    label="Tiêu đề chính vùng" 
                    name="why_section_title"
                    value={module.content?.sectionTitle}
                    onValueChange={(val) => onUpdate({ sectionTitle: val })}
                />
                <BilingualTextarea 
                    label="Mô tả phụ vùng" 
                    name="why_section_subtitle"
                    value={module.content?.sectionSubtitle}
                    onValueChange={(val) => onUpdate({ sectionSubtitle: val })}
                />
             </div>

             <hr className="border-slate-100" />

             <div className="flex items-center gap-2 px-2">
                <LucideIcons.List size={18} className="text-slate-400" />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Danh sách các mục đặc điểm</span>
             </div>

             {(module.content?.items || []).map((item: any, idx: number) => (
                <div key={idx} className="relative group p-6 bg-slate-50/50 rounded-3xl border border-slate-100 hover:border-primary/20 hover:bg-white transition-all space-y-6">
                  <div className="flex flex-col gap-4">
                    <div className="flex justify-between items-center">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Hình ảnh hoặc Biểu tượng</label>
                        <span className="text-[10px] font-bold text-primary bg-primary/5 px-2 py-0.5 rounded-full">Mục #{idx + 1}</span>
                    </div>

                    <div className="space-y-6">
                        {/* Biểu tượng Library */}
                        <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm space-y-3">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">1. Chọn từ thư viện Icon</p>
                            <div className="flex flex-wrap gap-2">
                                {iconList.map(iconName => {
                                    const IconNode = (LucideIcons as any)[iconName] || LucideIcons.HelpCircle;
                                    const isSelected = item.icon === iconName && !item.imageUrl;
                                    return (
                                        <button 
                                            key={iconName}
                                            onClick={() => {
                                                const newItems = [...module.content.items];
                                                newItems[idx].icon = iconName;
                                                newItems[idx].imageUrl = ''; // Clear image if icon picked
                                                onUpdate({ items: newItems });
                                            }}
                                            className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-all ${isSelected ? 'bg-primary border-primary text-white shadow-md' : 'bg-slate-50 border-slate-100 text-slate-400 hover:border-primary/40 hover:text-primary'}`}
                                            title={iconName}
                                        >
                                            <IconNode size={18} strokeWidth={isSelected ? 2.5 : 1.5} />
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Tải ảnh lên */}
                        <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm space-y-3">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">2. Hoặc tải ảnh/biểu tượng riêng</p>
                            <ImageUploader 
                                value={item.imageUrl ? [item.imageUrl] : []}
                                maxFiles={1}
                                onChange={(urls) => {
                                    const newItems = [...module.content.items];
                                    newItems[idx].imageUrl = urls[0] || '';
                                    onUpdate({ items: newItems });
                                }}
                            />
                        </div>
                    </div>
                  </div>

                  <hr className="border-slate-100" />

                  <BilingualInput 
                    label="Tiêu đề" 
                    name={`why_title_${idx}`}
                    value={item.title}
                    onValueChange={(val) => {
                        const newItems = [...module.content.items];
                        newItems[idx].title = val;
                        onUpdate({ items: newItems });
                    }}
                  />

                  <BilingualTextarea 
                    label="Mô tả" 
                    name={`why_desc_${idx}`}
                    value={item.desc}
                    onValueChange={(val) => {
                        const newItems = [...module.content.items];
                        newItems[idx].desc = val;
                        onUpdate({ items: newItems });
                    }}
                  />

                  <button 
                    onClick={() => {
                        const newItems = (module.content.items || []).filter((_: any, i: number) => i !== idx);
                        onUpdate({ items: newItems });
                    }}
                    className="absolute -top-2 -right-2 w-8 h-8 bg-white shadow-xl border border-slate-100 rounded-full flex items-center justify-center text-danger opacity-0 group-hover:opacity-100 transition-all hover:scale-110 active:scale-90 z-20"
                  >
                    <LucideIcons.Trash2 size={14}/>
                  </button>
                </div>
             ))}

             <button 
                onClick={() => {
                    const newItems = [...(module.content?.items || []), { 
                        icon: 'ShieldCheck', 
                        imageUrl: '',
                        title: { vi: '', en: '' }, 
                        desc: { vi: '', en: '' } 
                    }];
                    onUpdate({ items: newItems });
                }}
                className="w-full py-8 border-2 border-dashed border-slate-200 rounded-[2.5rem] text-[10px] font-black uppercase text-slate-400 hover:border-primary hover:text-primary hover:bg-primary/5 transition-all flex flex-col items-center justify-center gap-2 group"
             >
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                    <LucideIcons.Plus size={20}/>
                </div>
                Thêm mục Why Vivu mới
             </button>
          </div>
        );

      case 'STATS':
        return (
          <div className="space-y-4 animate-in fade-in duration-500">
             <div className="flex justify-between items-center mb-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Danh sách thông số</label>
                <button 
                    onClick={() => {
                        const newItems = [...(module.content?.items || [])];
                        newItems.push({ label: { vi: 'Mới', en: 'New' }, value: '0' });
                        onUpdate({ items: newItems });
                    }}
                    className="text-primary text-[10px] font-bold uppercase flex items-center gap-1 hover:underline"
                >
                    <LucideIcons.Plus size={14}/> Thêm mới
                </button>
             </div>

             {(module.content?.items || []).map((stat: any, idx: number) => (
                <div key={idx} className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex flex-col gap-4 relative group">
                  <div className="flex gap-4">
                      <div className="flex-1">
                        <BilingualInput 
                            label="Nhãn hiển thị" 
                            name={`stat-label-${idx}`}
                            defaultValue={stat.label} 
                            onValueChange={(val) => {
                                const newItems = [...module.content.items];
                                newItems[idx].label = val;
                                onUpdate({ items: newItems });
                            }}
                        />
                      </div>
                      <div className="w-32">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Giá trị</label>
                        <input 
                            type="text" 
                            value={stat.value}
                            onChange={(e) => {
                                const newItems = [...module.content.items];
                                newItems[idx].value = e.target.value;
                                onUpdate({ items: newItems });
                            }}
                            className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm font-black text-primary outline-none focus:border-primary"
                        />
                      </div>
                  </div>
                  <button 
                    onClick={() => {
                        const newItems = (module.content.items || []).filter((_: any, i: number) => i !== idx);
                        onUpdate({ items: newItems });
                    }}
                    className="absolute -top-2 -right-2 w-8 h-8 bg-white shadow-md border border-slate-100 rounded-full flex items-center justify-center text-danger opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
                  >
                    <LucideIcons.Trash2 size={14}/>
                  </button>
               </div>
             ))}

             {(!module.content?.items || module.content.items.length === 0) && (
                <button 
                    onClick={() => onUpdate({ items: [{ label: { vi: 'Số lượng', en: 'Count' }, value: '100' }] })}
                    className="w-full py-8 border-2 border-dashed border-slate-200 rounded-3xl text-[10px] font-black uppercase text-slate-400 hover:border-primary hover:text-primary transition-all flex items-center justify-center gap-2"
                >
                    <LucideIcons.Plus size={16}/> Khởi tạo danh sách thông số
                </button>
             )}
          </div>
        );

      case 'FLASH_SALE':
      case 'PROMOTION':
          return (
          <div className="space-y-6 animate-in fade-in duration-500">
             <BilingualInput 
                label="Nội dung khuyến mại" 
                name="promoContent" 
                defaultValue={module.content?.content} 
                onValueChange={(val) => onUpdate({ content: val })}
             />
             <div className="grid gap-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ngày kết thúc (Flash Sale)</label>
                <div className="relative">
                   <LucideIcons.Clock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                   <input 
                     type="text" 
                     value={module.content?.deadline}
                     onChange={(e) => onUpdate({ deadline: e.target.value })}
                     placeholder="YYYY-MM-DD HH:mm:ss"
                     className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 pl-12 text-sm font-bold outline-none focus:border-primary"
                   />
                </div>
             </div>
             <div className="grid gap-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Chủ đề hiển thị (Theme)</label>
                <div className="flex gap-4">
                    {['gold', 'blue', 'dark'].map((t) => (
                        <button 
                            key={t}
                            onClick={() => onUpdate({ theme: t })}
                            className={`flex-1 py-3 rounded-xl border-2 capitalize font-bold text-xs transition-all ${module.content?.theme === t ? 'border-primary bg-primary/5 text-primary' : 'border-slate-100 text-slate-400'}`}
                        >
                            {t}
                        </button>
                    ))}
                </div>
             </div>

             <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Hình nền Banner (Tùy chọn)</label>
                <ImageUploader 
                    value={module.content?.backgroundImage ? [module.content.backgroundImage] : []} 
                    onChange={(urls) => onUpdate({ backgroundImage: urls[0] })} 
                />
                <p className="text-[10px] text-slate-400 italic px-1">Lưu ý: Nếu có hình nền, hệ thống sẽ ưu tiên hiển thị hình nền thay cho màu Gradient.</p>
             </div>
          </div>
        );

      case 'DESTINATIONS': {
        const toggleDestination = (id: string) => {
            const currentIds = module.content?.selectedIds || [];
            if (currentIds.includes(id)) {
                onUpdate({ selectedIds: currentIds.filter((cid: string) => cid !== id) });
            } else {
                onUpdate({ selectedIds: [...currentIds, id] });
            }
        };

        const isLoadingDests = allDestinations.length === 0 && module.type === 'DESTINATIONS';

        return (
          <div className="space-y-6 animate-in fade-in duration-500">
            <BilingualInput 
                label="Tiêu đề vùng" 
                name="sectionTitle" 
                defaultValue={module.content?.sectionTitle} 
                onValueChange={(val) => onUpdate({ sectionTitle: val })}
            />
            
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                        Chọn từ kho địa điểm ({module.content?.selectedIds?.length || 0})
                    </label>
                    <a 
                      href="/admin/destinations" 
                      target="_blank"
                      className="text-[10px] font-bold text-primary flex items-center gap-1 hover:underline"
                    >
                        + Tạo địa điểm mới trong kho
                    </a>
                </div>
                 {isLoadingDests ? (
                    <div className="flex items-center justify-center p-12 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                        <LucideIcons.Loader2 className="animate-spin text-primary" size={24} />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                        {allDestinations.map((dest: any) => {
                            const isSelected = (module.content?.selectedIds || []).includes(dest.id);
                            return (
                                <button
                                    key={dest.id}
                                    onClick={() => toggleDestination(dest.id)}
                                    className={`flex items-center gap-4 p-4 rounded-2xl border transition-all text-left ${isSelected ? 'bg-primary/5 border-primary/40 shadow-sm' : 'bg-white border-slate-100 hover:border-slate-300'}`}
                                >
                                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
                                        {dest.imageUrl ? (
                                            <img src={dest.imageUrl} alt={dest.nameVi} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-slate-300">
                                                <LucideIcons.Image size={20} />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-black text-slate-800 truncate">{dest.nameVi}</p>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{dest.region?.nameVi || 'N/A'}</p>
                                    </div>
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${isSelected ? 'bg-primary text-white scale-110' : 'bg-slate-100 border border-slate-200'}`}>
                                        {isSelected && <LucideIcons.Check size={14} strokeWidth={4} />}
                                    </div>
                                </button>
                            );
                        })}
                         {allDestinations.length === 0 && (
                            <div className="p-8 text-center text-slate-400 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                                <p className="text-xs font-bold uppercase tracking-widest">Kho địa điểm trống</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
          </div>
        );
      }

      default:
        return (
          <div className="p-12 text-center text-slate-300 flex flex-col items-center gap-4">
            <LucideIcons.Construction size={48} strokeWidth={1}/>
            <p className="text-sm font-medium italic">Chưa có trình chỉnh sửa nâng cao cho module {module.type}</p>
          </div>
        );
    }
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
        <div className="p-2 bg-primary/10 text-primary rounded-xl">
          <LucideIcons.Settings2 size={20} />
        </div>
        <div>
          <h2 className="text-lg font-black tracking-tighter text-slate-900 uppercase">Cấu hình: {module.type}</h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Vivu Editor</p>
        </div>
      </div>

      {renderEditor()}
      
      <div className="pt-6 border-t border-slate-100">
         <div className="bg-blue-50/30 p-4 rounded-2xl border border-blue-100/50 flex items-center justify-between">
            <div className="flex items-center gap-3 text-primary">
                <LucideIcons.ShieldCheck size={16}/>
                <span className="text-[10px] font-bold uppercase tracking-widest">Dữ liệu an toàn</span>
            </div>
            <button className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-danger flex items-center gap-2 transition-colors">
                <LucideIcons.Trash2 size={12}/> Xóa module
            </button>
         </div>
      </div>
    </div>
  );
}
