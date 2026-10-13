import { VendorSignupForm } from "@/components/ui/vendor/vendor-signup-form";

export default async function VendorSignupPage({
  params,
}: PageProps<"/customer/signup">) {
  return <VendorSignupForm />;
}
