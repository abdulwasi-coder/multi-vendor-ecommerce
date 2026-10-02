"use client";

import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  function toggleTheme() {
    const root = document.documentElement;
    const nextIsDark = !root.classList.contains("dark");

    root.classList.add("theme-switching");
    root.classList.toggle("dark", nextIsDark);
    root.style.colorScheme = nextIsDark ? "dark" : "light";

    try {
      window.localStorage.setItem("town-market-theme", nextIsDark ? "dark" : "light");
    } catch {
      // The current theme still changes when persistent storage is unavailable.
    }

    window.setTimeout(() => root.classList.remove("theme-switching"), 220);
  }

  return (
    <button
      type="button"
      aria-label="Switch between light and dark theme"
      title="Switch between light and dark theme"
      onClick={toggleTheme}
      className="inline-flex size-11 shrink-0 items-center justify-center rounded-lg transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <Sun aria-hidden="true" size={19} className="dark:hidden" />
      <Moon aria-hidden="true" size={19} className="hidden dark:block" />
    </button>
  );
}
