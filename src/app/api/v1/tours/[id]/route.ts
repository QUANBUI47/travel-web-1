import { NextResponse } from "next/server";

import { TourService } from "@/services/tour.service";
import { requireAdmin } from "@/lib/auth-guard";
import { getValidationSchemas } from "@/lib/validations/get-schemas";
import { ActivityService } from "@/services/activity.service";
import { getApiMessages } from "@/lib/i18n/api";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const t = await getApiMessages();

  try {
    const user = await requireAdmin();
    const { id } = await params;
    const body = await req.json();
    const { TourUpdateSchema } = await getValidationSchemas();
    const validatedData = TourUpdateSchema.parse(body);
    const tour = await TourService.update(id, validatedData);

    await ActivityService.log({
      userId: user.id,
      action: "UPDATE_TOUR",
      entity: "Tour",
      entityId: id,
      details: { name: tour.nameVi },
    });

    return NextResponse.json({
      success: true,
      data: tour,
      message: t("TOUR_UPDATE_SUCCESS"),
    });
  } catch (error: unknown) {
    const isZod =
      error !== null &&
      typeof error === "object" &&
      "name" in error &&
      error.name === "ZodError";
    const zodMsg =
      isZod &&
      "errors" in error &&
      Array.isArray((error as { errors: { message: string }[] }).errors)
        ? (error as { errors: { message: string }[] }).errors[0]?.message
        : undefined;
    const status = isZod ? 400 : 500;
    const message =
      zodMsg ?? (error instanceof Error ? error.message : String(error));

    return NextResponse.json({ success: false, message }, { status });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const t = await getApiMessages();

  try {
    const user = await requireAdmin();
    const { id } = await params;

    await TourService.delete(id);

    await ActivityService.log({
      userId: user.id,
      action: "DELETE_TOUR",
      entity: "Tour",
      entityId: id,
    });

    return NextResponse.json({
      success: true,
      message: t("DELETE_TOUR_SUCCESS"),
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    const status = message.includes("Unauthorized")
      ? 401
      : message.includes("Forbidden")
        ? 403
        : 500;

    return NextResponse.json({ success: false, message }, { status });
  }
}
