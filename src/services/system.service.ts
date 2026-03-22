import { prisma } from "@/lib/prisma";
import { SystemSettingsContent } from "@/lib/schemas";

export class SystemService {
  /**
   * Lấy cấu hình hệ thống bao gồm thông tin công ty, SEO, Mạng xã hội, Bảo trì
   */
  static async getSettings(): Promise<Record<string, any>> {
    try {
      const settings = await prisma.systemSetting.findMany();
      const consolidated: Record<string, any> = {};
      
      settings.forEach((setting: any) => {
        consolidated[setting.key] = setting.value;
      });
      
      return consolidated;
    } catch (error) {
      console.error("[SystemService] Lỗi khi lấy cài đặt hệ thống:", error);
      return {};
    }
  }

  /**
   * Kiểm tra xem hệ thống có đang trong chế độ bảo trì không
   */
  static async isMaintenanceMode(): Promise<boolean> {
    try {
      const setting = await prisma.systemSetting.findUnique({
        where: { key: "maintenanceMode" }
      });
      return setting?.value === true;
    } catch {
      return false;
    }
  }

  /**
   * Cập nhật các key-value của hệ thống (Bulk update)
   */
  static async updateSettings(group: string, settings: Record<string, any>) {
    try {
      // Sử dụng transaction để đảm bảo tính nhất quán
      await prisma.$transaction(
        Object.entries(settings).map(([key, value]) => 
          prisma.systemSetting.upsert({
            where: { key },
            update: { value, group },
            create: { key, value, group },
          })
        )
      );
      return true;
    } catch (error) {
      console.error("[SystemService] Lỗi lưu biến hệ thống:", error);
      throw error;
    }
  }
}
