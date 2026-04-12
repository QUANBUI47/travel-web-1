/**
 * Central TanStack Query keys — dùng prefix để invalidate theo nhóm.
 */
export const queryKeys = {
  tours: {
    all: ["tours"] as const,
    lists: () => [...queryKeys.tours.all, "list"] as const,
    list: (params: { page: number; limit: number; search?: string }) =>
      [...queryKeys.tours.lists(), params] as const,
    details: () => [...queryKeys.tours.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.tours.details(), id] as const,
  },
  destinations: {
    all: ["destinations"] as const,
    lists: () => [...queryKeys.destinations.all, "list"] as const,
    list: (params: { page: number; limit: number }) =>
      [...queryKeys.destinations.lists(), params] as const,
    picklist: (limit = 100) =>
      [...queryKeys.destinations.all, "picklist", { limit }] as const,
  },
  regions: {
    all: ["regions"] as const,
  },
  home: {
    all: ["home"] as const,
    settings: () => [...queryKeys.home.all, "settings"] as const,
  },
  bookings: {
    all: ["bookings"] as const,
    list: () => [...queryKeys.bookings.all, "list"] as const,
  },
} as const;
