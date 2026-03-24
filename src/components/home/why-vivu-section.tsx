import * as LucideIcons from "lucide-react";
import { getLocalizedValue } from "@/lib/utils/i18n";
import Image from "next/image";

interface WhyVivuSectionProps {
  content: any;
  locale: string;
}

const IconMap: Record<string, any> = {
  ShieldCheck: LucideIcons.ShieldCheck,
  Clock: LucideIcons.Clock,
  Map: LucideIcons.Map,
  Zap: LucideIcons.Zap,
  Star: LucideIcons.Star,
  Heart: LucideIcons.Heart,
  Rocket: LucideIcons.Rocket,
  Search: LucideIcons.Search,
  Globe: LucideIcons.Globe,
  Camera: LucideIcons.Camera,
  Compass: LucideIcons.Compass,
  Smile: LucideIcons.Smile,
};

export function WhyVivuSection({ content, locale }: WhyVivuSectionProps) {
  const items = content?.items || [];
  const sectionTitle = getLocalizedValue(content?.sectionTitle, locale);
  const sectionSubtitle = getLocalizedValue(content?.sectionSubtitle, locale);

  return (
    <section className="py-12 bg-white relative overflow-hidden">
      {/* Subtle Background Decorations */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
      <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-slate-50 to-transparent" />
      
      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        {(sectionTitle || sectionSubtitle) && (
            <div className="max-w-2xl mx-auto text-center mb-12 space-y-3">
                {sectionTitle && (
                    <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight uppercase">
                        {sectionTitle}
                    </h2>
                )}
                {sectionSubtitle && (
                    <p className="text-slate-500 text-sm md:text-base leading-relaxed font-medium">
                        {sectionSubtitle}
                    </p>
                )}
                <div className="w-12 h-1 bg-primary mx-auto rounded-full mt-4" />
            </div>
        )}

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {items.map((item: any, i: number) => {
            const Icon = IconMap[item.icon] || LucideIcons.ShieldCheck;
            const title = getLocalizedValue(item.title, locale);
            const desc = getLocalizedValue(item.desc, locale);

            return (
              <div key={i} className="flex flex-col items-center text-center p-8 bg-slate-50/30 rounded-3xl border border-slate-100/50 hover:bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                <div className="w-14 h-14 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-sm">
                   {item.imageUrl ? (
                     <div className="relative w-7 h-7">
                       <Image 
                        src={item.imageUrl} 
                        alt={title || "Icon"} 
                        fill
                        className="object-contain group-hover:brightness-0 group-hover:invert transition-all"
                       />
                     </div>
                   ) : (
                     <Icon size={28} strokeWidth={1.5} />
                   )}
                </div>
                
                <h3 className="font-bold text-lg mb-3 text-slate-900">
                  {title}
                </h3>
                <p className="text-slate-500 text-xs leading-relaxed max-w-[240px]">
                  {desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
