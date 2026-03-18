"use client";

import { useEffect, useState } from "react";
import NextLink from "next/link";
import { NavbarItem, NavbarMenuItem } from "@heroui/navbar";
import { Link } from "@heroui/link";
import clsx from "clsx";
import { usePathname } from "next/navigation";
import { ROUTES } from "@/config/routes";

interface NavLinksProps {
  items: { label: string; href: string }[];
}

export function DesktopNavLinks({ items }: NavLinksProps) {
  const { activeSegment, handleClick } = useScrollSpy(items);
  const pathname = usePathname();

  return (
    <ul className="hidden lg:flex gap-10 justify-start ml-16">
      {items.map((item) => {
        let isActive = false;
        if (pathname === "/") {
          isActive = activeSegment === item.href || (activeSegment === "" && item.href === "/");
        } else {
          isActive = pathname === item.href;
        }

        return (
          <NavbarItem key={item.href}>
            <NextLink
              onClick={(e) => handleClick(e, item.href)}
              className={clsx(
                "text-[15px] font-bold tracking-tight transition-all duration-200",
                isActive
                  ? "text-primary"
                  : "text-foreground/70 hover:text-primary hover:opacity-100"
              )}
              href={item.href}
            >
              {item.label}
            </NextLink>
          </NavbarItem>
        );
      })}
    </ul>
  );
}

export function MobileNavLinks({ items }: NavLinksProps) {
  const { activeSegment, handleClick } = useScrollSpy(items);
  const pathname = usePathname();

  return (
    <div className='mx-4 mt-2 flex flex-col gap-2'>
      {items.map((item, index) => {
        let isActive = false;
        if (pathname === "/") {
          isActive = activeSegment === item.href || (activeSegment === "" && item.href === "/");
        } else {
          isActive = pathname === item.href;
        }

        return (
          <NavbarMenuItem key={`${item.href}-${index}`}>
            <NextLink
              onClick={(e) => handleClick(e, item.href)}
              className={clsx(
                "text-lg block py-2",
                isActive ? "text-primary font-bold" : "text-foreground"
              )}
              href={item.href}
            >
              {item.label}
            </NextLink>
          </NavbarMenuItem>
        );
      })}
      <NavbarMenuItem>
        <NextLink
          href={ROUTES.LOGIN}
          className='text-lg block py-2 text-primary font-bold'
        >
          Đăng nhập / Đăng ký
        </NextLink>
      </NavbarMenuItem>
    </div>
  );
}

// Hook for Scroll Spy
function useScrollSpy(items: { href: string }[]) {
  const [activeSegment, setActiveSegment] = useState("");
  const pathname = usePathname();

  useEffect(() => {
    if (pathname !== "/") return;

    const handleScroll = () => {
      let current = "";
      for (const item of items) {
        if (item.href.startsWith("/#")) {
          const id = item.href.substring(2);
          const element = document.getElementById(id);
          if (element) {
            const rect = element.getBoundingClientRect();
            // Check if element is in viewport (considering navbar height)
            if (rect.top <= 150 && rect.bottom >= 150) {
              current = item.href;
            }
          }
        }
      }

      if (current) {
        setActiveSegment(current);
      } else if (window.scrollY < 100) {
        setActiveSegment("/");
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [items, pathname]);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (pathname !== "/") return; 

    if (href.startsWith("/#")) {
      e.preventDefault();
      const id = href.substring(2);
      const element = document.getElementById(id);
      if (element) {
        const offset = 80;
        const elementPosition = element.getBoundingClientRect().top + window.scrollY;
        
        window.scrollTo({
          top: elementPosition - offset,
          behavior: "smooth"
        });
        
        setActiveSegment(href);
      }
    } else if (href === "/") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
      setActiveSegment("/");
    }
  };

  return { activeSegment, handleClick };
}
