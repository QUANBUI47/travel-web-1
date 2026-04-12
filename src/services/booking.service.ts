import type { Prisma } from "@prisma/client";
import type { AdminBooking } from "@/types/booking";

import { prisma } from "@/lib/prisma";

type BookingWithRelations = Prisma.BookingGetPayload<{
  include: {
    profile: true;
    tourBooking: { include: { tour: true } };
  };
}>;

export class BookingService {
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
}
