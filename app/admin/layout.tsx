import { redirect } from "next/navigation";
import NextLink from "next/link";
import { siteConfig } from "@/config/site";

// TODO: Thay bằng kiểm tra Supabase Auth + role ADMIN
const isAdmin = true; // placeholder — lấy từ session/cookie

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!isAdmin) redirect("/");

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <aside className="w-56 border-r border-default-200 bg-default-50/50 p-4 flex flex-col gap-2">
        <NextLink
          href="/admin"
          className="font-semibold text-primary mb-2"
        >
          {siteConfig.name} — Admin
        </NextLink>
        {siteConfig.adminNavItems.map((item) => (
          <NextLink
            key={item.href}
            href={item.href}
            className="text-default-700 hover:text-primary hover:bg-default-100 rounded-lg px-3 py-2 text-sm"
          >
            {item.label}
          </NextLink>
        ))}
        <NextLink
          href="/"
          className="text-default-500 text-sm mt-auto pt-4"
        >
          ← Về trang chủ
        </NextLink>
      </aside>
      <main className="flex-1 p-6 overflow-auto">{children}</main>
    </div>
  );
}
