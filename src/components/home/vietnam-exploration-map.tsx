"use client";

import type { MapPoint } from "@/types";

import dynamic from "next/dynamic";

const VietnamExplorationMapInner = dynamic(
  () =>
    import("./vietnam-exploration-map-inner").then(
      (mod) => mod.VietnamExplorationMapInner,
    ),
  {
    ssr: false,
    loading: () => (
      <div
        aria-hidden
        className="h-full w-full animate-pulse bg-slate-200 dark:bg-slate-800"
      />
    ),
  },
);

interface VietnamExplorationMapProps {
  points: MapPoint[];
  locale: string;
  activePointId?: string | null;
  getPointLabel: (point: MapPoint) => string;
  onSelectPoint: (pointId: string) => void;
  className?: string;
}

export function VietnamExplorationMap(props: VietnamExplorationMapProps) {
  return <VietnamExplorationMapInner {...props} />;
}
