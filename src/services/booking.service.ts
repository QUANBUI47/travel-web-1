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

export interface CreateTourBookingInput {
  userId: string;
  tourId: string;
  departureId: string;
  participants: number;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  notes?: string | null;
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
      checkIn: booking.checkIn?.toISOString() || null,
      checkOut: booking.checkOut?.toISOString() || null,
      tourStartDate: booking.tourStartDate?.toISOString() || null,
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
        hotelBooking: {
          include: { room: { include: { hotel: true } } },
        },
        payments: true,
      },
    });

    return this.mapBooking(booking as BookingWithRelations | null);
  }

  /* ────────────────  Mutations  ──────────────── */

  /**
   * Tạo booking cho tour theo departure cụ thể.
   *
   * Concurrency strategy: **Pessimistic locking**.
   * `SELECT … FOR UPDATE` khóa row `tour_departures` ngay từ đầu transaction.
   * Mọi request đồng thời cố đặt cùng departure sẽ bị Postgres block và phải
   * đợi commit/rollback → loại bỏ Lost Update.
   *
   * Lớp bảo vệ song song ở DB:
   *  - CHECK `tour_departures_no_overbooking_check`
   *    (booked_count <= max_participants)
   *  - CHECK `tour_bookings_participants_positive_check` (participants > 0)
   *  - CHECK `bookings_type_dates_check` (polymorphism)
   *
   * @throws {BookingError} Khi violate business rule (tour/departure không
   *   tồn tại, hết slot, departure đã đóng…). Lỗi DB constraint sẽ bubble
   *   lên dạng `PrismaClientKnownRequestError`.
   */
  static async createTourBooking(input: CreateTourBookingInput) {
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

        if (input.participants > remaining) {
          throw new BookingError("VIVU_BOOKING_NOT_ENOUGH_SLOTS");
        }

        // 2. Load tour để derive unit price + xác nhận đang active.
        const tour = await tx.tour.findUnique({
          where: { id: input.tourId },
          select: { id: true, isActive: true, priceFrom: true },
        });

        if (!tour) {
          throw new BookingError("VIVU_BOOKING_TOUR_NOT_FOUND");
        }
        if (!tour.isActive) {
          throw new BookingError("VIVU_BOOKING_TOUR_INACTIVE");
        }

        // Departure có giá riêng thì ưu tiên, không thì lấy giá tour.
        const unitPriceDecimal = departure.price_override ?? tour.priceFrom;

        if (unitPriceDecimal === null) {
          throw new BookingError("VIVU_BOOKING_PRICE_MISSING");
        }

        // Decimal × int — vẫn ra Decimal, không mất precision tiền tệ.
        const totalAmount = unitPriceDecimal.mul(input.participants);

        // 3. Tạo Booking + nested TourBooking.
        const booking = await tx.booking.create({
          data: {
            userId: input.userId,
            bookingType: "TOUR",
            status: "PENDING",
            totalAmount,
            guestName: input.guestName,
            guestEmail: input.guestEmail,
            guestPhone: input.guestPhone,
            notes: input.notes ?? null,
            tourStartDate: departure.start_date,
            tourBooking: {
              create: {
                tourId: input.tourId,
                departureId: input.departureId,
                participants: input.participants,
                unitPrice: unitPriceDecimal,
              },
            },
          },
          include: {
            profile: true,
            tourBooking: { include: { tour: true } },
          },
        });

        // 4. Tăng bookedCount. Nếu đủ max → đóng departure để không ai đặt nữa.
        const newBookedCount = departure.booked_count + input.participants;
        const shouldClose =
          departure.max_participants !== null &&
          newBookedCount >= departure.max_participants;

        await tx.tourDeparture.update({
          where: { id: input.departureId },
          data: {
            bookedCount: { increment: input.participants },
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
        if (booking.bookingType !== "TOUR" || !booking.tourBooking) {
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

        if (departureId) {
          const departure = await lockDeparture(tx, departureId);
          const newBookedCount =
            departure.booked_count - booking.tourBooking.participants;

          await tx.tourDeparture.update({
            where: { id: departureId },
            data: {
              bookedCount: { decrement: booking.tourBooking.participants },
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
