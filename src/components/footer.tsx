"use client";

import Image from "next/image";
import Link from "next/link";
import { Facebook, Instagram, Twitter, Phone, Mail, Send } from "lucide-react";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Divider } from "@heroui/divider";
import { useTranslations } from "next-intl";

import { ROUTES } from "@/constants";

type FooterMessageKey =
  | "destinations.halong"
  | "destinations.hoian"
  | "destinations.phuquoc"
  | "destinations.sapa"
  | "destinations.hue"
  | "links.help_center"
  | "links.refund_policy"
  | "links.terms_of_service"
  | "links.privacy_policy"
  | "links.collaboration";

const EXPLORE_LINKS: { key: string; label: FooterMessageKey }[] = [
  { key: "halong", label: "destinations.halong" },
  { key: "hoian", label: "destinations.hoian" },
  { key: "phuquoc", label: "destinations.phuquoc" },
  { key: "sapa", label: "destinations.sapa" },
  { key: "hue", label: "destinations.hue" },
];

const SUPPORT_LINKS: {
  key: string;
  label: FooterMessageKey;
  href: string;
}[] = [
  { key: "help_center", label: "links.help_center", href: "#" },
  { key: "refund_policy", label: "links.refund_policy", href: "#" },
  {
    key: "terms_of_service",
    label: "links.terms_of_service",
    href: "/dieu-khoan-dich-vu",
  },
  {
    key: "privacy_policy",
    label: "links.privacy_policy",
    href: "/chinh-sach-bao-mat",
  },
  { key: "collaboration", label: "links.collaboration", href: "#" },
];

export const Footer = () => {
  const t = useTranslations("Footer");

  return (
    <footer
      className="w-full bg-slate-50 dark:bg-slate-900/50 pt-16 pb-8 border-t border-divider"
      id="footer"
    >
      <div className="container mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Column 1: Brand & About */}
          <div className="flex flex-col gap-6">
            <Link className="flex items-center gap-2 group" href={ROUTES.HOME}>
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
            </Link>
            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed font-bold">
              {t("about")}
            </p>
            <div className="flex gap-4">
              <Link
                className="w-11 h-11 rounded-xl bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center text-gray-400 hover:text-primary transition-all border border-gray-100 dark:border-white/5 hover:-translate-y-1"
                href="#"
              >
                <Facebook size={20} />
              </Link>
              <Link
                className="w-11 h-11 rounded-xl bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center text-gray-400 hover:text-primary transition-all border border-gray-100 dark:border-white/5 hover:-translate-y-1"
                href="#"
              >
                <Instagram size={20} />
              </Link>
              <Link
                className="w-11 h-11 rounded-xl bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center text-gray-400 hover:text-primary transition-all border border-gray-100 dark:border-white/5 hover:-translate-y-1"
                href="#"
              >
                <Twitter size={20} />
              </Link>
            </div>
          </div>

          {/* Column 2: Explore */}
          <div className="flex flex-col gap-6">
            <h4 className="text-sm font-black uppercase tracking-[0.2em] text-foreground">
              {t("explore")}
            </h4>
            <ul className="flex flex-col gap-3">
              {EXPLORE_LINKS.map((item) => (
                <li key={item.key}>
                  <Link
                    className="text-default-500 hover:text-primary text-sm font-medium transition-colors"
                    href="#"
                  >
                    {t(item.label)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Support */}
          <div className="flex flex-col gap-6">
            <h4 className="text-sm font-black uppercase tracking-[0.2em] text-foreground">
              {t("support")}
            </h4>
            <ul className="flex flex-col gap-3">
              {SUPPORT_LINKS.map((item) => (
                <li key={item.key}>
                  <Link
                    className="text-default-500 hover:text-primary text-sm font-medium transition-colors"
                    href={item.href}
                  >
                    {t(item.label)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div className="flex flex-col gap-6">
            <h4 className="text-sm font-black uppercase tracking-[0.2em] text-foreground">
              {t("newsletter_title")}
            </h4>
            <p className="text-default-500 text-sm font-medium">
              {t("newsletter_description")}
            </p>
            <div suppressHydrationWarning className="relative group">
              <Input
                suppressHydrationWarning
                classNames={{
                  inputWrapper:
                    "bg-white dark:bg-slate-800 border-none shadow-sm h-12 pr-12",
                  input: "text-sm",
                }}
                placeholder={t("email_placeholder")}
                radius="lg"
                variant="flat"
              />
              <Button
                isIconOnly
                suppressHydrationWarning
                className="absolute right-1 top-1 h-10 w-10 min-w-10 z-10"
                color="primary"
                radius="md"
                size="sm"
              >
                <Send size={16} />
              </Button>
            </div>
            <div className="flex flex-col gap-3 mt-2">
              <div className="flex items-center gap-3 text-default-500">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Phone size={14} />
                </div>
                <span className="text-sm font-bold">1900 123 456</span>
              </div>
              <div className="flex items-center gap-3 text-default-500">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Mail size={14} />
                </div>
                <span className="text-sm font-medium">contact@vivu.com.vn</span>
              </div>
            </div>
          </div>
        </div>

        <Divider className="opacity-50" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-8 mt-12">
          <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest order-2 md:order-1 text-center md:text-left">
            © {new Date().getFullYear()} Vivu Travel . {t("copyright_suffix")}
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
  );
};
