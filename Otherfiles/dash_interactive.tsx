"use client";

export const orders = [
  {
    id: "#ORD-8294",
    customer: "Olivia Martin",
    country: "Canada",
    vendor: "Northstar Goods",
    date: "May 31, 2025",
    amount: "$248.00",
  },
  {
    id: "#ORD-8293",
    customer: "Jackson Lee",
    country: "London",
    vendor: "Field & Form",
    date: "May 31, 2025",
    amount: "$129.50",
  },
  {
    id: "#ORD-8292",
    customer: "Isabella Nguyen",
    vendor: "Mono Studio",
    country: "Afghanistan",
    date: "May 30, 2025",
    amount: "$384.00",
  },
  {
    id: "#ORD-8291",
    customer: "William Kim",
    country: "Island",
    vendor: "Northstar Goods",
    date: "May 30, 2025",
    amount: "$76.25",
  },
  {
    id: "#ORD-8290",
    customer: "Sofia Davis",
    country: "Germany",
    vendor: "Sunday Supply",
    date: "May 29, 2025",
    amount: "$212.00",
  },
];

import { useState } from "react";
import {
  ArrowRight,
  ChevronDown,
  Download,
  Search,
  Verified,
  View,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function DropdownMenuCustom({ data = [] }: { data?: string[] }) {
  const [current, setCurrent] = useState("1 Year");

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center gap-0.5 border rounded-md px-3 h-8 text-sm font-medium bg-background">
          <span>{current}</span>
          <ChevronDown className="size-4 opacity-50" />
        </DropdownMenuTrigger>

        <DropdownMenuContent side="bottom" align="end" className="w-44">
          {data.map((item: string) => (
            <DropdownMenuItem
              key={item}
              onClick={() => setCurrent(item)}
              className="cursor-pointer"
            >
              {item}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      <Button
        variant="outline"
        className="flex items-center gap-0.5 border rounded-md  text-sm font-medium bg-background"
      >
        <Download />
        <span className="hidden sm:inline ">Export</span>
      </Button>
    </div>
  );
}

export function PendingVendor() {
  const [search, setSearch] = useState("");
  const filteredOrders = orders.filter((order) => `${order.customer} ${order.vendor} ${order.date}`.toLowerCase().includes(search.toLowerCase()));

  return (
    <Card className="2xl:col-span-3">
      <CardHeader className="gap-4">
        <div className="space-y-1">
          <CardTitle>Recent Pending Vendors</CardTitle>
          <CardDescription>Review New Pending Sellers</CardDescription>
        </div>
        <div className="relative w-full">
          <Search className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search vendors..."
            className="pl-9"
            aria-label="Search orders"
          />
        </div>
      </CardHeader>
      <CardContent className="px-0 pb-2">
        <div className="space-y-3 px-4 pb-3 2xl:hidden">
          {filteredOrders.map((order) => (
            <article key={order.id} className="rounded-xl border bg-card p-3 transition-colors hover:border-violet-300/70 hover:bg-violet-50/30 dark:hover:border-violet-900 dark:hover:bg-violet-950/15">
              <div className="flex items-start justify-between gap-3"><div className="min-w-0"><p className="truncate font-medium">{order.customer}</p><p className="mt-0.5 truncate text-sm text-muted-foreground">{order.vendor}</p></div><span className="shrink-0 text-xs text-muted-foreground">{order.date}</span></div>
              <div className="mt-3 flex justify-end gap-2 border-t pt-3"><Button size="icon-sm" variant="outline" aria-label={`View ${order.customer}`}><View /></Button><Button size="icon-sm" variant="outline" aria-label={`Approve ${order.customer}`}><Verified /></Button></div>
            </article>
          ))}
          {filteredOrders.length === 0 && <p className="py-6 text-center text-sm text-muted-foreground">No vendors found.</p>}
        </div>
        <div className="hidden 2xl:block"><Table className="w-full table-fixed">
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[30%] pl-4">Name</TableHead>
              <TableHead className="w-[26%]">Store</TableHead>
              <TableHead className="w-[24%]">Joined</TableHead>
              <TableHead className="w-[20%] text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="pl-4 font-medium">{order.customer}</TableCell>
                <TableCell>{order.vendor}</TableCell>
                <TableCell>{order.date}</TableCell>
                <TableCell className="text-center">
                  <div className="inline-flex items-center justify-center gap-1">
                    <Button size="icon-sm" variant="outline" className="text-yellow-600 dark:text-yellow-400" aria-label={`View ${order.customer}`}><View /></Button>
                    <Button size="icon-sm" variant="outline" className="text-emerald-700 dark:text-emerald-400" aria-label={`Approve ${order.customer}`}><Verified /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table></div>
        <div className="flex items-center justify-between px-6 pt-4 text-xs text-muted-foreground">
          <span>Showing {filteredOrders.length} of {orders.length} orders</span>
          <Button variant="ghost" size="sm" className="-mr-2">
            View all <ArrowRight />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export function PendingOrders() {
  const [search, setSearch] = useState("");
  const filteredOrders = orders.filter((order) => `${order.id} ${order.customer} ${order.country}`.toLowerCase().includes(search.toLowerCase()));

  return (
    <Card className="2xl:col-span-4">
      <CardHeader className="gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <CardTitle>Pending Transfers</CardTitle>
          <CardDescription>See, Approve And Transfer The Money</CardDescription>
        </div>
        <div className="relative w-full sm:w-60">
          <Search className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search orders..."
            className="pl-9"
            aria-label="Search orders"
          />
        </div>
      </CardHeader>
      <CardContent className="px-0 pb-2">
        <div className="space-y-3 px-4 pb-3 2xl:hidden">
          {filteredOrders.map((order) => (
            <article key={order.id} className="rounded-xl border bg-card p-3 transition-colors hover:border-amber-300/70 hover:bg-amber-50/30 dark:hover:border-amber-900 dark:hover:bg-amber-950/15">
              <div className="flex items-start justify-between gap-3"><div className="min-w-0"><p className="truncate font-medium">{order.customer}</p><p className="mt-0.5 font-mono text-xs text-muted-foreground">{order.id}</p></div><span className="shrink-0 font-semibold tabular-nums">{order.amount}</span></div>
              <div className="mt-3 flex items-center justify-between gap-3 border-t pt-3"><span className="truncate text-sm text-muted-foreground">{order.country}</span><div className="flex shrink-0 gap-2"><Button size="icon-sm" variant="outline" aria-label={`View transfer ${order.id}`}><View /></Button><Button size="icon-sm" variant="outline" aria-label={`Approve transfer ${order.id}`}><Verified /></Button></div></div>
            </article>
          ))}
          {filteredOrders.length === 0 && <p className="py-6 text-center text-sm text-muted-foreground">No transfers found.</p>}
        </div>
        <div className="hidden 2xl:block"><Table className="w-full table-fixed">
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="pl-6">userID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Country</TableHead>
              <TableHead className="hidden sm:table-cell">Amount</TableHead>
              <TableHead className="w-24 min-w-24 text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
              {filteredOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="pl-6 font-medium">{order.id}</TableCell>
                <TableCell>{order.customer}</TableCell>
                <TableCell>{order.country}</TableCell>
                <TableCell className="font-medium">{order.amount}</TableCell>
                <TableCell className="w-24 min-w-24 text-center">
                  <div className="inline-flex items-center justify-center gap-1">
                    <Button size="icon-sm" variant="outline" className="text-yellow-600 dark:text-yellow-400" aria-label={`View transfer ${order.id}`}><View /></Button>
                    <Button size="icon-sm" variant="outline" className="text-emerald-700 dark:text-emerald-400" aria-label={`Approve transfer ${order.id}`}><Verified /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table></div>
        <div className="flex items-center justify-between px-6 pt-4 text-xs text-muted-foreground">
          <span>Showing {filteredOrders.length} of {orders.length} transfers</span>
          <Button variant="ghost" size="sm" className="-mr-2">
            View all <ArrowRight />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
