/**
 * Custom Cloudinary loader for Next.js Image (global via next.config `images.loaderFile`).
 * Non-Cloudinary URLs are returned unchanged.
 */
export function cloudinaryLoader({
  src,
  width,
  quality,
}: {
  src: string;
  width: number;
  quality?: number;
}) {
  // If not a Cloudinary URL, return as is
  if (!src.includes("res.cloudinary.com")) return src;

  // Cloudinary optimization parameters:
  // f_auto: automatic format selection (WebP, AVIF)
  // q_auto: automatic quality compression
  // c_limit: resize and fit within width while maintaining aspect ratio
  const params = [
    `f_auto`,
    `c_limit`,
    `w_${width}`,
    `q_${quality || "auto"}`,
  ].join(",");

  // Insert parameters into the URL after /upload/
  return src.replace("/upload/", `/upload/${params}/`);
}

export default cloudinaryLoader;
