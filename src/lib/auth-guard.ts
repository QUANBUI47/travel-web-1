"use server";

import { createClient } from "@/lib/supabase/server";
import { AuthService } from "@/services/auth.service";
import { AUTH_COOKIES } from "@/constants";

/**
 * Guard bảo vệ Server Actions — Yêu cầu người dùng phải là ADMIN.
 * Ném lỗi nếu chưa đăng nhập hoặc không có quyền ADMIN.
 * Sử dụng getUser() để xác thực phía Supabase Auth Server (không thể bypass).
 */
export async function requireAdmin() {
  const supabase = await createClient(AUTH_COOKIES.ADMIN);

  // Dùng getUser() thay vì getSession() để xác thực phía server, tránh bị giả mạo cookie
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new Error("VIVU_API_ERROR_401");
  }

  // Double-check role từ Database (defense in depth)
  const isAdmin = await AuthService.validateAdminRole(user.id);

  if (!isAdmin) {
    throw new Error("VIVU_API_ERROR_403");
  }

  return user;
}

/**
 * Guard bảo vệ Server Actions — Yêu cầu người dùng phải đăng nhập (bất kỳ role nào).
 */
export async function requireAuth() {
  const supabase = await createClient(AUTH_COOKIES.PUBLIC);

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new Error("VIVU_API_ERROR_401");
  }

  return user;
}
