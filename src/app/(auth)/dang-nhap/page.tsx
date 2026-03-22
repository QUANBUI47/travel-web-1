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
import { useState, useTransition } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";

import { ROUTES } from "@/config/routes";
import { login, signInWithGoogle } from "../actions";

export default function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; redirect?: string }>;
}) {
  const t = useTranslations("Auth");
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
    <div className='min-h-[100dvh] w-full flex bg-slate-100 dark:bg-slate-950 font-sans'>
      {/* Left Panel - Image Area (Hidden on mobile) */}
      <div className='hidden lg:flex w-1/2 relative flex-col justify-between p-10 xl:p-12 overflow-hidden bg-primary-900'>
        {/* Background Image with Overlay */}
        <div className='absolute inset-0 z-0'>
          <Image
            src='https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=2070&auto=format&fit=crop'
            alt='Ha Long Bay'
            fill
            className='object-cover'
            priority
          />
          <div className='absolute inset-0 bg-blue-900/70 mix-blend-multiply' />
          <div className='absolute inset-0 bg-gradient-to-t from-blue-900 via-transparent to-blue-900/30' />
        </div>

        {/* Top Left: Logo */}
        <NextLink
          href={ROUTES.HOME}
          className='relative z-10 block transition-transform group-hover:scale-105 hover:opacity-90 max-w-fit'
        >
          <HeroUI_Image
            src='/images/vivu-logo-dark.svg'
            alt='Vivu Logo'
            width={120}
            className='object-contain xl:w-[140px]'
            removeWrapper
          />
        </NextLink>

        {/* Middle: Content */}
        <div className='relative z-10 flex flex-col gap-5 xl:gap-8 mt-6 xl:mt-10'>
          <div className='self-start'>
            <span className='px-4 py-1.5 xl:px-5 xl:py-2 rounded-full border border-white/40 text-white text-[10px] xl:text-xs font-black uppercase tracking-[0.2em] backdrop-blur-sm bg-white/10'>
              {t("login.explore_heritage")}
            </span>
          </div>

          <h1 className='text-white text-5xl lg:text-5xl xl:text-6xl font-black leading-[1.15] tracking-tight font-serif mt-2 xl:mt-4'>
            {t("login.hero_title")}
          </h1>

          <p className='text-white/80 text-sm xl:text-base max-w-sm xl:max-w-md font-medium leading-relaxed'>
            {t("login.hero_desc")}
          </p>
        </div>

        {/* Bottom indicator */}
        <div className='relative z-10 flex items-center gap-2 xl:gap-4 text-white/70 text-[9px] xl:text-[11px] font-black uppercase tracking-[0.2em] mb-2 xl:mb-4'>
          <span>{t("login.destinations.hanoi")}</span>
          <span className='w-1 h-1 rounded-full bg-primary-300' />
          <span>{t("login.destinations.halong")}</span>
          <span className='w-1 h-1 rounded-full bg-white/30' />
          <span>{t("login.destinations.hoian")}</span>
          <span className='w-1 h-1 rounded-full bg-primary-400' />
          <span>{t("login.destinations.phuquoc")}</span>
        </div>
      </div>

      {/* Right Panel - Form Area */}
      <div className='w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-8 xl:p-12 bg-white dark:bg-slate-900 rounded-none relative shadow-[-10px_0_30px_rgba(0,0,0,0.05)] dark:shadow-[-10px_0_30px_rgba(0,0,0,0.3)] min-h-[100dvh] overflow-y-auto'>
        {/* Back Button */}
        <NextLink
          href={ROUTES.HOME}
          className='absolute top-6 left-6 xl:top-8 xl:left-8 inline-flex items-center text-[13px] font-bold text-slate-500 hover:text-primary transition-colors group z-10'
        >
          <ArrowLeft className='w-4 h-4 mr-1.5 transition-transform group-hover:-translate-x-1' />
          {t("back_to_home")}
        </NextLink>

        <div className='w-full max-w-[420px] xl:max-w-[460px] flex flex-col py-2'>
          {/* Header */}
          <div className='mb-8 xl:mb-10'>
            <h2 className='text-3xl sm:text-3xl lg:text-4xl font-black font-serif text-slate-900 dark:text-white tracking-tight mb-2 xl:mb-3'>
              {t("login.welcome")}
            </h2>
            <p className='text-slate-500 dark:text-slate-400 text-sm xl:text-base font-medium'>
              {t("login.welcome_desc")}
            </p>
          </div>

          {errorMsg && (
            <div className='bg-danger-50 border-l-4 border-danger px-4 py-3 text-danger text-sm font-bold animate-shake mb-5 xl:mb-6 rounded-r bg-red-50 dark:bg-danger-900/20'>
              {errorMsg}
            </div>
          )}

          {/* Social Auth */}
          <div className='grid grid-cols-2 gap-3 xl:gap-4 mb-5 xl:mb-6'>
            <form action={signInWithGoogle} className='w-full'>
              <Button
                className='w-full h-11 xl:h-12 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 shadow-sm'
                radius='lg'
                type='submit'
              >
                <div className='flex items-center gap-2 text-[10px] xl:text-[11px] uppercase tracking-widest'>
                  <svg
                    viewBox='0 0 24 24'
                    className='w-3.5 h-3.5 xl:w-4 xl:h-4'
                  >
                    <path
                      fill='#4285F4'
                      d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'
                    />
                    <path
                      fill='#34A853'
                      d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'
                    />
                    <path
                      fill='#FBBC05'
                      d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'
                    />
                    <path
                      fill='#EA4335'
                      d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'
                    />
                  </svg>
                  Google
                </div>
              </Button>
            </form>

            <Button
              className='w-full h-11 xl:h-12 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 shadow-sm'
              radius='lg'
            >
              <div className='flex items-center gap-2 text-[10px] xl:text-[11px] uppercase tracking-widest'>
                <svg
                  className='w-3.5 h-3.5 xl:w-4 xl:h-4 text-[#1877F2]'
                  fill='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path d='M24 12.074a12.072 12.072 0 10-13.96 11.933v-8.442H6.974v-3.491h3.066V9.414c0-3.044 1.815-4.72 4.587-4.72 1.33 0 2.723.238 2.723.238v2.99h-1.533c-1.51 0-1.98.937-1.98 1.902v2.25h3.364l-.538 3.491h-2.826v8.442a12.076 12.076 0 0010.163-11.94z' />
                </svg>
                Facebook
              </div>
            </Button>
          </div>

          <div className='flex items-center gap-4 py-3 xl:py-4 w-full'>
            <div className='flex-1 h-px bg-slate-100 dark:bg-slate-800'></div>
            <span className='text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]'>
              {t("or_with_email")}
            </span>
            <div className='flex-1 h-px bg-slate-100 dark:bg-slate-800'></div>
          </div>

          {/* Form Credentials */}
          <form
            action={handleSubmit}
            className='flex flex-col gap-4 xl:gap-5 mt-3 xl:mt-4'
          >
            {/* Email Field */}
            <div className='flex flex-col gap-1.5 xl:gap-2'>
              <label className='text-[10px] xl:text-[11px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500'>
                {t("login.email_label")}
              </label>
              <Input
                isRequired
                classNames={{
                  input:
                    "text-sm xl:text-[15px] font-medium text-slate-900 dark:text-slate-100",
                  inputWrapper:
                    "h-12 xl:h-14 bg-slate-50 dark:bg-slate-800/50 border-1.5 border-slate-100 dark:border-slate-700 hover:border-slate-200 dark:hover:border-slate-600 focus-within:!border-primary dark:focus-within:!border-primary transition-all duration-200",
                }}
                aria-label={t("login.email_label")}
                name='email'
                placeholder='example@vivu.com.vn'
                startContent={
                  <Mail
                    size={16}
                    className='text-slate-400 dark:text-slate-500 mr-2 xl:w-[18px] xl:h-[18px]'
                  />
                }
                type='email'
                variant='bordered'
              />
            </div>

            {/* Password Field */}
            <div className='flex flex-col gap-1.5 xl:gap-2'>
              <div className='flex justify-between items-center w-full'>
                <label className='text-[10px] xl:text-[11px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500'>
                  {t("login.password_label")}
                </label>
                <NextLink
                  href='#'
                  className='text-[10px] xl:text-[11px] font-black uppercase tracking-widest text-primary hover:opacity-70 transition-opacity'
                >
                  {t("login.forgot_password")}
                </NextLink>
              </div>
              <Input
                isRequired
                classNames={{
                  input:
                    "text-sm xl:text-[15px] font-medium text-slate-900 dark:text-slate-100",
                  inputWrapper:
                    "h-12 xl:h-14 bg-slate-50 dark:bg-slate-800/50 border-1.5 border-slate-100 dark:border-slate-700 hover:border-slate-200 dark:hover:border-slate-600 focus-within:!border-primary dark:focus-within:!border-primary transition-all duration-200",
                }}
                aria-label={t("login.password_label")}
                endContent={
                  <button
                    type='button'
                    className='text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors focus:outline-none'
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff size={16} className='xl:w-[18px] xl:h-[18px]' />
                    ) : (
                      <Eye size={16} className='xl:w-[18px] xl:h-[18px]' />
                    )}
                  </button>
                }
                name='password'
                placeholder='••••••••'
                startContent={
                  <Lock
                    size={16}
                    className='text-slate-400 dark:text-slate-500 mr-2 xl:w-[18px] xl:h-[18px]'
                  />
                }
                type={showPassword ? "text" : "password"}
                variant='bordered'
              />
            </div>

            {/* Remember Me */}
            <div className='flex items-center gap-2 xl:gap-3 mt-1 xl:mt-2'>
              <div className='relative flex items-center'>
                <input
                  type='checkbox'
                  id='remember'
                  name='remember'
                  className='peer h-3.5 w-3.5 xl:h-4 xl:w-4 cursor-pointer appearance-none rounded-sm border-2 border-slate-300 dark:border-slate-600 checked:border-primary checked:bg-primary transition-all'
                />
                <svg
                  className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 xl:w-3 xl:h-3 text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                  strokeWidth='3'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M5 13l4 4L19 7'
                  />
                </svg>
              </div>
              <label
                htmlFor='remember'
                className='text-xs xl:text-sm text-slate-600 dark:text-slate-300 font-medium cursor-pointer select-none'
              >
                {t("login.remember_me")}
              </label>
            </div>

            <Button
              className='w-full h-12 xl:h-14 text-sm xl:text-[15px] font-bold shadow-xl shadow-primary/20 dark:shadow-none mt-2 xl:mt-4 hover:scale-[1.02] transition-all bg-[#0a66c2]'
              color='primary'
              isLoading={isPending}
              size='lg'
              type='submit'
              radius='lg'
              endContent={
                !isPending && (
                  <ChevronRight size={16} className='xl:w-[18px] xl:h-[18px]' />
                )
              }
            >
              {t("login.button")}
            </Button>
          </form>

          {/* Footer Signup Link */}
          <div className='mt-6 xl:mt-8 flex justify-center'>
            <p className='text-xs xl:text-sm text-slate-500 dark:text-slate-400 font-medium'>
              {t("login.no_account")}{" "}
              <NextLink
                href={ROUTES.SIGNUP}
                className='text-primary hover:underline font-black ml-1 uppercase text-[10px] xl:text-[11px] tracking-wider'
              >
                {t("login.signup_now")}
              </NextLink>
            </p>
          </div>

          {/* Trust Badge */}
          <div className='mt-8 xl:mt-12 flex justify-center w-full'>
            <div className='flex items-center justify-center gap-1.5 xl:gap-2 bg-[#f0fbf4] dark:bg-emerald-900/20 text-[#138e4b] dark:text-emerald-400 border border-[#e1f5eb] dark:border-emerald-800/30 py-2.5 px-4 xl:py-3 xl:px-6 rounded-xl w-full'>
              <ShieldCheck size={16} className='xl:w-[18px] xl:h-[18px]' />
              <span className='text-[8px] xl:text-[9px] font-black uppercase tracking-widest'>
                {t("login.trust_badge")}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
