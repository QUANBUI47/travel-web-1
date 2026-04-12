import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";

import AdminLayoutClient from "./admin-layout-client";

import { AuthService } from "@/services/auth.service";
import { ROUTES, AUTH_COOKIES } from "@/constants";

const robots: Metadata["robots"] = {
  index: false,
  follow: false,
  nocache: true,
  googleBot: {
    index: false,
    follow: false,
    noimageindex: true,
  },
};

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Admin.Meta");

  return {
    title: t("title"),
    description: t("description"),
    robots,
  };
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, profile } = await AuthService.getCurrentSession(
    AUTH_COOKIES.ADMIN,
  );

  // Lưu ý: Việc redirect đã được đảm nhiệm bởi Middleware.
  // Layout chỉ đóng vai trò cung cấp dữ liệu phiên cho Client Layout.
  if (!user) {
    return <>{children}</>;
  }

  const isAdmin = await AuthService.validateAdminRole(user.id);

  if (!isAdmin) {
    // Nếu lọt qua được middleware nhưng không phải admin (rất hiếm)
    redirect(`${ROUTES.ADMIN.LOGIN}?error=unauthorized`);
  }

  return (
    <AdminLayoutClient profile={profile} user={user}>
      {children}
    </AdminLayoutClient>
  );
}
