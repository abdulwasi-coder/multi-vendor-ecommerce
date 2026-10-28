"use client";

import { useEffect, useState } from "react";
import { isAxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";
import type { Category } from "@/components/ui/admin/columns";
import api from "@/lib/axios";

const emptyCategories: Category[] = [];

export function useCategoryNameSearch(search: string, enabled = true) {
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const normalizedSearch = search.trim();

  useEffect(() => {
    const timeoutId = window.setTimeout(
      () => setDebouncedSearch(normalizedSearch),
      300,
    );
    return () => window.clearTimeout(timeoutId);
  }, [normalizedSearch]);

  const query = useQuery({
    queryKey: ["admin-categories", "name-search", debouncedSearch],
    queryFn: async ({ signal }) => {
      const response = await api.get<{ categories: Category[] }>(
        "/admin/specificCategoryName",
        { params: { name: debouncedSearch }, signal },
      );
      return response.data.categories ?? [];
    },
    enabled: enabled && debouncedSearch.length >= 2,
    staleTime: 60_000,
  });

  const isActive = normalizedSearch.length >= 2;
  const isCurrentSearch = normalizedSearch === debouncedSearch;
  const isDebouncing = isActive && !isCurrentSearch;
  const errorMessage =
    isActive && isCurrentSearch && query.error
      ? isAxiosError(query.error)
        ? query.error.response?.data?.message ?? "Could not search categories."
        : "Could not search categories."
      : "";

  return {
    categories: isCurrentSearch ? query.data ?? emptyCategories : emptyCategories,
    debouncedSearch,
    errorMessage,
    isActive,
    isDebouncing,
    isSearching: isDebouncing || (isActive && query.isFetching),
  };
}