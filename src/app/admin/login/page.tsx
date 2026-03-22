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
  Globe,
  Zap,
  ShieldAlert
} from "lucide-react";
import { useState } from "react";
import Image from "next/image";

import { ROUTES } from "@/config/routes";

import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMsg(null);
    setIsPending(true);

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      // Dùng chung REST API cho Web cũng như Mobile
      const res = await fetch("/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        setErrorMsg(result.message || "Đăng nhập thất bại");
        setIsPending(false);
        return;
      }

      // Check role theo kết quả trả về
      if (result.data?.user?.role !== "ADMIN") {
        setErrorMsg("Tài khoản không có quyền truy cập quản trị viên.");
        // Logout via API (để xóa cookie nhầm)
        await fetch("/api/v1/auth/logout", { method: "POST" });
        setIsPending(false);
        return;
      }

      // Web tự động lưu cookie từ Next.js server (Set-Cookie).
      // Đối với App Mobile, chúng ta có thể lưu result.data.session.access_token vào AsyncStorage ở đây.
      
      // Chuyển hướng
      router.push("/admin");
      router.refresh(); // Làm mới layout để nạp profile mới
    } catch (error) {
      setErrorMsg("Lỗi kết nối máy chủ");
      setIsPending(false);
    }
  }

  return (
    <div className='min-h-[100dvh] w-full flex bg-slate-100 dark:bg-slate-950 font-sans'>
      {/* Left Panel - Admin Branding Area (Hidden on mobile) */}
      <div className='hidden lg:flex w-1/2 relative flex-col justify-between p-10 xl:p-12 overflow-hidden bg-[#006fee]'>
        {/* Background Overlay / Pattern */}
        <div className='absolute inset-0 z-0 opacity-20'>
          <div className='absolute -top-20 -right-20 w-[600px] h-[600px] border border-white rounded-full' />
          <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border-[0.5px] border-white rotate-45' />
        </div>

        {/* Top Left: Logo */}
        <NextLink href={ROUTES.HOME} className='relative z-10 block transition-transform hover:opacity-90 max-w-fit'>
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
              Hệ thống quản trị nghiệp vụ
            </span>
          </div>

          <h1 className='text-white text-5xl lg:text-5xl xl:text-6xl font-black leading-[1.15] tracking-tight font-serif mt-2 xl:mt-4'>
            Quản lý <br />
            di sản Việt Nam.
          </h1>

          <p className='text-white/80 text-sm xl:text-base max-w-sm xl:max-w-md font-medium leading-relaxed'>
            Cổng thông tin bảo mật dành riêng cho đội ngũ vận hành và quản trị của Vivu Travel. 
            Vui lòng xác thực quyền hạn để tiếp tục.
          </p>
        </div>

        {/* Bottom stats/icons */}
        <div className='relative z-10 grid grid-cols-2 gap-8 mb-4 border-t border-white/10 pt-8'>
          <div className='flex items-center gap-3'>
             <ShieldCheck className='text-white/80' size={24} />
             <div>
                <p className='text-white font-bold text-[10px] uppercase tracking-wider'>Bản mật</p>
                <p className='text-white/60 text-[9px]'>AES-256 Encrypted</p>
             </div>
          </div>
          <div className='flex items-center gap-3'>
             <Zap className='text-white/80' size={24} />
             <div>
                <p className='text-white font-bold text-[10px] uppercase tracking-wider'>Hiệu năng</p>
                <p className='text-white/60 text-[9px]'>Real-time Sync</p>
             </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Form Area */}
      <div className='w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-8 xl:p-12 bg-white dark:bg-slate-900 rounded-none lg:rounded-l-3xl relative shadow-[-10px_0_30px_rgba(0,0,0,0.05)] dark:shadow-[-10px_0_30px_rgba(0,0,0,0.3)] min-h-[100dvh] overflow-y-auto'>
        <div className='w-full max-w-[420px] xl:max-w-[460px] flex flex-col py-2'>

          {/* Header */}
          <div className='mb-8 xl:mb-10'>
            <h2 className='text-3xl sm:text-3xl lg:text-4xl font-black font-serif text-slate-900 dark:text-white tracking-tight mb-2 xl:mb-3'>
              Xác thực Quản trị
            </h2>
            <p className='text-slate-500 dark:text-slate-400 text-sm xl:text-base font-medium'>
              Đăng nhập bằng tài khoản nội bộ được cấp phép.
            </p>
          </div>

          {errorMsg && (
            <div className='bg-danger-50 border-l-4 border-danger px-4 py-3 text-danger text-sm font-bold animate-shake mb-5 xl:mb-6 rounded-r bg-red-50 dark:bg-danger-900/20 flex items-center gap-2'>
              <ShieldAlert size={16} />
              {errorMsg}
            </div>
          )}

          {/* Form Credentials */}
          <form onSubmit={handleSubmit} className='flex flex-col gap-5 xl:gap-6'>
            {/* Email Field */}
            <div className='flex flex-col gap-1.5 xl:gap-2'>
              <label className='text-[10px] xl:text-[11px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 ml-1'>
                Email Quản trị
              </label>
              <Input
                isRequired
                classNames={{
                  input: "text-sm xl:text-[15px] font-medium text-slate-900 dark:text-slate-100",
                  inputWrapper:
                    "h-12 xl:h-14 bg-slate-50 dark:bg-slate-800/50 border-1.5 border-slate-100 dark:border-slate-700 hover:border-slate-200 dark:hover:border-slate-600 focus-within:!border-primary dark:focus-within:!border-primary transition-all duration-200",
                }}
                name='email'
                placeholder='admin@vivu.com.vn'
                startContent={
                  <Mail size={16} className='text-slate-400 dark:text-slate-500 mr-2 xl:w-[18px] xl:h-[18px]' />
                }
                type='email'
                variant='bordered'
              />
            </div>

            {/* Password Field */}
            <div className='flex flex-col gap-1.5 xl:gap-2'>
              <div className='flex justify-between items-center w-full px-1'>
                <label className='text-[10px] xl:text-[11px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500'>
                  Mật mã
                </label>
                <NextLink
                  href='#'
                  className='text-[10px] xl:text-[11px] font-black uppercase tracking-widest text-primary hover:opacity-70 transition-opacity'
                >
                  Quên?
                </NextLink>
              </div>
              <Input
                isRequired
                classNames={{
                  input: "text-sm xl:text-[15px] font-medium text-slate-900 dark:text-slate-100",
                  inputWrapper:
                    "h-12 xl:h-14 bg-slate-50 dark:bg-slate-800/50 border-1.5 border-slate-100 dark:border-slate-700 hover:border-slate-200 dark:hover:border-slate-600 focus-within:!border-primary dark:focus-within:!border-primary transition-all duration-200",
                }}
                endContent={
                  <button
                    type='button'
                    className='text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors focus:outline-none'
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={16} className="xl:w-[18px] xl:h-[18px]" /> : <Eye size={16} className="xl:w-[18px] xl:h-[18px]" />}
                  </button>
                }
                name='password'
                placeholder='••••••••'
                startContent={
                  <Lock size={16} className='text-slate-400 dark:text-slate-500 mr-2 xl:w-[18px] xl:h-[18px]' />
                }
                type={showPassword ? "text" : "password"}
                variant='bordered'
              />
            </div>

            <Button
              className='w-full h-12 xl:h-14 text-sm xl:text-[15px] font-bold shadow-xl shadow-primary/20 dark:shadow-none mt-2 xl:mt-4 hover:scale-[1.02] transition-all bg-[#006fee]'
              color='primary'
              isLoading={isPending}
              size='lg'
              type='submit'
              radius='lg'
              endContent={!isPending && <ChevronRight size={16} className="xl:w-[18px] xl:h-[18px]" />}
            >
              XÁC THỰC HỆ THỐNG
            </Button>
          </form>

          {/* Warning Message instead of Signup */}
          <div className='mt-12 p-5 bg-orange-50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-900/20 rounded-2xl flex gap-4 items-start'>
            <div className='w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center flex-shrink-0'>
                <ShieldAlert className='text-orange-600 dark:text-orange-400' size={20} />
            </div>
            <div className='flex flex-col gap-0.5'>
               <h4 className='font-black text-[10px] uppercase tracking-widest text-orange-900 dark:text-orange-300'>Truy cập hạn chế</h4>
               <p className='text-orange-800/70 dark:text-orange-400/70 text-[10px] font-medium leading-relaxed italic'>
                 Hệ thống chỉ dành cho nhân viên có thẩm quyền. Mọi hành vi xâm nhập trái phép sẽ bị truy cứu trách nhiệm.
               </p>
            </div>
          </div>

          {/* Trust Badge */}
          <div className='mt-8 flex justify-center w-full'>
            <div className='flex items-center justify-center gap-2 text-slate-400 dark:text-slate-500 py-3 w-full border-t border-slate-100 dark:border-slate-800'>
              <ShieldCheck size={14} />
              <span className='text-[9px] font-black uppercase tracking-[0.2em]'>
                SECURE ADMIN GATEWAY
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
