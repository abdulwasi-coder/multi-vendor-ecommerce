"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AccountPageShell } from "@/components/ui/customer/account-page-shell";

export default function CustomerLoginPage() {
  const [account, setAccount] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    toast.error("Sign in is not connected yet.", {
      description: "Connect the authentication service to sign in to your account.",
    });
  }

  return (
    <AccountPageShell>
      <section className="w-full max-w-[400px] rounded-lg border border-[#d5d9d9] px-7 py-6 shadow-sm sm:px-8">
        <h1 className="text-[30px] font-normal leading-9 tracking-tight">Sign in</h1>
        <form className="mt-5" onSubmit={handleSubmit}>
          <label htmlFor="login-account" className="mb-1 block text-sm font-bold">Email or mobile number</label>
          <Input id="login-account" name="account" autoComplete="username" required value={account} onChange={(event) => setAccount(event.target.value)} className="h-11 rounded-md border-[#888c8c] focus-visible:border-[#e77600] focus-visible:ring-2 focus-visible:ring-[#e77600]/35" />

          <div className="mb-1 mt-4 flex items-center justify-between gap-3">
            <label htmlFor="login-password" className="text-sm font-bold">Password</label>
            <Link href="/customer/forget-password" className="text-sm text-[#007185] hover:text-[#c45500] hover:underline">Forgot your password?</Link>
          </div>
          <Input id="login-password" name="password" type="password" autoComplete="current-password" required className="h-11 rounded-md border-[#888c8c] focus-visible:border-[#e77600] focus-visible:ring-2 focus-visible:ring-[#e77600]/35" />

          <Button type="submit" className="mt-6 h-11 w-full rounded-full border border-[#fcd200] bg-[#ffd814] text-sm font-normal text-[#0f1111] shadow-sm hover:border-[#f2c200] hover:bg-[#f7ca00]">Sign in</Button>
        </form>

        <p className="mt-4 text-xs leading-5 text-[#565959]">By continuing, you agree to Marketly’s <span className="text-[#007185]">Conditions of Use</span> and <span className="text-[#007185]">Privacy Notice</span>.</p>
        <div className="mt-5 border-t border-[#e7e7e7] pt-4">
          <p className="flex items-center gap-1 text-sm font-semibold"><ChevronRight className="size-4 text-[#565959]" /> Shopping for your business?</p>
          <Link href="/customer/sell" className="ml-5 text-sm text-[#007185] hover:text-[#c45500] hover:underline">Explore selling on Marketly</Link>
        </div>
      </section>

      <div className="my-5 flex w-full max-w-[400px] items-center gap-3 text-xs text-[#767676] before:h-px before:flex-1 before:bg-[#e7e7e7] after:h-px after:flex-1 after:bg-[#e7e7e7]">New to Marketly?</div>
      <Button render={<Link href="/customer/signup" />} variant="outline" className="h-10 w-full max-w-[400px] rounded-full border-[#adb1b8] bg-white text-sm font-normal text-[#0f1111] shadow-sm hover:bg-[#f7fafa]">Create your Marketly account</Button>
    </AccountPageShell>
  );
}
