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
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { orders } from "./dash_interactive";

export function ProductTable() {
  const [search, setSearch] = useState("");
  return (
    <Card className="xl:col-span-4">
      <CardHeader className="gap-4">
        <div className="space-y-1">
          <CardTitle>Products</CardTitle>
          <CardDescription>Browse and search marketplace products.</CardDescription>
        </div>
        <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search products by name..."
              className="pl-10"
              aria-label="Search products"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-0 pb-2">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="pl-6 font-medium">name</TableHead>
              <TableHead>price</TableHead>
              <TableHead>stock</TableHead>
              <TableHead>isActive</TableHead>
              <TableHead>createdAt</TableHead>
              <TableHead>vendorId</TableHead>
              <TableHead>ParentID</TableHead>
              <TableHead>businessName</TableHead>
              <TableHead>Image</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="pl-6 font-medium">{order.id}</TableCell>
                <TableCell className="font-medium">{order.amount}</TableCell>
                <TableCell className="font-medium">{order.id}</TableCell>
                <TableCell className="font-medium">{order.id}</TableCell>
                <TableCell className="font-medium">{order.amount}</TableCell>
                <TableCell className="font-medium">{order.id}</TableCell>
                <TableCell className="font-medium">{order.id}</TableCell>
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
