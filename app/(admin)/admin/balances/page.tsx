import { PageFrame } from "@/components/app-ui";
import { AdminBalances } from "@/components/admin-data";

export default function BalancesPage() { return <PageFrame eyebrow="Administration" title="Vendor balances" description="Marketplace balance ledger grouped by vendor."><AdminBalances /></PageFrame>; }
