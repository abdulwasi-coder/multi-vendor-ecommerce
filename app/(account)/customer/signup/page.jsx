"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AccountPageShell } from "@/components/ui/customer/account-page-shell";

export default function CustomerSignupPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    if (password.length < 8) {
      toast.error("Use a password with at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Your passwords don’t match.");
      return;
    }

    toast.error("Account creation is not connected yet.", {
      description: "Connect the authentication service to create your Marketly account.",
    });
  }

  return (
    <AccountPageShell>
      <section className="w-full max-w-[400px] rounded-lg border border-[#d5d9d9] px-7 py-6 shadow-sm sm:px-8">
        <h1 className="text-[30px] font-normal leading-9 tracking-tight">Create account</h1>
        <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="signup-name" className="mb-1 block text-sm font-bold">Your name</label>
            <Input id="signup-name" name="name" autoComplete="name" required className="h-11 rounded-md border-[#888c8c] focus-visible:border-[#e77600] focus-visible:ring-2 focus-visible:ring-[#e77600]/35" />
          </div>
          <div>
            <label htmlFor="signup-account" className="mb-1 block text-sm font-bold">Email or mobile number</label>
            <Input id="signup-account" name="account" autoComplete="username" required className="h-11 rounded-md border-[#888c8c] focus-visible:border-[#e77600] focus-visible:ring-2 focus-visible:ring-[#e77600]/35" />
          </div>
          <div>
            <label htmlFor="signup-password" className="mb-1 block text-sm font-bold">Password</label>
            <Input id="signup-password" name="password" type="password" autoComplete="new-password" required value={password} onChange={(event) => setPassword(event.target.value)} className="h-11 rounded-md border-[#888c8c] focus-visible:border-[#e77600] focus-visible:ring-2 focus-visible:ring-[#e77600]/35" />
            <p className="mt-1 text-xs text-[#565959]">Passwords must be at least 8 characters.</p>
          </div>
          <div>
            <label htmlFor="signup-confirm-password" className="mb-1 block text-sm font-bold">Re-enter password</label>
            <Input id="signup-confirm-password" name="confirmPassword" type="password" autoComplete="new-password" required value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} className="h-11 rounded-md border-[#888c8c] focus-visible:border-[#e77600] focus-visible:ring-2 focus-visible:ring-[#e77600]/35" />
          </div>
          <Button type="submit" className="h-11 w-full rounded-full border border-[#fcd200] bg-[#ffd814] text-sm font-normal text-[#0f1111] shadow-sm hover:border-[#f2c200] hover:bg-[#f7ca00]">Create your Marketly account</Button>
        </form>
        <p className="mt-4 text-xs leading-5 text-[#565959]">By creating an account, you agree to Marketly’s <span className="text-[#007185]">Conditions of Use</span> and <span className="text-[#007185]">Privacy Notice</span>.</p>
        <div className="mt-5 border-t border-[#e7e7e7] pt-4 text-sm">
          <span>Already have an account? </span>
          <Link href="/customer/login" className="text-[#007185] hover:text-[#c45500] hover:underline">Sign in</Link>
        </div>
      </section>
    </AccountPageShell>
  );
}
