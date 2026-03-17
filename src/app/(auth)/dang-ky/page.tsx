"use client";

import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Divider } from "@heroui/divider";
import Link from "next/link";
import NextLink from "next/link";
import { MapPin, Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import { useState, useTransition } from "react";
import Image from "next/image";

import { signup, signInWithGoogle } from "../actions";

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await signup(formData);

      if (result?.error) setErrorMsg(result.error);
    });
  }

  return (
    <div className='min-h-[100dvh] flex items-center justify-center relative p-4 bg-slate-50 dark:bg-slate-950 font-sans'>
      {/* Subtle professional background */}
      <div className='absolute inset-0 z-0 overflow-hidden'>
        <div className="absolute top-0 right-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-[0.05] dark:opacity-[0.1]" />
        <div className='absolute inset-0 bg-gradient-to-b from-transparent via-slate-50/50 to-slate-50 dark:to-slate-950' />
      </div>

      <div className='w-full max-w-[440px] z-10 animate-fade-in'>
        {/* Branding */}
        <div className='flex flex-col items-center mb-8'>
          <NextLink href='/' className='flex items-center gap-2.5 group'>
            <div className="relative h-16 w-48">
              <Image 
                src="/images/vivu-logo-light.svg" 
                alt="Vivu Logo" 
                fill 
                className="dark:hidden object-contain"
                priority
              />
              <Image 
                src="/images/vivu-logo-dark.svg" 
                alt="Vivu Logo" 
                fill 
                className="hidden dark:block object-contain"
                priority
              />
            </div>
          </NextLink>
        </div>

        {/* Card */}
        <Card
          className='bg-white dark:bg-slate-900 border-none shadow-[0_20px_60px_rgba(0,0,0,0.06)] dark:shadow-none p-1'
          radius='lg'
        >
          <CardHeader className='flex flex-col gap-1 px-8 pt-10 pb-2 text-center items-center'>
            <h1 className='text-3xl font-black text-foreground tracking-tighter'>Tạo tài khoản</h1>
            <p className='text-default-500 text-sm font-medium mt-2'>Khám phá Việt Nam theo cách riêng của bạn</p>
          </CardHeader>

          <CardBody className='px-8 py-8 gap-5'>
            {errorMsg && (
              <div className='bg-danger-50 border-l-4 border-danger px-4 py-3 text-danger text-sm font-bold animate-shake'>
                {errorMsg}
              </div>
            )}

            <form action={handleSubmit} className='flex flex-col gap-5'>
              <Input
                isRequired
                classNames={{
                  input: "text-base font-medium",
                  inputWrapper: "h-14 bg-slate-50 dark:bg-slate-800/50 border-1.5 border-slate-100 dark:border-slate-800 hover:border-primary/50 focus-within:!border-primary transition-all duration-200",
                  label: "text-sm font-bold text-foreground mb-1",
                }}
                label='Tên hiển thị'
                labelPlacement='outside'
                name='fullName'
                placeholder='Nguyễn Văn A'
                startContent={<User size={20} className='text-default-400 mr-1' />}
                type='text'
                variant='bordered'
              />

              <Input
                isRequired
                classNames={{
                  input: "text-base font-medium",
                  inputWrapper: "h-14 bg-slate-50 dark:bg-slate-800/50 border-1.5 border-slate-100 dark:border-slate-800 hover:border-primary/50 focus-within:!border-primary transition-all duration-200",
                  label: "text-sm font-bold text-foreground mb-1",
                }}
                label='Địa chỉ Email'
                labelPlacement='outside'
                name='email'
                placeholder='example@email.com'
                startContent={<Mail size={20} className='text-default-400 mr-1' />}
                type='email'
                variant='bordered'
              />

              <Input
                isRequired
                classNames={{
                  input: "text-base font-medium",
                  inputWrapper: "h-14 bg-slate-50 dark:bg-slate-800/50 border-1.5 border-slate-100 dark:border-slate-800 hover:border-primary/50 focus-within:!border-primary transition-all duration-200",
                  label: "text-sm font-bold text-foreground mb-1",
                }}
                endContent={
                  <button
                    type='button'
                    className='text-default-400 hover:text-primary transition-colors focus:outline-none'
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                }
                label='Mật khẩu'
                labelPlacement='outside'
                name='password'
                placeholder='Tối thiểu 6 ký tự'
                startContent={<Lock size={20} className='text-default-400 mr-1' />}
                type={showPassword ? "text" : "password"}
                variant='bordered'
              />

              <Button
                className='w-full h-14 text-lg font-black shadow-xl shadow-primary/20 mt-2'
                color='primary'
                isLoading={isPending}
                size='lg'
                type='submit'
                radius='md'
              >
                Đăng ký ngay
              </Button>
            </form>

            <div className='flex items-center gap-4 py-2'>
              <Divider className='flex-1 opacity-50' />
              <span className='text-default-400 text-[10px] font-black uppercase tracking-[0.2em]'>hoặc</span>
              <Divider className='flex-1 opacity-50' />
            </div>

            <form action={signInWithGoogle}>
              <Button
                className='w-full h-14 bg-white dark:bg-slate-800 text-foreground font-bold border-1.5 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 shadow-sm'
                size='lg'
                radius='md'
                startContent={
                  <svg viewBox='0 0 24 24' className='w-5 h-5 mr-1'>
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
                }
                type='submit'
                variant='bordered'
              >
                Đăng ký với Google
              </Button>
            </form>

            <p className='text-center text-sm text-default-500 mt-2 font-medium'>
              Đã có tài khoản?{" "}
              <NextLink
                href='/dang-nhap'
                className='text-primary hover:underline font-black'
              >
                Đăng nhập
              </NextLink>
            </p>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
