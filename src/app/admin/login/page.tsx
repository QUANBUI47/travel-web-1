"use client";

import React from "react";
import Image from "next/image";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Switch } from "@heroui/switch";
import { Link } from "@heroui/link";
import { Mail, Lock, Eye, EyeOff, Globe, Apple } from "lucide-react";
import { ROUTES } from "@/config/routes";

export default function AdminLoginPage() {
  const [isVisible, setIsVisible] = React.useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);

  return (
    <div className='flex min-h-screen bg-white font-sans'>
      {/* Left side - Visual & Branding */}
      <div className='hidden lg:flex lg:w-1/2 relative bg-[#0d1117] flex-col justify-between p-12 overflow-hidden'>
        {/* Abstract Background pattern */}
        <div className='absolute top-0 right-0 w-full h-full opacity-20 pointer-events-none'>
          <div className='absolute top-1/4 right-1/4 w-96 h-96 bg-primary rounded-full blur-[120px]' />
          <div className='absolute bottom-1/4 left-1/4 w-96 h-96 bg-secondary rounded-full blur-[120px]' />
        </div>

        <div className='relative z-10'>
          <Link href={ROUTES.HOME} className='flex items-center gap-3 decoration-none'>
            <div className='w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20'>
              <Globe className='text-white' size={24} />
            </div>
            <span className='text-2xl font-black text-white tracking-tighter'>
              Vivu Admin
            </span>
          </Link>
        </div>

        <div className='relative z-10 max-w-lg'>
          <h1 className='text-5xl font-black text-white leading-tight tracking-tighter mb-6'>
            Làm chủ <span className='text-primary italic'>trải nghiệm</span> du
            lịch của bạn.
          </h1>
          <p className='text-gray-400 text-lg font-medium leading-relaxed'>
            Hệ thống quản trị thông minh dành cho Vivu Travel. Theo dõi
            bookings, quản lý điểm đến và tối ưu doanh thu chỉ trong một giao
            diện duy nhất.
          </p>
        </div>

        <div className='relative z-10 flex items-center gap-8 border-t border-white/10 pt-12'>
          <div className='flex -space-x-3 overflow-hidden'>
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className='inline-block h-10 w-10 rounded-full ring-4 ring-[#0d1117] bg-slate-700 overflow-hidden text-center justify-center align-middle'
              >
                <Image
                  src={`https://i.pravatar.cc/100?img=${i + 10}`}
                  alt='avatar'
                  width={40}
                  height={40}
                />
              </div>
            ))}
          </div>
          <p className='text-sm font-bold text-gray-500'>
            <span className='text-white'>+500 nhà quản lý</span> đang sử dụng
            hàng ngày
          </p>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className='w-full lg:w-1/2 flex items-center justify-center p-8 md:p-16'>
        <div className='w-full max-w-md'>
          <div className='mb-12'>
            <div className='lg:hidden flex items-center gap-2 mb-8'>
              <Globe className='text-primary' size={32} />
              <span className='text-2xl font-black tracking-tighter'>
                Vivu Admin
              </span>
            </div>
            <h2 className='text-3xl font-black tracking-tighter mb-3'>
              Đăng nhập tài khoản
            </h2>
            <p className='text-gray-500 font-medium'>
              Chào mừng bạn quay trở lại! Vui lòng nhập thông tin đăng nhập dành
              cho quản trị viên.
            </p>
          </div>

          <form
            className='flex flex-col gap-6'
            onSubmit={(e) => e.preventDefault()}
          >
            <Input
              label='Email Address'
              placeholder='admin@vivu.com'
              labelPlacement='outside'
              type='email'
              variant='bordered'
              radius='lg'
              size='lg'
              classNames={{
                label:
                  "font-black text-xs uppercase tracking-widest text-gray-400 mb-2",
                input: "font-bold text-sm",
                inputWrapper:
                  "border-gray-200 hover:border-primary focus-within:border-primary px-4 h-14",
              }}
              startContent={
                <Mail className='text-gray-400 pointer-events-none' size={20} />
              }
            />

            <div className='flex flex-col gap-2'>
              <Input
                label='Password'
                placeholder='••••••••'
                labelPlacement='outside'
                variant='bordered'
                radius='lg'
                size='lg'
                type={isVisible ? "text" : "password"}
                classNames={{
                  label:
                    "font-black text-xs uppercase tracking-widest text-gray-400 mb-2",
                  input: "font-bold text-sm",
                  inputWrapper:
                    "border-gray-200 hover:border-primary focus-within:border-primary px-4 h-14",
                }}
                startContent={
                  <Lock
                    className='text-gray-400 pointer-events-none'
                    size={20}
                  />
                }
                endContent={
                  <button
                    className='focus:outline-none'
                    type='button'
                    onClick={toggleVisibility}
                  >
                    {isVisible ? (
                      <EyeOff className='text-gray-400' size={20} />
                    ) : (
                      <Eye className='text-gray-400' size={20} />
                    )}
                  </button>
                }
              />
              <div className='flex items-center justify-between mt-2'>
                <Switch
                  size="sm"
                  classNames={{ label: "text-sm font-bold text-gray-500" }}
                >
                  Ghi nhớ đăng nhập
                </Switch>
                <Link
                  className='text-sm font-black text-primary hover:opacity-70 transition-opacity'
                  href='#'
                >
                  Quên mật khẩu?
                </Link>
              </div>
            </div>

            <Button
              color='primary'
              size='lg'
              radius='lg'
              className='h-14 font-black shadow-lg shadow-primary/20 mt-4'
            >
              Đăng nhập ngay
            </Button>

            <div className='relative flex items-center py-4'>
              <div className='flex-grow border-t border-gray-100'></div>
              <span className='flex-shrink mx-4 text-gray-400 text-[10px] font-black uppercase tracking-widest'>
                Hoặc đăng nhập với
              </span>
              <div className='flex-grow border-t border-gray-100'></div>
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <Button
                variant='bordered'
                radius='lg'
                className='h-14 font-bold border-gray-100'
                startContent={
                  <Image
                    src='https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png'
                    alt='G'
                    width={20}
                    height={20}
                  />
                }
              >
                Google
              </Button>
              <Button
                variant='bordered'
                radius='lg'
                className='h-14 font-bold border-gray-100'
                startContent={<Apple size={20} />}
              >
                Apple
              </Button>
            </div>
          </form>

          <p className='text-center mt-12 text-sm font-bold text-gray-400'>
            Bạn chưa có tài khoản?{" "}
            <Link href={ROUTES.SIGNUP} className='text-primary font-black ml-1'>
              Tạo tài khoản mới
            </Link>
          </p>

          <p className='text-center mt-12 text-[10px] font-black text-gray-300 uppercase tracking-widest'>
            © 2026 Vivu Travel . All Rights Reserved
          </p>
        </div>
      </div>
    </div>
  );
}
