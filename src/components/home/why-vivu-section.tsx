import * as LucideIcons from "lucide-react";
import { getLocalizedValue } from "@/lib/utils/i18n";
import Image from "next/image";

interface WhyVivuSectionProps {
  content: any;
  locale: string;
}

import { PlayCircle, ShieldCheck, ChevronRight } from "lucide-react";

export function WhyVivuSection({ content, locale }: WhyVivuSectionProps) {
  const items = content?.items || [];
  const sectionTitle = getLocalizedValue(content?.sectionTitle, locale) || "Nâng tầm trải nghiệm Việt.";
  const sectionSubtitle = getLocalizedValue(content?.sectionSubtitle, locale) || "Chúng tôi không chỉ bán tour, chúng tôi thiết kế những mảnh ghép ký ức tuyệt đẹp cho hành trình của bạn.";
  const featuredImage = content?.featuredImage || "https://images.unsplash.com/photo-1506461883276-594a12b11cf3?q=80&w=1200";

  return (
    <section className="bg-slate-50 py-16 lg:py-20 mb-12 overflow-hidden relative">
         <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-100/10 rounded-full blur-[120px] translate-x-1/2 -translate-y-1/2"></div>
         <div className="w-full px-8 lg:px-20 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
            <div className="relative w-full">
               <div className="w-full aspect-[4/3] lg:aspect-square rounded-[2.5rem] lg:rounded-[3.5rem] overflow-hidden shadow-2xl relative z-10">
                  <Image src={featuredImage} alt="Travel guide" fill className="object-cover" />
                  <div className="absolute inset-0 bg-blue-900/5"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                     <PlayCircle size={80} className="text-white/80 animate-pulse cursor-pointer hover:text-white transition-colors" />
                  </div>
               </div>
               <div className="absolute -bottom-6 -right-6 w-48 h-48 lg:-bottom-8 lg:-right-8 lg:w-64 lg:h-64 bg-[#fcc219] rounded-[2rem] lg:rounded-[2.5rem] -z-0 shadow-xl opacity-40 lg:opacity-50"></div>
            </div>

            <div className="space-y-8 text-left">
               <div className="space-y-4">
                  <span className="text-primary font-black uppercase tracking-[0.4em] text-[10px]">Tại sao chọn Vivu?</span>
                  <h2 className="text-4xl lg:text-5xl font-black font-['Plus_Jakarta_Sans'] tracking-tighter leading-tight text-slate-900">
                    {sectionTitle}
                  </h2>
                  <p className="text-slate-500 text-lg leading-relaxed font-medium">
                    {sectionSubtitle}
                  </p>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 mt-4 pt-6 border-t border-slate-100">
                  {items.map((item: any, i: number) => {
                    const IconNode = (LucideIcons as any)[item.icon] || ShieldCheck;
                    return (
                      <div key={i} className="flex gap-4 group cursor-default">
                         <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center text-primary group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-500 shrink-0">
                            {item.imageUrl ? (
                                <Image src={item.imageUrl} alt={getLocalizedValue(item.title, locale)} width={24} height={24} className="w-6 h-6 object-contain" />
                            ) : (
                                <IconNode size={22} strokeWidth={2.5} />
                            )}
                         </div>
                         <div>
                            <h4 className="font-black text-[11px] uppercase tracking-widest mb-1 text-slate-800">{getLocalizedValue(item.title, locale)}</h4>
                            <p className="text-[10px] text-slate-400 font-bold leading-relaxed uppercase tracking-wide">{getLocalizedValue(item.desc, locale)}</p>
                         </div>
                      </div>
                    );
                  })}
               </div>
            </div>
         </div>
      </section>
  );
}
