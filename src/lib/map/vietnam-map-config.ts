import type { LatLngBoundsExpression, LatLngExpression } from "leaflet";

/** Trung tâm lãnh thổ Việt Nam */
export const VIETNAM_MAP_CENTER: LatLngExpression = [16.1667, 107.8333];

export const VIETNAM_DEFAULT_ZOOM = 6;

/** Giới hạn pan/zoom trong phạm vi Việt Nam & vùng lân cận */
export const VIETNAM_MAX_BOUNDS: LatLngBoundsExpression = [
  [7.5, 101.5],
  [24.5, 110.5],
];

export const VIETNAM_MAP_LIMITS = {
  minZoom: 5,
  maxZoom: 14,
} as const;

/** Esri World Imagery — ảnh vệ tinh, không cần API key */
export const SATELLITE_TILE = {
  url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
  attribution:
    "Tiles &copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics, USDA, USGS, AeroGRID, IGN, IGP, and the GIS User Community",
} as const;

/** Nhãn địa danh phủ lên ảnh vệ tinh */
export const SATELLITE_LABELS_TILE = {
  url: "https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}",
  attribution: "",
} as const;

export const MAP_MARKER = {
  active: "#0068c3",
  default: "#3385da",
} as const;
