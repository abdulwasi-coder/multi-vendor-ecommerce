import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";
import { cookies } from "next/headers";
import { VendorProductsTable } from "@/components/ui/vendor/vendor-products-table";
import { prefetchVendorProducts } from "@/Otherfiles/tanstack/vendor-products";

export default async function VendorProductsPage() {
  const queryClient = new QueryClient();
  const cookieHeader = (await cookies()).toString();
  await prefetchVendorProducts(queryClient, cookieHeader);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <VendorProductsTable />
    </HydrationBoundary>
  );
}
