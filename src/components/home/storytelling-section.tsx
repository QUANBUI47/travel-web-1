"use client";

import { Quote, Star } from "lucide-react";
import { getLocalizedValue } from "@/lib/utils/i18n";

interface StorytellingSectionProps {
  content: any;
  locale: string;
}

export function StorytellingSection({ content, locale }: StorytellingSectionProps) {
  const title = getLocalizedValue(content?.title, locale) || "Hành trình ngập tràn cảm xúc lữ hành.";
  const items = content?.items || [
    { 
        author: "Anh Hoàng Nam", 
        role: "Khách hàng thân thiết",
        quote: "Chuyến đi Phú Quốc thực sự đẳng cấp. Resort 5 sao và dịch vụ của Vivu không làm tôi thất vọng.",
        rating: 5
    },
    { 
        author: "Chị Minh Thư", 
        role: "Bloger du lịch",
        quote: "Hội An đẹp huyền ảo qua cách thiết kế tour của các bạn. Rất tinh tế và sâu sắc.",
        rating: 5
    },
    { 
        author: "Gia đình Bác Hùng", 
        role: "Tour xuyên Việt",
        quote: "Lần đầu tiên cả nhà đi tour mà không thấy mệt. Cảm ơn đội ngũ Vivu tận tâm.",
        rating: 5
    }
  ];

  return (
    <section className="w-full px-8 lg:px-20 py-16 mb-8 text-center">
      <div className="relative inline-block mb-8">
        <Quote className="mx-auto text-blue-50/60" size={80} />
        <div className="absolute inset-0 flex items-center justify-center">
             <span className="text-primary font-black uppercase tracking-[0.4em] text-[9px]">Trải nghiệm</span>
        </div>
      </div>
      
      <h2 className="text-3xl md:text-5xl font-black font-['Plus_Jakarta_Sans'] tracking-tighter mb-12 leading-tight">
        {title}
      </h2>

      <div className="flex flex-wrap justify-center gap-8">
        {items.map((item: any, i: number) => (
          <div key={i} className="w-full md:w-[calc(33.333%-1.5rem)] min-w-[300px] bg-white p-8 rounded-[2.5rem] border border-slate-100 flex flex-col items-center shadow-sm hover:shadow-lg transition-all duration-500 group">
             <div className="flex gap-1 text-[#fcc219] mb-6">
              {[...Array(item.rating || 5)].map((_, j) => (
                <Star key={j} size={14} fill="currentColor" />
              ))}
            </div>
            <p className="text-slate-600 text-base font-medium italic leading-relaxed mb-8">
              "{getLocalizedValue(item.quote, locale) || item.quote}"
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center font-black text-primary text-[10px]">
                {item.author?.charAt(0) || 'V'}
              </div>
              <div className="text-left">
                <p className="text-[10px] font-black uppercase tracking-widest text-primary">{item.author}</p>
                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{item.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
