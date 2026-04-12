"use client";

import L from "leaflet";
import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";

import { resetLeafletContainer } from "@/lib/map/leaflet-container";
import {
  SATELLITE_LABELS_TILE,
  SATELLITE_TILE,
  VIETNAM_MAP_LIMITS,
} from "@/lib/map/vietnam-map-config";

interface DestinationMiniMapInnerProps {
  lat: number;
  lng: number;
  label: string;
  className?: string;
}

export function DestinationMiniMapInner({
  lat,
  lng,
  label,
  className,
}: DestinationMiniMapInnerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    const container = containerRef.current;

    if (!container || mapRef.current) return;

    resetLeafletContainer(container);

    const map = L.map(container, {
      center: [lat, lng],
      dragging: true,
      maxZoom: VIETNAM_MAP_LIMITS.maxZoom,
      minZoom: 7,
      scrollWheelZoom: false,
      zoom: 10,
      zoomControl: false,
    });

    L.tileLayer(SATELLITE_TILE.url, {
      attribution: "",
      maxZoom: VIETNAM_MAP_LIMITS.maxZoom,
    }).addTo(map);

    L.tileLayer(SATELLITE_LABELS_TILE.url, {
      maxZoom: VIETNAM_MAP_LIMITS.maxZoom,
      opacity: 0.85,
    }).addTo(map);

    L.circleMarker([lat, lng], {
      color: "#ffffff",
      fillColor: "#0068c3",
      fillOpacity: 1,
      radius: 9,
      weight: 3,
    })
      .addTo(map)
      .bindTooltip(label, {
        permanent: true,
        direction: "top",
        offset: [0, -6],
      });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
      resetLeafletContainer(container);
    };
  }, [lat, lng, label]);

  return (
    <div
      ref={containerRef}
      className={className ?? "destination-mini-map h-48 w-full rounded-2xl"}
    />
  );
}
