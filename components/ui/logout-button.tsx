"use client";

import { useState } from "react";
import { isAxiosError } from "axios";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { LoaderCircle, LogOut } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/axios";
import { SidebarMenuButton } from "@/components/ui/sidebar";

type LogoutButtonProps = {
  variant?: "default" | "sidebar";
  compact?: boolean;
  className?: string;
};

export function LogoutButton({
  variant = "default",
  compact = false,
  className = "",
}: LogoutButtonProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);
    try {
      await api.post("/authentication/logout");
      queryClient.clear();
      router.replace("/login");
    } catch (error) {
      const message = isAxiosError(error)
        ? error.response?.data?.message
        : error instanceof Error
          ? error.message
          : undefined;
      toast.error(
        typeof message === "string" && message.trim()
          ? message
          : "Could not log out. Please try again.",
      );
    } finally {
      setIsLoggingOut(false);
    }
  };

  const Icon = isLoggingOut ? LoaderCircle : LogOut;

  if (variant === "sidebar") {
    return (
      <SidebarMenuButton
        className={`flex items-center gap-2 ${className}`}
        onClick={() => void handleLogout()}
        disabled={isLoggingOut}
        tooltip="Log out"
        aria-label={isLoggingOut ? "Logging out" : "Log out"}
      >
        <Icon
          className={isLoggingOut ? "animate-spin" : ""}
          aria-hidden="true"
        />
        <span className="group-data-[collapsible=icon]:hidden group-data-[hover-expanded=true]:inline">
          Log out
        </span>
      </SidebarMenuButton>
    );
  }

  return (
    <button
      type="button"
      className={`inline-flex min-h-9 items-center justify-center gap-2 rounded-md px-3 text-sm font-medium transition hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-60 ${compact ? "size-9 min-h-9 px-2" : ""} ${className}`}
      onClick={() => void handleLogout()}
      disabled={isLoggingOut}
      aria-label={isLoggingOut ? "Logging out" : "Log out"}
      title="Log out"
    >
      <Icon
        className={`size-4 ${isLoggingOut ? "animate-spin" : ""}`}
        aria-hidden="true"
      />
      <span className={compact ? "sr-only" : ""}>Log out</span>
    </button>
  );
}