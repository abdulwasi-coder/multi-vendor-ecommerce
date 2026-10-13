import { VendorSignupForm } from "@/components/ui/vendor-signup-form";

export default async function VendorSignupPage({
  params,
}: PageProps<"/vendor/signup/[userid]">) {
  const { userid } = await params;

  return <VendorSignupForm userId={userid} />;
}
