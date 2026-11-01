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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();
  const pageSize = 5;

  const vendorsQuery = useQuery({
    queryKey: ["admin-pending-vendors", page],
    queryFn: async () => {
      const response = await api.get<PendingVendorsResponse>(
        "/admin/getVendors",
        { params: { status: "pending", page, limit: pageSize } },
      );
      if (response.data.success === false) {
        throw new Error("Could not load pending vendors.");
      }
      return response.data;
    },
    staleTime: 30_000,
  });

  const approveVendorMutation = useMutation({
    mutationFn: async (vendor: PendingVendor) => {
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
      <CardContent className="px-0 pb-2">
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
                      : "—"}
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
        <div className="flex items-center justify-between px-6 pt-4 text-xs text-muted-foreground">
          <span>
            Page {page} of {totalPages}
            {vendorsQuery.data ? ` · ${vendorsQuery.data.totalVendors} pending` : ""}
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

interface PendingVendor {
  _id: string;
  name: string;
  lastName: string;
  companyName: string;
  country: string;
  createdAt?: string;
  userid: string | { _id: string; email?: string } | null;
}

interface PendingVendorsResponse {
  success: boolean;
  currentPage: number;
  totalPages: number;
  totalVendors: number;
  vendors: PendingVendor[];
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
