"use server";

import { getTranslations } from "next-intl/server";

import { cloudinary, isCloudinaryServerConfigured } from "@/lib/cloudinary";
import { handleError } from "@/lib/utils/error";
import { requireAdmin } from "@/lib/auth-guard";
import { getValidationMessages } from "@/lib/i18n/validation";

const MAX_UPLOAD_BYTES = 50 * 1024 * 1024; // 50 MB

interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
}

export type UploadResponse =
  | { success: true; url: string; publicId: string }
  | { success: false; error: string; message?: string };

export async function uploadMediaAction(
  formData: FormData,
): Promise<UploadResponse> {
  try {
    await requireAdmin();

    const file = formData.get("file");

    if (!(file instanceof File)) {
      return { success: false, error: "No file provided" };
    }

    if (file.size > MAX_UPLOAD_BYTES) {
      const t = await getValidationMessages();

      return {
        success: false,
        error: "FILE_TOO_LARGE",
        message: t("file_too_large"),
      };
    }

    if (!isCloudinaryServerConfigured()) {
      const tApi = await getTranslations("API");

      return {
        success: false,
        error: "CLOUDINARY_NOT_CONFIGURED",
        message: tApi("CLOUDINARY_NOT_CONFIGURED"),
      };
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Xác định resource_type (image hoặc video)
    const resourceType = file.type.startsWith("video") ? "video" : "image";

    const result = await new Promise<CloudinaryUploadResult>(
      (resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "vivu_travel_uploads",
            resource_type: resourceType,
          },
          (_error, uploadResult) => {
            if (_error) reject(_error);
            else if (uploadResult)
              resolve(uploadResult as CloudinaryUploadResult);
            else reject(new Error("Upload result is undefined"));
          },
        );

        uploadStream.end(buffer);
      },
    );

    return {
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch (error) {
    const errorRes = await handleError(
      error,
      "VIVU_ADMIN_ERROR_UPLOAD_CLOUDINARY",
    );

    return {
      success: false,
      error: errorRes.error || "Unknown error",
      message: errorRes.message,
    };
  }
}
