import type { User } from "@supabase/supabase-js";

import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import { ROUTES, ROLES, AUTH_COOKIES } from "@/constants";

type MaybeUser = User | null;

/* -------------------------------------------------------------------------- */
/*  Path matchers — pure functions, không side-effect, dễ unit test           */
/* -------------------------------------------------------------------------- */

const GUEST_AUTH_PATHS: readonly string[] = [
  ROUTES.LOGIN,
  ROUTES.REGISTER,
  ROUTES.FORGOT_PASSWORD,
  ROUTES.RESET_PASSWORD,
  ROUTES.REGISTER_VERIFY,
];

const PROTECTED_USER_PATHS: readonly string[] = [
  ROUTES.USER.PROFILE,
  ROUTES.USER.MY_BOOKINGS,
];

function isAdminZone(pathname: string): boolean {
  return pathname.startsWith(ROUTES.ADMIN.HOME);
}

function isGuestAuthPath(pathname: string): boolean {
  return (
    GUEST_AUTH_PATHS.includes(pathname) ||
    pathname.startsWith(`${ROUTES.REGISTER}/`)
  );
}

function isProtectedUserPath(pathname: string): boolean {
  return PROTECTED_USER_PATHS.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );
}

function isAdminUser(user: MaybeUser): boolean {
  return !!user && user.app_metadata?.role === ROLES.ADMIN;
}

/* -------------------------------------------------------------------------- */
/*  Response builder                                                          */
/* -------------------------------------------------------------------------- */

/**
 * Tạo response gốc cho middleware.
 *
 * - Với admin zone: rewrite URL ảo (vd. `/portal/tours`) sang URL thật `/admin/tours`.
 * - Với public: dùng `next()` để pass-through.
 */
function buildBaseResponse(
  request: NextRequest,
  pathname: string,
  isAdminPath: boolean,
): NextResponse {
  if (!isAdminPath) {
    return NextResponse.next({ request });
  }

  const realPath = pathname.replace(ROUTES.ADMIN.HOME, "/admin");

  return NextResponse.rewrite(new URL(realPath, request.url));
}

/* -------------------------------------------------------------------------- */
/*  Supabase client factory                                                   */
/* -------------------------------------------------------------------------- */

/**
 * Khởi tạo Supabase server client cho middleware.
 *
 * Trả về `{ supabase, getResponse }`:
 * - `supabase`     — client để gọi `auth.getUser()`.
 * - `getResponse`  — đọc response mới nhất (cookie có thể được sync lại bởi Supabase
 *                    qua `setAll` khi token refresh).
 */
function createMiddlewareSupabase(
  request: NextRequest,
  pathname: string,
  isAdminPath: boolean,
  cookieName: string,
) {
  let response = buildBaseResponse(request, pathname, isAdminPath);

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookieOptions: { name: cookieName },
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );

          response = buildBaseResponse(request, pathname, isAdminPath);
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  return { supabase, getResponse: () => response };
}

/* -------------------------------------------------------------------------- */
/*  Auth guards — mỗi guard chỉ làm 1 việc, trả NextResponse hoặc null        */
/* -------------------------------------------------------------------------- */

/**
 * Vùng QUẢN TRỊ:
 * - Trên trang login admin: nếu đã là admin → đẩy về admin home.
 * - Các trang khác trong admin zone: yêu cầu role ADMIN, nếu không → redirect login.
 */
function handleAdminZone(
  pathname: string,
  user: MaybeUser,
  request: NextRequest,
): NextResponse | null {
  if (pathname === ROUTES.ADMIN.LOGIN) {
    if (isAdminUser(user)) {
      return NextResponse.redirect(new URL(ROUTES.ADMIN.HOME, request.url));
    }

    return null;
  }

  if (!isAdminUser(user)) {
    const loginUrl = new URL(ROUTES.ADMIN.LOGIN, request.url);

    if (pathname !== ROUTES.ADMIN.HOME) {
      loginUrl.searchParams.set("returnTo", pathname);
    }

    return NextResponse.redirect(loginUrl);
  }

  return null;
}

/**
 * Vùng KHÁCH HÀNG (guest-only): chặn user thường đã đăng nhập vào lại trang
 * login / register / forgot-password / reset-password / verify.
 *
 * Admin vẫn được phép truy cập (vd. để debug) — không bị redirect.
 */
function handleGuestAuthPath(
  pathname: string,
  user: MaybeUser,
  request: NextRequest,
): NextResponse | null {
  if (!user || isAdminUser(user)) return null;
  if (!isGuestAuthPath(pathname)) return null;

  return NextResponse.redirect(new URL(ROUTES.HOME, request.url));
}

/**
 * Trang yêu cầu đăng nhập (profile, đơn đặt của tôi…): chưa login → đẩy về
 * login + lưu `returnTo`.
 */
function handleProtectedUserPath(
  pathname: string,
  user: MaybeUser,
  request: NextRequest,
): NextResponse | null {
  if (user) return null;
  if (!isProtectedUserPath(pathname)) return null;

  const loginUrl = new URL(ROUTES.LOGIN, request.url);

  loginUrl.searchParams.set("returnTo", pathname);

  return NextResponse.redirect(loginUrl);
}

/* -------------------------------------------------------------------------- */
/*  Entry                                                                     */
/* -------------------------------------------------------------------------- */

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Ẩn hoàn toàn /admin — admin chỉ được truy cập qua URL ảo `ROUTES.ADMIN.HOME`
  if (pathname.startsWith("/admin")) {
    return new NextResponse(null, { status: 404 });
  }

  // 2. Phân vùng (admin vs public) → chọn cookie session & URL rewrite tương ứng
  const isAdminPath = isAdminZone(pathname);
  const cookieName = isAdminPath ? AUTH_COOKIES.ADMIN : AUTH_COOKIES.PUBLIC;

  // 3. Khởi tạo Supabase client + response wrapper
  const { supabase, getResponse } = createMiddlewareSupabase(
    request,
    pathname,
    isAdminPath,
    cookieName,
  );

  // 4. Xác thực user (đồng thời refresh session qua cookie callback nếu cần)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 5. Áp dụng guard theo thứ tự ưu tiên
  if (isAdminPath) {
    const adminResponse = handleAdminZone(pathname, user, request);

    if (adminResponse) return adminResponse;
  } else {
    const guestRedirect = handleGuestAuthPath(pathname, user, request);

    if (guestRedirect) return guestRedirect;

    const protectedRedirect = handleProtectedUserPath(pathname, user, request);

    if (protectedRedirect) return protectedRedirect;
  }

  return getResponse();
}

export const config = {
  matcher: [
    /**
     * Chỉ chạy middleware cho HTML routes.
     *
     * Loại trừ:
     * - `api/*`             → các route API tự quản lý Supabase session (qua AuthService),
     *                          không cần middleware refresh thêm → tránh gọi `getUser()` thừa.
     * - `_next/static`,
     *   `_next/image`       → static assets & image optimizer.
     * - `favicon.ico`,
     *   `robots.txt`,
     *   `sitemap.xml`,
     *   `manifest.json`     → metadata files (Next.js generated hoặc public).
     * - File ảnh public     → svg, png, jpg, jpeg, gif, webp, avif, ico.
     */
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|manifest.json|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|ico)$).*)",
  ],
};
