"use server";

import { revalidatePath } from "next/cache";
import { ZodError } from "zod";

import { DestinationService } from "@/services/destination.service";
import { handleError } from "@/lib/utils/error";
import {
  CreateDestinationInput,
  UpdateDestinationInput,
  Destination,
  Region,
} from "@/types";
import { ROUTES, destinationDetailPath } from "@/constants";
import { serialize } from "@/lib/utils";
import { requireAdmin } from "@/lib/auth-guard";
import { revalidateNavCache } from "@/lib/cache/nav-cache";
import { getValidationSchemas } from "@/lib/validations/get-schemas";
import { zodFirstMessage } from "@/lib/i18n/zod-error";

export type DestinationMutationResult =
  | { success: true; data: Destination }
  | { success: false; error: string; message?: string };

export type DestinationDeleteResult =
  | { success: true }
  | { success: false; error: string; message?: string };

export type PaginatedDestinationsResponse =
  | {
      success: true;
      data: Destination[];
      meta: { total: number; page: number; limit: number; totalPages: number };
    }
  | { success: false; error: string; message?: string };

/**
 * Lấy danh sách điểm đến phân trang (chỉ admin)
 */
export async function getPaginatedDestinationsAction(
  page: number,
  limit: number,
): Promise<PaginatedDestinationsResponse> {
  try {
    await requireAdmin();
    const { listQuerySchema } = await getValidationSchemas();
    const { page: p, limit: l } = listQuerySchema.parse({ page, limit });

    const result = await DestinationService.getPaginated(p, l);

    return serialize({
      success: true,
      ...result,
    }) as PaginatedDestinationsResponse;
  } catch (error) {
    if (error instanceof ZodError) {
      return {
        success: false,
        error: "VALIDATION_ERROR",
        message: await zodFirstMessage(error, "invalid_params"),
      };
    }

    const errorRes = await handleError(
      error,
      "VIVU_ADMIN_ERROR_GET_DESTINATIONS",
    );

    return {
      success: false,
      error: errorRes.error || "Unknown error",
      message: errorRes.message,
    };
  }
}

/**
 * Lấy danh sách vùng miền (chỉ admin)
 */
export async function getRegionsAction(): Promise<
  | { success: true; data: Region[] }
  | { success: false; error: string; message?: string }
> {
  try {
    await requireAdmin();
    const regions = await DestinationService.getRegions();

    return serialize({ success: true, data: regions });
  } catch (error) {
    const errorRes = await handleError(error, "VIVU_ADMIN_ERROR_GET_REGIONS");

    return {
      success: false,
      error: errorRes.error || "Unknown error",
      message: errorRes.message,
    };
  }
}

/**
 * Tạo mới điểm đến
 */
export async function createDestinationAction(
  data: CreateDestinationInput,
): Promise<DestinationMutationResult> {
  try {
    await requireAdmin();
    const { DestinationSchema } = await getValidationSchemas();
    const validated = DestinationSchema.parse(data);
    const destination = await DestinationService.create(validated);

    revalidatePath(ROUTES.ADMIN.DESTINATIONS);
    revalidatePath(ROUTES.DESTINATIONS);
    revalidatePath(destinationDetailPath(destination.slug));
    revalidateNavCache();

    return serialize({
      success: true,
      data: destination,
    }) as DestinationMutationResult;
  } catch (error) {
    if (error instanceof ZodError) {
      return {
        success: false,
        error: "VALIDATION_ERROR",
        message: await zodFirstMessage(error, "invalid_destination_data"),
      };
    }

    return (await handleError(
      error,
      "VIVU_ADMIN_ERROR_CREATE_DESTINATION",
    )) as DestinationMutationResult;
  }
}

/**
 * Cập nhật điểm đến
 */
export async function updateDestinationAction(
  id: string,
  data: UpdateDestinationInput,
): Promise<DestinationMutationResult> {
  try {
    await requireAdmin();
    const { idSchema, DestinationSchema } = await getValidationSchemas();

    idSchema.parse(id);
    const validated = DestinationSchema.partial().parse(data);
    const existing = await DestinationService.getById(id);
    const destination = await DestinationService.update(id, validated);

    revalidatePath(ROUTES.ADMIN.DESTINATIONS);
    revalidatePath(ROUTES.DESTINATIONS);
    if (existing?.slug) {
      revalidatePath(destinationDetailPath(existing.slug));
    }
    if (destination.slug !== existing?.slug) {
      revalidatePath(destinationDetailPath(destination.slug));
    }
    revalidateNavCache();

    return serialize({
      success: true,
      data: destination,
    }) as DestinationMutationResult;
  } catch (error) {
    if (error instanceof ZodError) {
      return {
        success: false,
        error: "VALIDATION_ERROR",
        message: await zodFirstMessage(error, "invalid_destination_data"),
      };
    }

    return (await handleError(
      error,
      "VIVU_ADMIN_ERROR_UPDATE_DESTINATION",
    )) as DestinationMutationResult;
  }
}

/**
 * Xóa điểm đến
 */
export async function deleteDestinationAction(
  id: string,
): Promise<DestinationDeleteResult> {
  try {
    await requireAdmin();
    const { idSchema } = await getValidationSchemas();

    idSchema.parse(id);
    const existing = await DestinationService.getById(id);

    await DestinationService.delete(id);
    revalidatePath(ROUTES.ADMIN.DESTINATIONS);
    revalidatePath(ROUTES.DESTINATIONS);
    if (existing?.slug) {
      revalidatePath(destinationDetailPath(existing.slug));
    }
    revalidateNavCache();

    return { success: true };
  } catch (error) {
    if (error instanceof ZodError) {
      return {
        success: false,
        error: "VALIDATION_ERROR",
        message: await zodFirstMessage(error, "uuid_invalid"),
      };
    }

    return (await handleError(
      error,
      "VIVU_ADMIN_ERROR_DELETE_DESTINATION",
    )) as DestinationDeleteResult;
  }
}
