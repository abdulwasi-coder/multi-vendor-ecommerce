"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { LogoutButton } from "@/components/ui/logout-button";

interface UserProfileResponse {
  success: boolean;
  userData?: { name?: string };
}

async function getCustomerProfile() {
  const response = await fetch("/proxy-backend/user/userProfile", {
    credentials: "include",
    cache: "no-store",
  });
  if (!response.ok) return null;

  const result = (await response.json()) as UserProfileResponse;
  return result.success ? result.userData ?? null : null;
}

export function CustomerAccountActions() {
  const { data: user } = useQuery({
    queryKey: ["customer-account-profile"],
    queryFn: getCustomerProfile,
    retry: false,
    staleTime: 60_000,
  });

  if (!user) {
    return (
      <Link
        href="/login"
        className="hidden shrink-0 rounded-sm border border-transparent px-2 py-1 hover:border-white sm:block"
      >
        <span className="block text-[11px] text-white/70">Hello, sign in</span>
        <span className="block text-sm font-bold">Account</span>
      </Link>
    );
  }

  return (
    <div className="flex shrink-0 items-center gap-1 sm:gap-2">
      <Link
        href="/customer/orders"
        className="hidden rounded-sm border border-transparent px-2 py-1 hover:border-white sm:block"
      >
        <span className="block text-[11px] text-white/70">
          Hello, {user.name || "there"}
        </span>
        <span className="block text-sm font-bold">Account</span>
      </Link>
      <LogoutButton
        compact
        className="border border-transparent text-white hover:border-white hover:bg-white/10 hover:text-white"
      />
    </div>
  );
}