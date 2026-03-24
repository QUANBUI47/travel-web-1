"use client";

import { ChevronRight } from "lucide-react";
import { Button } from "@heroui/button";
import Image from "next/image";
import { getLocalizedValue } from "@/lib/utils/i18n";

interface DestinationsSectionProps {
  content: any;
  locale: string;
  t: (key: string, values?: any) => string;
  allDestinations: any[];
}

export function DestinationsSection({ content, locale, t, allDestinations }: DestinationsSectionProps) {
    const title = getLocalizedValue(content?.sectionTitle, locale) || t("Destinations.title");
    const selectedIds = content?.selectedIds || [];
    
    // Filter and sort destinations based on selection
    const displayDestinations = (allDestinations || [])
        .filter((d: any) => selectedIds.includes(d.id))
        .sort((a: any, b: any) => selectedIds.indexOf(a.id) - selectedIds.indexOf(b.id));

    // Fallback if none selected
    const finalDestinations = displayDestinations.length > 0 ? displayDestinations : (allDestinations || []).slice(0, 4);

    return (
        <section id='destinations' className='px-4 py-12'>
            <div className='flex justify-between items-end mb-12 px-4'>
                <div>
                    <h2 className='text-3xl lg:text-4xl font-black tracking-tight mb-3 uppercase'>{title}</h2>
                    <p className='text-slate-400 text-xs font-bold uppercase tracking-[0.2em]'>{t("Destinations.description")}</p>
                </div>
                <Button 
                    variant='flat' 
                    color='primary' 
                    suppressHydrationWarning
                    className='font-black rounded-xl h-12 text-xs tracking-widest' 
                    endContent={<ChevronRight size={16}/>}
                >
                    {t("Destinations.view_all")}
                </Button>
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
                {finalDestinations.map((item: any, i: number) => (
                    <div key={item.id || i} className='group relative h-[360px] rounded-3xl overflow-hidden shadow-lg cursor-pointer'>
                        <Image 
                            src={item.imageUrl || "https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=2070&auto=format&fit=crop"} 
                            alt={item.nameVi} 
                            fill 
                            className='object-cover transition-transform duration-1000 group-hover:scale-110' 
                        />
                        <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-6'>
                            <h4 className='text-white text-xl font-black mb-1 leading-tight'>
                                {locale === 'vi' ? item.nameVi : (item.nameEn || item.nameVi)}
                            </h4>
                            <p className='text-white/70 text-[9px] font-bold uppercase tracking-widest'>{t("Destinations.stays_count", { count: "1,200+" })}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
