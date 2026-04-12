"use client";

import { useQuery } from "@tanstack/react-query";

import { getRegionsAction } from "@/actions/destination.actions";
import { queryKeys } from "@/lib/query-keys";

export function useRegions() {
  return useQuery({
    queryKey: queryKeys.regions.all,
    queryFn: async () => {
      const result = await getRegionsAction();

      if (!result.success) {
        throw new Error(result.message ?? result.error);
      }

      return result;
    },
    staleTime: 10 * 60 * 1000,
  });
}
