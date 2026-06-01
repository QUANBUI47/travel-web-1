import { Be_Vietnam_Pro } from "next/font/google";

/**
 * Be Vietnam Pro — sans-serif do designer Việt (Lam Bao) thiết kế,
 * optimize 100% cho diacritics tiếng Việt. 1 family duy nhất cho cả
 * body + heading — phân cấp bằng SIZE + WEIGHT thay vì đổi font.
 *
 * Hero/h1: size lớn (text-7xl+) với weight nhẹ (500-600) → impact qua
 * size, không qua stroke dày. Tránh weight 800-900 ở display vì
 * Be Vietnam Pro thiết kế cho body, weight cực cao sẽ "đóng kín".
 */
export const fontSans = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-sans",
  display: "swap",
});

export const fontHeading = fontSans;
