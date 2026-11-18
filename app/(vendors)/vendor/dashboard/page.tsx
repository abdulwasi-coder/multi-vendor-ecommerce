import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";
import { cookies } from "next/headers";
import { VendorDashboard } from "@/components/ui/vendor/vendor-dashboard";
import {
  DEFAULT_DASHBOARD_RANGE,
  prefetchVendorFinance,
} from "@/Otherfiles/tanstack/vendor-finance";
import { prefetchVendorOrdersPage } from "@/Otherfiles/tanstack/vendor-orders";

export default async function VendorDashboardPage() {
  const queryClient = new QueryClient();
  const cookieHeader = (await cookies()).toString();

  await Promise.all([
    prefetchVendorFinance(
      queryClient,
      DEFAULT_DASHBOARD_RANGE,
      cookieHeader,
    ),
    prefetchVendorOrdersPage(queryClient, 1, 5, "all", "", cookieHeader),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <VendorDashboard />
    </HydrationBoundary>
  );
}
