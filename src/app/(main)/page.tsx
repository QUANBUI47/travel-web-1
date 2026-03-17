"use client";

import React, { useState, useEffect } from "react";
import { 
  Search, MapPin, Calendar, Users, ShieldCheck, 
  Clock, Map, Star, ChevronRight, Send, ArrowRight
} from "lucide-react";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Divider } from "@heroui/divider";
import NextLink from "next/link";
import Image from "next/image";

export default function Home() {
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Note: Cấu hình API Key tại đây khi cần sử dụng Imagen API
  const apiKey = ""; 

  const generateImages = async () => {
    if (!apiKey) {
      // Fallback images if no API key
      setImages([
        "/images/vivu-hero-landscape-1.png",
        "/images/vivu-hero-landscape-2.png",
        "/images/vivu-hero-landscape-3.png"
      ]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const prompts = [
      "Luxury travel photography of Ha Long Bay, emerald water, minimalist composition, bright and airy, 8k.",
      "Beautiful sunset over Hoi An ancient town river, golden lanterns, warm atmosphere, professional travel banner.",
      "Terraced rice fields in Northern Vietnam, Sapa, golden harvest, bright daylight, epic landscape."
    ];

    const generated = [];
    for (const prompt of prompts) {
      try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-generate-001:predict?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            instances: [{ prompt: prompt + " high resolution, professional photography, commercial travel style" }],
            parameters: { sampleCount: 1 }
          })
        });
        const result = await response.json();
        if (result.predictions?.[0]?.bytesBase64Encoded) {
          generated.push(`data:image/png;base64,${result.predictions[0].bytesBase64Encoded}`);
        }
      } catch (err) {
        console.error("Error generating images:", err);
      }
    }
    
    if (generated.length > 0) {
      setImages(generated);
    } else {
      setImages([
        "/images/vivu-hero-landscape-1.png",
        "/images/vivu-hero-landscape-2.png",
        "/images/vivu-hero-landscape-3.png"
      ]);
    }
    setLoading(false);
  };

  useEffect(() => {
    generateImages();
  }, []);

  const heroImage = images.length > 0 ? images[0] : "/images/vivu-hero-landscape-1.png";

  return (
    <div className='flex flex-col gap-20 py-8 pb-40'>
      {/* 1. Hero Section - Section ID for SEO */}
      <section id="hero" className='relative w-full h-[500px] md:h-[600px] flex items-center justify-center overflow-hidden rounded-[2.5rem] md:rounded-[3.5rem] shadow-2xl animate-fade-in'>
        <div className='absolute inset-0 z-0'>
          <Image 
            src={heroImage} 
            alt="Vivu Travel Hero - Khám phá vẻ đẹp Việt Nam" 
            fill 
            className="object-cover"
            priority
          />
          <div className='absolute inset-0 bg-black/25 z-10' />
        </div>

        <div className='relative z-20 w-full max-w-5xl px-6 flex flex-col items-center text-center'>
          <h1 className='text-4xl md:text-7xl font-extrabold leading-[1.1] text-white tracking-tighter mb-6 drop-shadow-2xl'>
            Lên kế hoạch <span className='text-[#fcc219]'>Vivu</span> ngay
          </h1>
          <p className='text-base md:text-xl text-white/95 font-medium max-w-2xl mb-12 drop-shadow-lg leading-relaxed opacity-90'>
            Khám phá những điểm đến tuyệt vời nhất Việt Nam với giá ưu đãi chỉ có tại Vivu Travel.
          </p>

          {/* Search Bar Widget - Enhanced for Mobile */}
          <div className='w-full bg-white p-2 rounded-[2rem] md:rounded-full shadow-2xl flex flex-col md:flex-row items-center w-full max-w-4xl border border-gray-100/50'>
            <div className='w-full md:flex-1 flex items-center px-4 md:px-6 py-3 border-b md:border-b-0 md:border-r border-gray-100 group'>
              <MapPin className='text-primary mr-3 group-hover:scale-110 transition-transform flex-shrink-0' size={18} />
              <div className='text-left w-full'>
                <p className='text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5'>Bạn muốn đi đâu?</p>
                <input 
                  type='text' 
                  placeholder='Địa điểm du lịch...' 
                  className='text-sm font-bold outline-none w-full bg-transparent text-foreground placeholder:text-gray-300' 
                />
              </div>
            </div>
            
            <div className='w-full md:flex-1 flex items-center px-4 md:px-6 py-3 border-b md:border-b-0 md:border-r border-gray-100 group cursor-pointer'>
              <Calendar className='text-primary mr-3 group-hover:scale-110 transition-transform flex-shrink-0' size={18} />
              <div className='text-left'>
                <p className='text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5'>Thời gian</p>
                <p className='text-sm font-bold text-foreground'>Thêm ngày</p>
              </div>
            </div>

            <div className='w-full md:flex-1 flex items-center px-4 md:px-6 py-3 group cursor-pointer'>
              <Users className='text-primary mr-3 group-hover:scale-110 transition-transform flex-shrink-0' size={18} />
              <div className='text-left'>
                <p className='text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5'>Hành khách</p>
                <p className='text-sm font-bold text-foreground'>Thêm người</p>
              </div>
            </div>

            <Button
              color='primary'
              radius='full'
              className='w-full md:w-auto h-14 md:h-16 px-10 text-[15px] font-black shadow-xl shadow-primary/20 transition-all duration-300 min-w-[160px] m-1'
              startContent={<Search size={18} />}
            >
              Tìm kiếm
            </Button>
          </div>
        </div>
      </section>

      {/* 2. Stats Section - Horizontal Stripe Design (Mẫu 2) */}
      <section id="stats" className="relative z-30 -mt-32 px-4 md:px-10">
        <div className="max-w-6xl mx-auto bg-white dark:bg-slate-900 rounded-[2.5rem] md:rounded-[4rem] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.1)] p-8 md:p-12 border border-gray-100/50 dark:border-white/5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 divide-x-0 md:divide-x divide-gray-100 dark:divide-white/5">
            {[
              { value: "63+", label: "Tỉnh thành" },
              { value: "1,200+", label: "Khách sạn" },
              { value: "550+", label: "Tour du lịch" },
              { value: "4.9★", label: "Đánh giá" },
            ].map((stat, idx) => (
              <div key={idx} className='flex flex-col items-center justify-center px-4 group cursor-default'>
                <p className='text-3xl md:text-5xl font-black text-foreground group-hover:text-primary transition-colors tracking-tighter'>{stat.value}</p>
                <p className='text-[10px] md:text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mt-3'>{stat.label}</p>
                <div className="w-1.5 h-1.5 rounded-full bg-secondary mt-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Value Propositions */}
      <section id="why-vivu" className='grid grid-cols-1 md:grid-cols-3 gap-8 px-2'>
        {[
          { 
            icon: ShieldCheck, 
            title: "Đặt chỗ an toàn", 
            desc: "Hệ thống bảo mật tiêu chuẩn quốc tế, bảo vệ thông tin và giao dịch của bạn 100%." 
          },
          { 
            icon: Clock, 
            title: "Hỗ trợ 24/7", 
            desc: "Đội ngũ chuyên viên tư vấn luôn sẵn sàng hỗ trợ bạn mọi lúc, mọi nơi." 
          },
          { 
            icon: Map, 
            title: "Trải nghiệm bản địa", 
            desc: "Các tour du lịch độc quyền được thiết kế bởi chuyên gia, khám phá vẻ đẹp ẩn giấu." 
          },
        ].map((item, i) => (
          <div 
            key={i} 
            className='flex flex-col items-center text-center p-10 bg-white dark:bg-slate-900/50 border border-gray-50 dark:border-white/5 rounded-[3rem] shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-500 group'
          >
            <div className='w-16 h-16 bg-blue-50 dark:bg-primary/20 text-primary rounded-[1.25rem] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform group-hover:rotate-6'>
              <item.icon size={32} />
            </div>
            <h3 className='font-bold text-xl mb-3'> {item.title}</h3>
            <p className='text-gray-500 dark:text-gray-400 text-sm leading-relaxed font-medium'>{item.desc}</p>
          </div>
        ))}
      </section>

      {/* 4. Top Destinations */}
      <section id="destinations">
        <div className='flex flex-col md:flex-row justify-between items-center md:items-end mb-12 px-4 gap-4'>
          <div className="text-center md:text-left">
            <h2 className='text-3xl md:text-4xl font-black tracking-tighter mb-2'>Điểm đến hàng đầu</h2>
            <p className='text-gray-500 dark:text-gray-400 text-sm font-medium'>Những địa điểm được yêu thích nhất bởi cộng đồng Vivu Travel</p>
          </div>
          <Button 
            variant='flat' 
            color='primary' 
            radius="full"
            className='font-black text-xs px-6'
            endContent={<ChevronRight size={18} />}
          >
            Xem tất cả
          </Button>
        </div>
        
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8'>
          {[
            { name: "Hạ Long", count: "1,200+ chỗ nghỉ", img: images[0] || "/images/vivu-hero-landscape-1.png" },
            { name: "Hội An", count: "850+ chỗ nghỉ", img: images[1] || "/images/vivu-hero-landscape-2.png" },
            { name: "Sapa", count: "420+ chỗ nghỉ", img: images[2] || "/images/vivu-hero-landscape-3.png" },
            { name: "Phú Quốc", count: "600+ chỗ nghỉ", img: images[0] || "/images/vivu-hero-landscape-1.png" }
          ].map((item, i) => (
            <div key={i} className='group relative h-[450px] md:h-[500px] rounded-[3rem] overflow-hidden shadow-xl cursor-pointer bg-slate-100 dark:bg-slate-800'>
              <Image 
                src={item.img} 
                alt={`Du lịch ${item.name}`} 
                fill 
                className='w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110' 
                loading="lazy"
              />
              <div className='absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-10 z-10'>
                <h4 className='text-white text-2xl md:text-3xl font-black mb-1'>{item.name}</h4>
                <p className='text-white/70 text-sm font-bold'>{item.count}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Featured Tour Promo */}
      <section id="promo" className='bg-primary/5 dark:bg-primary/10 p-10 md:p-20 rounded-[4rem] border border-primary/10 overflow-hidden relative'>
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[100px] -mr-48 -mt-48" />
        <div className='relative z-10 flex flex-col lg:flex-row gap-16 items-center'>
          <div className='flex-1 flex flex-col items-center lg:items-start text-center lg:text-left gap-8'>
            <span className='bg-secondary/20 text-secondary-600 dark:text-secondary-400 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.3em]'>Ưu đãi giới hạn</span>
            <h2 className='text-4xl md:text-6xl font-black leading-tight tracking-tighter'>Mùa hè rực rỡ tại <br/><span className="text-primary">Phú Quốc</span></h2>
            <p className='text-gray-500 dark:text-gray-400 text-lg leading-relaxed font-semibold max-w-xl'>
              Trọn gói 3 ngày 2 đêm tại Resort 5 sao chỉ từ <span className='text-primary font-black'>3.990.000đ</span>. Đã bao gồm vé máy bay khứ hồi.
            </p>
            <div className='flex flex-wrap items-center justify-center lg:justify-start gap-8'>
              <div className='flex items-center gap-2'>
                <Star className='text-secondary fill-secondary' size={24} />
                <span className='font-black text-2xl'>4.9</span>
                <span className='text-gray-400 font-bold text-sm'>/ 5.0</span>
              </div>
              <div className='h-6 w-[2px] bg-divider hidden sm:block' />
              <span className='text-gray-500 dark:text-gray-400 font-black text-sm uppercase tracking-widest'>2,500+ lượt đặt</span>
            </div>
            <Button
              color='primary'
              size='lg'
              radius='lg'
              className='h-18 px-14 text-lg font-black shadow-[0_20px_40px_-10px_rgba(0,104,195,0.4)] hover:scale-105 transition-all duration-500'
            >
              Đặt ngay bây giờ
            </Button>
          </div>
          <div className='flex-1 w-full h-[400px] md:h-[500px] relative rounded-[3.5rem] overflow-hidden shadow-2xl ring-12 ring-white/50 dark:ring-white/5'>
            <Image 
              src={images[0] || "/images/vivu-hero-landscape-1.png"} 
              alt="Phú Quốc Promo" 
              fill 
              className="object-cover transition-transform duration-700 hover:scale-105"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
