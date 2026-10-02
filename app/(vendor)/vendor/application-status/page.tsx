import Link from "next/link";
import { PageFrame, Notice } from "@/components/app-ui";
export default function ApplicationStatusPage() { return <PageFrame title="Application submitted"><div className="max-w-xl"><Notice title="Your application was accepted for review">The backend confirmed receipt of the application. Sign in later to check whether your vendor role has been activated.</Notice><Link href="/" className="mt-5 inline-block min-h-11 py-3 text-sm underline underline-offset-4">Return to marketplace</Link></div></PageFrame>; }
