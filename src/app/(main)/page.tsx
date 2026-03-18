"use client";

import { useState, useEffect } from "react";
import {
  Search,
  MapPin,
  Calendar,
  Users,
  ShieldCheck,
  Clock,
  Map,
  Star,
  ChevronRight,
} from "lucide-react";
import { Button } from "@heroui/button";
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
        "/images/vivu-hero-landscape-3.png",
      ]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const prompts = [
      "Luxury travel photography of Ha Long Bay, emerald water, minimalist composition, bright and airy, 8k.",
      "Beautiful sunset over Hoi An ancient town river, golden lanterns, warm atmosphere, professional travel banner.",
      "Terraced rice fields in Northern Vietnam, Sapa, golden harvest, bright daylight, epic landscape.",
    ];

    const generated = [];
    for (const prompt of prompts) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-generate-001:predict?key=${apiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              instances: [
                {
                  prompt:
                    prompt +
                    " high resolution, professional photography, commercial travel style",
                },
              ],
              parameters: { sampleCount: 1 },
            }),
          },
        );
        const result = await response.json();
        if (result.predictions?.[0]?.bytesBase64Encoded) {
          generated.push(
            `data:image/png;base64,${result.predictions[0].bytesBase64Encoded}`,
          );
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
        "/images/vivu-hero-landscape-3.png",
      ]);
    }
    setLoading(false);
  };

  useEffect(() => {
    generateImages();
  }, []);

  const heroImage =
    images.length > 0 ? images[0] : "/images/vivu-hero-landscape-1.png";

  return (
    <div className='flex flex-col gap-16 md:gap-20 xl:gap-24 py-6 md:py-8 pb-32 md:pb-40'>
      {/* 1. Hero Section - Section ID for SEO */}
      <section
        id='hero'
        className='relative w-full min-h-[500px] lg:min-h-[600px] xl:min-h-[700px] flex items-center justify-center overflow-hidden rounded-[2.5rem] md:rounded-[3.5rem] xl:rounded-[4.5rem] shadow-2xl animate-fade-in py-16 lg:py-0'
      >
        <div className='absolute inset-0 z-0'>
          <Image
            src={heroImage}
            alt='Vivu Travel Hero - Khám phá vẻ đẹp Việt Nam'
            fill
            className='object-cover'
            priority
          />
          <div className='absolute inset-0 bg-black/25 z-10' />
        </div>

        <div className='relative z-20 w-full max-w-[90%] md:max-w-5xl px-4 md:px-6 flex flex-col items-center text-center'>
          <h1 className='text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-[1.1] text-white tracking-tighter mb-4 md:mb-6 drop-shadow-2xl'>
            Lên kế hoạch <span className='text-[#fcc219]'>Vivu</span> ngay
          </h1>
          <p className='text-sm sm:text-base lg:text-lg xl:text-xl text-white font-medium max-w-2xl mb-8 lg:mb-12 drop-shadow-lg leading-relaxed'>
            Khám phá những điểm đến tuyệt vời nhất Việt Nam với giá ưu đãi chỉ
            có tại Vivu Travel.
          </p>

          {/* Search Bar Widget */}
          <div className='bg-white p-2 rounded-[1.5rem] lg:rounded-full shadow-2xl flex flex-col lg:flex-row items-center w-full max-w-4xl border border-gray-100/50'>
            <div className='w-full lg:flex-1 flex items-center px-4 md:px-6 py-2 md:py-3 border-b lg:border-b-0 lg:border-r border-gray-100 group'>
              <MapPin
                className='text-primary mr-2 md:mr-3 group-hover:scale-110 transition-transform flex-shrink-0 w-4 h-4 md:w-[18px] md:h-[18px]'
              />
              <div className='text-left w-full'>
                <p className='text-[8px] md:text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5'>
                  Bạn muốn đi đâu?
                </p>
                <input
                  type='text'
                  placeholder='Địa điểm du lịch...'
                  className='text-xs sm:text-sm font-bold outline-none w-full bg-transparent text-foreground placeholder:text-gray-300'
                />
              </div>
            </div>

            <div className='w-full lg:flex-1 flex items-center px-4 md:px-6 py-2 md:py-3 border-b lg:border-b-0 lg:border-r border-gray-100 group cursor-pointer'>
              <Calendar
                className='text-primary mr-2 md:mr-3 group-hover:scale-110 transition-transform flex-shrink-0 w-4 h-4 md:w-[18px] md:h-[18px]'
              />
              <div className='text-left'>
                <p className='text-[8px] md:text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5'>
                  Thời gian
                </p>
                <p className='text-xs sm:text-sm font-bold text-foreground'>Thêm ngày</p>
              </div>
            </div>

            <div className='w-full lg:flex-1 flex items-center px-4 md:px-6 py-2 md:py-3 group cursor-pointer'>
              <Users
                className='text-primary mr-2 md:mr-3 group-hover:scale-110 transition-transform flex-shrink-0 w-4 h-4 md:w-[18px] md:h-[18px]'
              />
              <div className='text-left'>
                <p className='text-[8px] md:text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5'>
                  Hành khách
                </p>
                <p className='text-xs sm:text-sm font-bold text-foreground'>Thêm người</p>
              </div>
            </div>

            <Button
              color='primary'
              radius='full'
              className='w-full lg:w-auto mt-2 lg:mt-0 lg:h-14 xl:h-16 px-6 lg:px-10 text-sm xl:text-[15px] font-black shadow-xl shadow-primary/20 transition-all duration-300 xl:min-w-[160px] m-1'
              startContent={<Search size={16} className='xl:w-[18px] xl:h-[18px]' />}
            >
              Tìm kiếm
            </Button>
          </div>
        </div>
      </section>

      {/* 2. Stats Section - Horizontal Stripe Design */}
      <section id='stats' className='relative z-30 -mt-20 sm:-mt-24 lg:-mt-32 xl:-mt-40 px-4 sm:px-6 md:px-10'>
        <div className='max-w-6xl mx-auto bg-white dark:bg-slate-900 rounded-[2rem] md:rounded-[3rem] xl:rounded-[4rem] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.1)] p-6 sm:p-8 md:p-10 xl:p-12 border border-gray-100/50 dark:border-white/5'>
          <div className='grid grid-cols-2 lg:grid-cols-4 gap-y-8 sm:gap-y-10 lg:gap-y-4 gap-x-4 lg:divide-x divide-gray-100 dark:divide-white/5'>
            {[
              { value: "63+", label: "Tỉnh thành" },
              { value: "1,200+", label: "Khách sạn" },
              { value: "550+", label: "Tour du lịch" },
              { value: "4.9★", label: "Đánh giá" },
            ].map((stat, idx) => (
              <div
                key={idx}
                className={`flex flex-col items-center justify-center px-2 sm:px-4 group cursor-default relative ${
                  idx < 2 ? 'border-b border-gray-100 dark:border-white/5 pb-8 sm:pb-10 lg:border-b-0 lg:pb-0' : 'pt-2 lg:pt-0'
                }`}
              >
                <p className='text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black text-foreground group-hover:text-primary transition-colors tracking-tighter'>
                  {stat.value}
                </p>
                <p className='text-[9px] sm:text-[10px] md:text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mt-2 lg:mt-3'>
                  {stat.label}
                </p>
                <div className='absolute bottom-0 w-1 h-1 lg:w-1.5 lg:h-1.5 rounded-full bg-secondary opacity-0 group-hover:opacity-100 transition-opacity' />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Value Propositions */}
      <section
        id='why-vivu'
        className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 px-2 mx-2 md:mx-6'
      >
        {[
          {
            icon: ShieldCheck,
            title: "Đặt chỗ an toàn",
            desc: "Hệ thống bảo mật tiêu chuẩn quốc tế, bảo vệ thông tin và giao dịch của bạn 100%.",
          },
          {
            icon: Clock,
            title: "Hỗ trợ 24/7",
            desc: "Đội ngũ chuyên viên tư vấn luôn sẵn sàng hỗ trợ bạn mọi lúc, mọi nơi.",
          },
          {
            icon: Map,
            title: "Trải nghiệm bản địa",
            desc: "Các tour du lịch độc quyền được thiết kế bởi chuyên gia, khám phá vẻ đẹp ẩn giấu.",
          },
        ].map((item, i) => (
          <div
            key={i}
            className='flex flex-col items-center text-center p-6 sm:p-8 lg:p-10 bg-white dark:bg-slate-900/50 border border-gray-50 dark:border-white/5 rounded-[2rem] xl:rounded-[3rem] shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-500 group'
          >
            <div className='w-12 h-12 lg:w-16 lg:h-16 bg-blue-50 dark:bg-primary/20 text-primary rounded-2xl lg:rounded-[1.25rem] flex items-center justify-center mb-4 lg:mb-6 group-hover:scale-110 transition-transform group-hover:rotate-6'>
              <item.icon className="w-6 h-6 lg:w-8 lg:h-8" />
            </div>
            <h3 className='font-bold text-lg lg:text-xl mb-2 lg:mb-3'> {item.title}</h3>
            <p className='text-gray-500 dark:text-gray-400 text-xs lg:text-sm leading-relaxed font-medium px-2'>
              {item.desc}
            </p>
          </div>
        ))}
      </section>

      {/* 4. Top Destinations */}
      <section id='destinations' className='px-2 md:px-6'>
        <div className='flex flex-col sm:flex-row justify-between items-center sm:items-end mb-8 lg:mb-12 gap-4'>
          <div className='text-center sm:text-left'>
            <h2 className='text-3xl sm:text-4xl lg:text-5xl font-black tracking-tighter mb-2 lg:mb-3'>
              Điểm đến hàng đầu
            </h2>
            <p className='text-gray-500 dark:text-gray-400 text-xs sm:text-sm font-medium'>
              Những địa điểm được yêu thích nhất bởi cộng đồng Vivu Travel
            </p>
          </div>
          <Button
            variant='flat'
            color='primary'
            radius='full'
            className='font-black text-[10px] sm:text-xs px-5 lg:px-6 h-9 lg:h-10'
            endContent={<ChevronRight size={16} className="lg:w-[18px] lg:h-[18px]" />}
          >
            Xem tất cả
          </Button>
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8'>
          {[
            {
              name: "Hạ Long",
              count: "1,200+ chỗ nghỉ",
              img: images[0] || "/images/vivu-hero-landscape-1.png",
            },
            {
              name: "Hội An",
              count: "850+ chỗ nghỉ",
              img: images[1] || "/images/vivu-hero-landscape-2.png",
            },
            {
              name: "Sapa",
              count: "420+ chỗ nghỉ",
              img: images[2] || "/images/vivu-hero-landscape-3.png",
            },
            {
              name: "Phú Quốc",
              count: "600+ chỗ nghỉ",
              img: images[0] || "/images/vivu-hero-landscape-1.png",
            },
          ].map((item, i) => (
            <div
              key={i}
              className='group relative h-[380px] sm:h-[420px] lg:h-[450px] xl:h-[500px] rounded-[2rem] lg:rounded-[3rem] overflow-hidden shadow-xl cursor-pointer bg-slate-100 dark:bg-slate-800'
            >
              <Image
                src={item.img}
                alt={`Du lịch ${item.name}`}
                fill
                className='w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110'
                loading='lazy'
              />
              <div className='absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-8 lg:p-10 z-10'>
                <h4 className='text-white text-2xl lg:text-3xl font-black mb-1'>
                  {item.name}
                </h4>
                <p className='text-white/70 text-xs lg:text-sm font-bold'>{item.count}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Featured Tour Promo */}
      <section
        id='promo'
        className='bg-[#f4f7fa] dark:bg-slate-900 p-8 sm:p-12 lg:p-16 xl:p-20 rounded-[2.5rem] lg:rounded-[4rem] border border-blue-50 dark:border-white/5 overflow-hidden relative mx-2 md:mx-6'
      >
        <div className='absolute top-0 right-0 w-64 h-64 lg:w-96 lg:h-96 bg-primary/10 rounded-full blur-[80px] lg:blur-[100px] -mr-32 -mt-32 lg:-mr-48 lg:-mt-48 pointer-events-none' />
        <div className='relative z-10 flex flex-col lg:flex-row gap-10 lg:gap-16 items-center'>
          
          <div className='flex-1 flex flex-col items-center lg:items-start text-center lg:text-left gap-6 lg:gap-8'>
            <span className='bg-[#fef3c7] text-[#b45309] dark:bg-amber-900/30 dark:text-amber-400 px-5 py-2 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-[0.25em] inline-block'>
              Ưu đãi giới hạn
            </span>

            <h2 className='text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black leading-[1.2] tracking-tight text-slate-900 dark:text-white'>
              Mùa hè rực rỡ tại <br className="hidden lg:block block" />
              <span className='text-[#0a66c2] dark:text-blue-400'>Phú Quốc</span>
            </h2>

            <p className='text-slate-500 dark:text-slate-400 text-sm sm:text-base lg:text-lg leading-relaxed font-semibold max-w-2xl'>
              Trọn gói 3 ngày 2 đêm tại Resort 5 sao chỉ từ{" "}
              <span className='text-[#0a66c2] dark:text-blue-400 font-black'>3.990.000đ</span>. Đã
              bao gồm vé máy bay khứ hồi.
            </p>

            <div className='flex items-center justify-center lg:justify-start gap-3 sm:gap-4'>
              <div className='flex items-center gap-1.5'>
                <Star className='text-[#fcc219] fill-[#fcc219] w-5 h-5 sm:w-6 sm:h-6' />
                <span className='font-black text-xl sm:text-2xl text-slate-800 dark:text-slate-200'>4.9</span>
                <span className='text-slate-400 text-xs sm:text-sm font-bold leading-none'>/ 5.0</span>
              </div>
              <div className='w-[2px] h-5 sm:h-6 bg-slate-300 dark:bg-slate-700 hidden sm:block' />
              <span className='text-slate-500 dark:text-slate-400 text-xs sm:text-sm uppercase tracking-widest'>
                <strong className='text-slate-800 dark:text-slate-200'>2,500+</strong> lượt đặt
              </span>
            </div>

            <Button
              color='primary'
              size='lg'
              radius='lg'
              className='h-12 sm:h-14 lg:h-16 px-8 lg:px-14 text-sm lg:text-lg font-black shadow-[0_15px_30px_-10px_rgba(10,102,194,0.4)] hover:scale-105 transition-all duration-500 bg-[#0a66c2]'
            >
              Đặt ngay bây giờ
            </Button>
          </div>

          <div className='hidden lg:block flex-1 w-full h-[300px] sm:h-[400px] xl:h-[500px] relative rounded-[2rem] lg:rounded-[3.5rem] overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] ring-4 sm:ring-8 lg:ring-12 ring-white/50 dark:ring-white/5 bg-slate-100 dark:bg-slate-800'>
            <Image
              src="/images/vivu-hero-landscape-3.png"
              alt='Phú Quốc Promo'
              fill
              className='object-cover transition-transform duration-700 hover:scale-105'
            />
          </div>
        </div>
      </section>
    </div>
  );
}
