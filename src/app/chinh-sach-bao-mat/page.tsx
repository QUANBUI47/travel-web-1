"use client";

import { useState, useEffect } from "react";
import {
  Shield,
  Lock,
  Eye,
  Database,
  Share2,
  UserCheck,
  Mail,
  Clock,
  Printer,
  Download,
  ChevronRight,
  ShieldCheck,
  Bell,
  MapPin,
  Phone,
  ExternalLink,
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

export default function PrivacyPolicyPage() {
  const t = useTranslations("Legal.privacy");
  const tCommon = useTranslations("Common");
  const tFooter = useTranslations("Footer");
  const [mounted, setMounted] = useState(false);
  const { theme, systemTheme } = useTheme();
  const [activeSection, setActiveSection] = useState("collection");

  useEffect(() => {
    setMounted(true);
  }, []);

  // Determine current theme
  const currentTheme = theme === "system" ? systemTheme : theme;
  const isDarkMode = currentTheme === "dark";

  const sections = [
    {
      id: "collection",
      title: t("sections.collection"),
      icon: <Database size={18} />,
    },
    { id: "usage", title: t("sections.usage"), icon: <Eye size={18} /> },
    { id: "security", title: t("sections.security"), icon: <Lock size={18} /> },
    { id: "cookies", title: t("sections.cookies"), icon: <Bell size={18} /> },
    { id: "sharing", title: t("sections.sharing"), icon: <Share2 size={18} /> },
    {
      id: "rights",
      title: t("sections.rights"),
      icon: <UserCheck size={18} />,
    },
    { id: "contact", title: t("sections.contact"), icon: <Mail size={18} /> },
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
        accent: "text-[#0068c3]",
        accentBg: "bg-[#0068c3]",
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

      {/* Hero Section */}
      <section
        className={`${isDarkMode ? "bg-[#0a0d11]" : "bg-blue-50/50"} py-20 md:py-32 px-6 border-b ${themeColors.border} relative overflow-hidden`}
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#fcc219]/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#3385da]/10 border border-[#3385da]/20 text-[#3385da] text-[10px] font-black uppercase tracking-[0.3em] mb-6">
            <Shield size={12} /> {t("breadcrumb")}
          </div>
          <h1 className="text-4xl md:text-6xl font-black font-serif tracking-tighter mb-6 leading-tight">
            {t("hero_title_prefix")} <br />{" "}
            <span className="text-[#fcc219]">{t("hero_title_highlight")}</span>
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

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-16 md:py-24 flex flex-col lg:flex-row gap-16">
        {/* Sticky Sidebar Navigation */}
        <aside className="lg:w-1/4">
          <div className="sticky top-28 space-y-1.5">
            <p
              className={`text-[10px] font-black uppercase tracking-[0.3em] ${themeColors.subtext} mb-6 px-4`}
            >
              {t("nav_title")}
            </p>
            {sections.map((section) => (
              <button
                key={section.id}
                className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl text-[13px] font-bold transition-all text-left group ${
                  activeSection === section.id
                    ? `${themeColors.accentBg} text-white shadow-xl shadow-blue-500/20`
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
                <span
                  className={
                    activeSection === section.id
                      ? "text-white"
                      : themeColors.accent
                  }
                >
                  {section.icon}
                </span>
                {section.title}
                <ChevronRight
                  className={`ml-auto transition-opacity ${activeSection === section.id ? "opacity-100" : "opacity-0"}`}
                  size={14}
                />
              </button>
            ))}

            <div
              className={`mt-12 p-8 rounded-[2rem] border ${themeColors.border} ${isDarkMode ? "bg-white/5 shadow-2xl shadow-black/20" : "bg-[#fcc219]/5"}`}
            >
              <ShieldCheck className="text-[#fcc219] mb-4" size={32} />
              <p className="text-xs font-black uppercase tracking-widest mb-2">
                {t("safecare_brand")}
              </p>
              <p className={`text-xs leading-relaxed ${themeColors.subtext}`}>
                {t("safecare")}
              </p>
            </div>
          </div>
        </aside>

        {/* Policy Content */}
        <article className="lg:w-3/4 space-y-20 leading-relaxed">
          <section className="scroll-mt-32" id="collection">
            <h2 className="text-3xl font-black mb-8 flex items-center gap-4">
              <div
                className={`w-10 h-10 rounded-xl ${themeColors.accentBg} text-white flex items-center justify-center`}
              >
                <Database size={20} />
              </div>
              {t("sections.collection")}
            </h2>
            <div
              className={`space-y-6 ${themeColors.subtext} font-medium text-[15px]`}
            >
              <p>{t("sections.collection_desc")}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    label: t("sections.collection_items.id"),
                    value: t("sections.collection_items.id_desc"),
                  },
                  {
                    label: t("sections.collection_items.contact"),
                    value: t("sections.collection_items.contact_desc"),
                  },
                  {
                    label: t("sections.collection_items.payment"),
                    value: t("sections.collection_items.payment_desc"),
                  },
                  {
                    label: t("sections.collection_items.device"),
                    value: t("sections.collection_items.device_desc"),
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className={`p-6 rounded-3xl border ${themeColors.border} ${themeColors.card}`}
                  >
                    <h4 className={`font-bold mb-2 ${themeColors.text}`}>
                      {item.label}
                    </h4>
                    <p className="text-sm">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="scroll-mt-32" id="usage">
            <h2 className="text-3xl font-black mb-8 flex items-center gap-4">
              <div
                className={`w-10 h-10 rounded-xl ${themeColors.accentBg} text-white flex items-center justify-center`}
              >
                <Eye size={20} />
              </div>
              {t("sections.usage")}
            </h2>
            <div className={`space-y-4 ${themeColors.subtext} font-medium`}>
              <p>{t("sections.usage_desc")}</p>
              <ul className="space-y-4">
                {(t.raw("sections.usage_items") as string[]).map((text, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div
                      className={`mt-1.5 w-1.5 h-1.5 rounded-full ${themeColors.accentBg} shrink-0`}
                    />
                    <span>{text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section className="scroll-mt-32" id="security">
            <h2 className="text-3xl font-black mb-8 flex items-center gap-4">
              <div
                className={`w-10 h-10 rounded-xl ${themeColors.accentBg} text-white flex items-center justify-center`}
              >
                <Lock size={20} />
              </div>
              {t("security_commitment_title")}
            </h2>
            <div
              className={`bg-[#3385da]/5 border border-[#3385da]/20 p-10 rounded-[2.5rem]`}
            >
              <p className={`${themeColors.subtext} font-medium mb-6`}>
                {t("security_commitment_desc")}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div>
                  <h4 className={`font-bold mb-2 ${themeColors.text}`}>
                    {t("security_ssl_title")}
                  </h4>
                  <p className="text-sm opacity-70">{t("security_ssl_desc")}</p>
                </div>
                <div>
                  <h4 className={`font-bold mb-2 ${themeColors.text}`}>
                    {t("security_access_title")}
                  </h4>
                  <p className="text-sm opacity-70">
                    {t("security_access_desc")}
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="scroll-mt-32" id="cookies">
            <h2 className="text-3xl font-black mb-8 flex items-center gap-4">
              <div
                className={`w-10 h-10 rounded-xl ${themeColors.accentBg} text-white flex items-center justify-center`}
              >
                <Bell size={20} />
              </div>
              {t("cookies_title")}
            </h2>
            <div className={`space-y-6 ${themeColors.subtext} font-medium`}>
              <p>{t("cookies_intro")}</p>
              <div className="space-y-4">
                {[
                  {
                    title: t("cookie_essential_title"),
                    desc: t("cookie_essential_desc"),
                  },
                  {
                    title: t("cookie_performance_title"),
                    desc: t("cookie_performance_desc"),
                  },
                  {
                    title: t("cookie_functional_title"),
                    desc: t("cookie_functional_desc"),
                  },
                ].map((cookie, i) => (
                  <div
                    key={i}
                    className={`p-5 rounded-2xl border ${themeColors.border} flex items-center gap-4`}
                  >
                    <div className="w-2 h-2 rounded-full bg-[#fcc219] shrink-0" />
                    <div>
                      <h4 className={`font-bold text-sm ${themeColors.text}`}>
                        {cookie.title}
                      </h4>
                      <p className="text-xs">{cookie.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="scroll-mt-32" id="sharing">
            <h2 className="text-3xl font-black mb-8 flex items-center gap-4">
              <div
                className={`w-10 h-10 rounded-xl ${themeColors.accentBg} text-white flex items-center justify-center`}
              >
                <Share2 size={20} />
              </div>
              {t("sharing_intro_title")}
            </h2>
            <div className={`space-y-6 ${themeColors.subtext} font-medium`}>
              <p>{t("sharing_intro")}</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  {
                    title: t("sections.sharing_provider_title"),
                    desc: t("sections.sharing_partner_desc"),
                  },
                  {
                    title: t("sections.sharing_payment_title"),
                    desc: t("sections.sharing_payment_desc"),
                  },
                  {
                    title: t("sections.sharing_legal_title"),
                    desc: t("sections.sharing_legal_desc"),
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className={`p-6 rounded-2xl border ${themeColors.border} ${themeColors.card} relative overflow-hidden`}
                  >
                    <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/5 rounded-bl-full" />
                    <h4
                      className={`font-bold mb-3 ${themeColors.text} text-sm`}
                    >
                      {item.title}
                    </h4>
                    <p className="text-xs leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="scroll-mt-32" id="rights">
            <h2 className="text-3xl font-black mb-8 flex items-center gap-4">
              <div
                className={`w-10 h-10 rounded-xl ${themeColors.accentBg} text-white flex items-center justify-center`}
              >
                <UserCheck size={20} />
              </div>
              {t("rights_title")}
            </h2>
            <div className={`space-y-6 ${themeColors.subtext} font-medium`}>
              <p>{t("rights_intro")}</p>
              <div className="space-y-4">
                {[
                  {
                    title: t("right_access_title"),
                    desc: t("right_access_desc"),
                  },
                  {
                    title: t("right_edit_title"),
                    desc: t("right_edit_desc"),
                  },
                  {
                    title: t("right_delete_title"),
                    desc: t("right_delete_desc"),
                  },
                ].map((right, i) => (
                  <div
                    key={i}
                    className={`p-5 rounded-2xl border ${themeColors.border} flex justify-between items-center group hover:bg-[#3385da]/5 transition-colors`}
                  >
                    <div>
                      <h4 className={`font-bold ${themeColors.text}`}>
                        {right.title}
                      </h4>
                      <p className="text-xs mt-1">{right.desc}</p>
                    </div>
                    <ChevronRight
                      className="opacity-20 group-hover:opacity-100 transition-opacity"
                      size={18}
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="scroll-mt-32" id="contact">
            <h2 className="text-3xl font-black mb-8 flex items-center gap-4">
              <div
                className={`w-10 h-10 rounded-xl ${themeColors.accentBg} text-white flex items-center justify-center`}
              >
                <Mail size={20} />
              </div>
              {t("contact_title")}
            </h2>
            <div
              className={`p-10 rounded-[3rem] border ${themeColors.border} ${themeColors.card} shadow-2xl shadow-blue-500/5`}
            >
              <p className={`${themeColors.subtext} mb-8`}>
                {t("contact_intro")}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-500/10 rounded-xl text-[#3385da]">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <h5 className={`font-bold text-sm ${themeColors.text}`}>
                      {t("contact_hq")}
                    </h5>
                    <p className="text-xs mt-1 opacity-70 leading-relaxed">
                      {t("contact_address")}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-500/10 rounded-xl text-[#3385da]">
                    <Mail size={20} />
                  </div>
                  <div>
                    <h5 className={`font-bold text-sm ${themeColors.text}`}>
                      {t("contact_email_label")}
                    </h5>
                    <p className="text-xs mt-1 opacity-70">
                      privacy@vivu.com.vn
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-500/10 rounded-xl text-[#3385da]">
                    <Phone size={20} />
                  </div>
                  <div>
                    <h5 className={`font-bold text-sm ${themeColors.text}`}>
                      {t("contact_hotline")}
                    </h5>
                    <p className="text-xs mt-1 opacity-70">
                      {t("contact_hotline_value")}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-500/10 rounded-xl text-[#3385da]">
                    <ExternalLink size={20} />
                  </div>
                  <div>
                    <h5 className={`font-bold text-sm ${themeColors.text}`}>
                      {t("contact_online")}
                    </h5>
                    <p className="text-xs mt-1 opacity-70">
                      {t("contact_online_value")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Action Buttons */}
          <div
            className={`pt-12 border-t ${themeColors.border} flex flex-col sm:flex-row gap-4`}
          >
            <button
              className={`${themeColors.accentBg} text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-2xl shadow-blue-500/30 transition-all hover:scale-[1.02] active:scale-95`}
            >
              <Printer size={16} /> {t("print")}
            </button>
            <button
              className={`border ${themeColors.border} ${themeColors.text} px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all`}
            >
              <Download size={16} /> {t("download")}
            </button>
          </div>
        </article>
      </main>

      {/* Standalone Footer consistent with Brand */}
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
                      className={`text-sm font-medium transition-colors ${item.href === ROUTES.PRIVACY ? "text-emerald-500 font-black" : "text-default-500 hover:text-primary"}`}
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
