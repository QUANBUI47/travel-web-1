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
        <section id='destinations' className='px-4'>
            <div className='flex justify-between items-end mb-16 px-4'>
                <div>
                    <h2 className='text-4xl lg:text-5xl font-black tracking-tighter mb-4 uppercase'>{title}</h2>
                    <p className='text-slate-400 text-sm font-bold uppercase tracking-[0.2em]'>{t("Destinations.description")}</p>
                </div>
                <Button variant='flat' color='primary' className='font-black rounded-2xl h-14' endContent={<ChevronRight size={20}/>}>
                    {t("Destinations.view_all")}
                </Button>
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8'>
                {finalDestinations.map((item: any, i: number) => (
                    <div key={item.id || i} className='group relative h-[500px] rounded-[3rem] overflow-hidden shadow-xl cursor-pointer'>
                        <Image 
                            src={item.imageUrl || "https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=2070&auto=format&fit=crop"} 
                            alt={item.nameVi} 
                            fill 
                            className='object-cover transition-transform duration-1000 group-hover:scale-110' 
                        />
                        <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-10'>
                            <h4 className='text-white text-3xl font-black mb-1'>
                                {locale === 'vi' ? item.nameVi : (item.nameEn || item.nameVi)}
                            </h4>
                            <p className='text-white/70 text-sm font-bold'>{t("Destinations.stays_count", { count: "1,200+" })}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
