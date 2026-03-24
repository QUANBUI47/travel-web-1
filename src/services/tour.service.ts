import { prisma } from "@/lib/prisma";

export class TourService {
  /**
   * Get all tours with their destinations
   */
  static async getAll() {
    return await prisma.tour.findMany({
      include: {
        destination: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  /**
   * Delete a tour
   */
  static async delete(id: string) {
    return await prisma.tour.delete({
      where: { id },
    });
  }
}
