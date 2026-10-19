import CustomerTopRatedPage from "@/components/ui/customer/customer-top-rated-page";

export default function TopRatedRoute({
  searchParams,
}: PageProps<"/top-rated">) {
  return <CustomerTopRatedPage searchParams={searchParams} />;
}
