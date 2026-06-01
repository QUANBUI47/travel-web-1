import type {
  Prisma,
  Tour as PrismaTour,
  TourDeparture as PrismaTourDeparture,
  TourOption as PrismaTourOption,
} from "@prisma/client";

import { prisma } from "@/lib/prisma";
import {
  TourInput,
  Tour,
  TourDeparture,
  TourItinerary,
  TourOption,
  Destination,
} from "@/types";

type TourDbRecord = PrismaTour & {
  destination?: Destination | null;
  itineraries?: TourItinerary[];
  departures?: PrismaTourDeparture[];
  options?: PrismaTourOption[];
};

export class TourService {
  /**
   * Chuyển đổi dữ liệu Prisma (Decimal) sang Plain Object (Number) để serialize
   * qua RSC. Áp dụng Pricing Pattern C (ADR-002) từ Sprint 4.
   */
  private static mapTour(tour: TourDbRecord): Tour {
    const priceAdult = tour.priceAdult ? Number(tour.priceAdult) : 0;
    const priceChild = tour.priceChild ? Number(tour.priceChild) : 0;
    const priceInfant = tour.priceInfant ? Number(tour.priceInfant) : 0;

    return {
      ...tour,
      destination: tour.destination ?? undefined,
      priceAdult,
      priceChild,
      priceInfant,
      singleSupplementPrice: tour.singleSupplementPrice
        ? Number(tour.singleSupplementPrice)
        : null,
      estimatedCost: tour.estimatedCost ? Number(tour.estimatedCost) : null,
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
          actualCostPerPax: d.actualCostPerPax
            ? Number(d.actualCostPerPax)
            : null,
        }),
      ),
      options: (tour.options || []).map(
        (o): TourOption => ({
          id: o.id,
          tourId: o.tourId,
          nameVi: o.nameVi,
          nameEn: o.nameEn,
          description: o.description,
          surchargeAdult: Number(o.surchargeAdult ?? 0),
          surchargeChild: Number(o.surchargeChild ?? 0),
          sortOrder: o.sortOrder,
          isActive: o.isActive,
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
        options: {
          orderBy: { sortOrder: "asc" },
        },
      },
    });

    return tour ? this.mapTour(tour) : null;
  }

  /**
   * Thay thế nguyên danh sách `TourOption` của tour. Hoàn toàn xoá rồi tạo
   * mới (Editor admin gửi snapshot toàn bộ — đơn giản hơn diff). Cẩn thận:
   * nếu sau này TourOption đã có TourBooking ref, ON DELETE Restrict sẽ chặn
   * — sửa thành upsert + soft delete khi case đó xảy ra.
   */
  static async replaceOptions(
    tourId: string,
    options: Array<{
      nameVi: string;
      nameEn?: string | null;
      description?: string | null;
      surchargeAdult: number;
      surchargeChild: number;
      sortOrder?: number;
      isActive?: boolean;
    }>,
  ) {
    return await prisma.$transaction(async (tx) => {
      await tx.tourOption.deleteMany({ where: { tourId } });

      if (options.length > 0) {
        await tx.tourOption.createMany({
          data: options.map((o, idx) => ({
            tourId,
            nameVi: o.nameVi,
            nameEn: o.nameEn ?? null,
            description: o.description ?? null,
            surchargeAdult: o.surchargeAdult,
            surchargeChild: o.surchargeChild,
            sortOrder: o.sortOrder ?? idx,
            isActive: o.isActive ?? true,
          })),
        });
      }
    });
  }

  /**
   * Public: lấy tour theo id. Trả null nếu destination inactive (cascade hide).
   * Dùng cho UUID fallback ở `(main)/tours/[slug]/page.tsx`.
   */
  static async getById(id: string): Promise<Tour | null> {
    const tour = await prisma.tour.findFirst({
      where: { id, destination: { isActive: true } },
      include: {
        destination: {
          include: { region: true },
        },
      },
    });

    return tour ? this.mapTour(tour) : null;
  }

  /**
   * Public: lấy tour theo slug. Trả null nếu destination inactive (cascade hide).
   */
  static async getBySlug(slug: string): Promise<Tour | null> {
    const tour = await prisma.tour.findFirst({
      where: { slug, destination: { isActive: true } },
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
      hotelId?: string | null;
    }>,
  ) {
    const normalized = itineraries.map((it) => ({
      tourId,
      dayNumber: it.dayNumber,
      title: it.title,
      description: it.description || null,
      hotelId: it.hotelId || null,
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
   * Tham số `destination` nhận `slug` (khớp URL `?destination=ha-noi`).
   */
  static async searchListings(filters: {
    destination?: string;
    q?: string;
    from?: string;
    to?: string;
    type?: string;
  }) {
    const { destination, q, from, to, type } = filters;

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
        destination: {
          isActive: true,
          ...(destination ? { slug: destination } : {}),
        },
        // tourType giờ là enum (SERIES / PRIVATE / CORPORATE — ADR-006).
        // Filter chấp nhận chính xác enum value, tags fallback giữ tự do.
        ...(type
          ? {
              OR: [
                ...(["SERIES", "PRIVATE", "CORPORATE"].includes(
                  type.toUpperCase(),
                )
                  ? [
                      {
                        tourType: type.toUpperCase() as
                          | "SERIES"
                          | "PRIVATE"
                          | "CORPORATE",
                      },
                    ]
                  : []),
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
   * Public: get all tours (REST API công khai). Cascade hide khi
   * destination inactive.
   */
  static async getAll() {
    const tours = await prisma.tour.findMany({
      where: { destination: { isActive: true } },
      include: { destination: true },
      orderBy: { createdAt: "desc" },
    });

    return tours.map((t) => this.mapTour(t));
  }

  /**
   * Public: paginated cho REST API công khai. Cascade hide khi
   * destination inactive.
   */
  static async getPaginated(
    page: number = 1,
    limit: number = 10,
    search?: string,
  ) {
    const skip = (page - 1) * limit;

    const where: Prisma.TourWhereInput = {
      destination: { isActive: true },
      ...(search
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
        : {}),
    };

    const [total, data] = await Promise.all([
      prisma.tour.count({ where }),
      prisma.tour.findMany({
        where,
        skip,
        take: limit,
        include: { destination: true },
        orderBy: { createdAt: "desc" },
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
   * Admin: paginated cho trang quản trị. KHÔNG cascade hide — admin
   * cần thấy tour thuộc destination inactive để sửa/khôi phục.
   */
  static async getPaginatedForAdmin(
    page: number = 1,
    limit: number = 10,
    search?: string,
  ) {
    const skip = (page - 1) * limit;

    const where: Prisma.TourWhereInput = search
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
        include: { destination: true },
        orderBy: { createdAt: "desc" },
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
   * Normalize TourInput → Prisma payload. Prisma sinh ra type không chấp nhận
   * `destinationId: null` (vì có relation cùng tên) — convert sang `undefined`
   * khi user xoá liên kết. Cho phép Pricing Pattern C optional fields.
   */
  private static toPrismaInput(
    data: Partial<TourInput>,
  ): Prisma.TourUncheckedCreateInput | Prisma.TourUncheckedUpdateInput {
    const { destinationId, singleSupplementPrice, estimatedCost, ...rest } =
      data;

    return {
      ...rest,
      ...(destinationId !== undefined
        ? { destinationId: destinationId ?? undefined }
        : {}),
      ...(singleSupplementPrice !== undefined
        ? { singleSupplementPrice: singleSupplementPrice ?? null }
        : {}),
      ...(estimatedCost !== undefined
        ? { estimatedCost: estimatedCost ?? null }
        : {}),
    } as Prisma.TourUncheckedCreateInput;
  }

  /**
   * Create a new tour
   */
  static async create(data: TourInput) {
    const tour = await prisma.tour.create({
      data: this.toPrismaInput(data) as Prisma.TourUncheckedCreateInput,
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
      data: this.toPrismaInput(data),
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
   * Public: tour nổi bật cho trang chủ + navbar.
   * Cascade hide khi destination inactive.
   */
  static async getFeatured(limit: number = 6): Promise<Tour[]> {
    const tours = await prisma.tour.findMany({
      where: { destination: { isActive: true } },
      take: limit,
      include: { destination: true },
      orderBy: { createdAt: "desc" }, // Có thể thay bằng rating nếu có
    });

    return tours.map((t) => this.mapTour(t));
  }
}
