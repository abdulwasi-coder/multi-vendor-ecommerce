import { PageFrame, Surface } from "@/components/app-ui";
import { VendorApplication } from "@/components/vendor-application";
export default function VendorApplyPage() { return <PageFrame eyebrow="Seller program" title="Apply to sell" description="Submit your business details for review."><Surface className="max-w-3xl"><VendorApplication /></Surface></PageFrame>; }
