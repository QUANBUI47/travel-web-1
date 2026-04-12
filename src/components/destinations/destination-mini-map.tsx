"use client";

import dynamic from "next/dynamic";

const DestinationMiniMapInner = dynamic(
  () =>
    import("./destination-mini-map-inner").then(
      (mod) => mod.DestinationMiniMapInner,
    ),
  {
    ssr: false,
    loading: () => (
      <div
        aria-hidden
        className="h-full w-full animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800"
      />
    ),
  },
);

interface DestinationMiniMapProps {
  lat: number;
  lng: number;
  label: string;
  className?: string;
}

export function DestinationMiniMap(props: DestinationMiniMapProps) {
  return <DestinationMiniMapInner {...props} />;
}
