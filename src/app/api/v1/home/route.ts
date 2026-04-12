import { NextResponse } from "next/server";

import { getApiMessages } from "@/lib/i18n/api";
import { HomeService } from "@/services/home.service";

export async function GET() {
  const t = await getApiMessages();

  try {
    const settings = await HomeService.getSettings();

    return NextResponse.json(
      {
        success: true,
        data: settings,
        message: t("VIVU_API_SUCCESS_200"),
      },
      { status: 200 },
    );
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : t("VIVU_API_ERROR_500");

    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      { status: 500 },
    );
  }
}
