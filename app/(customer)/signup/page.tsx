import { AuthForm } from "@/components/auth-form";
import { PageFrame } from "@/components/app-ui";
export const metadata = { title: "Create account | Town Market" };
export default function SignupPage() { return <PageFrame><AuthForm mode="signup" /></PageFrame>; }
