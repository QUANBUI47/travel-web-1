"use client";

import Image from "next/image";
import Link from "next/link";
import { Facebook, Instagram, Twitter, Phone, Mail, Send } from "lucide-react";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Divider } from "@heroui/divider";
import { ROUTES } from "@/config/routes";

export const Footer = () => {
  return (
    <footer
      id='footer'
      className='w-full bg-slate-50 dark:bg-slate-900/50 pt-16 pb-8 border-t border-divider'
    >
      <div className='container mx-auto max-w-7xl px-6'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16'>
          {/* Column 1: Brand & About */}
          <div className='flex flex-col gap-6'>
            <Link href={ROUTES.HOME} className='flex items-center gap-2 group'>
              <div className='relative h-10 w-10 transition-transform duration-300 group-hover:scale-110'>
                <Image
                  src='/favicon-vivu.svg'
                  alt='Vivu Logo'
                  fill
                  className='object-contain'
                />
              </div>
              <span className='text-2xl font-black text-foreground tracking-tighter'>
                Vivu<span className='text-primary italic'>.</span>
              </span>
            </Link>
            <p className='text-gray-500 dark:text-gray-400 text-sm leading-relaxed font-bold'>
              Nền tảng du lịch kết nối bạn với những vẻ đẹp di sản và trải
              nghiệm đậm chất Việt Nam.
            </p>
            <div className='flex gap-4'>
              <Link
                href='#'
                className='w-11 h-11 rounded-xl bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center text-gray-400 hover:text-primary transition-all border border-gray-100 dark:border-white/5 hover:-translate-y-1'
              >
                <Facebook size={20} />
              </Link>
              <Link
                href='#'
                className='w-11 h-11 rounded-xl bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center text-gray-400 hover:text-primary transition-all border border-gray-100 dark:border-white/5 hover:-translate-y-1'
              >
                <Instagram size={20} />
              </Link>
              <Link
                href='#'
                className='w-11 h-11 rounded-xl bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center text-gray-400 hover:text-primary transition-all border border-gray-100 dark:border-white/5 hover:-translate-y-1'
              >
                <Twitter size={20} />
              </Link>
            </div>
          </div>

          {/* Column 2: Explore */}
          <div className='flex flex-col gap-6'>
            <h4 className='text-sm font-black uppercase tracking-[0.2em] text-foreground'>
              Khám phá
            </h4>
            <ul className='flex flex-col gap-3'>
              {[
                "Vịnh Hạ Long",
                "Phố cổ Hội An",
                "Đảo ngọc Phú Quốc",
                "Ruộng bậc thang Sapa",
                "Cố đô Huế",
              ].map((item) => (
                <li key={item}>
                  <Link
                    href='#'
                    className='text-default-500 hover:text-primary text-sm font-medium transition-colors'
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Support */}
          <div className='flex flex-col gap-6'>
            <h4 className='text-sm font-black uppercase tracking-[0.2em] text-foreground'>
              Hỗ trợ
            </h4>
            <ul className='flex flex-col gap-3'>
              {[
                { title: "Trung tâm trợ giúp", href: "#" },
                { title: "Chính sách hoàn tiền", href: "#" },
                { title: "Điều khoản dịch vụ", href: "/dieu-khoan-dich-vu" },
                { title: "Chính sách bảo mật", href: "/chinh-sach-bao-mat" },
                { title: "Liên hệ hợp tác", href: "#" }
              ].map((item) => (
                <li key={item.title}>
                  <Link
                    href={item.href}
                    className='text-default-500 hover:text-primary text-sm font-medium transition-colors'
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div className='flex flex-col gap-6'>
            <h4 className='text-sm font-black uppercase tracking-[0.2em] text-foreground'>
              Đăng ký nhận tin
            </h4>
            <p className='text-default-500 text-sm font-medium'>
              Nhận thông báo về các tour khuyến mãi sớm nhất.
            </p>
            <div className='relative group'>
              <Input
                placeholder='Email của bạn'
                variant='flat'
                radius='lg'
                classNames={{
                  inputWrapper:
                    "bg-white dark:bg-slate-800 border-none shadow-sm h-12 pr-12",
                  input: "text-sm",
                }}
              />
              <Button
                isIconOnly
                color='primary'
                radius='md'
                size='sm'
                className='absolute right-1 top-1 h-10 w-10 min-w-10 z-10'
              >
                <Send size={16} />
              </Button>
            </div>
            <div className='flex flex-col gap-3 mt-2'>
              <div className='flex items-center gap-3 text-default-500'>
                <div className='w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary'>
                  <Phone size={14} />
                </div>
                <span className='text-sm font-bold'>1900 123 456</span>
              </div>
              <div className='flex items-center gap-3 text-default-500'>
                <div className='w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary'>
                  <Mail size={14} />
                </div>
                <span className='text-sm font-medium'>contact@vivu.com.vn</span>
              </div>
            </div>
          </div>
        </div>

        <Divider className='opacity-50' />

        <div className='flex flex-col md:flex-row justify-between items-center gap-8 mt-12'>
          <p className='text-gray-400 text-[10px] font-black uppercase tracking-widest order-2 md:order-1 text-center md:text-left'>
            © {new Date().getFullYear()} Vivu Travel . Khám phá vẻ đẹp Việt Nam
          </p>
          <div className='flex items-center gap-8 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-500 order-1 md:order-2'>
            <div className='font-extrabold text-slate-400 text-base italic'>
              VISA
            </div>
            <div className='font-extrabold text-slate-400 text-base italic'>
              MASTERCARD
            </div>
            <div className='font-extrabold text-slate-400 text-base italic'>
              PAYPAL
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
