import type { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";

export type ActivityAction =
  | "CREATE_TOUR"
  | "UPDATE_TOUR"
  | "DELETE_TOUR"
  | "CREATE_DESTINATION"
  | "UPDATE_DESTINATION"
  | "DELETE_DESTINATION"
  | "UPDATE_HOME_SETTING"
  | "UPDATE_SYSTEM_SETTING"
  | "LOGIN"
  | "LOGOUT";

export class ActivityService {
  /**
   * Ghi lại một hoạt động vào hệ thống
   */
  static async log({
    userId,
    action,
    entity,
    entityId,
    details,
  }: {
    userId: string;
    action: ActivityAction;
    entity?: string;
    entityId?: string;
    details?: Record<string, unknown>;
  }) {
    try {
      return await prisma.activityLog.create({
        data: {
          userId,
          action,
          entity,
          entityId,
          details: details ? (details as Prisma.InputJsonValue) : undefined,
        },
      });
    } catch {
      // Slient fail for logs
    }
  }

  /**
   * Lấy danh sách hoạt động gần đây
   */
  static async getRecentLogs(limit: number = 10) {
    return prisma.activityLog.findMany({
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        profile: {
          select: {
            displayName: true,
            avatarUrl: true,
          },
        },
      },
    });
  }
}
