import { redirect } from "next/navigation";
export default async function LegacyResetPassword({ params }: { params: Promise<{ resetLink: string }> }) { const { resetLink } = await params; redirect(`/resetPassword/${encodeURIComponent(resetLink)}`); }
