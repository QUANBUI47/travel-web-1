import { MetadataRoute } from "next";
// TODO: Lấy destinations, hotels, tours từ Prisma để sinh URL động
// import { prisma } from "@/lib/prisma";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${baseUrl}/diem-den`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/khach-san`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/tour`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/lien-he`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
  ];

  // Khi đã kết nối DB, bổ sung:
  // const destinations = await prisma.destination.findMany({ select: { slug: true, updatedAt: true } });
  // const destUrls = destinations.map(d => ({ url: `${baseUrl}/diem-den/${d.slug}`, lastModified: d.updatedAt, changeFrequency: 'weekly' as const, priority: 0.8 }));
  // return [...staticRoutes, ...destUrls, ...];

  return staticRoutes;
}
