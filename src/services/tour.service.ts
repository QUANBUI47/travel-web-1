import type {
  Tour as PrismaTour,
  TourDeparture as PrismaTourDeparture,
} from "@prisma/client";

import { prisma } from "@/lib/prisma";
import {
  TourInput,
  Tour,
  TourDeparture,
  TourItinerary,
  Destination,
} from "@/types";

type TourDbRecord = PrismaTour & {
  destination?: Destination | null;
  itineraries?: TourItinerary[];
  departures?: PrismaTourDeparture[];
};

export class TourService {
  /**
   * Chuyển đổi dữ liệu từ Prisma (Decimal) sang Plain Object (Number)
   */
  private static mapTour(tour: TourDbRecord): Tour {
    return {
      ...tour,
      destination: tour.destination ?? undefined,
      priceFrom: tour.priceFrom ? Number(tour.priceFrom) : 0,
      oldPrice: tour.oldPrice ? Number(tour.oldPrice) : null,
      imageUrls: tour.imageUrls || [],
      tags: tour.tags || [],
      inclusions: (tour.inclusions as string) || "",
      exclusions: (tour.exclusions as string) || "",
      policy: (tour.policy as string) || "",
      departures: (tour.departures || []).map(
        (d): TourDeparture => ({
          ...d,
          priceOverride: d.priceOverride ? Number(d.priceOverride) : null,
        }),
      ),
    };
  }

  static async getByIdWithItineraries(id: string): Promise<Tour | null> {
    const tour = await prisma.tour.findUnique({
      where: { id },
      include: {
        destination: {
          include: { region: true },
        },
        itineraries: {
          orderBy: { dayNumber: "asc" },
        },
        departures: {
          orderBy: { startDate: "asc" },
        },
      },
    });

    return tour ? this.mapTour(tour) : null;
  }

  static async getById(id: string): Promise<Tour | null> {
    const tour = await prisma.tour.findUnique({
      where: { id },
      include: {
        destination: {
          include: { region: true },
        },
      },
    });

    return tour ? this.mapTour(tour) : null;
  }

  static async getBySlug(slug: string): Promise<Tour | null> {
    const tour = await prisma.tour.findUnique({
      where: { slug },
      include: {
        destination: {
          include: { region: true },
        },
      },
    });

    return tour ? this.mapTour(tour) : null;
  }

  static async replaceItineraries(
    tourId: string,
    itineraries: Array<{
      dayNumber: number;
      title: string;
      description?: string | null;
    }>,
  ) {
    const normalized = itineraries.map((it) => ({
      tourId,
      dayNumber: it.dayNumber,
      title: it.title,
      description: it.description || null,
      sortOrder: it.dayNumber,
    }));

    return await prisma.$transaction(async (tx) => {
      await tx.tour.update({
        where: { id: tourId },
        data: { durationDays: itineraries.length },
      });

      await tx.tourItinerary.deleteMany({
        where: { tourId },
      });

      if (normalized.length > 0) {
        await tx.tourItinerary.createMany({
          data: normalized,
        });
      }
    });
  }

  /**
   * Cập nhật danh sách ngày khởi hành
   */
  static async replaceDepartures(
    tourId: string,
    departures: Array<{
      startDate: Date;
      endDate?: Date | null;
      priceOverride?: number | null;
      maxParticipants?: number | null;
      notes?: string | null;
    }>,
  ) {
    return await prisma.$transaction(async (tx) => {
      // Xóa cũ
      await tx.tourDeparture.deleteMany({
        where: { tourId },
      });

      // Tạo mới
      if (departures.length > 0) {
        await tx.tourDeparture.createMany({
          data: departures.map((d) => ({
            ...d,
            tourId,
            status: "AVAILABLE",
          })),
        });
      }
    });
  }

  /**
   * Danh sách tour công khai — lọc theo điểm đến, từ khóa, ngày khởi hành.
   */
  static async searchListings(filters: {
    destinationSlug?: string;
    q?: string;
    from?: string;
    to?: string;
    type?: string;
  }) {
    const { destinationSlug, q, from, to, type } = filters;

    const departureDateFilter =
      from || to
        ? {
            some: {
              status: "AVAILABLE" as const,
              startDate: {
                ...(from ? { gte: new Date(from) } : {}),
                ...(to ? { lte: new Date(to) } : {}),
              },
            },
          }
        : undefined;

    const tours = await prisma.tour.findMany({
      where: {
        isActive: true,
        ...(destinationSlug ? { destination: { slug: destinationSlug } } : {}),
        ...(type
          ? {
              OR: [
                { tourType: { contains: type, mode: "insensitive" as const } },
                { tags: { has: type } },
              ],
            }
          : {}),
        ...(q
          ? {
              OR: [
                { nameVi: { contains: q, mode: "insensitive" as const } },
                { nameEn: { contains: q, mode: "insensitive" as const } },
                {
                  destination: {
                    nameVi: { contains: q, mode: "insensitive" as const },
                  },
                },
                {
                  destination: {
                    nameEn: { contains: q, mode: "insensitive" as const },
                  },
                },
              ],
            }
          : {}),
        ...(departureDateFilter ? { departures: departureDateFilter } : {}),
      },
      include: {
        destination: {
          include: { region: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return tours.map((t) => this.mapTour(t));
  }

  /**
   * Get all tours with their destinations
   */
  static async getAll() {
    const tours = await prisma.tour.findMany({
      include: {
        destination: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return tours.map((t) => this.mapTour(t));
  }

  /**
   * Get paginated tours with search
   */
  static async getPaginated(
    page: number = 1,
    limit: number = 10,
    search?: string,
  ) {
    const skip = (page - 1) * limit;

    const where = search
      ? {
          OR: [
            { nameVi: { contains: search, mode: "insensitive" as const } },
            { nameEn: { contains: search, mode: "insensitive" as const } },
            {
              destination: {
                nameVi: { contains: search, mode: "insensitive" as const },
              },
            },
          ],
        }
      : {};

    const [total, data] = await Promise.all([
      prisma.tour.count({ where }),
      prisma.tour.findMany({
        where,
        skip,
        take: limit,
        include: {
          destination: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
    ]);

    return {
      data: data.map((t) => this.mapTour(t)),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Create a new tour
   */
  static async create(data: TourInput) {
    const tour = await prisma.tour.create({
      data,
      include: {
        destination: true,
      },
    });

    return this.mapTour(tour);
  }

  /**
   * Update a tour
   */
  static async update(id: string, data: Partial<TourInput>) {
    const tour = await prisma.tour.update({
      where: { id },
      data,
      include: {
        destination: true,
      },
    });

    return this.mapTour(tour);
  }

  /**
   * Delete a tour
   */
  static async delete(id: string) {
    return await prisma.tour.delete({
      where: { id },
    });
  }
  /**
   * Lấy danh sách tour nổi bật cho trang chủ
   */
  static async getFeatured(limit: number = 6): Promise<Tour[]> {
    const tours = await prisma.tour.findMany({
      take: limit,
      include: {
        destination: true,
      },
      orderBy: {
        createdAt: "desc", // Có thể thay bằng rating nếu có
      },
    });

    return tours.map((t) => this.mapTour(t));
  }
}
