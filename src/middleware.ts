import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { ROUTES, ROLES } from "@/constants";

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // Refresh session — QUAN TRỌNG: không viết code giữa đây và getUser()
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // Bảo vệ /admin/* — phải đăng nhập và là ADMIN
  if (pathname.startsWith(ROUTES.ADMIN.HOME)) {
    // Cho phép truy cập /admin/login mà không cần login
    if (pathname === ROUTES.ADMIN.LOGIN) {
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();
        
        if (profile?.role === ROLES.ADMIN) {
          return NextResponse.redirect(new URL(ROUTES.ADMIN.HOME, request.url));
        }
      }
      return supabaseResponse;
    }

    if (!user) {
      const loginUrl = new URL(ROUTES.ADMIN.LOGIN, request.url);
      return NextResponse.redirect(loginUrl);
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (!profile || profile.role !== ROLES.ADMIN) {
      return NextResponse.redirect(new URL(ROUTES.HOME, request.url));
    }
  }

  // Ngăn chặn KHÁCH HÀNG đã đăng nhập truy cập trang login/register (không áp dụng cho ADMIN)
  if (user && (pathname === ROUTES.LOGIN || pathname === ROUTES.REGISTER)) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role !== ROLES.ADMIN) {
      return NextResponse.redirect(new URL(ROUTES.HOME, request.url));
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    // Bỏ qua static files, _next, và favicon
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
