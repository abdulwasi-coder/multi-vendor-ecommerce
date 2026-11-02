"use client";

import {
  AppErrorFallback,
  type AppErrorFallbackProps,
} from "@/components/ui/app-error-fallback";

export default function GlobalError(props: AppErrorFallbackProps) {
  return (
    <html lang="en">
      <body>
        <AppErrorFallback {...props} />
      </body>
    </html>
  );
}
