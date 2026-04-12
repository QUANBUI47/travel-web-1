"use client";

import type { MapPoint } from "@/types";

import L from "leaflet";
import { useEffect, useMemo, useRef } from "react";
import "leaflet/dist/leaflet.css";

import { resetLeafletContainer } from "@/lib/map/leaflet-container";
import {
  MAP_MARKER,
  SATELLITE_LABELS_TILE,
  SATELLITE_TILE,
  VIETNAM_DEFAULT_ZOOM,
  VIETNAM_MAP_CENTER,
  VIETNAM_MAP_LIMITS,
  VIETNAM_MAX_BOUNDS,
} from "@/lib/map/vietnam-map-config";

interface VietnamExplorationMapInnerProps {
  points: MapPoint[];
  locale: string;
  activePointId?: string | null;
  getPointLabel: (point: MapPoint) => string;
  onSelectPoint: (pointId: string) => void;
  className?: string;
}

function isValidCoordinate(lat: number, lng: number) {
  return (
    Number.isFinite(lat) &&
    Number.isFinite(lng) &&
    lat >= -90 &&
    lat <= 90 &&
    lng >= -180 &&
    lng <= 180 &&
    !(lat === 0 && lng === 0)
  );
}

function fitMapToVietnamOrPoints(map: L.Map, mapPoints: MapPoint[]) {
  if (mapPoints.length === 0) {
    map.setView(VIETNAM_MAP_CENTER, VIETNAM_DEFAULT_ZOOM, { animate: false });

    return;
  }

  if (mapPoints.length === 1) {
    const [point] = mapPoints;

    map.setView([point.lat, point.lng], 8, { animate: true });

    return;
  }

  const bounds = mapPoints.map((p) => [p.lat, p.lng] as [number, number]);

  map.fitBounds(bounds, {
    padding: [56, 56],
    maxZoom: 9,
    animate: true,
  });
}

export function VietnamExplorationMapInner({
  points,
  locale,
  activePointId,
  getPointLabel,
  onSelectPoint,
  className,
}: VietnamExplorationMapInnerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const onSelectRef = useRef(onSelectPoint);
  const getLabelRef = useRef(getPointLabel);

  const validPoints = useMemo(
    () => points.filter((p) => isValidCoordinate(p.lat, p.lng)),
    [points],
  );

  onSelectRef.current = onSelectPoint;
  getLabelRef.current = getPointLabel;

  useEffect(() => {
    const container = containerRef.current;

    if (!container || mapRef.current) return;

    resetLeafletContainer(container);

    const map = L.map(container, {
      center: VIETNAM_MAP_CENTER,
      doubleClickZoom: true,
      dragging: true,
      maxBounds: VIETNAM_MAX_BOUNDS,
      maxBoundsViscosity: 1,
      maxZoom: VIETNAM_MAP_LIMITS.maxZoom,
      minZoom: VIETNAM_MAP_LIMITS.minZoom,
      scrollWheelZoom: false,
      zoom: VIETNAM_DEFAULT_ZOOM,
      zoomControl: false,
      worldCopyJump: false,
    });

    L.control.zoom({ position: "topright" }).addTo(map);

    L.tileLayer(SATELLITE_TILE.url, {
      attribution: SATELLITE_TILE.attribution,
      maxZoom: VIETNAM_MAP_LIMITS.maxZoom,
    }).addTo(map);

    L.tileLayer(SATELLITE_LABELS_TILE.url, {
      attribution: SATELLITE_LABELS_TILE.attribution,
      maxZoom: VIETNAM_MAP_LIMITS.maxZoom,
      opacity: 0.9,
      pane: "overlayPane",
    }).addTo(map);

    mapRef.current = map;
    markersLayerRef.current = L.layerGroup().addTo(map);

    return () => {
      map.remove();
      mapRef.current = null;
      markersLayerRef.current = null;
      resetLeafletContainer(container);
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    const markersLayer = markersLayerRef.current;

    if (!map || !markersLayer) return;

    markersLayer.clearLayers();

    validPoints.forEach((point) => {
      const isActive = point.id === activePointId;
      const label = getLabelRef.current(point);

      const marker = L.circleMarker([point.lat, point.lng], {
        color: "#ffffff",
        fillColor: isActive ? MAP_MARKER.active : MAP_MARKER.default,
        fillOpacity: 1,
        radius: isActive ? 11 : 8,
        weight: isActive ? 3 : 2,
      });

      marker.bindTooltip(label, {
        className: "map-exploration-tooltip",
        direction: "top",
        offset: [0, -8],
        opacity: 1,
        permanent: isActive,
      });

      marker.on("click", () => {
        onSelectRef.current(point.id);
        map.flyTo([point.lat, point.lng], 9, { duration: 1.2 });
      });

      markersLayer.addLayer(marker);
    });
  }, [validPoints, activePointId, locale]);

  useEffect(() => {
    const map = mapRef.current;

    if (!map) return;

    fitMapToVietnamOrPoints(map, validPoints);
  }, [validPoints]);

  return (
    <div
      ref={containerRef}
      className={className ?? "vietnam-exploration-map h-full w-full"}
    />
  );
}
