import NextLink from "next/link";
import Image from "next/image";
import { NavbarBrand } from "@heroui/navbar";
import { ROUTES } from "@/config/routes";

export function BrandLogo() {
  return (
    <NavbarBrand as='li' className='gap-3 max-w-fit'>
      <NextLink
        className='flex justify-start items-center gap-2 group'
        href={ROUTES.HOME}
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
  );
}
