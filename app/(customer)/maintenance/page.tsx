import Link from "next/link";
import { PageFrame, Notice } from "@/components/app-ui";
export default function MaintenancePage() { return <PageFrame title="Marketplace services"><div className="max-w-xl"><Notice title="Some features are temporarily unavailable">A few account and marketplace actions depend on backend routes that are being repaired. Browsing and your local cart remain available.</Notice><Link href="/products" className="mt-4 inline-block min-h-11 py-3 text-sm underline underline-offset-4">Continue browsing</Link></div></PageFrame>; }
