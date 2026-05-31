import type { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import {
  CreateDestinationInput,
  UpdateDestinationInput,
  Destination,
  Region,
} from "@/types";

/**
 * DestinationService
 * -----------------------------------------------------------------
 * Convention naming:
 *   - Methods KHÔNG có suffix `ForAdmin` đều là **public**: lọc
 *     `isActive: true`, dùng cho website hiển thị cho khách.
 *   - Methods có suffix `ForAdmin` là **admin/CMS**: thấy toàn bộ
 *     destinations bất kể `isActive`.
 *
 * Khi destination.isActive = false:
 *   - Public queries (homepage, /diem-den, navbar, sitemap) ẩn nó.
 *   - Tour/Hotel thuộc destination cũng bị **cascade hide** ở
 *     TourService.searchListings/getFeatured/getBySlug/getById.
 * -----------------------------------------------------------------
 */

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
  // ===================================================================
  // PUBLIC METHODS — chỉ trả destinations active
  // ===================================================================

  /** Public: list toàn bộ điểm đến đang active (cho homepage / tours filter). */
  static async getAll(): Promise<Destination[]> {
    return (await prisma.destination.findMany({
      where: { isActive: true },
      include: { region: true },
      orderBy: { sortOrder: "asc" },
    })) as Destination[];
  }

  /** Public: paginated cho REST API công khai. */
  static async getPaginated(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const where: Prisma.DestinationWhereInput = { isActive: true };

    const [total, data] = await Promise.all([
      prisma.destination.count({ where }),
      prisma.destination.findMany({
        where,
        skip,
        take: limit,
        include: { region: true },
        orderBy: { sortOrder: "asc" },
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

  /** Public: chi tiết theo slug (trang /diem-den/[slug]). Trả null nếu inactive. */
  static async getBySlug(slug: string): Promise<Destination | null> {
    return (await prisma.destination.findFirst({
      where: { slug, isActive: true },
      include: { region: true },
    })) as Destination | null;
  }

  /** Public: lọc destinations theo region slug (navbar / trang /diem-den). */
  static async getByRegionSlug(regionSlug?: string): Promise<Destination[]> {
    if (!regionSlug) {
      return this.getAll();
    }

    const region = await prisma.region.findUnique({
      where: { slug: regionSlug },
    });

    if (!region) return [];

    return (await prisma.destination.findMany({
      where: { regionId: region.id, isActive: true },
      include: { region: true },
      orderBy: { sortOrder: "asc" },
    })) as Destination[];
  }

  /** Public: lọc destinations theo region id (REST API công khai). */
  static async getByRegionId(regionId: string): Promise<Destination[]> {
    return (await prisma.destination.findMany({
      where: { regionId, isActive: true },
      include: { region: true },
      orderBy: { sortOrder: "asc" },
    })) as Destination[];
  }

  /** Public: điểm đến nổi bật cho navbar megamenu (cột Điểm đến). */
  static async getFeaturedForNav(limit = 5): Promise<Destination[]> {
    const featured = await prisma.destination.findMany({
      where: { isFeatured: true, isActive: true },
      take: limit,
      include: { region: true },
      orderBy: { sortOrder: "asc" },
    });

    if (featured.length >= limit) {
      return featured as Destination[];
    }

    const featuredIds = featured.map((d) => d.id);
    const rest = await prisma.destination.findMany({
      where: {
        isActive: true,
        ...(featuredIds.length > 0 ? { id: { notIn: featuredIds } } : {}),
      },
      take: limit - featured.length,
      include: { region: true },
      orderBy: { sortOrder: "asc" },
    });

    return [...featured, ...rest] as Destination[];
  }

  // ===================================================================
  // ADMIN METHODS — thấy toàn bộ records (active + inactive)
  // ===================================================================

  /** Admin: list toàn bộ destinations. */
  static async getAllForAdmin(): Promise<Destination[]> {
    return (await prisma.destination.findMany({
      include: { region: true },
      orderBy: { sortOrder: "asc" },
    })) as Destination[];
  }

  /** Admin: paginated cho trang quản trị. */
  static async getPaginatedForAdmin(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [total, data] = await Promise.all([
      prisma.destination.count(),
      prisma.destination.findMany({
        skip,
        take: limit,
        include: { region: true },
        orderBy: { sortOrder: "asc" },
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

  /** Admin: chi tiết theo slug (không lọc isActive). */
  static async getBySlugForAdmin(slug: string): Promise<Destination | null> {
    return (await prisma.destination.findUnique({
      where: { slug },
      include: { region: true },
    })) as Destination | null;
  }

  /** Admin: list regions (không cần filter active vì Region chưa có cờ). */
  static async getRegions(): Promise<Region[]> {
    return (await prisma.region.findMany({
      orderBy: { sortOrder: "asc" },
    })) as Region[];
  }

  /** Admin: get by id (dùng trong update/delete flow nên phải thấy cả inactive). */
  static async getById(id: string): Promise<Destination | null> {
    return (await prisma.destination.findUnique({
      where: { id },
    })) as Destination | null;
  }

  /** Admin/CMS: get by IDs (dùng cho "Homepage selection" — cần thấy cả inactive). */
  static async getByIds(ids: string[]) {
    return await prisma.destination.findMany({
      where: { id: { in: ids } },
      include: { region: true },
    });
  }

  // ===================================================================
  // MUTATIONS — chỉ admin gọi
  // ===================================================================

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
        isActive: data.isActive ?? true,
        sortOrder: data.sortOrder || 0,
      },
      include: { region: true },
    })) as Destination;
  }

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
    if (data.isActive !== undefined) updateData.isActive = data.isActive;
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

  static async delete(id: string) {
    return await prisma.destination.delete({
      where: { id },
    });
  }
}
