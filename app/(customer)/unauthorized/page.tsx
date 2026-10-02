import Link from "next/link";
import { PageFrame } from "@/components/app-ui";
export default function UnauthorizedPage() { return <PageFrame title="Sign in to continue" description="Your account session may have expired."><Link href="/login" className="inline-flex min-h-11 items-center rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground">Sign in</Link></PageFrame>; }
