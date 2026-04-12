import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";
import { getApiMessages } from "@/lib/i18n/api";

export async function POST() {
  const t = await getApiMessages();

  try {
    const supabase = await createClient();

    await supabase.auth.signOut();

    return NextResponse.json(
      {
        success: true,
        message: t("AUTH_LOGOUT_SUCCESS"),
        data: null,
      },
      { status: 200 },
    );
  } catch (error: unknown) {
    // eslint-disable-next-line no-console
    console.error("[POST /api/v1/auth/logout]", error);
    const message = error instanceof Error ? error.message : String(error);

    return NextResponse.json(
      {
        success: false,
        message: t("AUTH_LOGIN_ERROR"),
        error: message,
      },
      { status: 500 },
    );
  }
}
