"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { authApi } from "@/services/platform";
import { buttonClass, inputClass } from "@/components/app-ui";

type AuthMode = "login" | "signup" | "forgot";
const labels: Record<AuthMode, { title: string; submit: string }> = {
  login: { title: "Welcome back", submit: "Sign in" },
  signup: { title: "Create your account", submit: "Create account" },
  forgot: { title: "Reset your password", submit: "Send reset link" },
};

export function AuthForm({ mode }: { mode: AuthMode }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function submit(formData: FormData) {
    setPending(true);
    setError("");
    try {
      if (mode === "signup") {
        await authApi.signup({ name: String(formData.get("name") ?? "").trim(), email: String(formData.get("email") ?? "").trim(), password: String(formData.get("password") ?? "") });
        toast.success("Account created. Email verification is required before sign in.");
        router.push("/verify-email");
      } else if (mode === "login") {
        await authApi.login({ email: String(formData.get("email") ?? "").trim(), password: String(formData.get("password") ?? "") });
        toast.success("Signed in successfully.");
        router.push("/");
        router.refresh();
      } else {
        await authApi.forgotPassword(String(formData.get("email") ?? "").trim());
        toast.success("If the address is registered, a reset email will arrive shortly.");
      }
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : "The request could not be completed.";
      setError(message);
      toast.error(message);
    } finally {
      setPending(false);
    }
  }

  return <section className="surface-raised mx-auto w-full max-w-md rounded-2xl p-6 sm:p-8"><p className="text-xs font-semibold uppercase tracking-[.16em] text-muted-foreground">Town Market account</p><h1 className="mt-2 text-2xl font-semibold tracking-tight">{labels[mode].title}</h1><p className="mt-2 text-sm leading-6 text-muted-foreground">{mode === "signup" ? "Create an account to browse and shop the marketplace." : mode === "forgot" ? "Enter the email linked to your account." : "Sign in to continue to your account."}</p><form action={submit} className="mt-6 space-y-4">{mode === "signup" && <Field id="name" label="Full name" autoComplete="name" required />}{mode !== "forgot" && <Field id="email" label="Email address" type="email" autoComplete="email" required />}{mode !== "forgot" && <Field id="password" label="Password" type="password" autoComplete={mode === "signup" ? "new-password" : "current-password"} required />}{mode === "forgot" && <Field id="email" label="Email address" type="email" autoComplete="email" required />}{error && <p role="alert" className="text-sm text-destructive">{error}</p>}<button className={`${buttonClass} w-full`} disabled={pending}>{pending ? "Please wait…" : labels[mode].submit}</button></form><div className="mt-5 flex flex-wrap justify-between gap-3 text-sm text-muted-foreground">{mode !== "login" ? <Link className="rounded-sm underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" href="/login">Sign in</Link> : <Link className="rounded-sm underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" href="/forgot-password">Forgot password?</Link>}{mode !== "signup" && <Link className="rounded-sm underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" href="/register">Create account</Link>}</div></section>;
}

function Field({ id, label, type = "text", ...props }: { id: string; label: string; type?: string; autoComplete?: string; required?: boolean; minLength?: number }) {
  return <div className="space-y-1.5"><label htmlFor={id} className="text-sm font-medium">{label}</label><input id={id} name={id} type={type} className={inputClass} {...props} /></div>;
}
