import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

export class AuthService {
  /**
   * Lấy thông tin phiên đăng nhập hiện tại từ Supabase Cookies
   * và kết hợp với Profile từ Prisma Database
   */
  static async getCurrentSession() {
    try {
      const supabase = await createClient();
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        return { user: null, profile: null };
      }

      const profile = await prisma.profile.findUnique({
        where: { id: user.id },
      });

      return { user, profile };
    } catch (error) {
      console.error("[AuthService] Error fetching session:", error);
      return { user: null, profile: null };
    }
  }

  /**
   * Kiểm tra xem user có phải là ADMIN hay không
   */
  static async validateAdminRole(userId: string): Promise<boolean> {
    const profile = await prisma.profile.findUnique({
      where: { id: userId },
      select: { role: true },
    });
    return profile?.role === "ADMIN";
  }

  /**
   * Đăng xuất người dùng hiện tại
   */
  static async signOut() {
    const supabase = await createClient();
    await supabase.auth.signOut();
  }
}
