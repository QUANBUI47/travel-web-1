import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { HomeSetting } from "@/types";
import { ActivityService } from "@/services/activity.service";

export class HomeService {
  /**
   * Lấy dữ liệu cấu hình trang chủ (Hero, Stats, v.v...) từ CSDL
   */
  static async getSettings(): Promise<HomeSetting> {
    try {
      const homeSetting = await prisma.homeSetting.findUnique({
        where: { id: "default" },
      });

      return homeSetting?.content ? (homeSetting.content as HomeSetting) : {};
    } catch {
      return {};
    }
  }

  /**
   * Cập nhật cài đặt trang chủ
   */
  static async updateSettings(data: HomeSetting, adminId?: string) {
    try {
      const content = data as Prisma.InputJsonValue;
      const settings = await prisma.homeSetting.upsert({
        where: { id: "default" },
        update: { content },
        create: { id: "default", content },
      });

      if (adminId) {
        await ActivityService.log({
          userId: adminId,
          action: "UPDATE_HOME_SETTING",
          entity: "HomeSetting",
          entityId: "default",
        });
      }

      return settings;
    } catch (_error) {
      throw _error;
    }
  }
}
