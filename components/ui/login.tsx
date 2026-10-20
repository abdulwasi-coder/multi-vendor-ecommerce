"use client";

import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AccountPageShell } from "@/components/ui/customer/account-page-shell";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginFunction() {
  const router = useRouter();
  const [error, setError] = useState("");
  const formSchema = z.object({
    email: z
      .string()
      .trim()
      .regex(
        /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Enter a valid email address.",
      )
      .refine((value) => !/^\d+$/.test(value), "Enter a valid email address."),
    password: z.string().min(6, "Password must be at least 8 characters."),
  });

  type FormValues = z.infer<typeof formSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: FormValues) {
    try {
      const response = await api.post(
        "/authentication/login",
        {
          email: values.email,
          password: values.password,
        }
      );

      if (response.data.success && response.data.Role === "vendor") {
        router.push("/vendor/dashboard");
        return;
      }
      if (response.data.success && response.data.Role === "admin") {
        router.push("/admin/dashboard");
        return;
      }
      if (response.data.success) {
        router.push("/");
        return;
      }
    } catch (error:any) {
      console.log(error)
      if(error.reponse){
        setError(error.response.data.message)
      }
    }
  }

  function handleForgetClick(): void {
    toast.info("Password reset isn't available", {
      description:
        "This is a portfolio project, so no password reset emails are sent.",
    });
  }

  return (
    <AccountPageShell>
      <section className="w-full max-w-100 rounded-lg border border-[#d5d9d9] px-7 py-6 shadow-sm sm:px-8">
        <h1 className="text-[30px] font-normal leading-9 tracking-tight">
          Sign in
        </h1>
        {error ? <span className="pt-2 text-red-500">{error}</span> : undefined}
        <form className="mt-5" onSubmit={handleSubmit(onSubmit)} noValidate>
          <label
            htmlFor="login-account"
            className="mb-1 block text-sm font-bold"
          >
            Email
          </label>
          <Input
            id="login-account"
            type="email"
            autoComplete="username"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "login-email-error" : undefined}
            {...register("email")}
            className="h-11 rounded-md border-[#888c8c] focus-visible:border-[#e77600] focus-visible:ring-2 focus-visible:ring-[#e77600]/35"
          />
          {errors.email && (
            <p id="login-email-error" className="mt-1 text-sm text-red-600">
              {errors.email.message}
            </p>
          )}

          <div className="mb-1 mt-4 flex items-center justify-between gap-3">
            <label htmlFor="login-password" className="text-sm font-bold">
              Password
            </label>
            <Button
              type="button"
              variant="ghost"
              onClick={handleForgetClick}
              className="text-sm hover:bg-background text-[#007185] hover:text-[#c45500] hover:underline"
            >
              Forgot your password?
            </Button>
          </div>
          <Input
            id="login-password"
            type="password"
            autoComplete="current-password"
            aria-invalid={Boolean(errors.password)}
            aria-describedby={
              errors.password ? "login-password-error" : undefined
            }
            {...register("password")}
            className="h-11 rounded-md border-[#888c8c] focus-visible:border-[#e77600] focus-visible:ring-2 focus-visible:ring-[#e77600]/35"
          />
          {errors.password && (
            <p id="login-password-error" className="mt-1 text-sm text-red-600">
              {errors.password.message}
            </p>
          )}

          <Button
            type="submit"
            disabled={isSubmitting}
            className="mt-6 h-11 w-full rounded-full border border-[#fcd200] bg-[#ffd814] text-sm font-normal text-[#0f1111] shadow-sm hover:border-[#f2c200] hover:bg-[#f7ca00]"
          >
            {isSubmitting ? "Signing in..." : "Sign in"}
          </Button>
        </form>

        <p className="mt-4 text-xs leading-5 text-[#565959]">
          By continuing, you agree to Marketly's{" "}
          <span className="text-[#007185]">Conditions of Use</span> and{" "}
          <span className="text-[#007185]">Privacy Notice</span>.
        </p>
      </section>

      <div className="my-5 flex w-full max-w-100 items-center gap-3 text-xs text-[#767676] before:h-px before:flex-1 before:bg-[#e7e7e7] after:h-px after:flex-1 after:bg-[#e7e7e7]">
        New to Marketly?
      </div>
      <Link
        href="/signup"
        className="flex h-11 w-full max-w-100 items-center justify-center rounded-full border border-[#adb1b8] bg-white text-sm font-medium text-[#0f1111] shadow-sm transition-colors hover:border-[#888c8c] hover:bg-[#f7fafa] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e77600] focus-visible:ring-offset-2"
      >
        Create your Marketly account
      </Link>
    </AccountPageShell>
  );
}
