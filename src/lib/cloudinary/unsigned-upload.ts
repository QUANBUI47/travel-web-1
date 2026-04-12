import { getCloudinaryCloudName, getCloudinaryUploadPreset } from "./config";

export interface UnsignedUploadResult {
  secure_url: string;
  public_id: string;
}

/**
 * Upload trực tiếp lên Cloudinary bằng unsigned preset (chỉ cần cloud name + preset public).
 * Dùng khi chưa cấu hình CLOUDINARY_API_KEY / CLOUDINARY_API_SECRET trên server.
 */
export async function uploadToCloudinaryUnsigned(
  file: File,
  options?: { folder?: string },
): Promise<UnsignedUploadResult> {
  const cloudName = getCloudinaryCloudName();
  const uploadPreset = getCloudinaryUploadPreset();

  if (!cloudName || !uploadPreset) {
    throw new Error("CLOUDINARY_UNSIGNED_NOT_CONFIGURED");
  }

  const resourceType = file.type.startsWith("video") ? "video" : "image";
  const formData = new FormData();

  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);

  if (options?.folder) {
    formData.append("folder", options.folder);
  }

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`,
    { method: "POST", body: formData },
  );

  const data = (await response.json()) as {
    secure_url?: string;
    public_id?: string;
    error?: { message?: string };
  };

  if (!response.ok || !data.secure_url) {
    throw new Error(data.error?.message ?? "CLOUDINARY_UNSIGNED_UPLOAD_FAILED");
  }

  return {
    secure_url: data.secure_url,
    public_id: data.public_id ?? "",
  };
}
