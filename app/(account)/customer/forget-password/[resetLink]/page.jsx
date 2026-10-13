"use client";

import Link from "next/link";
import { useState } from "react";
import { KeyRound } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AccountPageShell } from "@/components/ui/customer/account-page-shell";

export default function ResetPasswordPage() {
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

    toast.error("Password reset is not connected yet.", {
      description: "Connect the authentication service to save your new password.",
    });
  }

  return (
    <AccountPageShell>
      <section className="w-full max-w-[468px] rounded-lg border border-[#d5d9d9] px-7 py-7 shadow-sm sm:px-9">
        <h1 className="border-b border-[#d5d9d9] pb-4 text-[30px] font-normal leading-9 tracking-tight">Create a new password</h1>
        <div className="mt-5 flex items-start gap-3 text-sm leading-5">
          <span className="grid size-10 shrink-0 place-items-center rounded-full bg-[#f3f4f4] text-[#232f3e]"><KeyRound className="size-5" /></span>
          <p>Choose a new password for your Marketly account.</p>
        </div>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="new-password" className="mb-1 block text-sm font-bold">New password</label>
            <Input id="new-password" name="password" type="password" autoComplete="new-password" required value={password} onChange={(event) => setPassword(event.target.value)} className="h-11 rounded-md border-[#888c8c] focus-visible:border-[#e77600] focus-visible:ring-2 focus-visible:ring-[#e77600]/35" />
            <p className="mt-1 text-xs text-[#565959]">Use at least 8 characters.</p>
          </div>
          <div>
            <label htmlFor="confirm-password" className="mb-1 block text-sm font-bold">Re-enter new password</label>
            <Input id="confirm-password" name="confirmPassword" type="password" autoComplete="new-password" required value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} className="h-11 rounded-md border-[#888c8c] focus-visible:border-[#e77600] focus-visible:ring-2 focus-visible:ring-[#e77600]/35" />
          </div>
          <Button type="submit" className="h-11 w-full rounded-full border border-[#fcd200] bg-[#ffd814] text-sm font-normal text-[#0f1111] shadow-sm hover:border-[#f2c200] hover:bg-[#f7ca00]">Save new password</Button>
        </form>

        <Link href="/customer/login" className="mt-5 inline-block text-sm text-[#007185] hover:text-[#c45500] hover:underline">Back to sign in</Link>
      </section>
    </AccountPageShell>
  );
}
