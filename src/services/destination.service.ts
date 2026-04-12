import type { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import {
  CreateDestinationInput,
  UpdateDestinationInput,
  Destination,
  Region,
} from "@/types";

function normalizeDestinationImages(
  imageUrls?: string[] | null,
  imageUrl?: string | null,
): { imageUrls: string[]; imageUrl: string | null } {
  const urls = (imageUrls ?? []).filter(Boolean);
  const cover = imageUrl || urls[0] || null;

  return {
    imageUrls: urls.length > 0 ? urls : cover ? [cover] : [],
    imageUrl: cover,
  };
}

export class DestinationService {
  /**
   * Get all destinations with their regions
   */
  static async getAll(): Promise<Destination[]> {
    return (await prisma.destination.findMany({
      include: {
        region: true,
      },
      orderBy: {
        sortOrder: "asc",
      },
    })) as Destination[];
  }

  /**
   * Get paginated destinations
   */
  static async getPaginated(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [total, data] = await Promise.all([
      prisma.destination.count(),
      prisma.destination.findMany({
        skip,
        take: limit,
        include: {
          region: true,
        },
        orderBy: {
          sortOrder: "asc",
        },
      }),
    ]);

    return {
      data: data as Destination[],
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get all regions
   */
  static async getRegions(): Promise<Region[]> {
    return (await prisma.region.findMany({
      orderBy: {
        sortOrder: "asc",
      },
    })) as Region[];
  }

  /** Điểm đến nổi bật cho navbar megamenu (cột Điểm đến). */
  static async getFeaturedForNav(limit = 5): Promise<Destination[]> {
    const featured = await prisma.destination.findMany({
      where: { isFeatured: true },
      take: limit,
      include: { region: true },
      orderBy: { sortOrder: "asc" },
    });

    if (featured.length >= limit) {
      return featured as Destination[];
    }

    const featuredIds = featured.map((d) => d.id);
    const rest = await prisma.destination.findMany({
      where:
        featuredIds.length > 0 ? { id: { notIn: featuredIds } } : undefined,
      take: limit - featured.length,
      include: { region: true },
      orderBy: { sortOrder: "asc" },
    });

    return [...featured, ...rest] as Destination[];
  }

  /**
   * Create a new destination
   */
  static async create(data: CreateDestinationInput): Promise<Destination> {
    const images = normalizeDestinationImages(data.imageUrls, data.imageUrl);

    return (await prisma.destination.create({
      data: {
        regionId: data.regionId,
        slug: data.slug,
        nameVi: data.nameVi,
        nameEn: data.nameEn,
        description: data.description,
        imageUrl: images.imageUrl,
        imageUrls: images.imageUrls,
        latitude: data.latitude,
        longitude: data.longitude,
        isFeatured: data.isFeatured ?? false,
        sortOrder: data.sortOrder || 0,
      },
      include: { region: true },
    })) as Destination;
  }

  /**
   * Update a destination
   */
  static async update(
    id: string,
    data: UpdateDestinationInput,
  ): Promise<Destination> {
    const images =
      data.imageUrls !== undefined || data.imageUrl !== undefined
        ? normalizeDestinationImages(data.imageUrls, data.imageUrl)
        : null;

    const updateData: Prisma.DestinationUpdateInput = {};

    if (data.slug !== undefined) updateData.slug = data.slug;
    if (data.nameVi !== undefined) updateData.nameVi = data.nameVi;
    if (data.nameEn !== undefined) updateData.nameEn = data.nameEn;
    if (data.description !== undefined)
      updateData.description = data.description;
    if (data.sortOrder !== undefined) updateData.sortOrder = data.sortOrder;
    if (data.latitude !== undefined) updateData.latitude = data.latitude;
    if (data.longitude !== undefined) updateData.longitude = data.longitude;
    if (data.isFeatured !== undefined) updateData.isFeatured = data.isFeatured;
    if (images) {
      updateData.imageUrl = images.imageUrl;
      updateData.imageUrls = images.imageUrls;
    }
    if (data.regionId !== undefined) {
      updateData.region = { connect: { id: data.regionId } };
    }

    return (await prisma.destination.update({
      where: { id },
      data: updateData,
      include: { region: true },
    })) as Destination;
  }

  static async getById(id: string): Promise<Destination | null> {
    return (await prisma.destination.findUnique({
      where: { id },
    })) as Destination | null;
  }

  /**
   * Chi tiết điểm đến theo slug (trang /diem-den/[slug])
   */
  static async getBySlug(slug: string): Promise<Destination | null> {
    return (await prisma.destination.findUnique({
      where: { slug },
      include: { region: true },
    })) as Destination | null;
  }

  /**
   * Delete a destination
   */
  static async delete(id: string) {
    return await prisma.destination.delete({
      where: { id },
    });
  }

  /**
   * Get by IDs (for Homepage selection)
   */
  static async getByIds(ids: string[]) {
    return await prisma.destination.findMany({
      where: {
        id: { in: ids },
      },
      include: {
        region: true,
      },
    });
  }

  /**
   * Get destinations by region
   */
  static async getByRegionId(regionId: string): Promise<Destination[]> {
    return (await prisma.destination.findMany({
      where: { regionId },
      include: {
        region: true,
      },
      orderBy: {
        sortOrder: "asc",
      },
    })) as Destination[];
  }

  /** Lọc điểm đến theo slug vùng (navbar / trang /diem-den). */
  static async getByRegionSlug(regionSlug?: string): Promise<Destination[]> {
    if (!regionSlug) {
      return this.getAll();
    }

    const region = await prisma.region.findUnique({
      where: { slug: regionSlug },
    });

    if (!region) return [];

    return this.getByRegionId(region.id);
  }
}
