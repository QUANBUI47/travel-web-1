import { prisma } from "@/lib/prisma";
import { HomeBuilder } from "@/components/admin/builder/home-builder";

export default async function HomepageSettingsPage() {
  const homeSetting = await prisma.homeSetting.findUnique({
    where: { id: "default" },
  });
  
  const initialData = homeSetting?.content ? (homeSetting.content as any) : {};

  return (
    <div className="h-full w-full animate-in fade-in duration-700">
      <HomeBuilder initialData={initialData} />
    </div>
  );
}
