import { AuthForm } from "@/components/auth-form";
import { PageFrame } from "@/components/app-ui";
export const metadata = { title: "Sign in | Town Market" };
export default function LoginPage() { return <PageFrame><AuthForm mode="login" /></PageFrame>; }
