"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, Mail, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ForgetPasswordPage() {
  const [account, setAccount] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    if (!account.trim()) {
      toast.error("Enter your email address.");
      return;
    }

    toast.error("Password recovery is not connected yet.", {
      description: "Connect the authentication service to send a password reset link.",
    });
  }

  return (
    <main className="flex min-h-screen flex-col items-center bg-white px-4 pt-5 text-[#0f1111]">
      <Link href="/customer" aria-label="Marketly home" className="mb-5 text-[32px] font-bold tracking-tight text-[#111]">
        marketly<span className="text-[#f3a847]">.</span>
      </Link>

      <section className="w-full max-w-[468px] rounded-lg border border-[#d5d9d9] bg-white px-7 py-7 shadow-sm sm:px-9 sm:py-8">
        <h1 className="border-b border-[#d5d9d9] pb-4 text-[30px] font-normal leading-9 tracking-tight">Forgot your password?</h1>
        <div className="mt-5 flex items-start gap-3">
          <span className="grid size-11 shrink-0 place-items-center rounded-full bg-[#f3f4f4] text-[#232f3e]"><Mail className="size-5" /></span>
          <p className="pt-1 text-sm leading-5">Enter the email address linked to your account and we’ll send you a link to reset your password.</p>
        </div>

        <form className="mt-6" onSubmit={handleSubmit}>
          <label htmlFor="account-identifier" className="mb-1 block text-sm font-bold">Email address</label>
          <Input
            id="account-identifier"
            name="account"
            type="text"
            autoComplete="username"
            value={account}
            onChange={(event) => setAccount(event.target.value)}
            className="h-11 rounded-md border-[#888c8c] focus-visible:border-[#e77600] focus-visible:ring-2 focus-visible:ring-[#e77600]/35"
          />
          <Button type="submit" className="mt-5 h-11 w-full rounded-full border border-[#fcd200] bg-[#ffd814] text-sm font-normal text-[#0f1111] shadow-sm hover:border-[#f2c200] hover:bg-[#f7ca00]">
            Send reset link
          </Button>
        </form>

        <div className="mt-5 flex items-start gap-2 border-t border-[#e7e7e7] pt-4 text-xs leading-5 text-[#565959]">
          <ShieldCheck className="mt-0.5 size-4 shrink-0 text-[#007600]" />
          <p>If an account matches, we’ll send instructions to help you reset its password.</p>
        </div>

        <Link href="/customer" className="mt-5 inline-flex items-center gap-2 text-sm text-[#007185] hover:text-[#c45500] hover:underline">
          <ArrowLeft className="size-4" /> Back to Marketly
        </Link>
      </section>

      <footer className="mt-auto w-full max-w-[1200px] pb-7 pt-10 text-center text-xs text-[#565959]">
        <div className="mb-6 border-t border-[#d5d9d9]" />
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-[#007185]">
          <span>Conditions of Use</span>
          <span>Privacy Notice</span>
          <span>Help</span>
          <span>Contact</span>
        </div>
        <p className="mt-4">© {new Date().getFullYear()} Marketly. All rights reserved.</p>
      </footer>
    </main>
  );
}
