"use client";

import { ChevronRight, PlusCircle, Star, Heart, MapPin, Calendar } from "lucide-react";
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
        <section id='destinations' className='w-full px-6 lg:px-10 py-10 mb-8'>
            <div className='flex flex-col md:flex-row justify-between items-end mb-10 gap-6'>
                <div className='flex flex-col gap-2'>
                    <span className="text-primary font-black uppercase tracking-[0.4em] text-[10px] block mb-1">Cảm hứng bất tận</span>
                    <h2 className='text-3xl md:text-5xl font-black font-["Plus_Jakarta_Sans"] tracking-tighter leading-[1.3] md:leading-[1.1] uppercase text-slate-900'>{title}</h2>
                </div>
                <Button 
                    variant='light' 
                    color='primary' 
                    suppressHydrationWarning
                    className='font-black rounded-xl h-12 px-6 text-[10px] tracking-widest flex items-center gap-2 group hover:bg-slate-50 transition-all' 
                    endContent={<ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />}
                >
                    XEM TẤT CẢ
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-none md:grid-rows-2 gap-8 h-auto md:h-[850px]">
                {/* Item 1: Large Feature (Left) */}
                {finalDestinations[0] && (
                    <div className="md:col-span-2 md:row-span-2 relative rounded-[4rem] overflow-hidden group cursor-pointer shadow-xl h-[450px] md:h-full transition-all hover:shadow-2xl hover:shadow-primary/10">
                        <Image 
                            src={finalDestinations[0].imageUrl || "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?q=80&w=1200"} 
                            alt={finalDestinations[0].nameVi}
                            fill
                            className="object-cover transition-transform duration-1000 group-hover:scale-105" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-10">
                            <span className="bg-[#fcc219] text-slate-900 w-fit px-4 py-1 rounded-full text-[9px] font-black uppercase mb-4 shadow-lg">Kỳ quan</span>
                            <h3 className="text-3xl md:text-4xl font-black text-white font-['Plus_Jakarta_Sans'] leading-none">
                                {locale === 'vi' ? finalDestinations[0].nameVi : (finalDestinations[0].nameEn || finalDestinations[0].nameVi)}
                            </h3>
                        </div>
                    </div>
                )}

                {/* Item 2: Horizontal Medium (Top Right) */}
                {finalDestinations[1] && (
                    <div className="md:col-span-2 relative rounded-[4rem] overflow-hidden group cursor-pointer h-[280px] md:h-full shadow-lg">
                        <Image 
                            src={finalDestinations[1].imageUrl || "https://images.unsplash.com/photo-1599708153386-62bf3f03597d?q=80&w=1200"} 
                            alt={finalDestinations[1].nameVi}
                            fill
                            className="object-cover transition-transform duration-1000 group-hover:scale-105" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex flex-col justify-end p-10">
                            <h3 className="text-2xl font-black text-white font-['Plus_Jakarta_Sans']">
                                {locale === 'vi' ? finalDestinations[1].nameVi : (finalDestinations[1].nameEn || finalDestinations[1].nameVi)}
                            </h3>
                        </div>
                    </div>
                )}

                {/* Item 3: Square small (Bottom Left of Right Half) */}
                {finalDestinations[2] && (
                    <div className="relative rounded-[4rem] overflow-hidden group cursor-pointer h-[280px] md:h-full shadow-lg">
                        <Image 
                            src={finalDestinations[2].imageUrl || "https://images.unsplash.com/photo-1509030464150-144d5809678b?q=80&w=1200"} 
                            alt={finalDestinations[2].nameVi}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-1000" 
                        />
                        <div className="absolute inset-0 bg-primary/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[1px]">
                            <p className="text-white font-black uppercase text-[10px] tracking-[0.2em]">Khám phá</p>
                        </div>
                    </div>
                )}

                {/* Item 4: Action Call (Bottom Right) */}
                <div className="relative rounded-[4rem] overflow-hidden group cursor-pointer bg-slate-50 flex items-center justify-center border-2 border-dashed border-slate-100 hover:border-primary transition-all h-[280px] md:h-full">
                   <div className="text-center group-hover:scale-110 transition-transform duration-500">
                      <div className="w-14 h-14 bg-white rounded-full shadow-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-primary group-hover:text-white transition-all text-primary">
                        <PlusCircle size={28} />
                      </div>
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 group-hover:text-primary">Xem thêm vùng</p>
                   </div>
                </div>
            </div>
        </section>

    );
}
