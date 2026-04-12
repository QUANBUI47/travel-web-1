/** Gỡ trạng thái Leaflet còn sót trên DOM (React Strict Mode / remount). */
export function resetLeafletContainer(element: HTMLElement | null) {
  if (!element) return;

  const container = element as HTMLElement & { _leaflet_id?: number };

  if (container._leaflet_id !== undefined) {
    delete container._leaflet_id;
  }
}
