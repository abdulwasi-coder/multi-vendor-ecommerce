import CustomerDealsPage from "@/components/ui/customer/customer-deals-page";

export default function TopDiscountsRoute({
  searchParams,
}: PageProps<"/top-discounts">) {
  return <CustomerDealsPage searchParams={searchParams} />;
}
