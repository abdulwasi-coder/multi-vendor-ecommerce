import { PageFrame } from "@/components/app-ui";
import { DashboardData } from "@/components/admin-data";

export default function AdminHome() { return <PageFrame eyebrow="Administration" title="Platform overview" description="Marketplace activity and platform metrics."><DashboardData /></PageFrame>; }
