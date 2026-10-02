import type { Metadata } from "next";

import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import { AppProvider } from "./providers/app-provider";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});
const themeInitScript = `(() => {
  try {
    const storedTheme = localStorage.getItem("town-market-theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const theme = storedTheme === "dark" || (storedTheme !== "light" && prefersDark) ? "dark" : "light";
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    root.style.colorScheme = theme;
  } catch {}
})();`;

export const metadata: Metadata = {
  title: "Town Market | Thoughtful finds for everyday life",
  description: "Shop independent marketplace finds and everyday essentials at Town Market.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full", "font-sans", geist.variable)}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-full flex flex-col">
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
