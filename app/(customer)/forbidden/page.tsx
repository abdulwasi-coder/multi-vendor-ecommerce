import Link from "next/link";
import { PageFrame, Notice } from "@/components/app-ui";
export default function ForbiddenPage() { return <PageFrame title="Access restricted"><div className="max-w-xl"><Notice title="This account does not have access">Use an account with the required marketplace role, or return to the store.</Notice><Link href="/" className="mt-4 inline-block min-h-11 py-3 text-sm underline underline-offset-4">Return to store</Link></div></PageFrame>; }
