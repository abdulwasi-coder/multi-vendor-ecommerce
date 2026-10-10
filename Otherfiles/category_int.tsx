"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowRight, Plus, Search } from "lucide-react";
import { Input } from "@base-ui/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { orders } from "./dash_interactive";

export function CategoryTable() {
  const [search, setSearch] = useState("");
  return (
    <Card className="xl:col-span-4">
      <CardHeader className="gap-4 ">
        <div className="space-y-1">
          <CardTitle>View Users and Vendors</CardTitle>
          <CardDescription>
            Review Edit and delete Users & Vendors
          </CardDescription>
        </div>
        <div className="flex items-center justify-between overflow-x-auto py-0.5 relative w-full ">
          <div className="flex items-center gap-1">
            <Search className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search orders..."
              className="pl-9 py-1.5 rounded-lg"
              aria-label="Search orders"
            />
          </div>
          <div className="flex items-center gap-1">
            <Button>
              Add <Plus />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-0 pb-2">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="pl-6 font-medium">Name</TableHead>
              <TableHead>ParentID</TableHead>
              <TableHead>Image</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="pl-6 font-medium">{order.id}</TableCell>
                <TableCell className="font-medium">{order.amount}</TableCell>
                <TableCell className="font-medium">{order.id}</TableCell>
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
