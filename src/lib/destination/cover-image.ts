import { IMAGES } from "@/constants";

type DestinationImages = {
  imageUrl?: string | null;
  imageUrls?: string[] | null;
};

export function getDestinationCoverImage(
  destination: DestinationImages,
): string {
  const fromGallery = destination.imageUrls?.find(Boolean);

  return fromGallery || destination.imageUrl || IMAGES.PLACEHOLDERS.DESTINATION;
}

export function getDestinationGallery(
  destination: DestinationImages,
): string[] {
  const urls = (destination.imageUrls ?? []).filter(Boolean);

  if (urls.length > 0) return urls;

  if (destination.imageUrl) return [destination.imageUrl];

  return [];
}
