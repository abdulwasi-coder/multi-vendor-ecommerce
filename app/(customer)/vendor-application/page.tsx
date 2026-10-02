import { PageFrame, Surface } from "@/components/app-ui";
import { VendorApplication } from "@/components/vendor-application";
export default function VendorApplicationPage() { return <PageFrame eyebrow="Seller program" title="Open a store" description="Tell us about your business. Applications are reviewed before the vendor workspace is enabled."><Surface className="mx-auto max-w-3xl"><VendorApplication /></Surface></PageFrame>; }
