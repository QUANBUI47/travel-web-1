"use server";

import { revalidatePath } from "next/cache";
import { ZodError } from "zod";

import { TourService } from "@/services/tour.service";
import { handleError } from "@/lib/utils/error";
import { Tour, TourInput } from "@/types";
import { ROUTES } from "@/constants";
import { getValidationSchemas } from "@/lib/validations/get-schemas";
import { zodFirstMessage } from "@/lib/i18n/zod-error";
import { serialize } from "@/lib/utils";
import { requireAdmin } from "@/lib/auth-guard";
import { revalidateNavCache } from "@/lib/cache/nav-cache";

export type PaginatedToursResponse =
  | {
      success: true;
      data: Tour[];
      meta: { total: number; page: number; limit: number; totalPages: number };
    }
  | { success: false; error: string; message?: string };

export async function getPaginatedToursAction(
  page: number,
  limit: number,
  search?: string,
): Promise<PaginatedToursResponse> {
  try {
    await requireAdmin();
    const { listQuerySchema } = await getValidationSchemas();
    const {
      page: p,
      limit: l,
      search: q,
    } = listQuerySchema.parse({
      page,
      limit,
      search,
    });

    const result = await TourService.getPaginatedForAdmin(p, l, q);

    return serialize({ success: true, ...result }) as PaginatedToursResponse;
  } catch (error) {
    if (error instanceof ZodError) {
      return {
        success: false,
        error: "VALIDATION_ERROR",
        message: await zodFirstMessage(error, "invalid_params"),
      };
    }

    const errorRes = await handleError(error, "VIVU_ADMIN_ERROR_GET_TOURS");

    return {
      success: false,
      error: errorRes.error || "Unknown error",
      message: errorRes.message,
    };
  }
}

export type TourActionResponse =
  | { success: true; data: Tour }
  | { success: false; error: string; message?: string };

export type TourVoidActionResponse =
  | { success: true }
  | { success: false; error: string; message?: string };

export async function createTourAction(
  data: TourInput,
): Promise<TourActionResponse> {
  try {
    await requireAdmin();
    const { TourSchema } = await getValidationSchemas();
    const validated = TourSchema.parse(data);
    const tour = await TourService.create(validated);

    revalidatePath(ROUTES.ADMIN.TOURS);
    revalidatePath(ROUTES.TOURS);
    revalidateNavCache();

    return serialize({ success: true, data: tour }) as TourActionResponse;
  } catch (error) {
    if (error instanceof ZodError) {
      return {
        success: false,
        error: "VALIDATION_ERROR",
        message: await zodFirstMessage(error, "invalid_tour_data"),
      };
    }

    return (await handleError(
      error,
      "VIVU_ADMIN_ERROR_CREATE_TOUR",
    )) as TourActionResponse;
  }
}

export async function updateTourAction(
  id: string,
  data: Partial<TourInput>,
): Promise<TourActionResponse> {
  try {
    await requireAdmin();
    const { tourIdSchema, TourUpdateSchema } = await getValidationSchemas();

    tourIdSchema.parse(id);
    const validated = TourUpdateSchema.parse(data);
    const tour = await TourService.update(id, validated);

    revalidatePath(ROUTES.ADMIN.TOURS);
    revalidatePath(ROUTES.TOURS);
    revalidatePath(`${ROUTES.TOURS}/${tour.slug}`);
    revalidateNavCache();

    return serialize({ success: true, data: tour }) as TourActionResponse;
  } catch (error) {
    if (error instanceof ZodError) {
      return {
        success: false,
        error: "VALIDATION_ERROR",
        message: await zodFirstMessage(error, "invalid_tour_data"),
      };
    }

    return (await handleError(
      error,
      "VIVU_ADMIN_ERROR_UPDATE_TOUR",
    )) as TourActionResponse;
  }
}

export async function deleteTourAction(id: string) {
  try {
    await requireAdmin();
    const { tourIdSchema } = await getValidationSchemas();

    tourIdSchema.parse(id);
    await TourService.delete(id);
    revalidatePath(ROUTES.ADMIN.TOURS);
    revalidatePath(ROUTES.TOURS);
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

    return await handleError(error, "VIVU_ADMIN_ERROR_DELETE_TOUR");
  }
}

export async function updateTourItinerariesAction(
  tourId: string,
  itineraries: unknown,
) {
  try {
    await requireAdmin();
    const { tourIdSchema, TourItinerariesInputSchema } =
      await getValidationSchemas();

    tourIdSchema.parse(tourId);
    const validated = TourItinerariesInputSchema.parse(itineraries);

    await TourService.replaceItineraries(tourId, validated);

    revalidatePath(ROUTES.ADMIN.TOURS);
    revalidatePath(`${ROUTES.ADMIN.TOURS}/${tourId}`);
    revalidatePath(ROUTES.TOURS);
    revalidateNavCache();

    return { success: true };
  } catch (error) {
    if (error instanceof ZodError) {
      return {
        success: false,
        error: "VIVU_ADMIN_ERROR_UPDATE_TOUR",
        message: await zodFirstMessage(error, "invalid_itinerary_data"),
      };
    }

    return await handleError(error, "VIVU_ADMIN_ERROR_UPDATE_TOUR");
  }
}

export async function updateTourOptionsAction(
  tourId: string,
  options: unknown,
): Promise<TourVoidActionResponse> {
  try {
    await requireAdmin();
    const { tourIdSchema, TourOptionsInputSchema } =
      await getValidationSchemas();

    tourIdSchema.parse(tourId);
    const validated = TourOptionsInputSchema.parse(options);

    await TourService.replaceOptions(tourId, validated);

    revalidatePath(ROUTES.ADMIN.TOURS);
    revalidatePath(`${ROUTES.ADMIN.TOURS}/${tourId}`);
    revalidatePath(ROUTES.TOURS);
    revalidateNavCache();

    return { success: true };
  } catch (error) {
    if (error instanceof ZodError) {
      return {
        success: false,
        error: "VALIDATION_ERROR",
        message: await zodFirstMessage(error, "invalid_tour_data"),
      };
    }

    return (await handleError(
      error,
      "VIVU_ADMIN_ERROR_UPDATE_TOUR",
    )) as TourVoidActionResponse;
  }
}

export async function updateTourDeparturesAction(
  tourId: string,
  departures: unknown,
): Promise<TourVoidActionResponse> {
  try {
    await requireAdmin();
    const { tourIdSchema, TourDeparturesInputSchema } =
      await getValidationSchemas();

    tourIdSchema.parse(tourId);
    const validated = TourDeparturesInputSchema.parse(departures);

    await TourService.replaceDepartures(tourId, validated);

    revalidatePath(ROUTES.ADMIN.TOURS);
    revalidatePath(`${ROUTES.ADMIN.TOURS}/${tourId}`);
    revalidatePath(ROUTES.TOURS);
    revalidateNavCache();

    return { success: true };
  } catch (error) {
    if (error instanceof ZodError) {
      return {
        success: false,
        error: "VALIDATION_ERROR",
        message: await zodFirstMessage(error, "invalid_departure_data"),
      };
    }

    return (await handleError(
      error,
      "VIVU_ADMIN_ERROR_UPDATE_TOUR",
    )) as TourVoidActionResponse;
  }
}
