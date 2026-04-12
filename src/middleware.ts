import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import { ROUTES, ROLES, AUTH_COOKIES } from "@/constants";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. CHẶN TRUY CẬP TRỰC TIẾP VÀO /admin (Giấu hoàn toàn trang admin)
  if (pathname.startsWith("/admin")) {
    return new NextResponse(null, { status: 404 });
  }

  // 2. CẤU HÌNH COOKIE NAME THEO VÙNG (Multi-Session)
  const isAdminPath = pathname.startsWith(ROUTES.ADMIN.HOME);
  const cookieName = isAdminPath ? AUTH_COOKIES.ADMIN : AUTH_COOKIES.PUBLIC;

  // Tạo response cơ sở (Sẽ dùng rewrite nếu là Admin Path)
  let supabaseResponse = isAdminPath
    ? NextResponse.rewrite(
        new URL(pathname.replace(ROUTES.ADMIN.HOME, "/admin"), request.url),
      )
    : NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookieOptions: {
        name: cookieName,
      },
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          // Cập nhật lại supabaseResponse để giữ cookies
          const nextResponse = isAdminPath
            ? NextResponse.rewrite(
                new URL(
                  pathname.replace(ROUTES.ADMIN.HOME, "/admin"),
                  request.url,
                ),
              )
            : NextResponse.next({ request });

          cookiesToSet.forEach(({ name, value, options }) =>
            nextResponse.cookies.set(name, value, options),
          );
          supabaseResponse = nextResponse;
        },
      },
    },
  );

  // 3. XÁC THỰC NGƯỜI DÙNG
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // --- VÙNG QUẢN TRỊ (ADMIN ZONE: /portal/*) ---
  if (isAdminPath) {
    // Ngoại lệ cho trang Login Admin (Dùng đường dẫn ảo để check)
    if (pathname === ROUTES.ADMIN.LOGIN) {
      if (user && user.app_metadata?.role === ROLES.ADMIN) {
        return NextResponse.redirect(new URL(ROUTES.ADMIN.HOME, request.url));
      }

      return supabaseResponse;
    }

    // Kiểm tra Session Admin
    if (!user || user.app_metadata?.role !== ROLES.ADMIN) {
      const loginUrl = new URL(ROUTES.ADMIN.LOGIN, request.url);

      if (pathname !== ROUTES.ADMIN.HOME) {
        loginUrl.searchParams.set("returnTo", pathname);
      }

      return NextResponse.redirect(loginUrl);
    }
  }

  const guestAuthPaths = [
    ROUTES.LOGIN,
    ROUTES.REGISTER,
    ROUTES.FORGOT_PASSWORD,
    ROUTES.RESET_PASSWORD,
    ROUTES.REGISTER_VERIFY,
  ] as const;

  const isGuestAuthPath =
    guestAuthPaths.includes(pathname as (typeof guestAuthPaths)[number]) ||
    pathname.startsWith(`${ROUTES.REGISTER}/`);

  // --- VÙNG KHÁCH HÀNG: chặn trang auth khi đã đăng nhập ---
  if (user && isGuestAuthPath && user.app_metadata?.role !== ROLES.ADMIN) {
    return NextResponse.redirect(new URL(ROUTES.HOME, request.url));
  }

  // --- Trang yêu cầu đăng nhập ---
  const protectedPaths = [
    ROUTES.USER.PROFILE,
    ROUTES.USER.MY_BOOKINGS,
  ] as const;

  if (
    !user &&
    protectedPaths.some((p) => pathname === p || pathname.startsWith(`${p}/`))
  ) {
    const loginUrl = new URL(ROUTES.LOGIN, request.url);

    loginUrl.searchParams.set("returnTo", pathname);

    return NextResponse.redirect(loginUrl);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    // Bỏ qua static files, _next, và favicon
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
