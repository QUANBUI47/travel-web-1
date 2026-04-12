"use client";

import type { AdminBooking } from "@/types/booking";

import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/table";
import { User } from "@heroui/user";
import { Chip } from "@heroui/chip";
import { Button } from "@heroui/button";
import * as LucideIcons from "lucide-react";
import { useTranslations } from "next-intl";

const statusColorMap: Record<
  string,
  "warning" | "success" | "danger" | "default"
> = {
  PENDING: "warning",
  CONFIRMED: "success",
  CANCELLED: "danger",
  COMPLETED: "default",
};

interface BookingTableProps {
  bookings: AdminBooking[];
}

export function BookingTable({ bookings }: BookingTableProps) {
  const t = useTranslations("Admin.Bookings");

  return (
    <Table
      removeWrapper
      aria-label={t("table_label")}
      className="min-h-[400px]"
    >
      <TableHeader>
        <TableColumn className="bg-default-100/50">
          {t("col_customer")}
        </TableColumn>
        <TableColumn className="bg-default-100/50">{t("col_type")}</TableColumn>
        <TableColumn className="bg-default-100/50 text-center">
          {t("col_total")}
        </TableColumn>
        <TableColumn className="bg-default-100/50">{t("col_date")}</TableColumn>
        <TableColumn className="bg-default-100/50">
          {t("col_status")}
        </TableColumn>
        <TableColumn className="bg-default-100/50 text-right">
          {t("col_actions")}
        </TableColumn>
      </TableHeader>
      <TableBody emptyContent={t("empty")} items={bookings}>
        {(booking) => (
          <TableRow
            key={booking.id}
            className="hover:bg-default-50 transition-colors"
          >
            <TableCell>
              <User
                avatarProps={{
                  src:
                    booking.profile?.avatarUrl ||
                    `https://i.pravatar.cc/150?u=${booking.id}`,
                  size: "sm",
                  isBordered: true,
                  color: "primary",
                }}
                description={booking.guestEmail}
                name={booking.guestName}
              />
            </TableCell>
            <TableCell>
              <Chip
                className="font-bold text-[10px]"
                color={booking.bookingType === "TOUR" ? "secondary" : "primary"}
                size="sm"
                variant="flat"
              >
                {booking.bookingType}
              </Chip>
            </TableCell>
            <TableCell className="text-center">
              <span className="font-bold text-primary">
                ₫{booking.totalAmount.toLocaleString("vi-VN")}
              </span>
            </TableCell>
            <TableCell>
              <span className="text-xs text-default-500 italic">
                {new Date(booking.createdAt).toLocaleDateString("vi-VN")}
              </span>
            </TableCell>
            <TableCell>
              <Chip
                className="font-bold text-[10px] uppercase"
                color={statusColorMap[booking.status] || "default"}
                size="sm"
                variant="dot"
              >
                {booking.status}
              </Chip>
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                <Button isIconOnly color="primary" size="sm" variant="light">
                  <LucideIcons.Search size={16} />
                </Button>
                <Button isIconOnly color="success" size="sm" variant="light">
                  <LucideIcons.Check size={18} />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
