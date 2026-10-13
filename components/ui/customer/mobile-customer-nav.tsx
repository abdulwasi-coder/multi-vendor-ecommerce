"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Menu, ShoppingBag, Store, Tag, TrendingUp, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const links = [
  { label: "Home", href: "/customer", icon: Store },
  { label: "Products", href: "/customer/products", icon: ShoppingBag },
  { label: "Sell", href: "/customer/sell", icon: Store },
  { label: "Top discounts", href: "/customer/top-discounts", icon: Tag },
  { label: "Top rated", href: "/customer/top-rated", icon: TrendingUp },
  { label: "Orders", href: "/customer/orders", icon: UserRound },
];

export function MobileCustomerNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex items-center justify-between gap-3 px-3 py-2 lg:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger
          render={
            <Button variant="outline" className="h-9 gap-2 border-white/20 bg-transparent px-3 text-white hover:bg-white/10 hover:text-white">
              <Menu className="size-4" aria-hidden="true" />
              <span>Browse</span>
            </Button>
          }
        />
        <SheetContent side="left" className="w-[min(86vw,340px)] gap-0 p-0">
          <SheetHeader className="border-b bg-[#131921] px-5 py-5 text-left text-white">
            <SheetTitle className="text-lg font-bold text-white">Shop Marketly</SheetTitle>
            <SheetDescription className="text-white/65">Browse the marketplace</SheetDescription>
          </SheetHeader>
          <nav aria-label="Mobile navigation" className="flex flex-col p-3">
            {links.map(({ label, href, icon: Icon }) => (
              <SheetClose
                key={label}
                render={<Link href={href} onClick={() => setOpen(false)} />}
                className="flex min-h-12 items-center gap-3 rounded-lg px-3 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 hover:text-zinc-950"
              >
                <Icon className="size-4 text-zinc-500" aria-hidden="true" />
                {label}
                <ArrowRight className="ml-auto size-4 text-zinc-400" aria-hidden="true" />
              </SheetClose>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
      <span className="truncate text-xs text-white/70">Find something good today</span>
    </div>
  );
}
