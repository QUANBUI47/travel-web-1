"use client";

import { usePathname } from "next/navigation";
import NextLink from "next/link";
import { clsx } from "clsx";
import * as LucideIcons from "lucide-react";
import { ScrollShadow } from "@heroui/scroll-shadow";
import { siteConfig } from "@/config/site";
import { Divider } from "@heroui/divider";

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex flex-col w-64 h-screen sticky top-0 border-r border-default-200 bg-default-50/50 backdrop-blur-xl">
      <div className="p-6">
        <NextLink href="/admin" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
             <LucideIcons.Send size={18} />
          </div>
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
             const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));

             return (
               <NextLink
                 key={item.href}
                 href={item.href}
                 className={clsx(
                   "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all group",
                   isActive 
                    ? "bg-primary text-white shadow-md shadow-primary/20" 
                    : "text-default-600 hover:bg-default-100 hover:text-default-900"
                 )}
               >
                 <Icon size={20} className={clsx(isActive ? "text-white" : "text-default-400 group-hover:text-primary")} />
                 {item.label}
               </NextLink>
             );
          })}
        </nav>
      </ScrollShadow>

      <div className="p-4 mt-auto">
        <NextLink
          href="/"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-default-500 hover:bg-danger/10 hover:text-danger transition-colors group"
        >
          <LucideIcons.LogOut size={20} className="group-hover:rotate-180 transition-transform" />
          Thoát Admin
        </NextLink>
      </div>
    </aside>
  );
}
