import { PageFrame } from "@/components/app-ui";
import { AdminOrders } from "@/components/admin-data";

export default function AdminOrdersPage() { return <PageFrame eyebrow="Administration" title="Orders" description="Review orders across the marketplace."><AdminOrders /></PageFrame>; }
