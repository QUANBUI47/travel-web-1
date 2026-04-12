"use client";

import Image, { type ImageProps } from "next/image";

import cloudinaryLoader from "@/lib/loaders";

function isCloudinarySrc(src: ImageProps["src"]): boolean {
  return typeof src === "string" && src.includes("res.cloudinary.com");
}

/**
 * next/image wrapper: Cloudinary URLs use custom loader; local/static URLs use default.
 * Safe to use from Server Components (loader stays inside this client boundary).
 */
export function AppImage(props: ImageProps) {
  if (isCloudinarySrc(props.src)) {
    return <Image {...props} loader={cloudinaryLoader} />;
  }

  return <Image {...props} />;
}
