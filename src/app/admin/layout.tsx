"use client";

import { usePathname, redirect } from "next/navigation";
import { AdminSidebar } from "./sidebar";
import { Navbar, NavbarContent, NavbarItem, NavbarMenuToggle, NavbarMenu, NavbarMenuItem } from "@heroui/navbar";
import { User } from "@heroui/user";
import { useState } from "react";
import * as LucideIcons from "lucide-react";
import NextLink from "next/link";
import { siteConfig } from "@/config/site";
import { clsx } from "clsx";

// TODO: Thay bằng kiểm tra Supabase Auth + role ADMIN
const isAdmin = true; 

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  if (!isAdmin) redirect("/");

  return (
    <div className="flex bg-default-50/30 min-h-screen">
      <AdminSidebar />
      
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar 
          maxWidth="full" 
          position="sticky"
          className="bg-white/70 backdrop-blur-md border-b border-default-100 h-16 px-6"
          isBordered={false}
          isMenuOpen={isMenuOpen}
          onMenuOpenChange={setIsMenuOpen}
        >
          <NavbarContent justify="start" className="lg:hidden">
             <NavbarMenuToggle />
          </NavbarContent>

          <NavbarContent justify="start" className="hidden lg:flex">
             <NavbarItem className="font-medium text-default-500">
               Hệ thống quản trị du lịch
             </NavbarItem>
          </NavbarContent>
          
          <NavbarContent justify="end" className="gap-4">
             <NavbarItem>
               <User
                 name="Administrator"
                 description="Quản trị viên"
                 avatarProps={{
                   src: "https://i.pravatar.cc/150?u=admin",
                   size: "sm",
                   isBordered: true,
                   color: "primary"
                 }}
                 className="cursor-pointer hover:opacity-80 transition-opacity"
               />
             </NavbarItem>
          </NavbarContent>

          {/* Mobile Menu (Drawer) */}
          <NavbarMenu className="pt-6 gap-2">
             {siteConfig.adminNavItems.map((item: any) => {
                const Icon = (LucideIcons as any)[item.icon || "Circle"];
                const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));

                return (
                  <NavbarMenuItem key={item.href}>
                    <NextLink
                      href={item.href}
                      onClick={() => setIsMenuOpen(false)}
                      className={clsx(
                        "flex items-center gap-3 px-4 py-3 rounded-xl w-full font-medium transition-all",
                        isActive ? "bg-primary text-white" : "text-default-600 hover:bg-default-100"
                      )}
                    >
                      <Icon size={20} />
                      {item.label}
                    </NextLink>
                  </NavbarMenuItem>
                );
             })}
             <NavbarMenuItem className="mt-auto pb-8">
                <NextLink href="/" className="flex items-center gap-3 px-4 py-3 text-danger font-bold">
                   <LucideIcons.LogOut size={20} />
                   Thoát Admin
                </NextLink>
             </NavbarMenuItem>
          </NavbarMenu>
        </Navbar>

        <main className="flex-1 p-6 lg:p-10 overflow-auto max-w-7xl mx-auto w-full">
           {children}
        </main>
      </div>
    </div>
  );
}
