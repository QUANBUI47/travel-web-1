import type { PromotionSectionProps } from "@/components/home/section-props";

import { useState, useEffect } from "react";
import { Sparkles, Gift, TrendingUp, ChevronRight } from "lucide-react";
import { Button } from "@heroui/button";
import Image from "next/image";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

import { getLocalizedValue } from "@/lib/utils/i18n";
import { cn } from "@/lib/utils/index";

export function PromotionSection({ content, locale }: PromotionSectionProps) {
  const t = useTranslations("HomePage.Promo");
  const theme = content?.theme || "gold";
  const text = getLocalizedValue(content?.content, locale);
  const deadlineStr = content?.deadline || "2026-12-31 23:59:59";
  const backgroundImage = content?.backgroundImage;

  useEffect(() => {
    if (backgroundImage) {
      // Background image loaded
    }
  }, [backgroundImage, content, text]);

  return (
    <section className="w-full py-20 md:py-24" id="promo">
      <div className="container mx-auto max-w-7xl px-4 lg:px-10">
        <div
          className={cn(
            "w-full p-6 sm:p-10 lg:p-12 rounded-3xl flex flex-col lg:flex-row items-center justify-between gap-8 relative overflow-hidden shadow-xl group transition-all duration-700",
            !backgroundImage &&
              (theme === "gold"
                ? "bg-gradient-to-br from-amber-400 via-orange-500 to-rose-600 text-white"
                : theme === "blue"
                  ? "bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-800 text-white"
                  : "bg-slate-900 text-white"),
            backgroundImage && "bg-slate-900 text-white",
          )}
        >
          {/* Background Image with Overlay */}
          {backgroundImage && (
            <div className="absolute inset-0 z-0">
              <Image
                fill
                priority
                unoptimized
                alt="Background"
                className="object-cover transition-transform duration-[5000ms] group-hover:scale-105"
                quality={100}
                sizes="(max-width: 768px) 100vw, 80vw"
                src={backgroundImage}
              />
              <div className="absolute inset-0 bg-black/50 lg:bg-black/40 z-0" />
              <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-black/90 lg:from-black/80 via-black/20 to-transparent z-0" />
            </div>
          )}

          {/* Decorative background elements (Only if no BG Image) */}
          {!backgroundImage && (
            <>
              <div className="absolute -top-32 -right-32 w-64 lg:w-96 h-64 lg:h-96 bg-white/20 rounded-full blur-[60px] lg:blur-[100px] animate-pulse" />
              <div className="absolute -bottom-32 -left-32 w-64 lg:w-80 h-64 lg:h-80 bg-black/20 rounded-full blur-[50px] lg:blur-[80px]" />
              <div className="absolute top-1/2 left-1/4 w-24 lg:w-32 h-24 lg:h-32 bg-amber-200/20 rounded-full blur-[40px] lg:blur-[50px] animate-spin-slow" />
            </>
          )}

          {/* Floating Particles/Sparkles style */}
          <div className="absolute inset-0 pointer-events-none opacity-30 z-0">
            <Sparkles
              className="absolute top-6 left-6 text-white animate-bounce"
              size={16}
            />
            <Sparkles
              className="absolute bottom-10 right-10 text-white animate-pulse"
              size={12}
            />
            <Gift
              className="absolute top-20 right-1/4 text-white/20 -rotate-12 hidden sm:block"
              size={80}
            />
          </div>

          <div className="relative z-10 flex-1 text-center lg:text-left">
            <motion.div
              className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6 justify-center lg:justify-start"
              initial={{ opacity: 0, y: 20 }}
              viewport={{ once: true }}
              whileInView={{ opacity: 1, y: 0 }}
            >
              <div className="p-1.5 sm:p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                <TrendingUp className="text-white" size={16} />
              </div>
              <span className="text-[0.625rem] sm:text-xs font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] text-white/90 whitespace-nowrap">
                {t("flash_sale_badge")}
              </span>
            </motion.div>

            <motion.h2
              className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight sm:leading-tight lg:leading-[1.1] mb-6 sm:mb-8 drop-shadow-2xl uppercase italic"
              initial={{ opacity: 0, x: -30 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
              whileInView={{ opacity: 1, x: 0 }}
            >
              {text || t("fallback_title")}
            </motion.h2>
            <p className="text-white/60 text-[0.625rem] md:text-xs font-bold uppercase tracking-[0.2em]">
              {t("badge_long")}
            </p>
          </div>

          <motion.div
            className="relative z-10 flex flex-col items-center gap-4 sm:gap-6 bg-white/10 backdrop-blur-xl p-6 sm:p-8 lg:p-10 rounded-3xl border border-white/30 shadow-2xl w-full sm:w-auto min-w-[280px] sm:min-w-[300px]"
            initial={{ scale: 0.9, opacity: 0 }}
            transition={{ delay: 0.4 }}
            viewport={{ once: true }}
            whileInView={{ scale: 1, opacity: 1 }}
          >
            <div className="text-center space-y-1">
              <p className="text-[0.625rem] sm:text-xs font-black uppercase tracking-[0.2em] text-white/50">
                {t("time_remaining")}
              </p>
              <div className="h-1 w-8 sm:w-12 bg-white/20 mx-auto rounded-full" />
            </div>

            <Countdown deadline={deadlineStr} />

            <Button
              suppressHydrationWarning
              className="w-full mt-2 sm:mt-4 h-14 sm:h-16 font-black tracking-[0.1em] sm:tracking-[0.2em] bg-white text-slate-900 shadow-xl shadow-black/10 hover:shadow-2xl hover:scale-105 active:scale-95 transition-all text-xs sm:text-sm"
              endContent={<ChevronRight size={18} />}
              radius="full"
              size="lg"
            >
              {t("button")}
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Countdown({ deadline }: { deadline: string }) {
  const [timeLeft, setTimeLeft] = useState({ h: "00", m: "00", s: "00" });

  useEffect(() => {
    const timer = setInterval(() => {
      const target = new Date(deadline).getTime();
      const now = new Date().getTime();
      const distance = target - now;

      if (distance < 0) {
        clearInterval(timer);

        return;
      }

      const h = Math.floor(distance / (1000 * 60 * 60))
        .toString()
        .padStart(2, "0");
      const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
        .toString()
        .padStart(2, "0");
      const s = Math.floor((distance % (1000 * 60)) / 1000)
        .toString()
        .padStart(2, "0");

      setTimeLeft({ h, m, s });
    }, 1000);

    return () => clearInterval(timer);
  }, [deadline]);

  return (
    <div className="flex gap-2 sm:gap-4 font-mono text-2xl sm:text-4xl lg:text-5xl font-black tabular-nums">
      <div className="flex flex-col items-center w-[1.5em] sm:w-[1.8em]">
        <span className="drop-shadow-md text-center">{timeLeft.h}</span>
        <span className="text-[0.5625rem] sm:text-[0.6875rem] font-bold uppercase tracking-widest text-white/40 mt-1 sm:mt-2">
          H
        </span>
      </div>
      <span className="text-white/20 animate-pulse text-xl sm:text-3xl">:</span>
      <div className="flex flex-col items-center w-[1.5em] sm:w-[1.8em]">
        <span className="drop-shadow-md text-center">{timeLeft.m}</span>
        <span className="text-[0.5625rem] sm:text-[0.6875rem] font-bold uppercase tracking-widest text-white/40 mt-1 sm:mt-2">
          M
        </span>
      </div>
      <span className="text-white/20 animate-pulse text-xl sm:text-3xl">:</span>
      <div className="flex flex-col items-center w-[1.5em] sm:w-[1.8em] text-amber-300">
        <span className="drop-shadow-md text-center">{timeLeft.s}</span>
        <span className="text-[0.5625rem] sm:text-[0.6875rem] font-bold uppercase tracking-widest text-white/40 mt-1 sm:mt-2">
          S
        </span>
      </div>
    </div>
  );
}
