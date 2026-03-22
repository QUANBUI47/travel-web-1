import { prisma } from "@/lib/prisma";

export class HomeService {
  /**
   * Lấy dữ liệu cấu hình trang chủ (Hero, Stats, v.v...) từ CSDL
   */
  static async getSettings() {
    try {
      const homeSetting = await prisma.homeSetting.findUnique({
        where: { id: "default" },
      });
      return homeSetting?.content ? (homeSetting.content as any) : {};
    } catch (error) {
      console.error("[HomeService] Lỗi khi lấy cài đặt Home:", error);
      return {};
    }
  }

  /**
   * Cập nhật cài đặt trang chủ
   */
  static async updateSettings(data: any) {
    try {
      const settings = await prisma.homeSetting.upsert({
        where: { id: "default" },
        update: { content: data },
        create: { id: "default", content: data },
      });
      return settings;
    } catch (error) {
      console.error("[HomeService] Lỗi khi lưu cài đặt Home:", error);
      throw error;
    }
  }
}

