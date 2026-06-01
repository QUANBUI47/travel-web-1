import { Manrope } from "next/font/google";

/**
 * Manrope — sans-serif duy nhất cho toàn site (web + admin).
 * Subset `vietnamese` đảm bảo dấu thanh + Đ/ă/ơ/ư render đẹp.
 * Variable weight 200–800 cho phép body / heading dùng cùng family,
 * chỉ khác weight (không cần load thêm font display).
 */
export const fontSans = Manrope({
  subsets: ["latin", "latin-ext", "vietnamese"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-sans",
  display: "swap",
});

// Alias để không phá lớp class `font-heading` đã xài trong codebase.
// Cùng trỏ về Manrope variable → 1 family duy nhất, chỉ khác weight.
export const fontHeading = fontSans;
