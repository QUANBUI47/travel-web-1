import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Chuyển đổi dữ liệu từ Prisma (Decimal, Date) thành Plain Object để truyền sang Client Component
 */
export function serialize<T>(data: T): T {
  return JSON.parse(JSON.stringify(data));
}

export { slugify } from "./slugify";
