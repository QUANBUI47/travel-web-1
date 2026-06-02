import type { Prisma } from "@prisma/client";

/**
 * Đơn đặt chỗ cho trang Admin.
 *
 * Sau Sprint 4 (ADR-001): drop HotelBooking, drop bookingType/checkIn/
 * checkOut/tourStartDate trên Booking. Ngày bắt đầu tour giờ nằm ở
 * `tourBooking.departure.startDate`. Hệ thống chỉ bán Tour, nên type này
 * implicit bookingType = "TOUR".
 */
export type AdminBooking = Omit<
  Prisma.BookingGetPayload<{
    include: {
      profile: true;
      tourBooking: { include: { tour: true } };
    };
  }>,
  "totalAmount" | "createdAt" | "updatedAt" | "paymentDeadline"
> & {
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
  paymentDeadline: string | null;
};
