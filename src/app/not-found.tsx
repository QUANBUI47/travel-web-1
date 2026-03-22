import React from "react";
import { Home, Search, Map as MapIcon, Compass, Terminal } from "lucide-react";
import { Button } from "@heroui/button";
import NextLink from "next/link";
import { getTranslations } from "next-intl/server";
import { ROUTES } from "@/config/routes";

export default async function NotFound() {
  const t = await getTranslations("NotFound");

  return (
    <div className="h-screen w-screen bg-white dark:bg-slate-950 font-sans text-foreground flex flex-col items-center justify-center relative overflow-hidden p-6 select-none">
      {/* 1. NỀN SỐ 404 NỔI BẬT */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden z-0">
        <h1
          className="text-[35vw] md:text-[50vh] font-black text-primary/10 font-heading leading-none tracking-tighter animate-zoom-in"
          style={{
            textShadow: "0 20px 50px rgba(0, 104, 195, 0.05)",
            WebkitTextStroke: "1px rgba(0, 104, 195, 0.08)",
          }}
        >
          404
        </h1>
      </div>

      {/* Grid Pattern mờ trang trí */}
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none z-0">
        <svg width="100%" height="100%">
          <defs>
            <pattern
              id="grid"
              width="60"
              height="60"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 60 0 L 0 0 0 60"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* 2. ICON CENTERPIECE (Thẻ 3D chứa bản đồ) */}
      <div className="relative z-20 mb-10 animate-slide-in-top">
        <div className="absolute inset-0 bg-primary/10 blur-[100px] rounded-full scale-125"></div>

        <div className="w-52 h-52 md:w-64 md:h-64 bg-white dark:bg-slate-900 rounded-[3.5rem] shadow-[0_50px_100px_-20px_rgba(0,104,195,0.2)] flex items-center justify-center border border-slate-50 dark:border-slate-800 relative group">
          {/* Vòng quay dashed */}
          <div className="absolute inset-5 border-[4px] border-dashed border-blue-100 dark:border-blue-900/50 rounded-[2.8rem] animate-spin-slow"></div>

          {/* Icon bản đồ nhấp nháy */}
          <div className="relative animate-bounce">
            <MapIcon size={90} className="text-primary" strokeWidth={1.5} />
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-ping"></div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full shadow-lg"></div>
          </div>

          {/* Icon tìm kiếm góc vàng */}
          <div className="absolute -top-4 -right-4 bg-secondary w-14 h-14 rounded-2xl flex items-center justify-center shadow-xl border-4 border-white dark:border-slate-800 rotate-12 transition-transform cursor-pointer hover:scale-110 active:scale-95">
            <Search size={24} className="text-white font-bold" strokeWidth={3} />
          </div>
        </div>
      </div>

      {/* 3. NỘI DUNG VĂN BẢN (Gọn gàng hơn) */}
      <div className="text-center z-20 max-w-xl animate-slide-in-bottom">
        <div className="inline-flex items-center gap-2 px-5 py-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-full mb-8 shadow-sm">
          <Terminal size={14} className="text-primary" />
          <span className="text-[11px] font-black text-primary uppercase tracking-widest leading-none">
            {t("error_code")}
          </span>
        </div>

        <h2
          className="text-4xl md:text-5xl font-black font-heading tracking-tighter leading-tight mb-6 dark:text-white"
          dangerouslySetInnerHTML={{ __html: t("title") }}
        />

        <p className="text-muted font-medium text-base leading-relaxed mb-12 max-w-[400px] mx-auto">
          {t("description")}
        </p>

        {/* 4. HỆ THỐNG NÚT BẤM */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
          <Button
            as={NextLink}
            href={ROUTES.HOME}
            className="min-w-[200px] bg-primary text-white h-14 md:h-16 px-8 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-[0_20px_40px_-10px_rgba(0,104,195,0.4)] hover:-translate-y-1 active:scale-95 transition-all"
            startContent={<Home size={18} strokeWidth={2.5} />}
          >
            {t("back_home")}
          </Button>
          <Button
            as={NextLink}
            href="/tours"
            className="min-w-[200px] bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400 h-14 md:h-16 px-8 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-200 dark:hover:border-slate-700 hover:-translate-y-1 active:scale-95 transition-all group"
            startContent={
              <Compass
                size={18}
                strokeWidth={2.5}
                className="group-hover:rotate-90 transition-transform"
              />
            }
          >
            {t("view_tours")}
          </Button>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="absolute bottom-6 md:bottom-10 left-0 right-0 text-center z-20 px-6">
        <p className="text-[10px] font-black text-slate-300 dark:text-slate-700 uppercase tracking-[0.3em]">
          {t("footer")}
        </p>
      </footer>

      {/* Decor Elements */}
      <div className="absolute top-[12%] left-[10%] opacity-[0.08] dark:opacity-[0.05] animate-pulse hidden lg:block">
        <Compass size={120} className="text-primary rotate-12" />
      </div>
      <div className="absolute bottom-[8%] right-[8%] opacity-[0.04] dark:opacity-[0.02] hidden lg:block">
        <MapIcon size={280} className="text-secondary -rotate-12" />
      </div>
    </div>
  );
}
