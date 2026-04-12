"use client";

import { isCloudinaryUnsignedConfigured } from "./config";
import { uploadToCloudinaryUnsigned } from "./unsigned-upload";

import { uploadMediaAction } from "@/actions/upload.actions";

const UPLOAD_FOLDER = "vivu_travel_uploads";

export type ClientUploadResult =
  | { success: true; url: string }
  | { success: false; error: string; message?: string };

function shouldFallbackToUnsigned(error?: string, message?: string): boolean {
  const combined = `${error ?? ""} ${message ?? ""}`;

  return (
    error === "CLOUDINARY_NOT_CONFIGURED" ||
    /api_key/i.test(combined) ||
    /Must supply api_key/i.test(combined)
  );
}

/**
 * Ưu tiên upload qua Server Action (signed).
 * Nếu server chưa có API key/secret → fallback unsigned preset (NEXT_PUBLIC_CLOUDINARY_*).
 */
export async function uploadFileFromClient(
  file: File,
): Promise<ClientUploadResult> {
  const formData = new FormData();

  formData.append("file", file);

  const result = await uploadMediaAction(formData);

  if (result.success) {
    return { success: true, url: result.url };
  }

  if (!shouldFallbackToUnsigned(result.error, result.message)) {
    return {
      success: false,
      error: result.error,
      message: result.message,
    };
  }

  if (!isCloudinaryUnsignedConfigured()) {
    return {
      success: false,
      error: result.error,
      message: result.message,
    };
  }

  try {
    const uploaded = await uploadToCloudinaryUnsigned(file, {
      folder: UPLOAD_FOLDER,
    });

    return { success: true, url: uploaded.secure_url };
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "CLOUDINARY_UNSIGNED_UPLOAD_FAILED";

    return { success: false, error: message, message };
  }
}
