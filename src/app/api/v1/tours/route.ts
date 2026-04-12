import { NextResponse } from "next/server";

import { TourService } from "@/services/tour.service";
import { getValidationSchemas } from "@/lib/validations/get-schemas";
import { requireAdmin } from "@/lib/auth-guard";
import { ActivityService } from "@/services/activity.service";
import { getApiMessages } from "@/lib/i18n/api";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "0");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("q") || "";

    if (page > 0) {
      const result = await TourService.getPaginated(page, limit, search);

      return NextResponse.json({ success: true, ...result });
    }

    const tours = await TourService.getAll();

    return NextResponse.json({ success: true, data: tours });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);

    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const t = await getApiMessages();

  try {
    const user = await requireAdmin();
    const body = await req.json();
    const { TourSchema } = await getValidationSchemas();
    const validatedData = TourSchema.parse(body);
    const tour = await TourService.create(validatedData);

    await ActivityService.log({
      userId: user.id,
      action: "CREATE_TOUR",
      entity: "Tour",
      entityId: tour.id,
      details: { name: tour.nameVi },
    });

    return NextResponse.json({
      success: true,
      data: tour,
      message: t("TOUR_CREATE_SUCCESS"),
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
