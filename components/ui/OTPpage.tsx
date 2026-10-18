"use client";

import Link from "next/link";
import { Check, KeyRound, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";

const FormValidator = z.object({
  otp: z.string().regex(/^\d{6}$/, "Enter a valid 6-digit code."),
});

type FormValues = z.infer<typeof FormValidator>;

export default function OTPValidator({ email }: { email: string }) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(FormValidator),
    defaultValues: { otp: "" },
  });

  function handleResend() {
    toast("Code delivery is not connected yet.", {
      description: "Connect the authentication API to send a new code.",
    });
  }

  async function onSubmit(values: FormValues) {
    try {
      const response = await api.post("/authentication/otpRequest", {
        clientOTP: values.otp,
        email,
      });

      const result = response?.data ?? response;

      if (result?.success) {
        router.push("/customer");
        return;
      }

      toast.error("Code verification failed", {
        description: result?.message ?? result,
      });
    } catch (error) {
      toast.error("Code verification failed", {
        description: `${error}`,
      });
      console.error("OTP verification request failed:", error);
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center bg-white px-4 pt-5 text-[#0f1111]">
      <Link
        href="/customer"
        aria-label="Marketly home"
        className="mb-5 text-[32px] font-bold tracking-tight text-[#111]"
      >
        marketly<span className="text-[#f3a847]">.</span>
      </Link>

      <section className="w-full max-w-117 rounded-lg border border-[#d5d9d9] bg-white px-7 py-7 shadow-sm sm:px-9 sm:py-8">
        <h1 className="border-b border-[#d5d9d9] pb-4 text-[30px] font-normal leading-9 tracking-tight">
          Verify your email
        </h1>

        <div className="mt-5 flex items-center gap-3">
          <span className="grid size-14 shrink-0 place-items-center rounded-full bg-[#c9d2d2] text-white">
            <KeyRound className="size-7" />
          </span>
          <div>
            <p className="font-medium">One-time password</p>
            <p className="mt-0.5 text-sm text-[#565959]">
              Enter the 6-digit code sent to your email address
            </p>
          </div>
        </div>

        <form className="mt-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-1 flex items-center justify-between gap-3">
            <label htmlFor="otp-code" className="text-sm font-bold">
              Enter OTP
            </label>
            <button
              type="button"
              onClick={handleResend}
              className="text-sm text-[#007185] hover:text-[#c45500] hover:underline"
            >
              Resend code
            </button>
          </div>
          <Input
            id="otp-code"
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            pattern="[0-9]{6}"
            maxLength={6}
            {...register("otp", {
              setValueAs: (value: string) =>
                value.replace(/\D/g, "").slice(0, 6),
            })}
            aria-invalid={!!errors.otp}
            aria-describedby={errors.otp ? "otp-help otp-error" : "otp-help"}
            className="h-11 rounded-md border-[#888c8c] text-lg tracking-[0.45em] focus-visible:border-[#e77600] focus-visible:ring-2 focus-visible:ring-[#e77600]/35"
          />
          <p id="otp-help" className="mt-2 text-xs leading-4 text-[#565959]">
            For your security, never share this code with anyone.
          </p>
          {errors.otp && (
            <p
              id="otp-error"
              className="mt-1 text-sm text-red-600"
              role="alert"
            >
              {errors.otp.message}
            </p>
          )}

          <Button
            type="submit"
            disabled={isSubmitting}
            className="mt-6 h-11 w-full rounded-full border border-[#fcd200] bg-[#ffd814] text-sm font-normal text-[#0f1111] shadow-sm hover:border-[#f2c200] hover:bg-[#f7ca00]"
          >
            <ShieldCheck className="size-4" /> Verify and continue
          </Button>
        </form>

        <div className="mt-5 flex items-start gap-2 border-t border-[#e7e7e7] pt-4 text-xs leading-5 text-[#565959]">
          <Check className="mt-0.5 size-4 shrink-0 text-[#007600]" />
          <p>
            Keep your one-time password private. Marketly will never ask you to
            share it.
          </p>
        </div>
      </section>

      <footer className="mt-auto w-full max-w-300 pb-7 pt-10 text-center text-xs text-[#565959]">
        <div className="mb-6 border-t border-[#d5d9d9]" />
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-[#007185]">
          <span>Conditions of Use</span>
          <span>Privacy Notice</span>
          <span>Help</span>
          <span>Contact</span>
        </div>
        <p className="mt-4">
          © {new Date().getFullYear()} Marketly. All rights reserved.
        </p>
      </footer>
    </main>
  );
}
