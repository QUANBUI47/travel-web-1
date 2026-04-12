import { NextResponse } from "next/server";

import { DestinationService } from "@/services/destination.service";
import { requireAdmin } from "@/lib/auth-guard";
import { getValidationSchemas } from "@/lib/validations/get-schemas";
import { getApiMessages } from "@/lib/i18n/api";
import { ActivityService } from "@/services/activity.service";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = Number.parseInt(searchParams.get("page") || "0", 10);
    const limit = Number.parseInt(searchParams.get("limit") || "10", 10);
    const regionId = searchParams.get("regionId");

    if (page > 0) {
      const result = await DestinationService.getPaginated(page, limit);

      return NextResponse.json({ success: true, ...result });
    }

    const destinations = regionId
      ? await DestinationService.getByRegionId(regionId)
      : await DestinationService.getAll();

    return NextResponse.json({ success: true, data: destinations });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown server error";

    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const tApi = await getApiMessages();

  try {
    const user = await requireAdmin();
    const body = await req.json();
    const { DestinationSchema } = await getValidationSchemas();
    const validation = DestinationSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          message:
            validation.error.issues[0]?.message ?? tApi("VIVU_API_ERROR_400"),
          errors: validation.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const destination = await DestinationService.create(validation.data);

    // 3. Ghi Log hệ thống
    await ActivityService.log({
      userId: user.id,
      action: "CREATE_DESTINATION",
      entity: "Destination",
      entityId: destination.id,
      details: { name: destination.nameVi },
    });

    return NextResponse.json(
      { success: true, data: destination },
      { status: 201 },
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown server error";
    const status = message.includes("Unauthorized")
      ? 401
      : message.includes("Forbidden")
        ? 403
        : 500;

    return NextResponse.json({ success: false, message }, { status });
  }
}
