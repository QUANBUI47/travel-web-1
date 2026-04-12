import { v2 as cloudinary } from "cloudinary";

import {
  getCloudinaryCloudName,
  isCloudinaryServerConfigured,
} from "@/lib/cloudinary/config";

export {
  getCloudinaryCloudName,
  getCloudinaryUploadPreset,
  isCloudinaryServerConfigured,
  isCloudinaryUnsignedConfigured,
} from "@/lib/cloudinary/config";

/**
 * Cloudinary chỉ dùng phía server (upload action, seed).
 * API key/secret phải đặt biến KHÔNG có prefix NEXT_PUBLIC_.
 */
function ensureCloudinaryConfig(): void {
  if (!isCloudinaryServerConfigured()) return;

  cloudinary.config({
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    cloud_name: getCloudinaryCloudName(),
    secure: true,
  });
}

ensureCloudinaryConfig();

export { cloudinary };
