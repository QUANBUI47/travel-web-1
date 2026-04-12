"use client";

import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Image as HeroUI_Image } from "@heroui/image";
import NextLink from "next/link";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  ChevronRight,
  ArrowLeft,
} from "lucide-react";
import { useState, useTransition, Suspense } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";

import { login } from "../actions";

import { AuthQueryAlerts } from "@/components/auth/auth-query-alerts";
import { GoogleSignInButton } from "@/components/auth/google-sign-in-button";
import { ROUTES } from "@/constants";

function LoginForm() {
  const t = useTranslations("Auth");
  const searchParams = useSearchParams();
  const returnTo = searchParams.get("returnTo") ?? "";
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await login(formData);

      if (result?.error) setErrorMsg(result.error);
    });
  }

  return (
    <div className="min-h-[100dvh] w-full flex bg-slate-100 dark:bg-slate-950 font-sans">
      {/* Left Panel - Image Area (Hidden on mobile) */}
      <div className="hidden lg:flex w-1/2 relative flex-col justify-between p-10 xl:p-12 overflow-hidden bg-primary-900">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            fill
            priority
            alt="Ha Long Bay"
            className="object-cover"
            src="https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=2070&auto=format&fit=crop"
          />
          <div className="absolute inset-0 bg-blue-900/70 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-t from-blue-900 via-transparent to-blue-900/30" />
        </div>

        {/* Top Left: Logo */}
        <NextLink
          className="relative z-10 block transition-transform group-hover:scale-105 hover:opacity-90 max-w-fit"
          href={ROUTES.HOME}
        >
          <HeroUI_Image
            removeWrapper
            alt="Vivu Logo"
            className="object-contain xl:w-[140px]"
            src="/images/vivu-logo-dark.svg"
            width={120}
          />
        </NextLink>

        {/* Middle: Content */}
        <div className="relative z-10 flex flex-col gap-5 xl:gap-8 mt-6 xl:mt-10">
          <div className="self-start">
            <span className="px-4 py-1.5 xl:px-5 xl:py-2 rounded-full border border-white/40 text-white text-[10px] xl:text-xs font-black uppercase tracking-[0.2em] backdrop-blur-sm bg-white/10">
              {t("login.explore_heritage")}
            </span>
          </div>

          <h1 className="text-white text-5xl lg:text-5xl xl:text-6xl font-black leading-[1.15] tracking-tight font-serif mt-2 xl:mt-4">
            {t("login.hero_title")}
          </h1>

          <p className="text-white/80 text-sm xl:text-base max-w-sm xl:max-w-md font-medium leading-relaxed">
            {t("login.hero_desc")}
          </p>
        </div>

        {/* Bottom indicator */}
        <div className="relative z-10 flex items-center gap-2 xl:gap-4 text-white/70 text-[9px] xl:text-xs font-black uppercase tracking-[0.2em] mb-2 xl:mb-4">
          <span>{t("login.destinations.hanoi")}</span>
          <span className="w-1 h-1 rounded-full bg-primary-300" />
          <span>{t("login.destinations.halong")}</span>
          <span className="w-1 h-1 rounded-full bg-white/30" />
          <span>{t("login.destinations.hoian")}</span>
          <span className="w-1 h-1 rounded-full bg-primary-400" />
          <span>{t("login.destinations.phuquoc")}</span>
        </div>
      </div>

      {/* Right Panel - Form Area */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-8 xl:p-12 bg-white dark:bg-slate-900 rounded-none relative shadow-[-10px_0_30px_rgba(0,0,0,0.05)] dark:shadow-[-10px_0_30px_rgba(0,0,0,0.3)] min-h-[100dvh] overflow-y-auto">
        {/* Back Button */}
        <NextLink
          className="absolute top-6 left-6 xl:top-8 xl:left-8 inline-flex items-center text-[13px] font-bold text-slate-500 hover:text-primary transition-colors group z-10"
          href={ROUTES.HOME}
        >
          <ArrowLeft className="w-4 h-4 mr-1.5 transition-transform group-hover:-translate-x-1" />
          {t("back_to_home")}
        </NextLink>

        <div className="w-full max-w-[420px] xl:max-w-[460px] flex flex-col py-2">
          {/* Header */}
          <div className="mb-8 xl:mb-10">
            <h2 className="text-3xl sm:text-3xl lg:text-4xl font-black font-serif text-slate-900 dark:text-white tracking-tight mb-2 xl:mb-3">
              {t("login.welcome")}
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm xl:text-base font-medium">
              {t("login.welcome_desc")}
            </p>
          </div>

          <Suspense fallback={null}>
            <AuthQueryAlerts />
          </Suspense>

          {errorMsg && (
            <div className="border-l-4 border-danger px-4 py-3 text-danger text-sm font-bold animate-shake mb-5 xl:mb-6 rounded-r bg-red-50 dark:bg-danger-900/20">
              {errorMsg}
            </div>
          )}

          <div className="mb-5 xl:mb-6">
            <GoogleSignInButton
              returnTo={returnTo || undefined}
              onError={setErrorMsg}
            />
          </div>

          <div className="flex items-center gap-4 py-3 xl:py-4 w-full">
            <div className="flex-1 h-px bg-slate-100 dark:bg-slate-800" />
            <span className="text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">
              {t("or_with_email")}
            </span>
            <div className="flex-1 h-px bg-slate-100 dark:bg-slate-800" />
          </div>

          {/* Form Credentials */}
          <form
            action={handleSubmit}
            className="flex flex-col gap-4 xl:gap-5 mt-3 xl:mt-4"
          >
            {returnTo ? (
              <input name="returnTo" type="hidden" value={returnTo} />
            ) : null}
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

            {/* Password Field */}
            <div className="flex flex-col gap-1.5 xl:gap-2">
              <div className="flex justify-between items-center w-full">
                <label className="text-[10px] xl:text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
                  {t("login.password_label")}
                </label>
                <NextLink
                  className="text-[10px] xl:text-xs font-black uppercase tracking-widest text-primary hover:opacity-70 transition-opacity"
                  href={ROUTES.FORGOT_PASSWORD}
                >
                  {t("login.forgot_password")}
                </NextLink>
              </div>
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
                    className="text-slate-400 dark:text-slate-500 mr-2 xl:w-[18px] xl:h-[18px]"
                    size={16}
                  />
                }
                type={showPassword ? "text" : "password"}
                variant="bordered"
              />
            </div>

            {/* Remember Me */}
            <div className="flex items-center gap-2 xl:gap-3 mt-1 xl:mt-2">
              <div className="relative flex items-center">
                <input
                  className="peer h-3.5 w-3.5 xl:h-4 xl:w-4 cursor-pointer appearance-none rounded-sm border-2 border-slate-300 dark:border-slate-600 checked:border-primary checked:bg-primary transition-all"
                  id="remember"
                  name="remember"
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
                htmlFor="remember"
              >
                {t("login.remember_me")}
              </label>
            </div>

            <Button
              className="w-full h-12 xl:h-14 text-sm xl:text-[15px] font-bold shadow-xl shadow-primary/20 dark:shadow-none mt-2 xl:mt-4 hover:scale-[1.02] transition-all bg-[#0a66c2]"
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
              {t("login.button")}
            </Button>
          </form>

          {/* Footer Signup Link */}
          <div className="mt-6 xl:mt-8 flex justify-center">
            <p className="text-xs xl:text-sm text-slate-500 dark:text-slate-400 font-medium">
              {t("login.no_account")}{" "}
              <NextLink
                className="text-primary hover:underline font-black ml-1 uppercase text-[10px] xl:text-xs tracking-wider"
                href={ROUTES.REGISTER}
              >
                {t("login.signup_now")}
              </NextLink>
            </p>
          </div>

          {/* Trust Badge */}
          <div className="mt-8 xl:mt-12 flex justify-center w-full">
            <div className="flex items-center justify-center gap-1.5 xl:gap-2 bg-[#f0fbf4] dark:bg-emerald-900/20 text-[#138e4b] dark:text-emerald-400 border border-[#e1f5eb] dark:border-emerald-800/30 py-2.5 px-4 xl:py-3 xl:px-6 rounded-xl w-full">
              <ShieldCheck className="xl:w-[18px] xl:h-[18px]" size={16} />
              <span className="text-[8px] xl:text-[9px] font-black uppercase tracking-widest">
                {t("login.trust_badge")}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
