"use client";

import { usePathname } from "next/navigation";
import { AdminSidebar } from "./sidebar";
import { Navbar, NavbarContent, NavbarItem, NavbarMenuToggle, NavbarMenu, NavbarMenuItem } from "@heroui/navbar";
import { User } from "@heroui/user";
import { useState } from "react";
import * as LucideIcons from "lucide-react";
import NextLink from "next/link";
import { siteConfig } from "@/config/site";
import { clsx } from "clsx";

export default function AdminLayoutClient({
  children,
  user,
  profile,
}: {
  children: React.ReactNode;
  user?: any;
  profile?: any;
}) {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isLoginPage = pathname === "/admin/login";

  if (isLoginPage) {
    return <>{children}</>;
  }

  const displayName = profile?.displayName || "Administrator";
  const email = user?.email || "admin@vivu.com";
  const avatarUrl = profile?.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=random`;

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

          <NavbarContent justify="start" className="hidden lg:flex gap-4">
             <NavbarItem className="font-medium text-default-500">
               Hệ thống quản trị du lịch
             </NavbarItem>
          </NavbarContent>
          
          <NavbarContent justify="end" className="gap-4">
             <NavbarItem>
               <User
                 name={displayName}
                 description={email}
                 avatarProps={{
                   src: avatarUrl,
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
                const items = item.children || [];
                const hasChildren = items.length > 0;
                const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));

                return (
                  <div key={item.href} className="w-full">
                    <NextLink
                      href={item.href}
                      onClick={() => !hasChildren && setIsMenuOpen(false)}
                      className={clsx(
                        "flex items-center gap-3 px-4 py-3 rounded-xl w-full font-medium transition-all",
                        isActive && !hasChildren ? "bg-primary text-white" : isActive ? "text-primary bg-primary/5" : "text-default-600 hover:bg-default-100"
                      )}
                    >
                      <Icon size={20} />
                      <span className="flex-1">{item.label}</span>
                      {hasChildren && <LucideIcons.ChevronDown size={14} className={isActive ? "" : "-rotate-90"} />}
                    </NextLink>
                    
                    {hasChildren && isActive && (
                      <div className="ml-9 mt-1 space-y-1">
                        {items.map((subItem: any) => (
                          <NextLink
                            key={subItem.href}
                            href={subItem.href}
                            onClick={() => setIsMenuOpen(false)}
                            className={clsx(
                              "flex items-center gap-3 px-4 py-2 rounded-xl w-full text-sm transition-all",
                              pathname + (typeof window !== 'undefined' ? window.location.search : '') === subItem.href 
                                ? "text-primary font-bold" 
                                : "text-default-500 hover:bg-default-50"
                            )}
                          >
                            {subItem.label}
                          </NextLink>
                        ))}
                      </div>
                    )}
                  </div>
                );
             })}
             <NavbarMenuItem className="mt-auto pb-8">
                <button 
                  onClick={async () => {
                    const { logoutAdmin } = await import("@/actions/auth.actions");
                    await logoutAdmin();
                  }}
                  className="flex items-center gap-3 px-4 py-3 text-danger font-bold w-full"
                >
                   <LucideIcons.LogOut size={20} />
                   Thoát Admin
                </button>
             </NavbarMenuItem>
          </NavbarMenu>
        </Navbar>

        <main className={clsx(
            "flex-1 overflow-auto w-full",
            pathname === "/admin/settings/homepage" ? "p-0" : "p-6 lg:p-10",
            !pathname.startsWith("/admin/settings") && "max-w-7xl mx-auto"
        )}>
           {children}
        </main>
      </div>
    </div>
  );
}
