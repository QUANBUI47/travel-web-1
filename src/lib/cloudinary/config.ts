/** Cloud name — có thể public (xuất hiện trong URL ảnh). */
export function getCloudinaryCloudName(): string | undefined {
  return (
    process.env.CLOUDINARY_CLOUD_NAME ??
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
  );
}

export function getCloudinaryUploadPreset(): string | undefined {
  return process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
}

/** Upload ký server — cần biến KHÔNG có prefix NEXT_PUBLIC_. */
export function isCloudinaryServerConfigured(): boolean {
  const cloudName = getCloudinaryCloudName();
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  return Boolean(cloudName && apiKey && apiSecret);
}

export function isCloudinaryUnsignedConfigured(): boolean {
  return Boolean(getCloudinaryCloudName() && getCloudinaryUploadPreset());
}
