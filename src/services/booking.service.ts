import type { Prisma } from "@prisma/client";
import type { AdminBooking } from "@/types/booking";

import { prisma } from "@/lib/prisma";

type BookingWithRelations = Prisma.BookingGetPayload<{
  include: {
    profile: true;
    tourBooking: { include: { tour: true } };
  };
}>;

/* -------------------------------------------------------------------------- */
/*  Domain errors                                                             */
/* -------------------------------------------------------------------------- */

/**
 * Domain error cho luồng booking. `message` phải là khóa i18n bắt đầu bằng
 * `VIVU_` để safe-action handler giữ nguyên thay vì che bằng generic 500.
 */
export class BookingError extends Error {
  constructor(messageKey: string) {
    super(messageKey);
    this.name = "BookingError";
  }
}

/* -------------------------------------------------------------------------- */
/*  Input types                                                               */
/* -------------------------------------------------------------------------- */

/**
 * Input cho `createTourBooking` (Sprint 4 — Pricing Pattern C, ADR-002).
 *
 * Khách phải có ít nhất 1 adult. children / infants mặc định 0. `optionId`
 * tham chiếu `TourOption` (gói nâng cấp, vd: VIP). `isSingleSupplement` chỉ
 * có hiệu lực khi adults = 1 và tour có `singleSupplementPrice`.
 */
export interface CreateTourBookingInput {
  userId: string;
  tourId: string;
  departureId: string;
  adults: number;
  children?: number;
  infants?: number;
  optionId?: string | null;
  isSingleSupplement?: boolean;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  notes?: string | null;
}

/**
 * JSON đặt vào `TourBooking.priceBreakdown` (ADR-002). Giúp re-derive tổng
 * tiền lúc render hóa đơn mà không cần fetch giá tour tại thời điểm sau.
 */
export interface PriceBreakdown {
  adults: { count: number; unitPrice: number; subtotal: number };
  children: { count: number; unitPrice: number; subtotal: number };
  infants: { count: number; unitPrice: number; subtotal: number };
  option: {
    id: string;
    nameVi: string;
    surchargeAdult: number;
    surchargeChild: number;
    subtotal: number;
  } | null;
  singleSupplement: number | null;
  total: number;
}

/* -------------------------------------------------------------------------- */
/*  Internal helpers                                                          */
/* -------------------------------------------------------------------------- */

/**
 * Lock 1 row `tour_departures` đến hết transaction (Postgres `SELECT … FOR
 * UPDATE`). Các transaction khác cố lock cùng row sẽ bị block cho đến khi
 * transaction hiện tại commit/rollback.
 */
async function lockDeparture(
  tx: Prisma.TransactionClient,
  departureId: string,
): Promise<{
  id: string;
  tour_id: string;
  start_date: Date;
  price_override: Prisma.Decimal | null;
  max_participants: number | null;
  booked_count: number;
  status: "AVAILABLE" | "FULL" | "CANCELLED";
}> {
  const rows = await tx.$queryRaw<
    Array<{
      id: string;
      tour_id: string;
      start_date: Date;
      price_override: Prisma.Decimal | null;
      max_participants: number | null;
      booked_count: number;
      status: "AVAILABLE" | "FULL" | "CANCELLED";
    }>
  >`
    SELECT id, tour_id, start_date, price_override, max_participants, booked_count, status
    FROM tour_departures
    WHERE id = ${departureId}
    FOR UPDATE
  `;

  const departure = rows[0];

  if (!departure) {
    throw new BookingError("VIVU_BOOKING_DEPARTURE_NOT_FOUND");
  }

  return departure;
}

/* -------------------------------------------------------------------------- */
/*  Service                                                                   */
/* -------------------------------------------------------------------------- */

export class BookingService {
  /* ────────────────  Read  ──────────────── */

  private static mapBooking(
    booking: BookingWithRelations | null,
  ): AdminBooking | null {
    if (!booking) return null;

    return {
      ...booking,
      totalAmount: Number(booking.totalAmount),
      createdAt: booking.createdAt.toISOString(),
      updatedAt: booking.updatedAt.toISOString(),
      paymentDeadline: booking.paymentDeadline?.toISOString() ?? null,
    };
  }

  static async getAll(limit: number = 15) {
    const bookings = await prisma.booking.findMany({
      include: {
        profile: true,
        tourBooking: {
          include: { tour: true },
        },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    return bookings
      .map((b) => this.mapBooking(b))
      .filter((b): b is AdminBooking => b !== null);
  }

  static async getById(id: string) {
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        profile: true,
        tourBooking: {
          include: { tour: true },
        },
        payments: true,
      },
    });

    return this.mapBooking(booking as BookingWithRelations | null);
  }

  /* ────────────────  Mutations  ──────────────── */

  /**
   * Tạo booking cho tour theo departure cụ thể (Pricing Pattern C, ADR-002).
   *
   * Concurrency strategy: **Pessimistic locking**.
   * `SELECT … FOR UPDATE` khóa row `tour_departures` ngay từ đầu transaction.
   * Mọi request đồng thời cố đặt cùng departure sẽ bị Postgres block và phải
   * đợi commit/rollback → loại bỏ Lost Update.
   *
   * Lớp bảo vệ song song ở DB:
   *  - CHECK `tour_departures_no_overbooking` (booked_count ≤ max_participants)
   *  - CHECK `tour_bookings_pax_non_negative` (adults ≥ 1, children/infants ≥ 0)
   *
   * Lưu ý: `bookedCount` ở `tour_departures` tính TOÀN BỘ pax (adults +
   * children + infants) — coi mỗi khách = 1 slot, kể cả em bé. Có thể đổi
   * policy sau (vd: infant không tính slot) nhưng giữ đơn giản trước.
   *
   * @throws {BookingError} Khi violate business rule (tour/departure không
   *   tồn tại, hết slot, departure đã đóng…).
   */
  static async createTourBooking(input: CreateTourBookingInput) {
    const adults = input.adults;
    const children = input.children ?? 0;
    const infants = input.infants ?? 0;
    const totalPax = adults + children + infants;

    if (adults < 1) {
      throw new BookingError("VIVU_BOOKING_AT_LEAST_ONE_ADULT");
    }
    if (children < 0 || infants < 0) {
      throw new BookingError("VIVU_BOOKING_PAX_NEGATIVE");
    }
    if (input.isSingleSupplement && adults !== 1) {
      throw new BookingError(
        "VIVU_BOOKING_SINGLE_SUPPLEMENT_REQUIRES_ONE_ADULT",
      );
    }

    return prisma.$transaction(
      async (tx) => {
        // 1. Lock departure — các transaction khác phải đợi tại đây.
        const departure = await lockDeparture(tx, input.departureId);

        if (departure.tour_id !== input.tourId) {
          throw new BookingError("VIVU_BOOKING_DEPARTURE_TOUR_MISMATCH");
        }

        if (departure.status !== "AVAILABLE") {
          throw new BookingError("VIVU_BOOKING_DEPARTURE_CLOSED");
        }

        const remaining =
          departure.max_participants === null
            ? Infinity
            : departure.max_participants - departure.booked_count;

        if (totalPax > remaining) {
          throw new BookingError("VIVU_BOOKING_NOT_ENOUGH_SLOTS");
        }

        // 2. Load tour + option để derive đơn giá Pattern C.
        const tour = await tx.tour.findUnique({
          where: { id: input.tourId },
          select: {
            id: true,
            isActive: true,
            priceAdult: true,
            priceChild: true,
            priceInfant: true,
            singleSupplementPrice: true,
            nameVi: true,
          },
        });

        if (!tour) {
          throw new BookingError("VIVU_BOOKING_TOUR_NOT_FOUND");
        }
        if (!tour.isActive) {
          throw new BookingError("VIVU_BOOKING_TOUR_INACTIVE");
        }

        const option = input.optionId
          ? await tx.tourOption.findUnique({
              where: { id: input.optionId },
              select: {
                id: true,
                tourId: true,
                isActive: true,
                nameVi: true,
                surchargeAdult: true,
                surchargeChild: true,
              },
            })
          : null;

        if (input.optionId) {
          if (!option || !option.isActive) {
            throw new BookingError("VIVU_BOOKING_OPTION_INVALID");
          }
          if (option.tourId !== input.tourId) {
            throw new BookingError("VIVU_BOOKING_OPTION_TOUR_MISMATCH");
          }
        }

        // Departure override luôn áp cho priceAdult (giá người lớn cơ bản).
        // Children / infant vẫn dùng giá tour-level vì hiếm khi tour override theo lứa tuổi.
        const effectiveAdult = departure.price_override ?? tour.priceAdult;
        const adultSubtotal = effectiveAdult.mul(adults);
        const childSubtotal = tour.priceChild.mul(children);
        const infantSubtotal = tour.priceInfant.mul(infants);

        const optionAdultSurcharge = option
          ? option.surchargeAdult.mul(adults)
          : null;
        const optionChildSurcharge = option
          ? option.surchargeChild.mul(children)
          : null;
        const optionSubtotal =
          optionAdultSurcharge && optionChildSurcharge
            ? optionAdultSurcharge.add(optionChildSurcharge)
            : null;

        const singleSupplement =
          input.isSingleSupplement && tour.singleSupplementPrice
            ? tour.singleSupplementPrice
            : null;

        let totalAmount = adultSubtotal.add(childSubtotal).add(infantSubtotal);

        if (optionSubtotal) totalAmount = totalAmount.add(optionSubtotal);
        if (singleSupplement) totalAmount = totalAmount.add(singleSupplement);

        // 3. priceBreakdown JSON để tái hiện hoá đơn về sau.
        const priceBreakdown: PriceBreakdown = {
          adults: {
            count: adults,
            unitPrice: Number(effectiveAdult),
            subtotal: Number(adultSubtotal),
          },
          children: {
            count: children,
            unitPrice: Number(tour.priceChild),
            subtotal: Number(childSubtotal),
          },
          infants: {
            count: infants,
            unitPrice: Number(tour.priceInfant),
            subtotal: Number(infantSubtotal),
          },
          option:
            option && optionSubtotal
              ? {
                  id: option.id,
                  nameVi: option.nameVi,
                  surchargeAdult: Number(option.surchargeAdult),
                  surchargeChild: Number(option.surchargeChild),
                  subtotal: Number(optionSubtotal),
                }
              : null,
          singleSupplement: singleSupplement ? Number(singleSupplement) : null,
          total: Number(totalAmount),
        };

        // 4. Tạo Booking + nested TourBooking (Pattern C fields).
        const booking = await tx.booking.create({
          data: {
            userId: input.userId,
            status: "PENDING",
            totalAmount,
            guestName: input.guestName,
            guestEmail: input.guestEmail,
            guestPhone: input.guestPhone,
            notes: input.notes ?? null,
            tourBooking: {
              create: {
                tourId: input.tourId,
                departureId: input.departureId,
                adults,
                children,
                infants,
                optionId: input.optionId ?? null,
                isSingleSupplement: input.isSingleSupplement ?? false,
                priceBreakdown:
                  priceBreakdown as unknown as Prisma.InputJsonValue,
              },
            },
          },
          include: {
            profile: true,
            tourBooking: { include: { tour: true } },
          },
        });

        // 5. Tăng bookedCount theo total pax. Nếu chạm max → đóng departure.
        const newBookedCount = departure.booked_count + totalPax;
        const shouldClose =
          departure.max_participants !== null &&
          newBookedCount >= departure.max_participants;

        await tx.tourDeparture.update({
          where: { id: input.departureId },
          data: {
            bookedCount: { increment: totalPax },
            ...(shouldClose ? { status: "FULL" } : {}),
          },
        });

        return this.mapBooking(booking);
      },
      {
        // Serializable cho thêm safety ở mức transaction; row lock đã đủ
        // nhưng level này giúp bắt cả phantom-read trên truy vấn phụ.
        isolationLevel: "Serializable",
        timeout: 10_000,
      },
    );
  }

  /**
   * Hủy booking và trả lại slot cho departure (nếu có).
   *
   * Cần lock departure trong cùng transaction để decrement an toàn — cùng
   * pattern với `createTourBooking`.
   */
  static async cancelTourBooking(bookingId: string) {
    return prisma.$transaction(
      async (tx) => {
        const booking = await tx.booking.findUnique({
          where: { id: bookingId },
          include: { tourBooking: true },
        });

        if (!booking) {
          throw new BookingError("VIVU_BOOKING_NOT_FOUND");
        }
        if (!booking.tourBooking) {
          throw new BookingError("VIVU_BOOKING_NOT_TOUR_TYPE");
        }

        const cancellableStatuses: (typeof booking.status)[] = [
          "PENDING",
          "PAID",
          "CONFIRMED",
        ];

        if (!cancellableStatuses.includes(booking.status)) {
          throw new BookingError("VIVU_BOOKING_NOT_CANCELLABLE");
        }

        const departureId = booking.tourBooking.departureId;
        const totalPax =
          booking.tourBooking.adults +
          booking.tourBooking.children +
          booking.tourBooking.infants;

        if (departureId) {
          const departure = await lockDeparture(tx, departureId);
          const newBookedCount = departure.booked_count - totalPax;

          await tx.tourDeparture.update({
            where: { id: departureId },
            data: {
              bookedCount: { decrement: totalPax },
              // Mở lại departure nếu trước đó FULL và giờ còn slot.
              ...(departure.status === "FULL" && newBookedCount >= 0
                ? { status: "AVAILABLE" }
                : {}),
            },
          });
        }

        const updated = await tx.booking.update({
          where: { id: bookingId },
          data: { status: "CANCELLED" },
          include: {
            profile: true,
            tourBooking: { include: { tour: true } },
          },
        });

        return this.mapBooking(updated);
      },
      {
        isolationLevel: "Serializable",
        timeout: 10_000,
      },
    );
  }
}
