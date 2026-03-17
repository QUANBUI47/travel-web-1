import { Inter, Plus_Jakarta_Sans } from "next/font/google";

export const fontSans = Inter({
  subsets: ["latin", "vietnamese"],
  variable: "--font-sans",
});

export const fontHeading = Plus_Jakarta_Sans({
  subsets: ["latin", "vietnamese"],
  variable: "--font-heading",
});
