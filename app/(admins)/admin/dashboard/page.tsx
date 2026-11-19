import AdminDashboard from "@/components/ui/admin/admin-dashboard";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { cookies } from "next/headers";
import {
  prefetchAdminDashboard,
  prefetchAdminPendingVendors,
  prefetchAdminVendorBalanceLedger,
} from "@/Otherfiles/tanstack/admin";

const PENDING_VENDORS_PAGE_SIZE = 5;
const VENDOR_LEDGER_LIMIT = 5;

export default async function AdminDashboardPage() {
  const queryClient = new QueryClient();
  const cookieHeader = (await cookies()).toString();

  await Promise.all([
    prefetchAdminDashboard(queryClient, cookieHeader),
    prefetchAdminPendingVendors(
      queryClient,
      1,
      PENDING_VENDORS_PAGE_SIZE,
      cookieHeader,
    ),
    prefetchAdminVendorBalanceLedger(
      queryClient,
      VENDOR_LEDGER_LIMIT,
      cookieHeader,
    ),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AdminDashboard />
    </HydrationBoundary>
  );
}
