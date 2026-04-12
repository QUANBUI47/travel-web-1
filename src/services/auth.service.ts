import { User } from "@supabase/supabase-js";

import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { UserProfile } from "@/types";

function resolveDisplayName(user: User): string {
  const meta = user.user_metadata ?? {};

  return (
    (meta.full_name as string | undefined) ??
    (meta.name as string | undefined) ??
    user.email?.split("@")[0] ??
    "Khách Vivu"
  );
}

function resolveAvatarUrl(user: User): string | null {
  const meta = user.user_metadata ?? {};

  return (
    (meta.avatar_url as string | undefined) ??
    (meta.picture as string | undefined) ??
    null
  );
}

export class AuthService {
  /**
   * Lấy thông tin phiên đăng nhập hiện tại từ Supabase Cookies
   * và kết hợp với Profile từ Prisma Database
   */
  static async getCurrentSession(cookieName?: string): Promise<{
    user: User | null;
    profile: UserProfile | null;
  }> {
    try {
      const supabase = await createClient(cookieName);
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        return { user: null, profile: null };
      }

      const profile = (await prisma.profile.findUnique({
        where: { id: user.id },
      })) as UserProfile | null;

      return { user, profile };
    } catch {
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
  static async signOut(cookieName?: string) {
    const supabase = await createClient(cookieName);

    await supabase.auth.signOut();
  }

  /**
   * Đồng bộ hồ sơ Prisma sau đăng ký / OAuth / xác thực email.
   */
  static async ensureUserProfile(user: User): Promise<UserProfile> {
    const displayName = resolveDisplayName(user);
    const avatarUrl = resolveAvatarUrl(user);

    const profile = await prisma.profile.upsert({
      where: { id: user.id },
      create: {
        id: user.id,
        displayName,
        avatarUrl,
        role: "USER",
      },
      update: {
        displayName,
        ...(avatarUrl ? { avatarUrl } : {}),
      },
    });

    return profile as unknown as UserProfile;
  }
}
