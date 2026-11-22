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
  ChevronLeft,
  ChevronRight,
  Download,
  Search,
  Verified,
  View,
} from "lucide-react";
import { isAxiosError } from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { toast } from "sonner";
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
import Link from "next/link";
import {
  useAdminPendingVendors,
  useApproveVendorPayout,
  useVendorBalanceLedger,
  type AdminPendingVendor,
} from "@/Otherfiles/tanstack/admin";

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export interface DropdownMenuCustomOption {
  value: string;
  label: string;
}

export function DropdownMenuCustom({
  options = [],
  value,
  onValueChange,
}: {
  options?: DropdownMenuCustomOption[];
  value: string;
  onValueChange: (value: string) => void;
}) {
  const current =
    options.find((option) => option.value === value)?.label ?? value;

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center gap-0.5 border rounded-md px-3 h-8 text-sm font-medium bg-background">
          <span>{current}</span>
          <ChevronDown className="size-4 opacity-50" />
        </DropdownMenuTrigger>

        <DropdownMenuContent side="bottom" align="end" className="w-44">
          {options.map((item) => (
            <DropdownMenuItem
              key={item.value}
              onClick={() => onValueChange(item.value)}
              className="cursor-pointer"
            >
              {item.label}
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
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();
  const pageSize = 5;

  const vendorsQuery = useAdminPendingVendors(page, pageSize);

  const approveVendorMutation = useMutation({
    mutationFn: async (vendor: AdminPendingVendor) => {
      const userId =
        typeof vendor.userid === "string"
          ? vendor.userid
          : vendor.userid?._id;
      if (!userId) {
        throw new Error("This vendor application has no linked user account.");
      }
      const response = await api.post(
        `/admin/approaveVendor/${vendor._id}`,
        { userId },
      );
      if (response.data?.success === false) {
        throw new Error(response.data.message || "Could not approve vendor.");
      }
    },
    onSuccess: async () => {
      toast.success("Vendor approved.");
      setPage(1);
      await queryClient.invalidateQueries({
        queryKey: ["admin-pending-vendors"],
      });
      await queryClient.invalidateQueries({
        queryKey: ["admin-dashboard"],
      });
    },
    onError: (error) => {
      const message = isAxiosError(error)
        ? error.response?.data?.message ?? error.response?.data?.error
        : error instanceof Error
          ? error.message
          : undefined;
      toast.error(
        typeof message === "string" && message.trim()
          ? message
          : "Could not approve vendor. Please try again.",
      );
    },
  });

  const vendors = vendorsQuery.data?.vendors ?? [];
  const filteredVendors = vendors.filter((vendor) =>
    [
      vendor.name,
      vendor.lastName,
      vendor.companyName,
      vendor.country,
      typeof vendor.userid === "string" || !vendor.userid
        ? ""
        : vendor.userid.email,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase()
      .includes(search.trim().toLowerCase()),
  );
  const totalPages = Math.max(1, vendorsQuery.data?.totalPages ?? 1);
  const queryErrorMessage = vendorsQuery.isError
    ? isAxiosError(vendorsQuery.error)
      ? vendorsQuery.error.response?.data?.message
      : vendorsQuery.error instanceof Error
        ? vendorsQuery.error.message
        : undefined
    : undefined;

  return (
    <Card className="h-full min-w-0 w-full">
      <CardHeader className="min-w-0 gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <CardTitle>Recent Pending Vendors</CardTitle>
          <CardDescription>Review New Pending Sellers</CardDescription>
        </div>
        <div className="relative w-full min-w-0 sm:w-72">
          <Search className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder="Search vendors..."
            className="pl-9"
            aria-label="Search pending vendors"
          />
        </div>
      </CardHeader>
      <CardContent className="min-w-0 overflow-hidden px-0 pb-2">
        <div className="w-full min-w-0 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="pl-4">Vendor</TableHead>
              <TableHead>Company</TableHead>
              <TableHead className="hidden sm:table-cell">Country</TableHead>
              <TableHead className="hidden md:table-cell">Applied</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vendorsQuery.isPending ? (
              <TableRow>
                <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                  Loading pending vendors...
                </TableCell>
              </TableRow>
            ) : vendorsQuery.isError ? (
              <TableRow>
                <TableCell colSpan={5} className="py-8 text-center text-destructive">
                  {typeof queryErrorMessage === "string" && queryErrorMessage.trim()
                    ? queryErrorMessage
                    : "Could not load pending vendors."}
                </TableCell>
              </TableRow>
            ) : filteredVendors.length ? (
              filteredVendors.map((vendor) => (
                <TableRow key={vendor._id}>
                  <TableCell className="pl-4 font-medium">
                    {vendor.name} {vendor.lastName}
                    <span className="block text-xs font-normal text-muted-foreground">
                      {typeof vendor.userid === "string"
                        ? ""
                        : vendor.userid?.email}
                    </span>
                  </TableCell>
                  <TableCell>{vendor.companyName}</TableCell>
                  <TableCell className="hidden sm:table-cell">{vendor.country}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    {vendor.createdAt
                      ? new Date(vendor.createdAt).toLocaleDateString()
                      : "â€”"}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      aria-label={`Approve ${vendor.companyName}`}
                      disabled={approveVendorMutation.isPending}
                      onClick={() => approveVendorMutation.mutate(vendor)}
                      className="text-emerald-700"
                    >
                      <Verified />
                      <span className="hidden sm:inline">Approve</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                  {search ? "No vendors match your search." : "No pending vendors."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        </div>
        <div className="flex items-center justify-between px-6 pt-4 text-xs text-muted-foreground">
          <span>
            Page {page} of {totalPages}
            {vendorsQuery.data ? ` Â· ${vendorsQuery.data.totalVendors} pending` : ""}
          </span>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Previous pending vendors page"
              disabled={page <= 1 || vendorsQuery.isPending}
              onClick={() => setPage((current) => Math.max(1, current - 1))}
            >
              <ChevronLeft />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Next pending vendors page"
              disabled={page >= totalPages || vendorsQuery.isPending}
              onClick={() => setPage((current) => current + 1)}
            >
              <ChevronRight />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function PendingOrders() {
  const [search, setSearch] = useState("");
  const ledgerQuery = useVendorBalanceLedger(5);
  const approvePayout = useApproveVendorPayout();

  const vendors = ledgerQuery.data?.vendorsData ?? [];
  const filteredVendors = vendors.filter((vendor) =>
    [vendor.BusinessName, vendor.vendorID]
      .filter(Boolean)
      .join(" ")
      .toLowerCase()
      .includes(search.trim().toLowerCase()),
  );
  const queryErrorMessage = ledgerQuery.isError
    ? isAxiosError(ledgerQuery.error)
      ? ledgerQuery.error.response?.data?.message
      : ledgerQuery.error instanceof Error
        ? ledgerQuery.error.message
        : undefined
    : undefined;

  return (
    <Card className="h-full min-w-0 w-full">
      <CardHeader className="min-w-0 gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <CardTitle>Pending Transfers</CardTitle>
          <CardDescription>See, Approve And Transfer The Money</CardDescription>
        </div>
        <div className="relative w-full min-w-0 sm:w-72">
          <Search className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search vendors..."
            className="pl-9"
            aria-label="Search vendors"
          />
        </div>
      </CardHeader>
      <CardContent className="min-w-0 overflow-hidden px-0 pb-2">
        <div className="w-full min-w-0 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="pl-6">Vendor</TableHead>
              <TableHead className="hidden sm:table-cell">Gross sales</TableHead>
              <TableHead>Payout balance</TableHead>
              <TableHead className="hidden md:table-cell">Platform revenue</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ledgerQuery.isPending ? (
              <TableRow>
                <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                  Loading vendor balances...
                </TableCell>
              </TableRow>
            ) : ledgerQuery.isError ? (
              <TableRow>
                <TableCell colSpan={5} className="py-8 text-center text-destructive">
                  {typeof queryErrorMessage === "string" && queryErrorMessage.trim()
                    ? queryErrorMessage
                    : "Could not load vendor balances."}
                </TableCell>
              </TableRow>
            ) : filteredVendors.length ? (
              filteredVendors.map((vendor) => (
                <TableRow key={vendor.vendorID}>
                  <TableCell className="pl-6 font-medium">
                    {vendor.BusinessName || "Unnamed vendor"}
                    <span className="block text-xs font-normal text-muted-foreground">
                      {vendor.vendorID}
                    </span>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell font-medium">
                    {currency.format(vendor.grossSales ?? 0)}
                  </TableCell>
                  <TableCell className="font-medium">
                    {currency.format(vendor.vendorPayoutBalance ?? 0)}
                  </TableCell>
                  <TableCell className="hidden md:table-cell font-medium">
                    {currency.format(vendor.platfromRevenue ?? 0)}
                  </TableCell>
                  <TableCell className="font-medium flex items-center gap-0.5">
                    <Link href={`/admin/vendors-users?vendor=${vendor.vendorID}`}>
                      <Button variant="outline" className="text-yellow-400" aria-label={`View ${vendor.BusinessName}`}>
                        <View />
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      className="text-emerald-400"
                      aria-label={`Approve payout for ${vendor.BusinessName}`}
                      disabled={approvePayout.isPending}
                      onClick={() =>
                        approvePayout.mutate(vendor.vendorID, {
                          onSuccess: (data) =>
                            toast.success(
                              `Marked ${data.updated} order${data.updated === 1 ? "" : "s"} as paid out`,
                            ),
                          onError: () => toast.error("Could not approve payout"),
                        })
                      }
                    >
                      <Verified />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                  {search ? "No vendors match your search." : "No vendor balances yet."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        </div>
        <div className="flex items-center justify-between px-6 pt-4 text-xs text-muted-foreground">
          <span>
            Showing {filteredVendors.length} of {ledgerQuery.data?.totalVendors ?? 0} vendors
          </span>
          <Button variant="ghost" size="sm" className="-mr-2">
            View all <ArrowRight />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
