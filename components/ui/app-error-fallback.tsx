"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export interface AppErrorFallbackProps {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}

export function AppErrorFallback({
  error,
  unstable_retry,
}: AppErrorFallbackProps) {
  useEffect(() => {
    console.error("Application route failed to render:", error);
  }, [error]);

  return (
    <main className="mx-auto flex min-h-[50vh] w-full max-w-2xl flex-col items-center justify-center gap-4 px-6 text-center">
      <div>
        <h1 className="text-xl font-semibold">Something went wrong</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          This page encountered an unexpected error.
        </p>
        {process.env.NODE_ENV === "development" && (
          <pre className="mt-4 max-w-full overflow-auto rounded-md bg-muted p-3 text-left text-xs">
            {error.message}
          </pre>
        )}
        {error.digest && (
          <p className="mt-3 text-xs text-muted-foreground">
            Error reference: {error.digest}
          </p>
        )}
      </div>
      <Button type="button" onClick={() => unstable_retry()}>
        Try again
      </Button>
    </main>
  );
}
