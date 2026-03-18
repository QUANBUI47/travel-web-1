"use client";

import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Lock, 
  Eye, 
  Database, 
  Share2, 
  UserCheck, 
  Mail, 
  Moon, 
  Sun,
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

export default function PrivacyPolicyPage() {
  const [mounted, setMounted] = useState(false);
  const { theme, systemTheme } = useTheme();
  const [activeSection, setActiveSection] = useState('collection');

  useEffect(() => {
    setMounted(true);
  }, []);

  // Determine current theme
  const currentTheme = theme === "system" ? systemTheme : theme;
  const isDarkMode = currentTheme === "dark";

  const sections = [
    { id: 'collection', title: '1. Thu thập thông tin', icon: <Database size={18} /> },
    { id: 'usage', title: '2. Sử dụng thông tin', icon: <Eye size={18} /> },
    { id: 'security', title: '3. Bảo mật dữ liệu', icon: <Lock size={18} /> },
    { id: 'cookies', title: '4. Cookies & Theo dõi', icon: <Bell size={18} /> },
    { id: 'sharing', title: '5. Chia sẻ bên thứ ba', icon: <Share2 size={18} /> },
    { id: 'rights', title: '6. Quyền của bạn', icon: <UserCheck size={18} /> },
    { id: 'contact', title: '7. Liên hệ chúng tôi', icon: <Mail size={18} /> },
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
    accent: "text-[#0068c3]",
    accentBg: "bg-[#0068c3]",
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
              Quay lại Trang chủ
            </Button>
          </NavbarItem>
        </NavbarContent>
      </HeroUINavbar>

      {/* Hero Section */}
      <section className={`${isDarkMode ? 'bg-[#0a0d11]' : 'bg-blue-50/50'} py-20 md:py-32 px-6 border-b ${themeColors.border} relative overflow-hidden`}>
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#fcc219]/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#3385da]/10 border border-[#3385da]/20 text-[#3385da] text-[10px] font-black uppercase tracking-[0.3em] mb-6">
            <Shield size={12} /> Cam kết bảo mật quyền riêng tư
          </div>
          <h1 className="text-4xl md:text-6xl font-black font-serif tracking-tighter mb-6 leading-tight">
            Chính sách <br /> <span className="text-[#fcc219]">Bảo mật</span>
          </h1>
          <p className={`${themeColors.subtext} text-lg max-w-2xl mx-auto font-medium`}>
            Tại Vivu, sự an toàn của dữ liệu cá nhân là ưu tiên hàng đầu. Chúng tôi bảo vệ thông tin của bạn như bảo vệ những di sản quý giá nhất.
          </p>
          <div className={`mt-8 flex justify-center items-center gap-2 text-xs font-bold ${themeColors.subtext}`}>
            <Clock size={14} /> Cập nhật: 20 Tháng 03, 2024
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-16 md:py-24 flex flex-col lg:flex-row gap-16">
        
        {/* Sticky Sidebar Navigation */}
        <aside className="lg:w-1/4">
          <div className="sticky top-28 space-y-1.5">
            <p className={`text-[10px] font-black uppercase tracking-[0.3em] ${themeColors.subtext} mb-6 px-4`}>Điều hướng chính sách</p>
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
                className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl text-[13px] font-bold transition-all text-left group ${
                  activeSection === section.id 
                    ? `${themeColors.accentBg} text-white shadow-xl shadow-blue-500/20` 
                    : `${themeColors.subtext} ${themeColors.navHover}`
                }`}
              >
                <span className={activeSection === section.id ? "text-white" : themeColors.accent}>
                  {section.icon}
                </span>
                {section.title}
                <ChevronRight size={14} className={`ml-auto transition-opacity ${activeSection === section.id ? 'opacity-100' : 'opacity-0'}`} />
              </button>
            ))}

            <div className={`mt-12 p-8 rounded-[2rem] border ${themeColors.border} ${isDarkMode ? 'bg-white/5 shadow-2xl shadow-black/20' : 'bg-[#fcc219]/5'}`}>
              <ShieldCheck className="text-[#fcc219] mb-4" size={32} />
              <p className="text-xs font-black uppercase tracking-widest mb-2">Vivu SafeCare</p>
              <p className={`text-[11px] leading-relaxed ${themeColors.subtext}`}>Dữ liệu của bạn được mã hóa theo tiêu chuẩn quân đội AES-256.</p>
            </div>
          </div>
        </aside>

        {/* Policy Content */}
        <article className="lg:w-3/4 space-y-20 leading-relaxed">
          
          <section id="collection" className="scroll-mt-32">
            <h2 className="text-3xl font-black mb-8 flex items-center gap-4">
              <div className={`w-10 h-10 rounded-xl ${themeColors.accentBg} text-white flex items-center justify-center`}>
                <Database size={20} />
              </div>
              Thông tin chúng tôi thu thập
            </h2>
            <div className={`space-y-6 ${themeColors.subtext} font-medium text-[15px]`}>
              <p>Chúng tôi thu thập các thông tin sau để đảm bảo hành trình của bạn diễn ra suôn sẻ:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { label: 'Thông tin định danh', value: 'Họ tên, ngày sinh, số CMND/Hộ chiếu khi đặt tour.' },
                  { label: 'Thông tin liên lạc', value: 'Địa chỉ email, số điện thoại, địa chỉ nhận hóa đơn.' },
                  { label: 'Thông tin thanh toán', value: 'Chi tiết giao dịch (chúng tôi không lưu trữ số thẻ tín dụng).' },
                  { label: 'Dữ liệu thiết bị', value: 'Địa chỉ IP, loại trình duyệt, hệ điều hành.' }
                ].map((item, i) => (
                  <div key={i} className={`p-6 rounded-3xl border ${themeColors.border} ${themeColors.card}`}>
                    <h4 className={`font-bold mb-2 ${themeColors.text}`}>{item.label}</h4>
                    <p className="text-sm">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section id="usage" className="scroll-mt-32">
            <h2 className="text-3xl font-black mb-8 flex items-center gap-4">
              <div className={`w-10 h-10 rounded-xl ${themeColors.accentBg} text-white flex items-center justify-center`}>
                <Eye size={20} />
              </div>
              Cách chúng tôi sử dụng thông tin
            </h2>
            <div className={`space-y-4 ${themeColors.subtext} font-medium`}>
              <p>Vivu sử dụng thông tin của bạn vào các mục đích minh bạch sau:</p>
              <ul className="space-y-4">
                {[
                  'Xác nhận và quản lý các yêu cầu đặt chỗ du lịch.',
                  'Gửi thông báo cập nhật về hành trình và thay đổi dịch vụ.',
                  'Cải thiện trải nghiệm người dùng trên nền tảng Vivu.',
                  'Ngăn chặn các hoạt động gian lận và bảo vệ an toàn cho hệ thống.'
                ].map((text, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className={`mt-1.5 w-1.5 h-1.5 rounded-full ${themeColors.accentBg} shrink-0`}></div>
                    <span>{text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section id="security" className="scroll-mt-32">
            <h2 className="text-3xl font-black mb-8 flex items-center gap-4">
              <div className={`w-10 h-10 rounded-xl ${themeColors.accentBg} text-white flex items-center justify-center`}>
                <Lock size={20} />
              </div>
              Cam kết bảo mật dữ liệu
            </h2>
            <div className={`bg-[#3385da]/5 border border-[#3385da]/20 p-10 rounded-[2.5rem]`}>
              <p className={`${themeColors.subtext} font-medium mb-6`}>
                An toàn thông tin là trái tim của hệ thống Vivu. Chúng tôi áp dụng các biện pháp kỹ thuật tiên tiến nhất để bảo vệ dữ liệu khách hàng.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div>
                  <h4 className={`font-bold mb-2 ${themeColors.text}`}>Mã hóa SSL</h4>
                  <p className="text-sm opacity-70">Mọi đường truyền dữ liệu đều được bảo vệ bởi chứng chỉ SSL 256-bit.</p>
                </div>
                <div>
                  <h4 className={`font-bold mb-2 ${themeColors.text}`}>Kiểm soát truy cập</h4>
                  <p className="text-sm opacity-70">Chỉ nhân viên được ủy quyền mới có quyền truy cập thông tin cá nhân của bạn.</p>
                </div>
              </div>
            </div>
          </section>

          <section id="cookies" className="scroll-mt-32">
            <h2 className="text-3xl font-black mb-8 flex items-center gap-4">
              <div className={`w-10 h-10 rounded-xl ${themeColors.accentBg} text-white flex items-center justify-center`}>
                <Bell size={20} />
              </div>
              Cookies & Công nghệ theo dõi
            </h2>
            <div className={`space-y-6 ${themeColors.subtext} font-medium`}>
              <p>Chúng tôi sử dụng cookies để cá nhân hóa trải nghiệm của bạn và phân tích lưu lượng truy cập web.</p>
              <div className="space-y-4">
                {[
                  { title: 'Cookies thiết yếu', desc: 'Cần thiết để bạn di chuyển và sử dụng các tính năng bảo mật của website.' },
                  { title: 'Cookies hiệu suất', desc: 'Thu thập thông tin về cách khách hàng sử dụng trang web để chúng tôi cải thiện dịch vụ.' },
                  { title: 'Cookies chức năng', desc: 'Cho phép trang web ghi nhớ các lựa chọn của bạn (như ngôn ngữ hoặc vùng).' }
                ].map((cookie, i) => (
                  <div key={i} className={`p-5 rounded-2xl border ${themeColors.border} flex items-center gap-4`}>
                    <div className="w-2 h-2 rounded-full bg-[#fcc219] shrink-0"></div>
                    <div>
                      <h4 className={`font-bold text-sm ${themeColors.text}`}>{cookie.title}</h4>
                      <p className="text-xs">{cookie.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section id="sharing" className="scroll-mt-32">
            <h2 className="text-3xl font-black mb-8 flex items-center gap-4">
              <div className={`w-10 h-10 rounded-xl ${themeColors.accentBg} text-white flex items-center justify-center`}>
                <Share2 size={20} />
              </div>
              Chia sẻ thông tin với bên thứ ba
            </h2>
            <div className={`space-y-6 ${themeColors.subtext} font-medium`}>
              <p>Vivu cam kết không bán dữ liệu của bạn. Chúng tôi chỉ chia sẻ thông tin trong các trường hợp cần thiết:</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { title: 'Nhà cung cấp dịch vụ', desc: 'Đối tác khách sạn, hàng không để hoàn tất thủ tục đặt chỗ.' },
                  { title: 'Xử lý thanh toán', desc: 'Cổng thanh toán an toàn để xử lý các giao dịch tài chính.' },
                  { title: 'Yêu cầu pháp lý', desc: 'Khi có yêu cầu từ cơ quan chức năng có thẩm quyền theo pháp luật.' }
                ].map((item, i) => (
                  <div key={i} className={`p-6 rounded-2xl border ${themeColors.border} ${themeColors.card} relative overflow-hidden`}>
                    <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/5 rounded-bl-full"></div>
                    <h4 className={`font-bold mb-3 ${themeColors.text} text-sm`}>{item.title}</h4>
                    <p className="text-xs leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section id="rights" className="scroll-mt-32">
            <h2 className="text-3xl font-black mb-8 flex items-center gap-4">
              <div className={`w-10 h-10 rounded-xl ${themeColors.accentBg} text-white flex items-center justify-center`}>
                <UserCheck size={20} />
              </div>
              Quyền hạn của người dùng
            </h2>
            <div className={`space-y-6 ${themeColors.subtext} font-medium`}>
              <p>Bạn luôn giữ quyền kiểm soát hoàn toàn đối với dữ liệu của mình:</p>
              <div className="space-y-4">
                {[
                  { title: 'Quyền truy cập', desc: 'Bạn có thể yêu cầu xem lại tất cả thông tin chúng tôi đang lưu trữ.' },
                  { title: 'Quyền chỉnh sửa', desc: 'Yêu cầu cập nhật thông tin nếu có sự sai lệch hoặc lỗi thời.' },
                  { title: 'Quyền yêu cầu xóa', desc: 'Bạn có quyền yêu cầu chúng tôi xóa vĩnh viễn dữ liệu cá nhân trong các trường hợp cụ thể.' }
                ].map((right, i) => (
                  <div key={i} className={`p-5 rounded-2xl border ${themeColors.border} flex justify-between items-center group hover:bg-[#3385da]/5 transition-colors`}>
                    <div>
                      <h4 className={`font-bold ${themeColors.text}`}>{right.title}</h4>
                      <p className="text-xs mt-1">{right.desc}</p>
                    </div>
                    <ChevronRight size={18} className="opacity-20 group-hover:opacity-100 transition-opacity" />
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section id="contact" className="scroll-mt-32">
            <h2 className="text-3xl font-black mb-8 flex items-center gap-4">
              <div className={`w-10 h-10 rounded-xl ${themeColors.accentBg} text-white flex items-center justify-center`}>
                <Mail size={20} />
              </div>
              Liên hệ chúng tôi
            </h2>
            <div className={`p-10 rounded-[3rem] border ${themeColors.border} ${themeColors.card} shadow-2xl shadow-blue-500/5`}>
              <p className={`${themeColors.subtext} mb-8`}>Nếu bạn có bất kỳ câu hỏi nào về chính sách này, hãy kết nối với đội ngũ bảo mật của chúng tôi:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-500/10 rounded-xl text-[#3385da]"><MapPin size={20} /></div>
                  <div>
                    <h5 className={`font-bold text-sm ${themeColors.text}`}>Trụ sở chính</h5>
                    <p className="text-xs mt-1 opacity-70 leading-relaxed">Tầng 12, Tòa nhà Heritage, 123 Lê Lợi, Quận 1, TP. Hồ Chí Minh.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-500/10 rounded-xl text-[#3385da]"><Mail size={20} /></div>
                  <div>
                    <h5 className={`font-bold text-sm ${themeColors.text}`}>Email hỗ trợ</h5>
                    <p className="text-xs mt-1 opacity-70">privacy@vivu.com.vn</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-500/10 rounded-xl text-[#3385da]"><Phone size={20} /></div>
                  <div>
                    <h5 className={`font-bold text-sm ${themeColors.text}`}>Đường dây nóng</h5>
                    <p className="text-xs mt-1 opacity-70">1900 123 456 (Nhánh 4)</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-500/10 rounded-xl text-[#3385da]"><ExternalLink size={20} /></div>
                  <div>
                    <h5 className={`font-bold text-sm ${themeColors.text}`}>Kênh trực tuyến</h5>
                    <p className="text-xs mt-1 opacity-70">vivu.com.vn/help-center</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Action Buttons */}
          <div className={`pt-12 border-t ${themeColors.border} flex flex-col sm:flex-row gap-4`}>
            <button className={`${themeColors.accentBg} text-white px-10 py-4 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-2xl shadow-blue-500/30 transition-all hover:scale-[1.02] active:scale-95`}>
              <Printer size={16} /> In chính sách
            </button>
            <button className={`border ${themeColors.border} ${themeColors.text} px-10 py-4 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all`}>
              <Download size={16} /> Tải bản PDF (.pdf)
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
                    <NextLink href={item.href} className={`text-sm font-medium transition-colors ${item.title === "Chính sách bảo mật" ? "text-emerald-500 font-black" : "text-default-500 hover:text-primary"}`}>
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
