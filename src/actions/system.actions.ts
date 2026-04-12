"use server";

import { revalidatePath } from "next/cache";
import { ZodError, z } from "zod";

import { SystemService } from "@/services/system.service";
import { handleError } from "@/lib/utils/error";
import { ROUTES } from "@/constants";
import { requireAdmin } from "@/lib/auth-guard";
import { zodFirstMessage } from "@/lib/i18n/zod-error";

const systemUpdateSchema = z.object({
  group: z.string().min(1).max(80),
  settings: z.record(z.string(), z.unknown()),
});

/**
 * Cập nhật cấu hình hệ thống theo nhóm
 */
export async function updateSystemSettingsAction(
  group: string,
  settings: Record<string, unknown>,
) {
  try {
    await requireAdmin();
    const { group: g, settings: s } = systemUpdateSchema.parse({
      group,
      settings,
    });

    await SystemService.updateSettings(g, s);

    // Làm mới trang cấu hình hệ thống
    revalidatePath(ROUTES.ADMIN.SETTINGS);
    revalidatePath(ROUTES.HOME);

    return { success: true };
  } catch (error) {
    if (error instanceof ZodError) {
      return {
        success: false,
        error: "VALIDATION_ERROR",
        message: await zodFirstMessage(error, "invalid_system_config"),
      };
    }

    return await handleError(error, "VIVU_ADMIN_ERROR_UPDATE_SYSTEM");
  }
}
