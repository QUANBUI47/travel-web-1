import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";

export class SystemService {
  /**
   * Lấy cấu hình hệ thống bao gồm thông tin công ty, SEO, Mạng xã hội, Bảo trì
   */
  static async getSettings(): Promise<Record<string, unknown>> {
    try {
      const settings = await prisma.systemSetting.findMany();
      const consolidated: Record<string, unknown> = {};

      settings.forEach((setting) => {
        consolidated[setting.key] = setting.value;
      });

      return consolidated;
    } catch {
      return {};
    }
  }

  /**
   * Kiểm tra xem hệ thống có đang trong chế độ bảo trì không
   */
  static async isMaintenanceMode(): Promise<boolean> {
    try {
      const setting = await prisma.systemSetting.findUnique({
        where: { key: "maintenanceMode" },
      });

      return setting?.value === true;
    } catch {
      return false;
    }
  }

  /**
   * Cập nhật các key-value của hệ thống (Bulk update)
   */
  static async updateSettings(
    group: string,
    settings: Record<string, unknown>,
  ) {
    try {
      // Sử dụng transaction để đảm bảo tính nhất quán
      await prisma.$transaction(
        Object.entries(settings).map(([key, value]) =>
          prisma.systemSetting.upsert({
            where: { key },
            update: { value: value as Prisma.InputJsonValue, group },
            create: { key, value: value as Prisma.InputJsonValue, group },
          }),
        ),
      );

      return true;
    } catch (_error) {
      throw _error;
    }
  }
}
