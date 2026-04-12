import type { QueryClient } from "@tanstack/react-query";

import { queryKeys } from "@/lib/query-keys";

export function invalidateTours(queryClient: QueryClient) {
  return queryClient.invalidateQueries({ queryKey: queryKeys.tours.all });
}

export function invalidateDestinations(queryClient: QueryClient) {
  return queryClient.invalidateQueries({
    queryKey: queryKeys.destinations.all,
  });
}

export function invalidateTourDetail(queryClient: QueryClient, tourId: string) {
  return Promise.all([
    invalidateTours(queryClient),
    queryClient.invalidateQueries({
      queryKey: queryKeys.tours.detail(tourId),
    }),
  ]);
}
