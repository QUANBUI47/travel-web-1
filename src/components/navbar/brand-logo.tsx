import NextLink from "next/link";
import Image from "next/image";
import { NavbarBrand } from "@heroui/navbar";

import { ROUTES } from "@/constants";

export function BrandLogo({ isTransparent }: { isTransparent?: boolean }) {
  return (
    <NavbarBrand as="li" className="gap-3 max-w-fit">
      <NextLink
        className="flex justify-start items-center gap-2 group cursor-pointer"
        href={ROUTES.HOME}
      >
        <div className="relative h-10 w-32">
          {/* If header is transparent (on Hero), ALWAYS use light logo for contrast */}
          {isTransparent ? (
            <Image
              fill
              priority
              alt="Vivu Logo"
              className="object-contain transition-opacity duration-500 opacity-100"
              src="/images/vivu-logo-light.svg"
            />
          ) : (
            <>
              <Image
                fill
                priority
                alt="Vivu Logo"
                className="dark:hidden object-contain transition-opacity duration-500 opacity-100"
                src="/images/vivu-logo-light.svg"
              />
              <Image
                fill
                priority
                alt="Vivu Logo"
                className="hidden dark:block object-contain transition-opacity duration-500"
                src="/images/vivu-logo-dark.svg"
              />
            </>
          )}
        </div>
      </NextLink>
    </NavbarBrand>
  );
}
