import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { prisma } from "@/lib/prisma";
import { UserProfile } from "@/types";
import { AUTH_COOKIES } from "@/constants";
import { getApiMessages } from "@/lib/i18n/api";

export async function POST(request: Request) {
  const t = await getApiMessages();

  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          message: t("AUTH_LOGIN_MISSING"),
          data: null,
        },
        { status: 400 },
      );
    }

    const supabase = await createClient(AUTH_COOKIES.ADMIN);

    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !authData?.user || !authData.session) {
      return NextResponse.json(
        {
          success: false,
          message: t("AUTH_LOGIN_INVALID"),
          data: null,
        },
        { status: 401 },
      );
    }

    const profile = (await prisma.profile.findUnique({
      where: { id: authData.user.id },
    })) as UserProfile | null;

    if (profile?.role === "ADMIN") {
      try {
        const adminClient = createAdminClient();

        await adminClient.auth.admin.updateUserById(authData.user.id, {
          app_metadata: { role: "ADMIN" },
        });
      } catch {
        // ignore metadata sync failure
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: t("AUTH_LOGIN_SUCCESS"),
        data: {
          user: {
            id: authData.user.id,
            email: authData.user.email,
            role: profile?.role || "USER",
            profile: profile,
          },
          session: {
            access_token: authData.session.access_token,
            refresh_token: authData.session.refresh_token,
            expires_at: authData.session.expires_at,
            expires_in: authData.session.expires_in,
          },
        },
      },
      { status: 200 },
    );
  } catch (error: unknown) {
    // eslint-disable-next-line no-console
    console.error("[POST /api/v1/auth/login]", error);
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
