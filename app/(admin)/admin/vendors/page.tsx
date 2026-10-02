import { PageFrame } from "@/components/app-ui";
import { VendorApplications } from "@/components/admin-data";

export default function VendorsPage() { return <PageFrame eyebrow="Administration" title="Vendor applications" description="Review incoming vendor applications and active marketplace sellers."><VendorApplications /></PageFrame>; }
