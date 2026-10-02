import { VendorBlockedPage } from "@/components/vendor-pages";
export default async function EditVendorProductPage({ params }: { params: Promise<{ id: string }> }) { await params; return <VendorBlockedPage title="Edit product" detail="Product details and update actions are blocked by the current backend product controllers." />; }
