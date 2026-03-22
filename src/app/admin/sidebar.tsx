"use client";

import { usePathname } from "next/navigation";
import NextLink from "next/link";
import { clsx } from "clsx";
import * as LucideIcons from "lucide-react";
import { ScrollShadow } from "@heroui/scroll-shadow";
import { siteConfig } from "@/config/site";
import { Divider } from "@heroui/divider";
import Image from "next/image";
export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex flex-col w-64 h-screen sticky top-0 border-r border-default-200 bg-default-50/50 backdrop-blur-xl">
      <div className="p-6">
        <NextLink href="/admin" className="flex items-center gap-2 group">
          <Image 
            src="/images/mini-logo-vivu.svg" 
            alt="Vivu Admin Logo" 
            width={32} 
            height={32} 
            className="group-hover:scale-110 transition-transform drop-shadow-md"
          />
          <span className="font-bold text-xl tracking-tight text-default-900">
            Vivu <span className="text-primary">Admin</span>
          </span>
        </NextLink>
      </div>

      <Divider className="mx-6 w-auto" />

      <ScrollShadow className="flex-1 py-4 px-4 overflow-y-auto">
        <nav className="space-y-1">
          {siteConfig.adminNavItems.map((item) => {
             const Icon = (LucideIcons as any)[item.icon || "Circle"];
             const items = (item as any).children || [];
             const hasChildren = items.length > 0;
             const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));

             return (
               <div key={item.href} className="space-y-1">
                 <NextLink
                   href={item.href}
                   className={clsx(
                     "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all group",
                     isActive && !hasChildren
                      ? "bg-primary text-white shadow-md shadow-primary/20" 
                      : isActive 
                        ? "text-primary bg-primary/5"
                        : "text-default-600 hover:bg-default-100 hover:text-default-900"
                   )}
                 >
                   <Icon size={20} className={clsx(isActive && !hasChildren ? "text-white" : "text-default-400 group-hover:text-primary")} />
                   <span className="flex-1">{item.label}</span>
                   {hasChildren && <LucideIcons.ChevronDown size={14} className={clsx("transition-transform", isActive ? "rotate-0" : "-rotate-90")} />}
                 </NextLink>

                 {hasChildren && isActive && (
                   <div className="ml-9 space-y-1 animate-in slide-in-from-top-2 duration-300">
                     {items.map((subItem: any) => {
                       const isSubActive = pathname + (window.location.search || "") === subItem.href || (subItem.href.includes('?') && pathname === subItem.href.split('?')[0] && window.location.search === '?' + subItem.href.split('?')[1]);
                       // Note: window.location might not be available during SSR, but this is a client component.
                       // Better to use useSearchParams if needed, but for now let's just check the href.
                       
                       return (
                         <NextLink
                           key={subItem.href}
                           href={subItem.href}
                           className={clsx(
                             "flex items-center gap-3 px-4 py-2 rounded-lg text-xs font-medium transition-all",
                             pathname + (typeof window !== 'undefined' ? window.location.search : '') === subItem.href
                               ? "text-primary font-bold"
                               : "text-default-500 hover:text-default-900"
                           )}
                         >
                            {subItem.label}
                         </NextLink>
                       );
                     })}
                   </div>
                 )}
               </div>
             );
          })}
        </nav>
      </ScrollShadow>

      <div className="p-4 mt-auto">
        <button
          onClick={async () => {
            const { logoutAdmin } = await import("@/actions/auth.actions");
            await logoutAdmin();
          }}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-default-500 hover:bg-danger/10 hover:text-danger transition-colors group w-full"
        >
          <LucideIcons.LogOut size={20} className="group-hover:rotate-180 transition-transform" />
          Thoát Admin
        </button>
      </div>
    </aside>
  );
}
