import { redirect } from "next/navigation";
export default async function LegacyProductPage({ params }: { params: Promise<{ productID: string }> }) { const { productID } = await params; redirect(`/products/${encodeURIComponent(productID)}`); }
