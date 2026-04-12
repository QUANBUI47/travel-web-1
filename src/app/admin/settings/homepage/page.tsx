import type { HomeSetting } from "@/types";

import { prisma } from "@/lib/prisma";
import { HomeBuilder } from "@/components/admin/builder/home-builder";

export default async function HomepageSettingsPage() {
  const homeSetting = await prisma.homeSetting.findUnique({
    where: { id: "default" },
  });

  const initialData: HomeSetting = homeSetting?.content
    ? (homeSetting.content as HomeSetting)
    : {};

  // Tải messages để truyền xuống cho vùng Preview trong HomeBuilder
  const viMessages = (await import("@/messages/vi.json")).default;
  const enMessages = (await import("@/messages/en.json")).default;
  const messages = { vi: viMessages, en: enMessages };

  return (
    <div className="h-full w-full animate-in fade-in duration-700">
      <HomeBuilder initialData={initialData} messages={messages} />
    </div>
  );
}
