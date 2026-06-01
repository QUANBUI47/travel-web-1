import { Be_Vietnam_Pro } from "next/font/google";

/**
 * Be Vietnam Pro — sans-serif do designer Việt (Lam Bao) thiết kế, optimize
 * 100% cho diacritics tiếng Việt (Đ/đ/ă/ơ/ư + dấu thanh đặt đúng vị trí).
 * 9 weights — body dùng 400-500, heading 700-900.
 *
 * Brand Việt nổi tiếng đang dùng (Tiki, Momo, ZaloPay) → user Việt cảm
 * thấy quen mắt nhưng vẫn modern.
 */
export const fontSans = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-sans",
  display: "swap",
});

// Alias để giữ class `font-heading` cũ. 1 family duy nhất, phân cấp qua weight.
export const fontHeading = fontSans;
