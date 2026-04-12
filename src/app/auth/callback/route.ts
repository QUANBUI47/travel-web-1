import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";
import { AuthService } from "@/services/auth.service";
import { AUTH_COOKIES, ROUTES } from "@/constants";

function parseNextPath(next: string, origin: string): URL {
  const path = next.startsWith("/") ? next : `/${next}`;

  return new URL(path, origin);
}

function isEmailVerifiedLoginRedirect(nextUrl: URL): boolean {
  return (
    nextUrl.pathname === ROUTES.LOGIN &&
    nextUrl.searchParams.get("verified") === "1"
  );
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const nextRaw = searchParams.get("next") ?? "/";
  const nextUrl = parseNextPath(nextRaw, origin);
  const landOnLoginAfterVerify = isEmailVerifiedLoginRedirect(nextUrl);

  if (code) {
    const supabase = await createClient(AUTH_COOKIES.PUBLIC);
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      await AuthService.ensureUserProfile(data.user);

      if (landOnLoginAfterVerify) {
        await supabase.auth.signOut();

        return NextResponse.redirect(`${origin}${ROUTES.LOGIN}?verified=1`);
      }

      return NextResponse.redirect(
        `${origin}${nextUrl.pathname}${nextUrl.search}`,
      );
    }
  }

  return NextResponse.redirect(
    `${origin}${ROUTES.LOGIN}?error=auth_callback_failed`,
  );
}
