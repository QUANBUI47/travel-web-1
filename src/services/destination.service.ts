import { prisma } from "@/lib/prisma";
import { CreateDestinationInput, UpdateDestinationInput, Destination, Region } from "@/types";

export class DestinationService {
  /**
   * Get all destinations with their regions
   */
  static async getAll(): Promise<Destination[]> {
    return await prisma.destination.findMany({
      include: {
        region: true,
      },
      orderBy: {
        sortOrder: 'asc',
      },
    }) as Destination[];
  }

  /**
   * Get all regions
   */
  static async getRegions(): Promise<Region[]> {
    return await prisma.region.findMany({
      orderBy: {
        sortOrder: 'asc',
      },
    }) as Region[];
  }

  /**
   * Create a new destination
   */
  static async create(data: CreateDestinationInput): Promise<Destination> {
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
    }) as Destination;
  }

  /**
   * Update a destination
   */
  static async update(id: string, data: UpdateDestinationInput): Promise<Destination> {
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
    }) as Destination;
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
