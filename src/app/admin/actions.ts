"use server";

import { prisma } from "@/lib/prisma"; // Giả định đã có file lib/prisma.ts
import { revalidatePath } from "next/cache";

/**
 * Cập nhật cấu hình Trang chủ
 */
export async function updateHomeSettings(data: any) {
  try {
    const settings = await prisma.homeSetting.upsert({
      where: { id: "default" },
      update: { content: data },
      create: { id: "default", content: data },
    });

    revalidatePath("/admin/settings");
    revalidatePath("/");
    return { success: true, data: settings };
  } catch (error) {
    console.error("Failed to update home settings:", error);
    return { success: false, error: "Không thể lưu cài đặt trang chủ" };
  }
}

/**
 * Cập nhật cấu hình Hệ thống / SEO
 */
export async function updateSystemSettings(group: string, settings: Record<string, any>) {
  try {
    const promises = Object.entries(settings).map(([key, value]) => 
      prisma.systemSetting.upsert({
        where: { key },
        update: { value, group },
        create: { key, value, group },
      })
    );

    await Promise.all(promises);

    revalidatePath("/admin/settings");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Failed to update system settings:", error);
    return { success: false, error: "Không thể lưu cài đặt hệ thống" };
  }
}
