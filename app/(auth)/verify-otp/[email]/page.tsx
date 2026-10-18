import OTPValidator from "@/components/ui/OTPpage";

interface paramprop {
  params: Promise<{ email: string }>;
}

export default async function VerifyOtpPage({ params }: paramprop) {
  const { email } = await params;
  const cleanemail = decodeURIComponent(email)
  return <OTPValidator email={cleanemail} />;
}
