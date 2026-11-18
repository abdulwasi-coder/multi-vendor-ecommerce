import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { CustomerOrdersPage } from "@/components/ui/customer/customer-orders-page";

export default async function CustomerOrdersRoute() {
  const store = await cookies();
  if (!store.get("refreshtoken")) {
    redirect("/login?redirect=/orders");
  }
  return <CustomerOrdersPage />;
}
