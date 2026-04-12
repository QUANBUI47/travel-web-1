"use client";

import { useQuery } from "@tanstack/react-query";

import { getPaginatedDestinationsAction } from "@/actions/destination.actions";
import { queryKeys } from "@/lib/query-keys";

const PICKLIST_LIMIT = 100;

export function useDestinationsPicklist(limit = PICKLIST_LIMIT) {
  return useQuery({
    queryKey: queryKeys.destinations.picklist(limit),
    queryFn: async () => {
      const result = await getPaginatedDestinationsAction(1, limit);

      if (!result.success) {
        throw new Error(result.message ?? result.error);
      }

      return result;
    },
    staleTime: 5 * 60 * 1000,
  });
}
