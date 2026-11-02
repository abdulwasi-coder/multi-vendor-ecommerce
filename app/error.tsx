"use client";

import {
  AppErrorFallback,
  type AppErrorFallbackProps,
} from "@/components/ui/app-error-fallback";

export default function AppError(props: AppErrorFallbackProps) {
  return <AppErrorFallback {...props} />;
}
