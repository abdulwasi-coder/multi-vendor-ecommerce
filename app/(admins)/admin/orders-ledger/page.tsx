import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { cookies } from "next/headers";
import { AdminOrdersLedger } from "@/Otherfiles/Order_interactive";
import {
  prefetchAdminOrderFeed,
  prefetchAdminVendorBalanceLedger,
} from "@/Otherfiles/tanstack/admin";

const ORDER_PAGE_SIZE = 10;
const VENDOR_LEDGER_PAGE_SIZE = 10;

export default async function AdminOrdersLedgerPage() {
  const queryClient = new QueryClient();
  const cookieHeader = (await cookies()).toString();

  await Promise.all([
    prefetchAdminOrderFeed(queryClient, 1, ORDER_PAGE_SIZE, cookieHeader),
    prefetchAdminVendorBalanceLedger(
      queryClient,
      VENDOR_LEDGER_PAGE_SIZE,
      cookieHeader,
      1,
    ),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <main className="admin-dashboard-surface min-h-screen w-full px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-400 space-y-6">
          <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-1">
              <h1 className="text-2xl font-semibold tracking-tight">Orders</h1>
              <p className="text-sm text-muted-foreground">
                Review order activity and vendor earnings across the
                marketplace.
              </p>
            </div>
          </header>
          <AdminOrdersLedger />
        </div>
      </main>
    </HydrationBoundary>
  );
}
