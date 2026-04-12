import { MetadataRoute } from "next";

import { prisma } from "@/lib/prisma";
import { ROUTES } from "@/constants";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://vivuvietnam.vn";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [destinations, tours] = await Promise.all([
    prisma.destination.findMany({
      select: { slug: true, updatedAt: true },
      where: { slug: { not: "" } },
    }),
    prisma.tour.findMany({
      select: { slug: true, updatedAt: true },
      where: { slug: { not: "" } },
    }),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}${ROUTES.DESTINATIONS}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}${ROUTES.HOTELS}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}${ROUTES.TOURS}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}${ROUTES.CONTACT}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  const destinationRoutes: MetadataRoute.Sitemap = destinations.map((item) => ({
    url: `${baseUrl}${ROUTES.DESTINATIONS}/${item.slug}`,
    lastModified: item.updatedAt,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const tourRoutes: MetadataRoute.Sitemap = tours.map((item) => ({
    url: `${baseUrl}${ROUTES.TOURS}/${item.slug}`,
    lastModified: item.updatedAt,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...destinationRoutes, ...tourRoutes];
}
