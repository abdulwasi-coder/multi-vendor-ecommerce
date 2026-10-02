import { PageFrame } from "@/components/app-ui";
import { BlockedProducts } from "@/components/admin-data";

export default function AdminProductsPage() { return <PageFrame eyebrow="Administration" title="Products" description="Product oversight for the marketplace."><BlockedProducts /></PageFrame>; }
