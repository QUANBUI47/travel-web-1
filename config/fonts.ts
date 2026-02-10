import { Be_Vietnam_Pro } from "next/font/google";

// Design system: Be Vietnam Pro — dùng chung cho web (xem doc/DESIGN_SYSTEM.md)
export const fontSans = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans",
});
