import { prisma } from "@/lib/prisma";

export class DestinationService {
  /**
   * Get all destinations with their regions
   */
  static async getAll() {
    return await prisma.destination.findMany({
      include: {
        region: true,
      },
      orderBy: {
        sortOrder: 'asc',
      },
    });
  }

  /**
   * Get all regions
   */
  static async getRegions() {
    return await prisma.region.findMany({
      orderBy: {
        sortOrder: 'asc',
      },
    });
  }

  /**
   * Create a new destination
   */
  static async create(data: any) {
    return await prisma.destination.create({
      data: {
        regionId: data.regionId,
        slug: data.slug,
        nameVi: data.nameVi,
        nameEn: data.nameEn,
        description: data.description,
        imageUrl: data.imageUrl,
        latitude: data.latitude,
        longitude: data.longitude,
        sortOrder: data.sortOrder || 0,
      },
    });
  }

  /**
   * Update a destination
   */
  static async update(id: string, data: any) {
    return await prisma.destination.update({
      where: { id },
      data: {
        regionId: data.regionId,
        slug: data.slug,
        nameVi: data.nameVi,
        nameEn: data.nameEn,
        description: data.description,
        imageUrl: data.imageUrl,
        latitude: data.latitude,
        longitude: data.longitude,
        sortOrder: data.sortOrder,
      },
    });
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
}
