"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";
import { Toaster } from "sonner";

export function AppProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster
        position="bottom-center"
        theme="light"
        closeButton
        duration={3000}
        gap={10}
        visibleToasts={2}
        offset={24}
        mobileOffset={{ bottom: "calc(env(safe-area-inset-bottom) + 16px)" }}
        toastOptions={{
          classNames: {
            toast: "rounded-xl border border-zinc-200 bg-white shadow-xl shadow-zinc-900/10",
            title: "text-sm font-semibold text-zinc-900",
            description: "text-sm text-zinc-600",
            success: "border-[#c7d9cb] bg-[#f6fbf6]",
            error: "border-[#e8cfcc] bg-[#fff8f7]",
            actionButton: "rounded-md bg-[#19392f] px-3 text-white hover:bg-[#285447]",
            closeButton: "border-zinc-200 bg-white text-zinc-500 hover:bg-zinc-100",
          },
        }}
      />
    </QueryClientProvider>
  );
}
