import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { CheckoutPageClient } from "@/components/ui/customer/checkout-page-client";

export default async function CheckoutPage() {
  const store = await cookies();
  if (!store.get("refreshtoken")) {
    redirect("/login?redirect=/checkout");
  }
  return <CheckoutPageClient />;
}
