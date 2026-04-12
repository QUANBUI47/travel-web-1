"use client";

import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Image as HeroUI_Image } from "@heroui/image";
import NextLink from "next/link";
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  ShieldCheck,
  ChevronRight,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";
import { useState, useTransition } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";

import { signup } from "../actions";

import { GoogleSignInButton } from "@/components/auth/google-sign-in-button";
import { ROUTES } from "@/constants";

export default function SignupPage() {
  const t = useTranslations("Auth");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(formData: FormData) {
    const pwd = formData.get("password") as string;
    const confirmPwd = formData.get("confirmPassword") as string;

    if (pwd !== confirmPwd) {
      setErrorMsg(t("signup.password_mismatch"));

      return;
    }

    startTransition(async () => {
      const result = await signup(formData);

      if (result?.error) setErrorMsg(result.error);
    });
  }

  return (
    <div className="min-h-[100dvh] w-full flex bg-slate-100 dark:bg-slate-950 font-sans">
      {/* Left Panel - Form Area */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-8 xl:p-12 bg-white dark:bg-slate-900 rounded-none lg:rounded-r-3xl relative shadow-[10px_0_30px_rgba(0,0,0,0.05)] dark:shadow-[10px_0_30px_rgba(0,0,0,0.3)] min-h-[100dvh] overflow-y-auto z-10">
        {/* Back Button */}
        <NextLink
          className="absolute top-6 left-6 xl:top-8 xl:left-8 inline-flex items-center text-xs xl:text-[13px] font-black uppercase text-slate-500 hover:text-primary transition-colors group z-10 tracking-widest"
          href={ROUTES.HOME}
        >
          <ArrowLeft className="w-4 h-4 mr-1.5 transition-transform group-hover:-translate-x-1" />
          {t("back_to_home")}
        </NextLink>

        <div className="w-full max-w-[420px] xl:max-w-[460px] flex flex-col py-2">
          {/* Header */}
          <div className="mb-6 xl:mb-10">
            <h2 className="text-3xl sm:text-3xl lg:text-4xl font-black font-serif text-slate-900 dark:text-white tracking-tight mb-2 xl:mb-3">
              {t("signup.title")}
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm xl:text-base font-medium">
              {t("signup.desc")}
            </p>
          </div>

          {errorMsg && (
            <div className="border-l-4 border-danger px-4 py-3 text-danger text-sm font-bold animate-shake mb-5 xl:mb-6 rounded-r bg-red-50 dark:bg-danger-900/20">
              {errorMsg}
            </div>
          )}

          <div className="mb-5 xl:mb-6">
            <GoogleSignInButton onError={setErrorMsg} />
          </div>

          <div className="flex items-center gap-4 py-3 xl:py-4 w-full">
            <div className="flex-1 h-px bg-slate-100 dark:bg-slate-800" />
            <span className="text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">
              {t("or_with_info")}
            </span>
            <div className="flex-1 h-px bg-slate-100 dark:bg-slate-800" />
          </div>

          {/* Form Credentials */}
          <form
            action={handleSubmit}
            className="flex flex-col gap-4 xl:gap-5 mt-3 xl:mt-4"
          >
            {/* Full Name Field */}
            <div className="flex flex-col gap-1.5 xl:gap-2">
              <label className="text-[10px] xl:text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
                {t("signup.fullname_label")}
              </label>
              <Input
                isRequired
                aria-label={t("signup.fullname_label")}
                classNames={{
                  input:
                    "text-sm xl:text-[15px] font-medium text-slate-900 dark:text-slate-100",
                  inputWrapper:
                    "h-12 xl:h-14 bg-slate-50 dark:bg-slate-800/50 border-1.5 border-slate-100 dark:border-slate-700 hover:border-slate-200 dark:hover:border-slate-600 focus-within:!border-primary dark:focus-within:!border-primary transition-all duration-200",
                }}
                name="fullName"
                placeholder={t("signup.fullname_placeholder")}
                startContent={
                  <User
                    className="text-slate-400 dark:text-slate-500 mr-2 xl:w-[18px] xl:h-[18px]"
                    size={16}
                  />
                }
                type="text"
                variant="bordered"
              />
            </div>

            {/* Email Field */}
            <div className="flex flex-col gap-1.5 xl:gap-2">
              <label className="text-[10px] xl:text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
                {t("login.email_label")}
              </label>
              <Input
                isRequired
                aria-label={t("login.email_label")}
                classNames={{
                  input:
                    "text-sm xl:text-[15px] font-medium text-slate-900 dark:text-slate-100",
                  inputWrapper:
                    "h-12 xl:h-14 bg-slate-50 dark:bg-slate-800/50 border-1.5 border-slate-100 dark:border-slate-700 hover:border-slate-200 dark:hover:border-slate-600 focus-within:!border-primary dark:focus-within:!border-primary transition-all duration-200",
                }}
                name="email"
                placeholder="example@vivu.com.vn"
                startContent={
                  <Mail
                    className="text-slate-400 dark:text-slate-500 mr-2 xl:w-[18px] xl:h-[18px]"
                    size={16}
                  />
                }
                type="email"
                variant="bordered"
              />
            </div>

            {/* Password Fields Row */}
            <div className="grid grid-cols-2 gap-3 xl:gap-4">
              {/* Password */}
              <div className="flex flex-col gap-1.5 xl:gap-2">
                <label className="text-[10px] xl:text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
                  {t("login.password_label")}
                </label>
                <Input
                  isRequired
                  aria-label={t("login.password_label")}
                  classNames={{
                    input:
                      "text-sm xl:text-[15px] font-medium text-slate-900 dark:text-slate-100",
                    inputWrapper:
                      "h-12 xl:h-14 bg-slate-50 dark:bg-slate-800/50 border-1.5 border-slate-100 dark:border-slate-700 hover:border-slate-200 dark:hover:border-slate-600 focus-within:!border-primary dark:focus-within:!border-primary transition-all duration-200",
                  }}
                  endContent={
                    <button
                      className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors focus:outline-none"
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="xl:w-[18px] xl:h-[18px]" size={16} />
                      ) : (
                        <Eye className="xl:w-[18px] xl:h-[18px]" size={16} />
                      )}
                    </button>
                  }
                  name="password"
                  placeholder="••••••••"
                  startContent={
                    <Lock
                      className="text-slate-400 dark:text-slate-500 mr-1 xl:mr-2 xl:w-[18px] xl:h-[18px]"
                      size={16}
                    />
                  }
                  type={showPassword ? "text" : "password"}
                  variant="bordered"
                />
              </div>

              {/* Confirm Password */}
              <div className="flex flex-col gap-1.5 xl:gap-2">
                <label className="text-[10px] xl:text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
                  {t("signup.confirm_password_label")}
                </label>
                <Input
                  isRequired
                  aria-label={t("signup.confirm_password_label")}
                  classNames={{
                    input:
                      "text-sm xl:text-[15px] font-medium text-slate-900 dark:text-slate-100",
                    inputWrapper:
                      "h-12 xl:h-14 bg-slate-50 dark:bg-slate-800/50 border-1.5 border-slate-100 dark:border-slate-700 hover:border-slate-200 dark:hover:border-slate-600 focus-within:!border-primary dark:focus-within:!border-primary transition-all duration-200",
                  }}
                  endContent={
                    <button
                      className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors focus:outline-none"
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="xl:w-[18px] xl:h-[18px]" size={16} />
                      ) : (
                        <Eye className="xl:w-[18px] xl:h-[18px]" size={16} />
                      )}
                    </button>
                  }
                  name="confirmPassword"
                  placeholder={t("signup.confirm_password_placeholder")}
                  startContent={
                    <Lock
                      className="text-slate-400 dark:text-slate-500 mr-1 xl:mr-2 xl:w-[18px] xl:h-[18px]"
                      size={16}
                    />
                  }
                  type={showConfirmPassword ? "text" : "password"}
                  variant="bordered"
                />
              </div>
            </div>

            {/* Accept terms */}
            <div className="flex items-start gap-2 xl:gap-3 mt-1 xl:mt-2">
              <div className="relative flex items-center mt-0.5">
                <input
                  required
                  className="peer h-3.5 w-3.5 xl:h-4 xl:w-4 cursor-pointer appearance-none rounded-sm border-2 border-slate-300 dark:border-slate-600 checked:border-primary checked:bg-primary transition-all"
                  id="terms"
                  name="terms"
                  type="checkbox"
                />
                <svg
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 xl:w-3 xl:h-3 text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M5 13l4 4L19 7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <label
                className="text-xs xl:text-sm text-slate-600 dark:text-slate-300 font-medium cursor-pointer select-none"
                htmlFor="terms"
              >
                {t("signup.terms_prefix")}
                <NextLink
                  className="text-primary hover:underline"
                  href={ROUTES.TERMS}
                >
                  {t("signup.terms_link")}
                </NextLink>{" "}
                {t("signup.terms_and")}{" "}
                <NextLink
                  className="text-primary hover:underline"
                  href={ROUTES.PRIVACY}
                >
                  {t("signup.privacy_link")}
                </NextLink>{" "}
                {t("signup.terms_suffix")}
              </label>
            </div>

            <Button
              className="w-full h-12 xl:h-14 text-sm xl:text-[15px] font-bold shadow-xl shadow-primary/20 dark:shadow-none mt-2 hover:scale-[1.02] transition-all bg-[#0a66c2]"
              color="primary"
              endContent={
                !isPending && (
                  <ChevronRight className="xl:w-[18px] xl:h-[18px]" size={16} />
                )
              }
              isLoading={isPending}
              radius="lg"
              size="lg"
              type="submit"
            >
              {t("signup.button")}
            </Button>
          </form>

          {/* Footer SignIn Link */}
          <div className="mt-6 xl:mt-8 flex justify-center">
            <p className="text-xs xl:text-sm text-slate-500 dark:text-slate-400 font-medium">
              {t("signup.already_member")}{" "}
              <NextLink
                className="text-primary hover:underline font-black ml-1 uppercase text-[10px] xl:text-xs tracking-wider"
                href={ROUTES.LOGIN}
              >
                {t("signup.login_now")}
              </NextLink>
            </p>
          </div>

          {/* Trust Badge */}
          <div className="mt-8 xl:mt-12 flex justify-center w-full">
            <div className="flex items-center justify-center gap-1.5 xl:gap-2 bg-[#f0fbf4] dark:bg-emerald-900/20 text-[#138e4b] dark:text-emerald-400 border border-[#e1f5eb] dark:border-emerald-800/30 py-2.5 px-4 xl:py-3 xl:px-6 rounded-xl w-full">
              <ShieldCheck className="xl:w-[18px] xl:h-[18px]" size={16} />
              <span className="text-[8px] xl:text-[9px] font-black uppercase tracking-widest">
                {t("signup.trust_badge")}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Image Area (Hidden on mobile) */}
      <div className="hidden lg:flex w-1/2 relative flex-col justify-between p-10 xl:p-12 overflow-hidden bg-[#0A192F]">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            fill
            priority
            alt="Sapa Terraces"
            className="object-cover opacity-60"
            src="https://images.unsplash.com/photo-1543681534-75eb8bdbe9b8?q=80&w=2072&auto=format&fit=crop"
          />
          <div className="absolute inset-0 bg-blue-950/80 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent" />
        </div>

        {/* Top Right: Logo */}
        <HeroUI_Image
          removeWrapper
          alt="Vivu Logo"
          className="relative z-10 object-contain xl:w-[140px] opacity-90"
          src="/images/vivu-logo-dark.svg"
          width={120}
        />

        {/* Middle: Content */}
        <div className="relative z-10 flex flex-col gap-5 xl:gap-8 mt-6 xl:mt-10">
          <div className="self-start">
            <span className="px-4 py-1.5 xl:px-5 xl:py-2 rounded-full border border-white/20 text-white text-[10px] xl:text-xs font-black uppercase tracking-widest backdrop-blur-sm bg-white/5">
              {t("signup.start_adventure")}
            </span>
          </div>

          <h1 className="text-white text-5xl lg:text-5xl xl:text-6xl font-black leading-[1.15] tracking-tight font-serif mt-2 xl:mt-4">
            {t("signup.hero_title")}
          </h1>

          <p className="text-white/70 text-sm xl:text-base max-w-sm xl:max-w-md font-medium leading-relaxed">
            {t("signup.hero_desc")}
          </p>

          <ul className="flex flex-col gap-3 xl:gap-4 mt-2">
            <li className="flex items-center gap-3 text-white/90 font-bold text-sm xl:text-base">
              <CheckCircle2 className="text-[#fcc219] w-5 h-5" />
              {t("signup.benefits.points")}
            </li>
            <li className="flex items-center gap-3 text-white/90 font-bold text-sm xl:text-base">
              <CheckCircle2 className="text-[#fcc219] w-5 h-5" />
              {t("signup.benefits.early_bird")}
            </li>
            <li className="flex items-center gap-3 text-white/90 font-bold text-sm xl:text-base">
              <CheckCircle2 className="text-[#fcc219] w-5 h-5" />
              {t("signup.benefits.support")}
            </li>
          </ul>
        </div>

        {/* Bottom indicator */}
        <div className="relative z-10 text-white/50 text-[9px] xl:text-xs font-black uppercase tracking-widest mb-2 xl:mb-4">
          {t("signup.footer_text")} &nbsp;&bull;&nbsp;{" "}
          {t("signup.footer_journey")}
        </div>
      </div>
    </div>
  );
}
