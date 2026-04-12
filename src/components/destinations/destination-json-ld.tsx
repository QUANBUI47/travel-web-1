type DestinationJsonLdProps = {
  name: string;
  description?: string;
  url: string;
  image?: string;
  regionName?: string;
};

export function DestinationJsonLd({
  name,
  description,
  url,
  image,
  regionName,
}: DestinationJsonLdProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "TouristDestination",
    name,
    description: description || undefined,
    url,
    image: image ? [image] : undefined,
    ...(regionName
      ? {
          containedInPlace: {
            "@type": "Place",
            name: regionName,
          },
        }
      : {}),
  };

  return (
    <script
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      type="application/ld+json"
    />
  );
}
