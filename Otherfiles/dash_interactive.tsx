"use client";

const orders = [
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
          <span>Last {current}</span>
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

  return (
    <Card className="xl:col-span-3">
      <CardHeader className="gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <CardTitle>Recent Pending Vendors</CardTitle>
          <CardDescription>Review New Pending Sellers</CardDescription>
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
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="pl-4">Name</TableHead>
              <TableHead>companyName</TableHead>
              <TableHead>createdAt</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="pl-4 font-medium">
                  {order.customer}
                </TableCell>
                <TableCell>{order.vendor}</TableCell>
                <TableCell>{order.date}</TableCell>
                <TableCell className="font-medium flex items-center gap-0.5">
                  <Button variant="outline" className="text-yellow-400 ">
                    <View />
                  </Button>
                  <Button variant="outline" className="text-emerald-400">
                    <Verified />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="flex items-center justify-between px-6 pt-4 text-xs text-muted-foreground">
          <span>Showing 5 of 5 orders</span>
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

  return (
    <Card className="xl:col-span-4">
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
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="pl-6">userID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Country</TableHead>
              <TableHead className="hidden sm:table-cell">Amount</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="pl-6 font-medium">{order.id}</TableCell>
                <TableCell>{order.customer}</TableCell>
                <TableCell>{order.country}</TableCell>
                <TableCell className="font-medium">{order.amount}</TableCell>
                <TableCell className="font-medium flex items-center gap-0.5">
                  <Button variant="outline" className="text-yellow-400 ">
                    <View />
                  </Button>
                  <Button variant="outline" className="text-emerald-400">
                    <Verified />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="flex items-center justify-between px-6 pt-4 text-xs text-muted-foreground">
          <span>Showing 5 of 5 orders</span>
          <Button variant="ghost" size="sm" className="-mr-2">
            View all <ArrowRight />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
