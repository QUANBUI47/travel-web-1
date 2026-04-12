import type { Prisma } from "@prisma/client";

export type AdminBooking = Omit<
  Prisma.BookingGetPayload<{
    include: {
      profile: true;
      tourBooking: { include: { tour: true } };
    };
  }>,
  | "totalAmount"
  | "createdAt"
  | "updatedAt"
  | "checkIn"
  | "checkOut"
  | "tourStartDate"
> & {
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
  checkIn: string | null;
  checkOut: string | null;
  tourStartDate: string | null;
};
