"use client";

import { useState, useEffect } from "react";
import {
  Shield,
  Search,
  Printer,
  Download,
  Mail,
  FileText,
  Scale,
  Lock,
  Clock,
  ArrowLeft,
  Facebook,
  Instagram,
  Twitter,
  Send,
} from "lucide-react";
import { useTheme } from "next-themes";
import NextLink from "next/link";
import Image from "next/image";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Divider } from "@heroui/divider";
import {
  Navbar as HeroUINavbar,
  NavbarContent,
  NavbarBrand,
  NavbarItem,
} from "@heroui/navbar";
import { useTranslations } from "next-intl";

import { ROUTES } from "@/constants";
import { ThemeSwitch } from "@/components/theme-switch";

export default function TermsOfServicePage() {
  const t = useTranslations("Legal.terms");
  const tCommon = useTranslations("Common");
  const tFooter = useTranslations("Footer");
  const [mounted, setMounted] = useState(false);
  const { theme, systemTheme } = useTheme();
  const [activeSection, setActiveSection] = useState("intro");

  useEffect(() => {
    setMounted(true);
  }, []);

  // Determine current theme
  const currentTheme = theme === "system" ? systemTheme : theme;
  const isDarkMode = currentTheme === "dark";

  const accountsItems = t.raw("accounts_items") as string[];
  const ipRules = t.raw("ip_rules") as Array<{ allow: boolean; text: string }>;
  const privacyMeasures = [
    {
      titleKey: "privacy_measure_ssl_title",
      descKey: "privacy_measure_ssl_desc",
    },
    {
      titleKey: "privacy_measure_access_title",
      descKey: "privacy_measure_access_desc",
    },
    {
      titleKey: "privacy_measure_backup_title",
      descKey: "privacy_measure_backup_desc",
    },
    {
      titleKey: "privacy_measure_audit_title",
      descKey: "privacy_measure_audit_desc",
    },
  ] as const;

  const sections = [
    { id: "intro", title: t("sections.intro"), icon: <FileText size={18} /> },
    {
      id: "definitions",
      title: t("sections.definitions"),
      icon: <Search size={18} />,
    },
    { id: "accounts", title: t("sections.accounts"), icon: <Lock size={18} /> },
    {
      id: "bookings",
      title: t("sections.bookings"),
      icon: <Scale size={18} />,
    },
    {
      id: "cancellation",
      title: t("sections.cancellation"),
      icon: <ArrowLeft size={18} />,
    },
    { id: "privacy", title: t("sections.privacy"), icon: <Shield size={18} /> },
    { id: "ip", title: t("sections.ip"), icon: <FileText size={18} /> },
  ];

  const themeColors = isDarkMode
    ? {
        bg: "bg-[#0D1117]",
        card: "bg-[#161B22]",
        text: "text-[#F0F6FC]",
        subtext: "text-[#8B949E]",
        border: "border-[#30363D]",
        accent: "text-[#3385da]",
        accentBg: "bg-[#3385da]",
        navHover: "hover:bg-[#30363D]",
      }
    : {
        bg: "bg-[#FAFAFA]",
        card: "bg-white",
        text: "text-[#1A1A1A]",
        subtext: "text-gray-500",
        border: "border-gray-200",
        accent: "text-[#0a66c2]",
        accentBg: "bg-[#0a66c2]",
        navHover: "hover:bg-gray-100",
      };

  if (!mounted) {
    return null; // prevent hydration mismatch
  }

  return (
    <div
      className={`min-h-screen ${themeColors.bg} ${themeColors.text} font-sans transition-colors duration-500`}
    >
      {/* Custom Header Styled like Homepage Navbar */}
      <HeroUINavbar
        classNames={{
          base: "border-b border-divider/40 backdrop-blur-xl bg-background/60",
          wrapper: "px-6",
        }}
        height="5rem"
        maxWidth="xl"
        position="sticky"
      >
        <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
          <NavbarBrand as="li" className="gap-3 max-w-fit">
            <NextLink
              className="flex justify-start items-center gap-2 group"
              href={ROUTES.HOME}
            >
              <div className="relative h-10 w-32">
                <Image
                  fill
                  priority
                  alt="Vivu Logo"
                  className="dark:hidden object-contain"
                  src="/images/vivu-logo-light.svg"
                />
                <Image
                  fill
                  priority
                  alt="Vivu Logo"
                  className="hidden dark:block object-contain"
                  src="/images/vivu-logo-dark.svg"
                />
              </div>
            </NextLink>
          </NavbarBrand>
        </NavbarContent>

        <NavbarContent className="flex basis-1/5 sm:basis-full" justify="end">
          <NavbarItem className="flex items-center gap-4">
            <ThemeSwitch />
          </NavbarItem>
          <NavbarItem>
            <Button
              as={NextLink}
              className="font-bold text-[13px] px-6 h-10 shadow-lg shadow-primary/20 hover:scale-105 transition-all"
              color="primary"
              href={ROUTES.HOME}
              radius="full"
            >
              {tCommon("back_to_home")}
            </Button>
          </NavbarItem>
        </NavbarContent>
      </HeroUINavbar>

      {/* Hero Banner cho trang Điều khoản */}
      <section
        className={`${isDarkMode ? "bg-[#0a0d11]" : "bg-blue-50"} py-16 md:py-24 px-6 border-b ${themeColors.border}`}
      >
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#fcc219]/10 border border-[#fcc219]/20 text-[#fcc219] text-[10px] font-black uppercase tracking-[0.3em] mb-6">
            <FileText size={12} /> {t("title")}
          </div>
          <h1 className="text-4xl md:text-6xl font-black font-serif tracking-tighter mb-6 leading-tight">
            {t("hero_title")}
          </h1>
          <p
            className={`${themeColors.subtext} text-lg max-w-2xl mx-auto font-medium`}
          >
            {t("hero_desc")}
          </p>
          <div
            className={`mt-8 flex justify-center items-center gap-2 text-xs font-bold ${themeColors.subtext}`}
          >
            <Clock size={14} /> {t("updated_at")}
          </div>
        </div>
      </section>

      {/* Nội dung chính */}
      <main className="max-w-7xl mx-auto px-6 py-12 md:py-20 flex flex-col lg:flex-row gap-12">
        {/* Sidebar điều hướng (Sticky) */}
        <aside className="lg:w-1/4">
          <div className="sticky top-28 space-y-1">
            <p
              className={`text-[10px] font-black uppercase tracking-[0.3em] ${themeColors.subtext} mb-6 px-4`}
            >
              {t("nav_title")}
            </p>
            {sections.map((section) => (
              <button
                key={section.id}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all text-left ${
                  activeSection === section.id
                    ? `${themeColors.accentBg} text-white shadow-lg`
                    : `${themeColors.subtext} ${themeColors.navHover}`
                }`}
                onClick={() => {
                  setActiveSection(section.id);
                  const el = document.getElementById(section.id);

                  if (el) {
                    const y =
                      el.getBoundingClientRect().top + window.scrollY - 100;

                    window.scrollTo({ top: y, behavior: "smooth" });
                  }
                }}
              >
                {section.icon}
                {section.title}
              </button>
            ))}

            <div
              className={`mt-12 p-8 rounded-[2rem] border ${themeColors.border} ${isDarkMode ? "bg-white/5 shadow-2xl shadow-black/20" : "bg-[#fcc219]/5"}`}
            >
              <Mail className="text-[#fcc219] mb-4" size={32} />
              <p className="text-xs font-black uppercase tracking-widest mb-2">
                {t("legal_help")}
              </p>
              <button
                className={`text-xs font-bold text-left hover:text-[#fcc219] transition-colors leading-relaxed ${themeColors.subtext}`}
              >
                {t("legal_contact")}
              </button>
            </div>
          </div>
        </aside>

        {/* Nội dung văn bản */}
        <article className="lg:w-3/4 space-y-16 leading-relaxed">
          <section className="scroll-mt-32" id="intro">
            <h2 className="text-2xl font-black mb-6 flex items-center gap-3">
              <span
                className={`w-8 h-8 rounded-lg ${themeColors.accentBg} text-white flex items-center justify-center text-sm`}
              >
                1
              </span>
              {t("sections.intro")}
            </h2>
            <div className={`space-y-4 ${themeColors.subtext} font-medium`}>
              <p>{t("intro_p1")}</p>
              <p>{t("intro_p2")}</p>
            </div>
          </section>

          <section className="scroll-mt-32" id="definitions">
            <h2 className="text-2xl font-black mb-6 flex items-center gap-3">
              <span
                className={`w-8 h-8 rounded-lg ${themeColors.accentBg} text-white flex items-center justify-center text-sm`}
              >
                2
              </span>
              {t("sections.definitions")}
            </h2>
            <div className={`grid grid-cols-1 md:grid-cols-2 gap-6`}>
              <div
                className={`p-6 rounded-2xl border ${themeColors.border} ${themeColors.card}`}
              >
                <h4 className="font-bold mb-2">{t("def_service_label")}</h4>
                <p className={`text-sm ${themeColors.subtext}`}>
                  {t("def_service_desc")}
                </p>
              </div>
              <div
                className={`p-6 rounded-2xl border ${themeColors.border} ${themeColors.card}`}
              >
                <h4 className="font-bold mb-2">{t("def_member_label")}</h4>
                <p className={`text-sm ${themeColors.subtext}`}>
                  {t("def_member_desc")}
                </p>
              </div>
            </div>
          </section>

          <section className="scroll-mt-32" id="accounts">
            <h2 className="text-2xl font-black mb-6 flex items-center gap-3">
              <span
                className={`w-8 h-8 rounded-lg ${themeColors.accentBg} text-white flex items-center justify-center text-sm`}
              >
                3
              </span>
              {t("sections.accounts")}
            </h2>
            <div className={`space-y-4 ${themeColors.subtext} font-medium`}>
              <p>{t("accounts_p1")}</p>
              <ul className="list-disc pl-5 space-y-2">
                {accountsItems.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </section>

          <section className="scroll-mt-32" id="bookings">
            <h2 className="text-2xl font-black mb-6 flex items-center gap-3">
              <span
                className={`w-8 h-8 rounded-lg ${themeColors.accentBg} text-white flex items-center justify-center text-sm`}
              >
                4
              </span>
              {t("sections.bookings")}
            </h2>
            <p className={`${themeColors.subtext} font-medium mb-6`}>
              {t("bookings_pricing")}
            </p>
            <div
              className={`bg-[#fcc219]/5 border border-[#fcc219]/20 p-8 rounded-3xl`}
            >
              <h4 className="font-bold text-[#ca9b14] flex items-center gap-2 mb-4">
                <Shield size={18} /> {t("bookings_payment_title")}
              </h4>
              <p className="text-sm text-slate-500 font-medium">
                {t("bookings_payment_desc")}
              </p>
            </div>
          </section>

          <section className="scroll-mt-32" id="cancellation">
            <h2 className="text-2xl font-black mb-6 flex items-center gap-3">
              <span
                className={`w-8 h-8 rounded-lg ${themeColors.accentBg} text-white flex items-center justify-center text-sm`}
              >
                5
              </span>
              {t("sections.cancellation")}
            </h2>
            <div className={`space-y-4 ${themeColors.subtext} font-medium`}>
              <p>{t("cancellation_intro")}</p>
              <div
                className={`overflow-hidden border ${themeColors.border} rounded-2xl`}
              >
                <table className="w-full text-sm text-left">
                  <thead
                    className={`${isDarkMode ? "bg-white/5" : "bg-gray-100"} font-bold`}
                  >
                    <tr>
                      <th className="p-4 uppercase tracking-widest text-[10px]">
                        {t("cancel_col_time")}
                      </th>
                      <th className="p-4 uppercase tracking-widest text-[10px]">
                        {t("cancel_col_refund")}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                    <tr>
                      <td className="p-4">{t("cancel_row_7d")}</td>
                      <td className="p-4 text-emerald-500 font-bold">100%</td>
                    </tr>
                    <tr>
                      <td className="p-4">{t("cancel_row_3_6d")}</td>
                      <td className="p-4 text-[#fcc219] font-bold">50%</td>
                    </tr>
                    <tr>
                      <td className="p-4">{t("cancel_row_48h")}</td>
                      <td className="p-4 text-red-500 font-bold">0%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          <section className="scroll-mt-32" id="privacy">
            <h2 className="text-2xl font-black mb-6 flex items-center gap-3">
              <span
                className={`w-8 h-8 rounded-lg ${themeColors.accentBg} text-white flex items-center justify-center text-sm`}
              >
                6
              </span>
              {t("sections.privacy")}
            </h2>
            <div className={`space-y-6 ${themeColors.subtext} font-medium`}>
              <p>{t("privacy_p1")}</p>
              <div
                className={`bg-[#3385da]/5 border border-[#3385da]/20 p-8 rounded-3xl`}
              >
                <h4 className="font-bold mb-4 flex items-center gap-2">
                  <Shield className={themeColors.accent} size={16} />{" "}
                  {t("privacy_measures_title")}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {privacyMeasures.map((item) => (
                    <div
                      key={item.titleKey}
                      className={`p-4 rounded-2xl border ${themeColors.border} ${themeColors.card}`}
                    >
                      <h5 className="font-bold text-sm mb-1">
                        {t(item.titleKey)}
                      </h5>
                      <p className="text-xs opacity-80">{t(item.descKey)}</p>
                    </div>
                  ))}
                </div>
              </div>
              <p>
                {t("privacy_link_prefix")}{" "}
                <a
                  className={`${themeColors.accent} hover:underline font-bold`}
                  href={ROUTES.PRIVACY}
                >
                  {t("privacy_link_label")}
                </a>{" "}
                {t("privacy_link_suffix")}
              </p>
            </div>
          </section>

          <section className="scroll-mt-32" id="ip">
            <h2 className="text-2xl font-black mb-6 flex items-center gap-3">
              <span
                className={`w-8 h-8 rounded-lg ${themeColors.accentBg} text-white flex items-center justify-center text-sm`}
              >
                7
              </span>
              {t("sections.ip")}
            </h2>
            <div className={`space-y-6 ${themeColors.subtext} font-medium`}>
              <p>{t("ip_p1")}</p>
              <div
                className={`border ${themeColors.border} rounded-3xl overflow-hidden`}
              >
                <div
                  className={`${isDarkMode ? "bg-white/5" : "bg-gray-50"} p-4 border-b ${themeColors.border}`}
                >
                  <p className="text-xs font-black uppercase tracking-widest opacity-60">
                    {t("ip_rules_title")}
                  </p>
                </div>
                <div className="divide-y divide-slate-100 dark:divide-white/5">
                  {ipRules.map((rule, i) => (
                    <div key={i} className="flex items-center gap-4 p-4">
                      <span
                        className={`text-xs font-black px-2 py-0.5 rounded-full ${rule.allow ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"}`}
                      >
                        {rule.allow ? t("ip_allowed") : t("ip_forbidden")}
                      </span>
                      <p className="text-sm">{rule.text}</p>
                    </div>
                  ))}
                </div>
              </div>
              <p>{t("ip_p2")}</p>
            </div>
          </section>

          {/* Nút hành động cuối trang */}
          <div
            className={`pt-12 border-t ${themeColors.border} flex flex-col sm:flex-row gap-4`}
          >
            <button
              className={`${themeColors.accentBg} text-white px-8 py-4 rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl shadow-blue-500/20 transition-all hover:scale-[1.02] active:scale-95`}
            >
              <Printer size={16} /> {t("print")}
            </button>
            <button
              className={`border ${themeColors.border} ${themeColors.text} px-8 py-4 rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all`}
            >
              <Download size={16} /> {t("download")}
            </button>
          </div>
        </article>
      </main>

      {/* Custom Footer Styled like Homepage Footer */}
      <footer className="w-full bg-slate-50 dark:bg-slate-900/50 pt-16 pb-8 border-t border-divider transition-colors duration-500">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16 text-left">
            {/* Column 1: Brand & About */}
            <div className="flex flex-col gap-6">
              <NextLink
                className="flex items-center gap-2 group"
                href={ROUTES.HOME}
              >
                <div className="relative h-10 w-10 transition-transform duration-300 group-hover:scale-110">
                  <Image
                    fill
                    alt="Vivu Logo"
                    className="object-contain"
                    src="/favicon-vivu.svg"
                  />
                </div>
                <span className="text-2xl font-black text-foreground tracking-tighter">
                  Vivu<span className="text-primary italic">.</span>
                </span>
              </NextLink>
              <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed font-bold">
                {tFooter("about")}
              </p>
              <div className="flex gap-4">
                <NextLink
                  className="w-11 h-11 rounded-xl bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center text-gray-400 hover:text-primary transition-all border border-gray-100 dark:border-white/5 hover:-translate-y-1"
                  href="#"
                >
                  <Facebook size={20} />
                </NextLink>
                <NextLink
                  className="w-11 h-11 rounded-xl bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center text-gray-400 hover:text-primary transition-all border border-gray-100 dark:border-white/5 hover:-translate-y-1"
                  href="#"
                >
                  <Instagram size={20} />
                </NextLink>
                <NextLink
                  className="w-11 h-11 rounded-xl bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center text-gray-400 hover:text-primary transition-all border border-gray-100 dark:border-white/5 hover:-translate-y-1"
                  href="#"
                >
                  <Twitter size={20} />
                </NextLink>
              </div>
            </div>

            {/* Column 2: Explore */}
            <div className="flex flex-col gap-6">
              <h4 className="text-sm font-black uppercase tracking-[0.2em] text-foreground">
                {tFooter("explore")}
              </h4>
              <ul className="flex flex-col gap-3">
                {(
                  [
                    ["halong", "#"],
                    ["hoian", "#"],
                    ["phuquoc", "#"],
                    ["sapa", "#"],
                    ["hue", "#"],
                  ] as const
                ).map(([key, href]) => (
                  <li key={key}>
                    <NextLink
                      className="text-default-500 hover:text-primary text-sm font-medium transition-colors"
                      href={href}
                    >
                      {tFooter(`destinations.${key}`)}
                    </NextLink>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Support */}
            <div className="flex flex-col gap-6">
              <h4 className="text-sm font-black uppercase tracking-[0.2em] text-foreground">
                {tFooter("support")}
              </h4>
              <ul className="flex flex-col gap-3">
                {(
                  [
                    { key: "help_center", href: "#" },
                    { key: "refund_policy", href: "#" },
                    { key: "terms_of_service", href: ROUTES.TERMS },
                    { key: "privacy_policy", href: ROUTES.PRIVACY },
                    { key: "collaboration", href: "#" },
                  ] as const
                ).map((item) => (
                  <li key={item.key}>
                    <NextLink
                      className={`text-sm font-medium transition-colors ${item.href === ROUTES.TERMS ? "text-primary font-black" : "text-default-500 hover:text-primary"}`}
                      href={item.href}
                    >
                      {tFooter(`links.${item.key}`)}
                    </NextLink>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 4: Newsletter */}
            <div className="flex flex-col gap-6">
              <h4 className="text-sm font-black uppercase tracking-[0.2em] text-foreground">
                {tFooter("newsletter_title")}
              </h4>
              <p className="text-default-500 text-sm font-medium">
                {tFooter("newsletter_description")}
              </p>
              <div className="relative group">
                <Input
                  classNames={{
                    inputWrapper:
                      "bg-white dark:bg-slate-800 border-none shadow-sm h-12 pr-12",
                    input: "text-sm",
                  }}
                  placeholder={tFooter("email_placeholder")}
                  radius="lg"
                  variant="flat"
                />
                <Button
                  isIconOnly
                  className="absolute right-1 top-1 h-10 w-10 min-w-10 z-10"
                  color="primary"
                  radius="md"
                  size="sm"
                >
                  <Send size={16} />
                </Button>
              </div>
            </div>
          </div>

          <Divider className="opacity-50" />

          <div className="flex flex-col md:flex-row justify-between items-center gap-8 mt-12">
            <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest order-2 md:order-1 text-center md:text-left">
              © {new Date().getFullYear()} Vivu Travel . {t("copyright_line")}
            </p>
            <div className="flex items-center gap-8 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-500 order-1 md:order-2">
              <div className="font-extrabold text-slate-400 text-base italic">
                VISA
              </div>
              <div className="font-extrabold text-slate-400 text-base italic">
                MASTERCARD
              </div>
              <div className="font-extrabold text-slate-400 text-base italic">
                PAYPAL
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
