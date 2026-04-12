"use server";

import type { HomeModule } from "@/types";

import { revalidatePath } from "next/cache";

import { adminActionClient } from "@/lib/safe-action";
import { HomeService } from "@/services/home.service";
import { ROUTES } from "@/constants";
import { homeSettingsModulesSchema } from "@/lib/validations/home-settings.schema";

export const updateHomeSettingsAction = adminActionClient
  .schema(homeSettingsModulesSchema)
  .action(async ({ parsedInput }) => {
    const modules = parsedInput as HomeModule[];

    await HomeService.updateSettings({ modules });

    revalidatePath(ROUTES.HOME);
    revalidatePath(ROUTES.ADMIN.SETTINGS_HOMEPAGE);

    return { success: true as const };
  });
