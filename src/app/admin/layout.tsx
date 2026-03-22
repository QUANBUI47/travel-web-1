import { Metadata } from "next";
import AdminLayoutClient from "./admin-layout-client";
import { AuthService } from "@/services/auth.service";

export const metadata: Metadata = {
  title: "Vivu Admin - Hệ thống quản trị",
  description: "Trang quản trị nội bộ Vivu Travel",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, profile } = await AuthService.getCurrentSession();

  return (
    <AdminLayoutClient user={user} profile={profile}>
      {children}
    </AdminLayoutClient>
  );
}
