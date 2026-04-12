import { Card, CardBody } from "@heroui/card";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/table";
import { User } from "@heroui/user";
import { Button } from "@heroui/button";
import * as LucideIcons from "lucide-react";
import { getTranslations } from "next-intl/server";

import { prisma } from "@/lib/prisma";

export default async function AdminCustomersPage() {
  const t = await getTranslations("Admin.Customers");

  const customers = await prisma.profile.findMany({
    where: { role: "USER" },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

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
          <Table
            removeWrapper
            aria-label={t("table_label")}
            className="min-h-[400px]"
          >
            <TableHeader>
              <TableColumn className="bg-default-100/50 uppercase text-[10px]">
                {t("col_user")}
              </TableColumn>
              <TableColumn className="bg-default-100/50 uppercase text-[10px]">
                {t("col_email")}
              </TableColumn>
              <TableColumn className="bg-default-100/50 uppercase text-[10px]">
                {t("col_phone")}
              </TableColumn>
              <TableColumn className="bg-default-100/50 uppercase text-[10px]">
                {t("col_created")}
              </TableColumn>
              <TableColumn className="bg-default-100/50 uppercase text-[10px] text-right">
                {t("col_actions")}
              </TableColumn>
            </TableHeader>
            <TableBody emptyContent={t("empty")}>
              {customers.map((user) => (
                <TableRow
                  key={user.id}
                  className="hover:bg-default-50 transition-colors"
                >
                  <TableCell>
                    <User
                      avatarProps={{
                        src:
                          user.avatarUrl ||
                          `https://i.pravatar.cc/150?u=${user.id}`,
                        size: "sm",
                        isBordered: true,
                        color: "primary",
                      }}
                      description={user.role}
                      name={user.displayName || t("anonymous")}
                    />
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-default-600 font-mono">
                      {user.id.slice(0, 8)}…
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm font-medium">
                      {user.phone || "--"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-xs text-default-400">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        isIconOnly
                        color="primary"
                        size="sm"
                        variant="light"
                      >
                        <LucideIcons.Mail size={16} />
                      </Button>
                      <Button
                        isIconOnly
                        color="danger"
                        size="sm"
                        variant="light"
                      >
                        <LucideIcons.Ban size={16} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardBody>
      </Card>
    </div>
  );
}
