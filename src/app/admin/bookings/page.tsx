import { Card, CardBody } from "@heroui/card";
import { getTranslations } from "next-intl/server";

import { BookingTable } from "@/components/admin/bookings/booking-table";
import { BookingService } from "@/services/booking.service";

export default async function AdminBookingsPage() {
  const t = await getTranslations("Admin.Bookings");
  const bookings = await BookingService.getAll();

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-extrabold tracking-tight text-default-900">
          {t("title")}
        </h1>
        <p className="text-default-500">{t("subtitle")}</p>
      </div>

      <Card className="border-none shadow-sm">
        <CardBody className="p-0">
          <BookingTable bookings={bookings} />
        </CardBody>
      </Card>
    </div>
  );
}
