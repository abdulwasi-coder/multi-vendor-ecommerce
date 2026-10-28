"use client";

import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AccountPageShell } from "@/components/ui/customer/account-page-shell";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const FormValidator = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, "Enter your name.")
      .max(100, "Name is too long."),
    email: z
      .string()
      .trim()
      .min(1, "Enter your email address.")
      .max(254, "Email address is too long.")
      .email("Enter a valid email address."),
    password: z
      .string()
      .min(8, "Use a password with at least 8 characters.")
      .max(128, "Password must be 128 characters or fewer."),
    confirmPassword: z.string(),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "Your passwords don't match.",
    path: ["confirmPassword"],
  });

type SignupFormValues = z.infer<typeof FormValidator>;

export default function CustomerSignupPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(FormValidator),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  async function onSubmit(values: SignupFormValues) {
    try {
      const result = await api.post("/authentication/createAccount", {
        name: values.name,
        email: values.email,
        password: values.password,
      });
      if (result.data.success) {
        console.log(result.data.OTP)
        toast.message(`Your OTP is here. ${result.data.OTP}`, {
          description: "This is a porfolio project, so we reveal the OTP.",
        });
        router.push(`/verify-otp/${values.email}`);
      } else {
        const message = result.data.message ?? result.data.error;
        toast.error("Couldn't create your account.", {
          description:
            typeof message === "string" && message.trim()
              ? message
              : "Please check your details and try again.",
        });
      }
    } catch (error) {
      const apiError = error as {
        response?: {
          status?: number;
          data?: { message?: unknown; error?: unknown };
        };
      };
      const message =
        apiError.response?.data?.message ?? apiError.response?.data?.error;
      toast.error("Couldn't create your account.", {
        description:
          typeof message === "string" && message.trim() ? message
            :"An Error Occured, Please try again.",
      });
    }
  }

  return (
    <AccountPageShell>
      <section className="w-full max-w-100 rounded-lg border border-[#d5d9d9] px-7 py-6 shadow-sm sm:px-8">
        <h1 className="text-[30px] font-normal leading-9 tracking-tight">
          Create account
        </h1>
        <form
          className="mt-5 space-y-4"
          noValidate
          onSubmit={handleSubmit(onSubmit)}
        >
          <div>
            <label
              htmlFor="signup-name"
              className="mb-1 block text-sm font-bold"
            >
              Your name
            </label>
            <Input
              id="signup-name"
              autoComplete="name"
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? "signup-name-error" : undefined}
              {...register("name")}
              className="h-11 rounded-md border-[#888c8c] focus-visible:border-[#e77600] focus-visible:ring-2 focus-visible:ring-[#e77600]/35"
            />
            {errors.name && (
              <p
                id="signup-name-error"
                role="alert"
                className="mt-1 text-xs text-red-700"
              >
                {errors.name.message}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="signup-email"
              className="mb-1 block text-sm font-bold"
            >
              Email
            </label>
            <Input
              id="signup-email"
              type="email"
              autoComplete="email"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "signup-email-error" : undefined}
              {...register("email")}
              className="h-11 rounded-md border-[#888c8c] focus-visible:border-[#e77600] focus-visible:ring-2 focus-visible:ring-[#e77600]/35"
            />
            {errors.email && (
              <p
                id="signup-email-error"
                role="alert"
                className="mt-1 text-xs text-red-700"
              >
                {errors.email.message}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="signup-password"
              className="mb-1 block text-sm font-bold"
            >
              Password
            </label>
            <div className="relative">
              <Input
                id="signup-password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                aria-invalid={!!errors.password}
                aria-describedby={
                  errors.password
                    ? "signup-password-error"
                    : "signup-password-hint"
                }
                {...register("password")}
                className="h-11 rounded-md border-[#888c8c] pr-11 focus-visible:border-[#e77600] focus-visible:ring-2 focus-visible:ring-[#e77600]/35"
              />
              <button
                type="button"
                onClick={() => setShowPassword((visible) => !visible)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                aria-pressed={showPassword}
                className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#e77600]"
              >
                {showPassword ? (
                  <EyeOff aria-hidden="true" size={18} />
                ) : (
                  <Eye aria-hidden="true" size={18} />
                )}
              </button>
            </div>
            <p className="mt-1 text-xs text-[#565959]">
              Passwords must be at least 8 characters.
            </p>
            {errors.password && (
              <p
                id="signup-password-error"
                role="alert"
                className="mt-1 text-xs text-red-700"
              >
                {errors.password.message}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="signup-confirm-password"
              className="mb-1 block text-sm font-bold"
            >
              Re-enter password
            </label>
            <div className="relative">
              <Input
                id="signup-confirm-password"
                type={showConfirmPassword ? "text" : "password"}
                autoComplete="new-password"
                aria-invalid={!!errors.confirmPassword}
                aria-describedby={
                  errors.confirmPassword
                    ? "signup-confirm-password-error"
                    : undefined
                }
                {...register("confirmPassword")}
                className="h-11 rounded-md border-[#888c8c] pr-11 focus-visible:border-[#e77600] focus-visible:ring-2 focus-visible:ring-[#e77600]/35"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((visible) => !visible)}
                aria-label={
                  showConfirmPassword ? "Hide password" : "Show password"
                }
                aria-pressed={showConfirmPassword}
                className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#e77600]"
              >
                {showConfirmPassword ? (
                  <EyeOff aria-hidden="true" size={18} />
                ) : (
                  <Eye aria-hidden="true" size={18} />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p
                id="signup-confirm-password-error"
                role="alert"
                className="mt-1 text-xs text-red-700"
              >
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="h-11 w-full rounded-full border border-[#fcd200] bg-[#ffd814] text-sm font-normal text-[#0f1111] shadow-sm hover:border-[#f2c200] hover:bg-[#f7ca00]"
          >
            {isSubmitting ? "Sending..." : "Create your Marketly account"}
          </Button>
        </form>
        <p className="mt-4 text-xs leading-5 text-[#565959]">
          By creating an account, you agree to Marketly's{" "}
          <span className="text-[#007185]">Conditions of Use</span> and{" "}
          <span className="text-[#007185]">Privacy Notice</span>.
        </p>
        <div className="mt-5 border-t border-[#e7e7e7] pt-4 text-sm">
          <span>Already have an account? </span>
          <Link
            href="/login"
            className="text-[#007185] hover:text-[#c45500] hover:underline"
          >
            Sign in
          </Link>
        </div>
      </section>
    </AccountPageShell>
  );
}
