import { NextResponse } from "next/server";

import { getApiMessages } from "@/lib/i18n/api";
import { AuthService } from "@/services/auth.service";

export async function GET() {
  const t = await getApiMessages();

  try {
    const { user, profile } = await AuthService.getCurrentSession();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: t("VIVU_API_ERROR_401"),
          data: null,
        },
        { status: 401 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: t("VIVU_API_SUCCESS_200"),
        data: {
          id: user.id,
          email: user.email,
          profile: profile,
        },
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
