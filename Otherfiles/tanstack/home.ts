import api from "@/lib/axios";
import {
  useInfiniteQuery,
  type QueryClient,
} from "@tanstack/react-query";

const HOME_CATEGORY_PAGE_SIZE = 8;
const HOME_CATEGORY_STALE_TIME = 60_000;

export const homeCategoryQueryKey = ["home-categories"] as const;

export interface HomeCategoryChild {
  _id: string;
  name: string;
  Image?: {
    publicId?: string;
  };
}

export interface HomeCategory {
  _id: string;
  name: string;
  children: HomeCategoryChild[];
}

export interface HomeCategoryPageData {
  categories: HomeCategory[];
  currentPage: number;
  totalPages: number;
  totalCategories: number;
}

async function fetchCategoryPage(
  pageParam: number,
  signal: AbortSignal,
  cookieHeader?: string,
) {
  const response = await api.get<HomeCategoryPageData>(
    "/user/home-categories",
    {
      params: { page: pageParam, limit: HOME_CATEGORY_PAGE_SIZE },
      signal,
      headers: cookieHeader ? { Cookie: cookieHeader } : undefined,
    },
  );

  return response.data;
}

function homeCategoriesQueryOptions(cookieHeader?: string) {
  return {
    queryKey: homeCategoryQueryKey,
    queryFn: ({ pageParam, signal }: { pageParam: number; signal: AbortSignal }) =>
      fetchCategoryPage(pageParam, signal, cookieHeader),
    initialPageParam: 1,
    getNextPageParam: (
      lastPage: HomeCategoryPageData,
      _pages: HomeCategoryPageData[],
      lastPageParam: number,
    ) =>
      lastPageParam < lastPage.totalPages ? lastPageParam + 1 : undefined,
    staleTime: HOME_CATEGORY_STALE_TIME,
    refetchOnWindowFocus: false,
  };
}

export function useHomeCategories() {
  return useInfiniteQuery(homeCategoriesQueryOptions());
}

export async function prefetchHomeCategories(
  queryClient: QueryClient,
  cookieHeader?: string,
) {
  await queryClient.prefetchInfiniteQuery(
    homeCategoriesQueryOptions(cookieHeader),
  );
}
