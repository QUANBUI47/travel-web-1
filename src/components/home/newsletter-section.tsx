"use client";

import type { NewsletterSectionProps } from "@/components/home/section-props";

import { Mail, Send, Bell } from "lucide-react";
import { useTranslations } from "next-intl";

import { getLocalizedValue } from "@/lib/utils/i18n";

export function NewsletterSection({ content, locale }: NewsletterSectionProps) {
  const t = useTranslations("HomePage.Newsletter");

  return (
    <section className="py-20 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-white/5">
      <div className="max-w-4xl mx-auto px-6 text-center space-y-10">
        <div className="inline-flex items-center gap-3 px-6 py-3 bg-primary/10 text-primary rounded-full animate-bounce">
          <Bell fill="currentColor" size={18} />
          <span className="text-xs font-black uppercase tracking-widest">
            {t("badge")}
          </span>
        </div>

        <div className="space-y-4">
          <h2 className="text-3xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            {getLocalizedValue(content?.title, locale) || t("title")}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-lg font-medium">
            {getLocalizedValue(content?.subtitle, locale) || t("subtitle")}
          </p>
        </div>

        <div className="relative max-w-2xl mx-auto group">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary to-indigo-600 rounded-[2.5rem] blur opacity-25 group-hover:opacity-40 transition duration-1000" />
          <div className="relative flex flex-col md:flex-row items-center gap-4 bg-white dark:bg-slate-800 p-2 rounded-[2.5rem] border border-slate-200 dark:border-white/10 shadow-2xl">
            <div className="flex-1 flex items-center px-6 w-full">
              <Mail className="text-slate-400 mr-4" size={24} />
              <input
                className="w-full bg-transparent border-none outline-none text-slate-900 dark:text-white font-medium py-4"
                placeholder={
                  getLocalizedValue(content?.placeholder, locale) ||
                  t("placeholder")
                }
                type="email"
              />
            </div>
            <button className="w-full md:w-auto px-10 py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-primary hover:text-white transition-all shadow-xl">
              {getLocalizedValue(content?.buttonText, locale) || t("button")}
              <Send size={16} strokeWidth={3} />
            </button>
          </div>
        </div>

        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
          {t("privacy")}
        </p>
      </div>
    </section>
  );
}
