import * as LucideIcons from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { SystemService } from "@/services/system.service";
import { cn } from "@/lib/utils";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = await getTranslations("Maintenance");
  // Sử dụng Service Layer thay vì query Prisma trực tiếp
  const isMaintenance = await SystemService.isMaintenanceMode();

  return (
    <div
      className={cn(
        "flex flex-col min-h-screen",
        isMaintenance
          ? "items-center justify-center bg-gray-50 text-center p-6"
          : "",
      )}
    >
      {isMaintenance ? (
        <>
          <LucideIcons.Settings className="w-24 h-24 text-primary animate-[spin_3s_linear_infinite] mb-6" />
          <h1 className="text-4xl font-black mb-4 text-slate-800">
            {t("title")}
          </h1>
          <p className="text-lg text-slate-500 max-w-lg">{t("description")}</p>
        </>
      ) : (
        <>
          <Navbar />
          <main className="flex-grow">{children}</main>
          <Footer />
        </>
      )}
    </div>
  );
}
