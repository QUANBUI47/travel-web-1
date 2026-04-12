import { Card, CardBody, CardHeader } from "@heroui/card";
import { Image as HeroUI_Image } from "@heroui/image";
import { Divider } from "@heroui/divider";
import * as LucideIcons from "lucide-react";
import clsx from "clsx";
import { getTranslations } from "next-intl/server";

import { prisma } from "@/lib/prisma";
import { getLucideIcon } from "@/lib/utils/lucide-icon";

interface StatCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: keyof typeof LucideIcons;
  color: "primary" | "success" | "warning" | "danger" | "secondary";
}

function StatCard({ title, value, description, icon, color }: StatCardProps) {
  // Lấy icon an toàn hơn
  const IconComponent = getLucideIcon(icon);

  const colorMap = {
    primary: "bg-primary/10 text-primary shadow-primary/10",
    success: "bg-success/10 text-success shadow-success/10",
    warning: "bg-warning/10 text-warning shadow-warning/10",
    danger: "bg-danger/10 text-danger shadow-danger/10",
    secondary: "bg-secondary/10 text-secondary shadow-secondary/10",
  };

  return (
    <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
      <CardBody className="p-5 flex flex-row items-center gap-4">
        <div className={clsx("p-3 rounded-2xl shadow-inner", colorMap[color])}>
          <IconComponent size={24} />
        </div>
        <div className="flex flex-col">
          <p className="text-default-500 text-xs font-medium uppercase tracking-wider">
            {title}
          </p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-bold text-default-900">{value}</h3>
          </div>
          <p className="text-default-400 text-[10px] mt-1 italic">
            {description}
          </p>
        </div>
      </CardBody>
    </Card>
  );
}

export default async function AdminDashboardPage() {
  const t = await getTranslations("Admin.Dashboard");

  const ACTION_LABELS: Record<string, { text: string; color: string }> = {
    CREATE_TOUR: { text: t("action_create_tour"), color: "text-success" },
    UPDATE_TOUR: { text: t("action_update_tour"), color: "text-primary" },
    DELETE_TOUR: { text: t("action_delete_tour"), color: "text-danger" },
    CREATE_DESTINATION: {
      text: t("action_create_destination"),
      color: "text-success",
    },
    UPDATE_HOME_SETTING: {
      text: t("action_update_home"),
      color: "text-warning",
    },
    LOGIN: { text: t("action_login"), color: "text-default-400" },
  };

  const [
    bookingCount,
    tourCount,
    userCount,
    revenue,
    recentBookings,
    recentLogs,
  ] = await Promise.all([
    prisma.booking.count(),
    prisma.tour.count({ where: { isActive: true } }),
    prisma.profile.count({ where: { role: "USER" } }),
    prisma.payment.aggregate({
      _sum: { amount: true },
      where: { status: "SUCCESS" },
    }),
    prisma.booking.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        profile: true,
        tourBooking: { include: { tour: true } },
        hotelBooking: { include: { room: { include: { hotel: true } } } },
      },
    }),
    prisma.activityLog.findMany({
      take: 6,
      orderBy: { createdAt: "desc" },
      include: {
        profile: true,
      },
    }),
  ]);

  const totalRevenue = Number(revenue._sum.amount || 0).toLocaleString("vi-VN");

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-extrabold tracking-tight text-default-900">
          {t("title")}
        </h1>
        <p className="text-default-500">{t("welcome")}</p>
      </div>

      {/* Thẻ thống kê nhanh */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard
          color="primary"
          description={t("stat_bookings_desc")}
          icon="ShoppingBag"
          title={t("stat_bookings")}
          value={bookingCount}
        />
        <StatCard
          color="success"
          description={t("stat_tours_desc")}
          icon="Palmtree"
          title={t("stat_tours")}
          value={tourCount}
        />
        <StatCard
          color="warning"
          description={t("stat_customers_desc")}
          icon="Users"
          title={t("stat_customers")}
          value={userCount}
        />
        <StatCard
          color="secondary"
          description={t("stat_revenue_desc")}
          icon="Banknote"
          title={t("stat_revenue")}
          value={totalRevenue}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Danh sách đơn hàng gần đây */}
        <Card className="lg:col-span-2 border-none shadow-sm h-full flex flex-col overflow-hidden">
          <CardHeader className="flex flex-col items-start px-6 pt-6 pb-2">
            <h2 className="text-lg font-bold">{t("recent_orders")}</h2>
            <p className="text-default-400 text-xs">
              {t("recent_orders_sub", { count: recentBookings.length })}
            </p>
          </CardHeader>
          <CardBody className="px-6 pb-6 flex-1 flex flex-col justify-between">
            <div className="w-full overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="text-default-400 font-medium border-b border-default-100">
                    <th className="py-3 px-2">{t("col_customer")}</th>
                    <th className="py-3 px-2">{t("col_service")}</th>
                    <th className="py-3 px-2">{t("col_value")}</th>
                    <th className="py-3 px-2 text-right">{t("col_status")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-default-100">
                  {recentBookings.map((booking) => {
                    let service = t("other_service");

                    if (
                      booking.bookingType === "TOUR" &&
                      booking.tourBooking?.tour
                    ) {
                      service = booking.tourBooking.tour.nameVi;
                    } else if (
                      booking.bookingType === "HOTEL" &&
                      booking.hotelBooking?.room?.hotel
                    ) {
                      service = booking.hotelBooking.room.hotel.nameVi;
                    }

                    const statusMap: Record<
                      string,
                      { label: string; color: string }
                    > = {
                      COMPLETED: {
                        label: t("status_completed"),
                        color: "text-success",
                      },
                      PENDING: {
                        label: t("status_pending"),
                        color: "text-warning",
                      },
                      CONFIRMED: {
                        label: t("status_confirmed"),
                        color: "text-primary",
                      },
                      CANCELLED: {
                        label: t("status_cancelled"),
                        color: "text-danger",
                      },
                      PAID: {
                        label: t("status_paid"),
                        color: "text-success",
                      },
                    };

                    const status = statusMap[booking.status] || {
                      label: booking.status,
                      color: "text-default-500",
                    };

                    return (
                      <tr
                        key={booking.id}
                        className="hover:bg-default-50 transition-colors"
                      >
                        <td className="py-4 px-2 font-medium">
                          {booking.guestName ||
                            booking.profile?.displayName ||
                            t("guest")}
                        </td>
                        <td className="py-4 px-2 text-default-600">
                          <span className="line-clamp-1">{service}</span>
                        </td>
                        <td className="py-4 px-2 font-semibold">
                          ₫{Number(booking.totalAmount).toLocaleString("vi-VN")}
                        </td>
                        <td
                          className={clsx(
                            "py-4 px-2 text-right font-bold w-[120px]",
                            status.color,
                          )}
                        >
                          {status.label}
                        </td>
                      </tr>
                    );
                  })}
                  {recentBookings.length === 0 && (
                    <tr>
                      <td
                        className="text-center py-6 text-default-400 font-medium italic"
                        colSpan={4}
                      >
                        {t("no_recent_orders")}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="mt-auto">
              <Divider className="my-4" />
              <div className="flex justify-center">
                <button className="text-xs text-primary font-bold hover:underline">
                  {t("view_all_orders")}
                </button>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Luồng hoạt động hệ thống */}
        <Card className="border-none shadow-sm flex flex-col overflow-hidden">
          <CardHeader className="flex flex-col items-start px-6 pt-6 pb-2">
            <h2 className="text-lg font-bold">{t("activity_title")}</h2>
            <p className="text-default-400 text-xs">{t("activity_subtitle")}</p>
          </CardHeader>
          <CardBody className="px-6 pb-6">
            <div className="space-y-6">
              {recentLogs.map((log) => {
                const actionInfo = ACTION_LABELS[log.action] || {
                  text: log.action,
                  color: "text-default-500",
                };

                return (
                  <div key={log.id} className="flex gap-4 relative group">
                    <div className="relative z-10">
                      <div className="w-10 h-10 rounded-full bg-default-100 flex items-center justify-center border-2 border-white shadow-sm overflow-hidden text-default-400">
                        {log.profile?.avatarUrl ? (
                          <HeroUI_Image
                            removeWrapper
                            alt="Avatar"
                            className="w-full h-full object-cover"
                            src={log.profile.avatarUrl}
                          />
                        ) : (
                          <LucideIcons.User size={18} />
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2">
                        <p className="text-sm font-bold text-default-900 truncate">
                          {log.profile?.displayName || t("system_actor")}
                        </p>
                        <span className="text-[10px] text-default-400 whitespace-nowrap mt-0.5">
                          {new Date(log.createdAt).toLocaleTimeString("vi-VN", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      <p
                        className={clsx(
                          "text-xs font-semibold mt-0.5",
                          actionInfo.color,
                        )}
                      >
                        {actionInfo.text}
                      </p>
                      <p className="text-[10px] text-default-400 mt-1 line-clamp-1 italic">
                        {log.entity}: {log.entityId?.substring(0, 8) || "N/A"}
                        ...
                      </p>
                    </div>
                  </div>
                );
              })}
              {recentLogs.length === 0 && (
                <div className="text-center py-10 text-default-400 italic text-sm">
                  {t("no_activity")}
                </div>
              )}
            </div>

            <Divider className="my-6" />

            <Card className="border-none bg-default-50 shadow-inner">
              <CardBody className="p-4 flex flex-row items-center gap-3">
                <div className="p-2 bg-success/20 text-success rounded-lg">
                  <LucideIcons.ShieldCheck size={18} />
                </div>
                <div className="flex flex-col">
                  <p className="text-[10px] font-bold text-success uppercase tracking-wider">
                    {t("security_title")}
                  </p>
                  <p className="text-[10px] text-default-500">
                    {t("security_desc")}
                  </p>
                </div>
              </CardBody>
            </Card>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
