import api from "@/lib/axios";
import {
  useQuery,
  type QueryClient,
  type QueryFunctionContext,
} from "@tanstack/react-query";

export interface VendorProfile {
  _id: string;
  name: string;
  lastName: string;
  country: string;
  mobilenumber: string;
  companyName: string;
  storeSlug: string;
  storeDescription: string;
  Companyimage?: {
    cloudinaryId?: string;
    publicId?: string;
  };
  status: "pending" | "inactive" | "suspended" | "active";
}

interface VendorProfileResponse {
  success: boolean;
  message?: string;
  vendor?: VendorProfile;
}

export const vendorProfileQueryKey = ["vendor-profile"] as const;
const VENDOR_PROFILE_STALE_TIME = 5 * 60_000;

function vendorProfileQueryOptions(cookieHeader?: string) {
  return {
    queryKey: vendorProfileQueryKey,
    queryFn: async ({
      signal,
    }: QueryFunctionContext<typeof vendorProfileQueryKey>) => {
      const response = await api.get<VendorProfileResponse>(
        "/vendor/getProfile",
        {
          signal,
          headers: cookieHeader ? { Cookie: cookieHeader } : undefined,
        },
      );

      if (!response.data.success || !response.data.vendor) {
        throw new Error(
          response.data.message ?? "Vendor profile was not returned.",
        );
      }

      return response.data.vendor;
    },
    staleTime: VENDOR_PROFILE_STALE_TIME,
    refetchOnWindowFocus: false,
  };
}

export function useVendorProfile() {
  return useQuery(vendorProfileQueryOptions());
}

export async function prefetchVendorProfile(
  queryClient: QueryClient,
  cookieHeader: string,
) {
  await queryClient.prefetchQuery(vendorProfileQueryOptions(cookieHeader));
}
