"use client";

import { useQuery } from "@tanstack/react-query";

import { getPaginatedDestinationsAction } from "@/actions/destination.actions";
import { queryKeys } from "@/lib/query-keys";

export function useAdminDestinationsList(page: number, limit: number) {
  return useQuery({
    queryKey: queryKeys.destinations.list({ page, limit }),
    queryFn: async () => {
      const result = await getPaginatedDestinationsAction(page, limit);

      if (!result.success) {
        throw new Error(result.message ?? result.error);
      }

      return result;
    },
  });
}
