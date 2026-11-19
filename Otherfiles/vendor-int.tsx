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
import { ArrowRight, ChevronDown, Search } from "lucide-react";
import { Input } from "@base-ui/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { orders } from "./dash_interactive";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ViewingAllUser() {
  const [search, setSearch] = useState("");
  const [isVendor, setIsVendor] = useState(true);
  const filtersForVendors = [
    "none",
    "companyName",
    "name",
    "storeSlug",
    "userID",
  ];
  const filtersForUsers = ["email", "name"];
  const [Vfilter, setVFilter] = useState("none");
  const [Ufilter, setUFilter] = useState("none");
  return (
    <Card className="xl:col-span-4">
      <CardHeader className="gap-4 ">
        <div className="space-y-1">
          <CardTitle>View Users and Vendors</CardTitle>
          <CardDescription>
            Review Edit and delete Users & Vendors
          </CardDescription>
        </div>
        <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex w-full min-w-0 flex-col gap-2 sm:flex-row sm:items-center">
            <div className="relative w-full sm:max-w-md sm:flex-1">
              <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
                placeholder="Search users and vendors..."
                className="pl-10"
                aria-label="Search users and vendors"
            />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger render={<Button variant="outline" className="w-full justify-between border-amber-100/15 bg-[#1d190f] text-[#eee5d2] hover:bg-[#292317] sm:w-auto sm:min-w-36" />}>
                {Vfilter === "none" ? "Filter by" : Vfilter} <ChevronDown />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuGroup>
                  <DropdownMenuLabel>select filter</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {isVendor ? (
                    <DropdownMenuRadioGroup
                      value={Vfilter}
                      onValueChange={setVFilter}
                    >
                      {filtersForVendors.map((key) => (
                        <DropdownMenuRadioItem
                          key={key}
                          value={key}
                          closeOnClick
                        >
                          {key}
                        </DropdownMenuRadioItem>
                      ))}
                    </DropdownMenuRadioGroup>
                  ) : (
                    <DropdownMenuRadioGroup
                      value={Ufilter}
                      onValueChange={setUFilter}
                    >
                      {filtersForUsers.map((key) => (
                        <DropdownMenuRadioItem
                          key={key}
                          value={key}
                          closeOnClick
                        >
                          {key}
                        </DropdownMenuRadioItem>
                      ))}
                    </DropdownMenuRadioGroup>
                  )}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="flex shrink-0 items-center gap-1 self-start rounded-lg border border-amber-100/10 bg-[#1d190f] p-1 sm:self-auto">
            <Button
              variant="ghost"
              className={`
                ${
                  isVendor === false
                    ? "bg-[#eee5d2] text-[#211c13] hover:bg-[#e2d6bd]"
                    : ""
                }
              `}
              onClick={() => setIsVendor(false)}
            >
              User
            </Button>
            <Button
              variant="ghost"
              className={
                isVendor === true
                  ? "bg-[#eee5d2] text-[#211c13] hover:bg-[#e2d6bd]"
                  : ""
              }
              onClick={() => setIsVendor(true)}
            >
              Vendor
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-0 pb-2">
        <Table>
          {isVendor ? (
            <>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="pl-6">Companyimage ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>email</TableHead>
                  <TableHead className="hidden sm:table-cell">
                    storeSlug
                  </TableHead>
                  <TableHead>status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="pl-6 font-medium">
                      {order.id}
                    </TableCell>
                    <TableCell>{order.customer}</TableCell>
                    <TableCell>{order.country}</TableCell>
                    <TableCell className="font-medium">
                      {order.amount}
                    </TableCell>
                    <TableCell className="font-medium">{order.id}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </>
          ) : (
            <>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="pl-6">Profileimage ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>email</TableHead>
                  <TableHead className="hidden sm:table-cell">role</TableHead>
                  <TableHead>status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="pl-6 font-medium">
                      {order.id}
                    </TableCell>
                    <TableCell>{order.customer}</TableCell>
                    <TableCell>{order.country}</TableCell>
                    <TableCell className="font-medium">
                      {order.amount}
                    </TableCell>
                    <TableCell className="font-medium">{order.id}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </>
          )}
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
