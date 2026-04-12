"use client";

import { useQuery } from "@tanstack/react-query";

import { getPaginatedToursAction } from "@/actions/tour.actions";
import { queryKeys } from "@/lib/query-keys";

export function useAdminToursList(
  page: number,
  limit: number,
  search?: string,
) {
  return useQuery({
    queryKey: queryKeys.tours.list({
      page,
      limit,
      search: search || undefined,
    }),
    queryFn: async () => {
      const result = await getPaginatedToursAction(page, limit, search ?? "");

      if (!result.success) {
        throw new Error(result.message ?? result.error);
      }

      return result;
    },
  });
}
