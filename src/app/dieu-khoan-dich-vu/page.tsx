"use client";

import React, { useState, useEffect } from 'react';
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
  Moon,
  Sun,
  Facebook,
  Instagram,
  Twitter,
  Phone,
  Send
} from 'lucide-react';
import { useTheme } from 'next-themes';
import NextLink from 'next/link';
import Image from 'next/image';
import { Button } from '@heroui/button';
import { Input } from '@heroui/input';
import { Divider } from '@heroui/divider';
import { 
  Navbar as HeroUINavbar, 
  NavbarContent, 
  NavbarBrand, 
  NavbarItem 
} from "@heroui/navbar";
import { ThemeSwitch } from "@/components/theme-switch";
import { useTranslations } from "next-intl";

export default function TermsOfServicePage() {
  const t = useTranslations("Legal.terms");
  const [mounted, setMounted] = useState(false);
  const { theme, systemTheme } = useTheme();
  const [activeSection, setActiveSection] = useState('intro');

  useEffect(() => {
    setMounted(true);
  }, []);

  // Determine current theme
  const currentTheme = theme === "system" ? systemTheme : theme;
  const isDarkMode = currentTheme === "dark";

  const sections = [
    { id: 'intro', title: t("sections.intro"), icon: <FileText size={18} /> },
    { id: 'definitions', title: t("sections.definitions"), icon: <Search size={18} /> },
    { id: 'accounts', title: t("sections.accounts"), icon: <Lock size={18} /> },
    { id: 'bookings', title: t("sections.bookings"), icon: <Scale size={18} /> },
    { id: 'cancellation', title: t("sections.cancellation"), icon: <ArrowLeft size={18} /> },
    { id: 'privacy', title: t("sections.privacy"), icon: <Shield size={18} /> },
    { id: 'ip', title: t("sections.ip"), icon: <FileText size={18} /> },
  ];

  const themeColors = isDarkMode ? {
    bg: "bg-[#0D1117]",
    card: "bg-[#161B22]",
    text: "text-[#F0F6FC]",
    subtext: "text-[#8B949E]",
    border: "border-[#30363D]",
    accent: "text-[#3385da]",
    accentBg: "bg-[#3385da]",
    navHover: "hover:bg-[#30363D]"
  } : {
    bg: "bg-[#FAFAFA]",
    card: "bg-white",
    text: "text-[#1A1A1A]",
    subtext: "text-gray-500",
    border: "border-gray-200",
    accent: "text-[#0a66c2]",
    accentBg: "bg-[#0a66c2]",
    navHover: "hover:bg-gray-100"
  };

  if (!mounted) {
    return null; // prevent hydration mismatch
  }

  return (
    <div className={`min-h-screen ${themeColors.bg} ${themeColors.text} font-sans transition-colors duration-500`}>
      
      {/* Custom Header Styled like Homepage Navbar */}
      <HeroUINavbar
        maxWidth='xl'
        position='sticky'
        height='5rem'
        classNames={{
          base: "border-b border-divider/40 backdrop-blur-xl bg-background/60",
          wrapper: "px-6",
        }}
      >
        <NavbarContent className='basis-1/5 sm:basis-full' justify='start'>
          <NavbarBrand as='li' className='gap-3 max-w-fit'>
            <NextLink
              className='flex justify-start items-center gap-2 group'
              href="/"
            >
              <div className='relative h-10 w-32'>
                <Image
                  src='/images/vivu-logo-light.svg'
                  alt='Vivu Logo'
                  fill
                  className='dark:hidden object-contain'
                  priority
                />
                <Image
                  src='/images/vivu-logo-dark.svg'
                  alt='Vivu Logo'
                  fill
                  className='hidden dark:block object-contain'
                  priority
                />
              </div>
            </NextLink>
          </NavbarBrand>
        </NavbarContent>

        <NavbarContent className='flex basis-1/5 sm:basis-full' justify='end'>
          <NavbarItem className='flex items-center gap-4'>
            <ThemeSwitch />
          </NavbarItem>
          <NavbarItem>
            <Button
              as={NextLink}
              href="/"
              color='primary'
              radius='full'
              className='font-bold text-[13px] px-6 h-10 shadow-lg shadow-primary/20 hover:scale-105 transition-all'
            >
              {useTranslations("Common")("back_to_home")}
            </Button>
          </NavbarItem>
        </NavbarContent>
      </HeroUINavbar>

      {/* Hero Banner cho trang Điều khoản */}
      <section className={`${isDarkMode ? 'bg-[#0a0d11]' : 'bg-blue-50'} py-16 md:py-24 px-6 border-b ${themeColors.border}`}>
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#fcc219]/10 border border-[#fcc219]/20 text-[#fcc219] text-[10px] font-black uppercase tracking-[0.3em] mb-6">
            <FileText size={12} /> {t("title")}
          </div>
          <h1 className="text-4xl md:text-6xl font-black font-serif tracking-tighter mb-6 leading-tight">
            {t("hero_title")}
          </h1>
          <p className={`${themeColors.subtext} text-lg max-w-2xl mx-auto font-medium`}>
            {t("hero_desc")}
          </p>
          <div className={`mt-8 flex justify-center items-center gap-2 text-xs font-bold ${themeColors.subtext}`}>
            <Clock size={14} /> {t("updated_at")}
          </div>
        </div>
      </section>

      {/* Nội dung chính */}
      <main className="max-w-7xl mx-auto px-6 py-12 md:py-20 flex flex-col lg:flex-row gap-12">
        
        {/* Sidebar điều hướng (Sticky) */}
        <aside className="lg:w-1/4">
          <div className="sticky top-28 space-y-1">
            <p className={`text-[10px] font-black uppercase tracking-[0.3em] ${themeColors.subtext} mb-6 px-4`}>{t("nav_title")}</p>
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => {
                  setActiveSection(section.id);
                  const el = document.getElementById(section.id);
                  if (el) {
                    const y = el.getBoundingClientRect().top + window.scrollY - 100;
                    window.scrollTo({ top: y, behavior: 'smooth' });
                  }
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all text-left ${
                  activeSection === section.id 
                    ? `${themeColors.accentBg} text-white shadow-lg` 
                    : `${themeColors.subtext} ${themeColors.navHover}`
                }`}
              >
                {section.icon}
                {section.title}
              </button>
            ))}

            <div className={`mt-12 p-8 rounded-[2rem] border ${themeColors.border} ${isDarkMode ? 'bg-white/5 shadow-2xl shadow-black/20' : 'bg-[#fcc219]/5'}`}>
              <Mail className="text-[#fcc219] mb-4" size={32} />
              <p className="text-xs font-black uppercase tracking-widest mb-2">{t("legal_help")}</p>
              <button className={`text-[11px] font-bold text-left hover:text-[#fcc219] transition-colors leading-relaxed ${themeColors.subtext}`}>
                {t("legal_contact")}
              </button>
            </div>
          </div>
        </aside>

        {/* Nội dung văn bản */}
        <article className="lg:w-3/4 space-y-16 leading-relaxed">
          
          <section id="intro" className="scroll-mt-32">
            <h2 className="text-2xl font-black mb-6 flex items-center gap-3">
              <span className={`w-8 h-8 rounded-lg ${themeColors.accentBg} text-white flex items-center justify-center text-sm`}>1</span>
              {t("sections.intro")}
            </h2>
            <div className={`space-y-4 ${themeColors.subtext} font-medium`}>
              <p>
                Chào mừng bạn đến với Vivu. Bằng cách truy cập vào trang web của chúng tôi hoặc sử dụng bất kỳ dịch vụ nào do chúng tôi cung cấp, bạn đồng ý tuân thủ và chịu sự ràng buộc của các Điều khoản Dịch vụ này.
              </p>
              <p>
                Vivu là một nền tảng du lịch trực tuyến cung cấp dịch vụ đặt tour, khách sạn và trải nghiệm văn hóa tại Việt Nam. Chúng tôi cam kết mang đến những giá trị di sản đích thực thông qua sự minh bạch và an toàn.
              </p>
            </div>
          </section>

          <section id="definitions" className="scroll-mt-32">
            <h2 className="text-2xl font-black mb-6 flex items-center gap-3">
              <span className={`w-8 h-8 rounded-lg ${themeColors.accentBg} text-white flex items-center justify-center text-sm`}>2</span>
              {t("sections.definitions")}
            </h2>
            <div className={`grid grid-cols-1 md:grid-cols-2 gap-6`}>
              <div className={`p-6 rounded-2xl border ${themeColors.border} ${themeColors.card}`}>
                <h4 className="font-bold mb-2">"Dịch vụ"</h4>
                <p className={`text-sm ${themeColors.subtext}`}>Tất cả các sản phẩm du lịch bao gồm tour, phòng lưu trú và vé tham quan trên hệ thống Vivu.</p>
              </div>
              <div className={`p-6 rounded-2xl border ${themeColors.border} ${themeColors.card}`}>
                <h4 className="font-bold mb-2">"Thành viên"</h4>
                <p className={`text-sm ${themeColors.subtext}`}>Cá nhân hoặc tổ chức đã đăng ký tài khoản thành công trên nền tảng của chúng tôi.</p>
              </div>
            </div>
          </section>

          <section id="accounts" className="scroll-mt-32">
            <h2 className="text-2xl font-black mb-6 flex items-center gap-3">
              <span className={`w-8 h-8 rounded-lg ${themeColors.accentBg} text-white flex items-center justify-center text-sm`}>3</span>
              {t("sections.accounts")}
            </h2>
            <div className={`space-y-4 ${themeColors.subtext} font-medium`}>
              <p>
                Để sử dụng một số tính năng nhất định, bạn phải đăng ký tài khoản. Bạn có trách nhiệm bảo mật thông tin đăng nhập và mọi hoạt động diễn ra dưới tài khoản của mình.
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Thông tin cung cấp phải chính xác và cập nhật liên tục.</li>
                <li>Không được chuyển nhượng tài khoản cho bất kỳ bên thứ ba nào.</li>
                <li>Phải thông báo ngay cho Vivu nếu phát hiện có sự truy cập trái phép.</li>
              </ul>
            </div>
          </section>

          <section id="bookings" className="scroll-mt-32">
            <h2 className="text-2xl font-black mb-6 flex items-center gap-3">
              <span className={`w-8 h-8 rounded-lg ${themeColors.accentBg} text-white flex items-center justify-center text-sm`}>4</span>
              {t("sections.bookings")}
            </h2>
            <p className={`${themeColors.subtext} font-medium mb-6`}>
              Giá cả được niêm yết công khai và đã bao gồm các loại thuế phí cơ bản trừ khi có ghi chú khác.
            </p>
            <div className={`bg-[#fcc219]/5 border border-[#fcc219]/20 p-8 rounded-3xl`}>
              <h4 className="font-bold text-[#ca9b14] flex items-center gap-2 mb-4">
                <Shield size={18} /> Lưu ý về an toàn thanh toán
              </h4>
              <p className="text-sm text-slate-500 font-medium">
                Vivu sử dụng hệ thống mã hóa bảo mật cấp cao. Mọi giao dịch của bạn được bảo vệ bởi Vivu SafeCare, đảm bảo không có bên thứ ba nào can thiệp được vào thông tin thẻ của bạn.
              </p>
            </div>
          </section>

          <section id="cancellation" className="scroll-mt-32">
            <h2 className="text-2xl font-black mb-6 flex items-center gap-3">
              <span className={`w-8 h-8 rounded-lg ${themeColors.accentBg} text-white flex items-center justify-center text-sm`}>5</span>
              {t("sections.cancellation")}
            </h2>
            <div className={`space-y-4 ${themeColors.subtext} font-medium`}>
              <p>
                Chính sách hoàn tiền phụ thuộc vào từng loại dịch vụ và thời điểm hủy bỏ.
              </p>
              <div className={`overflow-hidden border ${themeColors.border} rounded-2xl`}>
                <table className="w-full text-sm text-left">
                  <thead className={`${isDarkMode ? 'bg-white/5' : 'bg-gray-100'} font-bold`}>
                    <tr>
                      <th className="p-4 uppercase tracking-widest text-[10px]">Thời gian hủy</th>
                      <th className="p-4 uppercase tracking-widest text-[10px]">Mức hoàn trả</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                    <tr>
                      <td className="p-4">Trước 7 ngày khởi hành</td>
                      <td className="p-4 text-emerald-500 font-bold">100%</td>
                    </tr>
                    <tr>
                      <td className="p-4">3 - 6 ngày trước khởi hành</td>
                      <td className="p-4 text-[#fcc219] font-bold">50%</td>
                    </tr>
                    <tr>
                      <td className="p-4">Trong vòng 48 giờ</td>
                      <td className="p-4 text-red-500 font-bold">0%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          <section id="privacy" className="scroll-mt-32">
            <h2 className="text-2xl font-black mb-6 flex items-center gap-3">
              <span className={`w-8 h-8 rounded-lg ${themeColors.accentBg} text-white flex items-center justify-center text-sm`}>6</span>
              {t("sections.privacy")}
            </h2>
            <div className={`space-y-6 ${themeColors.subtext} font-medium`}>
              <p>
                Vivu cam kết bảo vệ thông tin cá nhân của bạn theo tiêu chuẩn bảo mật cao nhất. Việc thu thập và sử dụng dữ liệu của bạn được thực hiện hoàn toàn minh bạch.
              </p>
              <div className={`bg-[#3385da]/5 border border-[#3385da]/20 p-8 rounded-3xl`}>
                <h4 className="font-bold mb-4 flex items-center gap-2">
                  <Shield size={16} className={themeColors.accent} /> Các biện pháp bảo vệ chúng tôi áp dụng
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {[
                    { title: 'Mã hóa SSL 256-bit', desc: 'Mọi kết nối giữa trình duyệt và máy chủ của chúng tôi đều được mã hóa hoàn toàn.' },
                    { title: 'Kiểm soát truy cập', desc: 'Chỉ nhân viên được ủy quyền mới có thể truy cập thông tin cá nhân của người dùng.' },
                    { title: 'Sao lưu thường xuyên', desc: 'Dữ liệu được sao lưu định kỳ để đảm bảo không bị mất mát trong mọi tình huống.' },
                    { title: 'Kiểm tra bảo mật', desc: 'Hệ thống được kiểm tra bảo mật định kỳ bởi các chuyên gia độc lập.' }
                  ].map((item, i) => (
                    <div key={i} className={`p-4 rounded-2xl border ${themeColors.border} ${themeColors.card}`}>
                      <h5 className="font-bold text-sm mb-1">{item.title}</h5>
                      <p className="text-xs opacity-80">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
              <p>
                Để biết thêm chi tiết về cách chúng tôi thu thập và xử lý dữ liệu cá nhân, vui lòng tham khảo{' '}
                <a href="/chinh-sach-bao-mat" className={`${themeColors.accent} hover:underline font-bold`}>
                  Chính sách bảo mật
                </a>{' '}
                của Vivu.
              </p>
            </div>
          </section>

          <section id="ip" className="scroll-mt-32">
            <h2 className="text-2xl font-black mb-6 flex items-center gap-3">
              <span className={`w-8 h-8 rounded-lg ${themeColors.accentBg} text-white flex items-center justify-center text-sm`}>7</span>
              {t("sections.ip")}
            </h2>
            <div className={`space-y-6 ${themeColors.subtext} font-medium`}>
              <p>
                Tất cả nội dung trên nền tảng Vivu bao gồm văn bản, hình ảnh, logo, biểu tượng, video và phần mềm đều là tài sản trí tuệ độc quyền của Vivu hoặc các đối tác cấp phép.
              </p>
              <div className={`border ${themeColors.border} rounded-3xl overflow-hidden`}>
                <div className={`${isDarkMode ? 'bg-white/5' : 'bg-gray-50'} p-4 border-b ${themeColors.border}`}>
                  <p className="text-xs font-black uppercase tracking-widest opacity-60">Quy định về sử dụng nội dung</p>
                </div>
                <div className="divide-y divide-slate-100 dark:divide-white/5">
                  {[
                    { allow: true, text: 'Sử dụng cá nhân, phi thương mại với ghi nguồn rõ ràng.' },
                    { allow: true, text: 'Chia sẻ liên kết đến các trang trên website Vivu.' },
                    { allow: false, text: 'Sao chép, phân phối hoặc chỉnh sửa nội dung cho mục đích thương mại.' },
                    { allow: false, text: 'Sử dụng logo, thương hiệu Vivu mà không có sự đồng ý bằng văn bản.' },
                    { allow: false, text: 'Khai thác dữ liệu bằng các công cụ tự động (scraping, crawling).' }
                  ].map((rule, i) => (
                    <div key={i} className="flex items-center gap-4 p-4">
                      <span className={`text-xs font-black px-2 py-0.5 rounded-full ${rule.allow ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                        {rule.allow ? 'CHO PHÉP' : 'CẤM'}
                      </span>
                      <p className="text-sm">{rule.text}</p>
                    </div>
                  ))}
                </div>
              </div>
              <p>
                Mọi vi phạm bản quyền sẽ bị xử lý theo quy định của pháp luật Việt Nam và các công ước quốc tế về sở hữu trí tuệ.
              </p>
            </div>
          </section>

          {/* Nút hành động cuối trang */}
          <div className={`pt-12 border-t ${themeColors.border} flex flex-col sm:flex-row gap-4`}>
            <button className={`${themeColors.accentBg} text-white px-8 py-4 rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl shadow-blue-500/20 transition-all hover:scale-[1.02] active:scale-95`}>
              <Printer size={16} /> In điều khoản
            </button>
            <button className={`border ${themeColors.border} ${themeColors.text} px-8 py-4 rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all`}>
              <Download size={16} /> Tải bản PDF
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
              <NextLink href="/" className="flex items-center gap-2 group">
                <div className="relative h-10 w-10 transition-transform duration-300 group-hover:scale-110">
                  <Image 
                    src="/favicon-vivu.svg" 
                    alt="Vivu Logo" 
                    fill 
                    className="object-contain"
                  />
                </div>
                <span className="text-2xl font-black text-foreground tracking-tighter">Vivu<span className="text-primary italic">.</span></span>
              </NextLink>
              <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed font-bold">
                Nền tảng du lịch kết nối bạn với những vẻ đẹp di sản và trải nghiệm đậm chất Việt Nam.
              </p>
              <div className="flex gap-4">
                <NextLink href="#" className="w-11 h-11 rounded-xl bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center text-gray-400 hover:text-primary transition-all border border-gray-100 dark:border-white/5 hover:-translate-y-1">
                  <Facebook size={20} />
                </NextLink>
                <NextLink href="#" className="w-11 h-11 rounded-xl bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center text-gray-400 hover:text-primary transition-all border border-gray-100 dark:border-white/5 hover:-translate-y-1">
                  <Instagram size={20} />
                </NextLink>
                <NextLink href="#" className="w-11 h-11 rounded-xl bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center text-gray-400 hover:text-primary transition-all border border-gray-100 dark:border-white/5 hover:-translate-y-1">
                  <Twitter size={20} />
                </NextLink>
              </div>
            </div>

            {/* Column 2: Explore */}
            <div className="flex flex-col gap-6">
              <h4 className="text-sm font-black uppercase tracking-[0.2em] text-foreground">Khám phá</h4>
              <ul className="flex flex-col gap-3">
                {["Vịnh Hạ Long", "Phố cổ Hội An", "Đảo ngọc Phú Quốc", "Ruộng bậc thang Sapa", "Cố đô Huế"].map((item) => (
                  <li key={item}>
                    <NextLink href="#" className="text-default-500 hover:text-primary text-sm font-medium transition-colors">
                      {item}
                    </NextLink>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Support */}
            <div className="flex flex-col gap-6">
              <h4 className="text-sm font-black uppercase tracking-[0.2em] text-foreground">Hỗ trợ</h4>
              <ul className="flex flex-col gap-3">
                {[
                  { title: "Trung tâm trợ giúp", href: "#" },
                  { title: "Chính sách hoàn tiền", href: "#" },
                  { title: "Điều khoản dịch vụ", href: "/dieu-khoan-dich-vu" },
                  { title: "Chính sách bảo mật", href: "/chinh-sach-bao-mat" },
                  { title: "Liên hệ hợp tác", href: "#" }
                ].map((item) => (
                  <li key={item.title}>
                    <NextLink href={item.href} className={`text-sm font-medium transition-colors ${item.title === "Điều khoản dịch vụ" ? "text-primary font-black" : "text-default-500 hover:text-primary"}`}>
                      {item.title}
                    </NextLink>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 4: Newsletter */}
            <div className="flex flex-col gap-6">
              <h4 className="text-sm font-black uppercase tracking-[0.2em] text-foreground">Đăng ký nhận tin</h4>
              <p className="text-default-500 text-sm font-medium">
                Nhận thông báo về các tour khuyến mãi sớm nhất.
              </p>
              <div className="relative group">
                <Input
                  placeholder="Email của bạn"
                  variant="flat"
                  radius="lg"
                  classNames={{
                    inputWrapper: "bg-white dark:bg-slate-800 border-none shadow-sm h-12 pr-12",
                    input: "text-sm",
                  }}
                />
                <Button 
                  isIconOnly 
                  color="primary" 
                  radius="md" 
                  size="sm"
                  className="absolute right-1 top-1 h-10 w-10 min-w-10 z-10"
                >
                  <Send size={16} />
                </Button>
              </div>
            </div>
          </div>

          <Divider className="opacity-50" />

          <div className="flex flex-col md:flex-row justify-between items-center gap-8 mt-12">
            <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest order-2 md:order-1 text-center md:text-left">
              © {new Date().getFullYear()} Vivu Travel . Khám phá vẻ đẹp Việt Nam
            </p>
            <div className="flex items-center gap-8 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-500 order-1 md:order-2">
              <div className="font-extrabold text-slate-400 text-base italic">VISA</div>
              <div className="font-extrabold text-slate-400 text-base italic">MASTERCARD</div>
              <div className="font-extrabold text-slate-400 text-base italic">PAYPAL</div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
