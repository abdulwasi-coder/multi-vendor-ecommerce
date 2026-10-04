"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  LayoutDashboard,
  Package,
  ScrollText,
  Store,
  WalletCards,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const navigation = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Vendors", href: "/vendors", icon: Store },
  { label: "Products", href: "/products", icon: Package },
  { label: "Payouts", href: "/payouts", icon: WalletCards },
  { label: "Ledger", href: "/ledger/pages", icon: ScrollText },
]

export default function AdminLayout({ children }) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className="min-h-screen bg-muted/30 md:flex">
      <aside
        className={cn(
          "flex shrink-0 flex-col border-b border-border bg-card transition-[width] duration-200 md:sticky md:top-0 md:h-screen md:border-r md:border-b-0",
          collapsed ? "md:w-[76px]" : "md:w-[250px]",
        )}
      >
        <div className={cn("flex h-[72px] items-center border-b border-border px-4", collapsed && "md:justify-center md:px-2")}>
          <Link href="/dashboard" className="flex min-w-0 items-center gap-3" aria-label="MarketHub admin home">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
              <Store className="size-5" />
            </span>
            <span className={cn("min-w-0", collapsed && "md:hidden")}>
              <span className="block truncate text-sm font-semibold tracking-tight">MarketHub</span>
              <span className="block text-xs text-muted-foreground">Admin panel</span>
            </span>
          </Link>
        </div>

        <div className={cn("px-3 pt-6 pb-2 text-[11px] font-medium tracking-[0.12em] text-muted-foreground uppercase", collapsed && "md:px-0 md:text-center")}>
          <span className={collapsed ? "hidden md:inline" : ""}>{collapsed ? "•••" : "Workspace"}</span>
        </div>
        <nav aria-label="Admin navigation" className="flex flex-1 flex-row gap-1 overflow-x-auto px-3 pb-3 md:flex-col md:overflow-visible">
          {navigation.map((item) => {
            const Icon = item.icon
            const active = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href))
            return (
              <Link
                key={item.href}
                href={item.href}
                title={collapsed ? item.label : undefined}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex h-10 shrink-0 items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors",
                  "hover:bg-muted hover:text-foreground",
                  active ? "bg-primary/10 text-primary" : "text-muted-foreground",
                  collapsed && "md:justify-center md:px-0",
                )}
              >
                <Icon className="size-[18px] shrink-0" />
                <span className={collapsed ? "hidden md:hidden" : ""}>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="hidden px-3 pb-3 md:block">
          <div className={cn("mb-3 rounded-xl border border-border bg-muted/50 p-3", collapsed && "border-0 bg-transparent px-0 text-center")}>
            <div className={cn("flex items-center gap-2", collapsed && "justify-center")}>
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-background text-muted-foreground ring-1 ring-border"><CircleHelp className="size-4" /></span>
              <div className={cn("min-w-0", collapsed && "hidden")}>
                <p className="text-xs font-medium">Need a hand?</p>
                <p className="truncate text-[11px] text-muted-foreground">Visit help center</p>
              </div>
            </div>
          </div>
          <Button
            type="button"
            variant="outline"
            size={collapsed ? "icon" : "sm"}
            className={cn("w-full bg-background text-muted-foreground", collapsed && "mx-auto")}
            onClick={() => setCollapsed((value) => !value)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronRight /> : <><ChevronLeft /><span>Collapse menu</span></>}
          </Button>
        </div>

        <div className="flex items-center gap-3 border-t border-border px-4 py-3 md:hidden">
          <span className="flex size-8 items-center justify-center rounded-full bg-muted text-xs font-semibold">AM</span>
          <div><p className="text-sm font-medium">Admin Manager</p><p className="text-xs text-muted-foreground">Marketplace admin</p></div>
        </div>
      </aside>

      <div className="min-w-0 flex-1">{children}</div>
    </div>
  )
}
