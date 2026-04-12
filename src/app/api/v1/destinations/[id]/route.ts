import { NextResponse } from "next/server";

import { DestinationService } from "@/services/destination.service";
import { requireAdmin } from "@/lib/auth-guard";
import { getValidationSchemas } from "@/lib/validations/get-schemas";
import { getApiMessages } from "@/lib/i18n/api";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const destination = await DestinationService.getByIds([id]);

    if (destination.length === 0)
      return NextResponse.json(
        {
          success: false,
          message: (await getApiMessages())("VIVU_API_ERROR_404"),
        },
        { status: 404 },
      );

    return NextResponse.json({ success: true, data: destination[0] });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown server error";

    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAdmin();

    const { id } = await params;
    const body = await req.json();

    // 2. Validation với Zod
    const { DestinationSchema } = await getValidationSchemas();
    const validation = DestinationSchema.partial().safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          message:
            validation.error.issues[0]?.message ??
            (await getApiMessages())("VIVU_API_ERROR_400"),
          errors: validation.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const destination = await DestinationService.update(id, validation.data);

    return NextResponse.json({ success: true, data: destination });
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

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    // 1. Kiểm tra quyền Admin
    await requireAdmin();

    const { id } = await params;

    await DestinationService.delete(id);

    // Trả về 200 OK hoặc 204 No Content cho DELETE
    const t = await getApiMessages();

    return NextResponse.json({ success: true, message: t("DELETE_SUCCESS") });
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
