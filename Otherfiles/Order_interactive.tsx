"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowRight, Search } from "lucide-react";
import { useState } from "react";
import { orders } from "./dash_interactive";

export function ViewingOrder() {
  const [search, setSearch] = useState("");

  return (
    <Card className="xl:col-span-4">
      <CardHeader className="gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <CardTitle>Pending Transfers</CardTitle>
          <CardDescription>See, Review And Analyze Orders</CardDescription>
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
              <TableHead className="pl-6">OrderID</TableHead>
              <TableHead>UserName</TableHead>
              <TableHead>paymentMethod</TableHead>
              <TableHead className="hidden sm:table-cell">Amount</TableHead>

              <TableHead>paymentIntentId</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="pl-6 font-medium">{order.id}</TableCell>
                <TableCell>{order.customer}</TableCell>
                <TableCell>{order.country}</TableCell>
                <TableCell className="font-medium">{order.amount}</TableCell>
                 <TableCell className="font-medium">{order.id}</TableCell>
              </TableRow>
            ))}
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="pl-6 font-medium">{order.id}</TableCell>
                <TableCell>{order.customer}</TableCell>
                <TableCell>{order.country}</TableCell>
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

export function VendorAnalyzes() {
  const [search, setSearch] = useState("");

  return (
    <Card className="xl:col-span-4">
      <CardHeader className="gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <CardTitle>Search Specific Orders</CardTitle>
          <CardDescription>See, Review And Analyze Orders</CardDescription>
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
              <TableHead className="pl-6">vendorID</TableHead>
              <TableHead >Busines-sName</TableHead>
              <TableHead>Gross-Sales</TableHead>
              <TableHead>Vendor-Earning</TableHead>
              <TableHead className="hidden sm:table-cell">Order-Count</TableHead>

              <TableHead>paymentIntentId</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="pl-6 font-medium">{order.id}</TableCell>
                <TableCell>{order.customer}</TableCell>
                <TableCell className="font-medium">{order.amount}</TableCell>
                <TableCell className="font-medium">{order.amount}</TableCell>
                <TableCell className="font-medium">{order.amount}</TableCell>
                <TableCell className="font-medium">{order.id}</TableCell>
              </TableRow>
            ))}
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="pl-6 font-medium">{order.id}</TableCell>
                <TableCell>{order.customer}</TableCell>
                <TableCell className="font-medium">{order.amount}</TableCell>
                <TableCell className="font-medium">{order.amount}</TableCell>
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
