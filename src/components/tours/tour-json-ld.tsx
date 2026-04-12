import { Tour } from "@/types";

type TourJsonLdProps = {
  tour: Tour;
  name: string;
  description?: string;
  url: string;
  locale: string;
};

export function TourJsonLd({
  tour,
  name,
  description,
  url,
  locale,
}: TourJsonLdProps) {
  const image = tour.imageUrls?.[0];
  const price = tour.priceFrom;

  const schema = {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name,
    description: description || undefined,
    url,
    image: image ? [image] : undefined,
    touristType: tour.tourType || undefined,
    itinerary: tour.itineraries?.length
      ? {
          "@type": "ItemList",
          itemListElement: tour.itineraries.map((day, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: day.title,
            description: day.description || undefined,
          })),
        }
      : undefined,
    offers: price
      ? {
          "@type": "Offer",
          price: String(price),
          priceCurrency: locale === "vi" ? "VND" : "USD",
          availability: tour.isActive
            ? "https://schema.org/InStock"
            : "https://schema.org/OutOfStock",
          url,
        }
      : undefined,
  };

  return (
    <script
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      type="application/ld+json"
    />
  );
}
