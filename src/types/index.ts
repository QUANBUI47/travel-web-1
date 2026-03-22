import { SVGProps } from "react";

export type SupportedLocale = 'vi' | 'en';

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};
