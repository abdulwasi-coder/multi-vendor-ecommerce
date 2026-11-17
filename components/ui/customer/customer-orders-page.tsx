"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ArrowRight, ChevronDown, ChevronRight, PackageCheck, RotateCcw, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import api from "@/lib/axios";
import { useCustomerCart } from "@/lib/customer-cart-store";

type OrderStatus = "Delivered" | "Shipped" | "Cancelled" | "Processing";

const STATUS_MAP: Record<string, OrderStatus> = {
  delivered: "Delivered",
  shipped: "Shipped",
  cancelled: "Cancelled",
  pending: "Processing",
  processing: "Processing",
};

type ApiOrder = {
  _id: string;
  createdAt: string;
  updatedAt?: string;
  totalPrice: number;
  paymentStatus: string;
  paymentIntentId?: string;
  statuses: string[];
};

type OrdersResponse = {
  orders: ApiOrder[];
  currentPage: number;
  totalPages: number;
  totalOrders: number;
  counts: {
    notYetShipped: number;
    cancelled: number;
    delivered: number;
  };
};

type ApiProduct = {
  _id: string;
  name: string;
  price: number;
  discount?: number;
  stock?: number;
  brand?: string;
  images?: { publicId?: string }[];
};

type ApiOrderItem = {
  productID: ApiProduct | string;
  quantity: number;
  price: number;
  subtotal: number;
  color?: string;
};

type ApiSubOrder = {
  _id: string;
  status: string;
  subOrderTotal: number;
  vendorID: { _id: string; name?: string; companyName?: string; mobilenumber?: string } | string;
  items: ApiOrderItem[];
};

type OrderDetailsResponse = {
  order: {
    _id: string;
    paymentIntentId?: string;
    totalPrice: number;
    createdAt: string;
    updatedAt?: string;
    shippingAddress?: { address?: string; city?: string; country?: string };
  };
  subOrders: ApiSubOrder[];
};

type OrderCard = {
  id: string;
  date: string;
  total: number;
  statuses: OrderStatus[];
};

const currency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
const dateFormat = new Intl.DateTimeFormat("en-US", { year: "numeric", month: "long", day: "numeric" });

function toOrderCards(orders: ApiOrder[]): OrderCard[] {
  return orders.map((order) => ({
    id: order._id,
    date: dateFormat.format(new Date(order.createdAt)),
    total: order.totalPrice,
    statuses: Array.from(
      new Set(
        (order.statuses ?? [])
          .map((s) => STATUS_MAP[s] ?? "Processing")
          .filter(Boolean),
      ),
    ),
  }));
}

const tabs = ["Orders", "Not yet shipped", "Delivered", "Cancelled"] as const;
type OrderTab = (typeof tabs)[number];

function matchesTab(order: OrderCard, tab: OrderTab) {
  if (tab === "Not yet shipped") return order.statuses.includes("Processing");
  if (tab === "Delivered") return order.statuses.includes("Delivered");
  if (tab === "Cancelled") return order.statuses.includes("Cancelled");
  return true;
}

const PAGE_SIZE = 5;

type UserProfileResponse = {
  success?: boolean;
  userData?: { name?: string };
};

async function getCustomerProfile() {
  const response = await fetch("/proxy-backend/user/userProfile", {
    credentials: "include",
  });
  if (!response.ok) return null;
  const result = (await response.json()) as UserProfileResponse;
  return result.success ? (result.userData ?? null) : null;
}

function OrderItems({ orderId }: { orderId: string }) {
  const { data, isPending, isError } = useQuery({
    queryKey: ["order-details", orderId],
    staleTime: 120_000,
    queryFn: async () => {
      const response = await api.get<OrderDetailsResponse>(`/user/orders/${orderId}`);
      return response.data;
    },
  });

  if (isPending) {
    return <div className="border-t border-[#d5d9d9] px-4 py-6 sm:px-5"><div className="h-24 animate-pulse rounded-md bg-[#f0f2f2]" /></div>;
  }
  if (isError || !data) {
    return <div className="border-t border-[#d5d9d9] px-4 py-6 text-sm text-[#565959] sm:px-5">Could not load order items.</div>;
  }

  const shipTo = [data.order.shippingAddress?.address, data.order.shippingAddress?.city, data.order.shippingAddress?.country]
    .filter(Boolean)
    .join(", ");
  const dateTimeFormat = new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short" });

  return (
    <div className="border-t border-[#d5d9d9] bg-[#fafafa] px-4 py-4 sm:px-5">
      <dl className="mb-4 grid grid-cols-2 gap-x-6 gap-y-2 rounded-md border border-[#d5d9d9] bg-white p-3 text-sm sm:grid-cols-4">
        <div><dt className="text-xs uppercase text-[#565959]">Payment ref</dt><dd className="mt-0.5 truncate font-medium">{data.order.paymentIntentId ?? "—"}</dd></div>
        <div><dt className="text-xs uppercase text-[#565959]">Total</dt><dd className="mt-0.5 font-medium">{currency.format(data.order.totalPrice)}</dd></div>
        <div><dt className="text-xs uppercase text-[#565959]">Placed</dt><dd className="mt-0.5 font-medium">{dateTimeFormat.format(new Date(data.order.createdAt))}</dd></div>
        <div><dt className="text-xs uppercase text-[#565959]">Last updated</dt><dd className="mt-0.5 font-medium">{data.order.updatedAt ? dateTimeFormat.format(new Date(data.order.updatedAt)) : "—"}</dd></div>
      </dl>
      {shipTo && <p className="mb-3 text-xs text-[#565959]"><span className="font-bold uppercase">Ship to:</span> {shipTo}</p>}
      <div className="space-y-4">
        {data.subOrders.map((subOrder) => {
          const vendorName = typeof subOrder.vendorID === "object" ? subOrder.vendorID.companyName ?? subOrder.vendorID.name : undefined;
          const status = STATUS_MAP[subOrder.status] ?? "Processing";
          const statusColor = status === "Delivered" ? "text-[#007600]" : status === "Shipped" ? "text-[#007185]" : status === "Cancelled" ? "text-[#565959]" : "text-[#c45500]";
          return (
            <div key={subOrder._id} className="rounded-md border border-[#d5d9d9] bg-white p-3">
              <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                <p className="font-bold">{vendorName ?? "Vendor"}</p>
                <p className={`text-sm font-bold ${statusColor}`}>{status}</p>
              </div>
              <div className="mt-3 space-y-3">
                {(subOrder.items ?? []).map((item, idx) => {
                  const product = typeof item.productID === "object" ? item.productID : null;
                  if (!product) return null;
                  const unitPrice = product.price * (1 - (product.discount ?? 0) / 100);
                  const image = product.images?.[0]?.publicId;
                  return (
                    <div key={idx} className="grid grid-cols-[56px_1fr_auto] items-center gap-3">
                      <Link href={`/products/${product._id}`} className="relative block size-14 overflow-hidden rounded bg-[#f7f7f7]">
                        {image && <Image src={image} alt={product.name} fill sizes="56px" className="object-contain p-1 mix-blend-multiply" />}
                      </Link>
                      <div className="min-w-0">
                        <Link href={`/products/${product._id}`} className="block truncate text-sm font-medium text-[#007185] hover:text-[#c45500] hover:underline">{product.name}</Link>
                        <p className="text-xs text-[#565959]">Qty: {item.quantity} · {currency.format(unitPrice)} each{item.color ? ` · Color: ${item.color}` : ""}</p>
                      </div>
                      <div className="text-right text-sm font-bold">{currency.format(item.subtotal)}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function CustomerOrdersPage() {
  const [activeTab, setActiveTab] = useState<OrderTab>("Orders");
  const [year, setYear] = useState(() => String(new Date().getFullYear()));
  const [page, setPage] = useState(1);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("payment") !== "success") return;

    useCustomerCart.getState().clearCart();
    window.history.replaceState(null, "", window.location.pathname);

    const invalidate = () =>
      queryClient.invalidateQueries({ queryKey: ["my-orders"] });

    invalidate();
    const timers = [3000, 8000, 15000].map((ms) => setTimeout(invalidate, ms));
    return () => timers.forEach(clearTimeout);
  }, [queryClient]);

  const { data: user, isPending: isProfilePending } = useQuery({
    queryKey: ["customer-account-profile"],
    queryFn: getCustomerProfile,
    staleTime: 60_000,
  });

  const { data, isPending, isError } = useQuery({
    queryKey: ["my-orders", page, year],
    staleTime: 120_000,
    enabled: !!user,
    queryFn: async () => {
      const response = await api.get<OrdersResponse>("/user/orders", {
        params: { page, limit: PAGE_SIZE, year },
      });
      return response.data;
    },
  });

  const orderCards = useMemo(() => toOrderCards(data?.orders ?? []), [data]);

  const filteredOrders = useMemo(
    () => orderCards.filter((order) => matchesTab(order, activeTab)),
    [orderCards, activeTab],
  );

  return (
    <main className="min-h-screen bg-white pb-14 pt-36 text-[#0f1111] sm:pt-32">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-3 flex flex-wrap items-center gap-1 text-sm text-[#565959]">
          <Link href="/customer/profile" className="hover:text-[#c45500] hover:underline">Your account</Link>
          <ChevronRight className="size-3.5" aria-hidden="true" />
          <span>Your orders</span>
        </div>

        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-3xl font-normal tracking-tight sm:text-4xl">Your Orders</h1>
            <p className="mt-1 text-sm text-[#565959]">Track, return, or buy things again</p>
          </div>
        </div>

        <nav aria-label="Order categories" className="mt-6 flex gap-6 overflow-x-auto border-b border-[#d5d9d9]">
          {tabs.map((tab) => {
            const tabCount =
              tab === "Orders"
                ? data?.totalOrders
                : tab === "Not yet shipped"
                  ? data?.counts.notYetShipped
                  : tab === "Delivered"
                    ? data?.counts.delivered
                    : data?.counts.cancelled;
            return (
              <button key={tab} type="button" onClick={() => { setActiveTab(tab); setPage(1); setExpandedId(null); }} aria-current={activeTab === tab ? "page" : undefined}
                className={`-mb-px shrink-0 border-b-2 px-1 pb-3 text-sm ${activeTab === tab ? "border-[#c45500] font-bold text-[#0f1111]" : "border-transparent text-[#565959] hover:text-[#c45500]"}`}>
                {tab}{typeof tabCount === "number" ? ` (${tabCount})` : ""}
              </button>
            );
          })}
        </nav>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-bold">{filteredOrders.length} {filteredOrders.length === 1 ? "order" : "orders"}</p>
          <label className="flex h-10 items-center gap-2 rounded-lg border border-[#d5d9d9] bg-[#f0f2f2] px-3 text-sm shadow-sm">
            <span className="whitespace-nowrap text-[#565959]">Order placed in</span>
            <select value={year} onChange={(event) => { setYear(event.target.value); setPage(1); setExpandedId(null); }} aria-label="Filter by order year" className="min-w-20 bg-transparent font-medium text-[#0f1111] outline-none">
              <option value={String(new Date().getFullYear())}>{new Date().getFullYear()}</option>
              <option value={String(new Date().getFullYear() - 1)}>{new Date().getFullYear() - 1}</option>
              <option value="all">All years</option>
            </select>
          </label>
        </div>

        {isProfilePending && (
          <div className="mt-5 space-y-4">
            {[0, 1, 2].map((i) => <div key={i} className="h-32 animate-pulse rounded-lg border border-[#d5d9d9] bg-white" />)}
          </div>
        )}

        {!isProfilePending && !user && (
          <div className="mt-5 rounded-lg border border-[#d5d9d9] px-5 py-12 text-center">
            <PackageCheck className="mx-auto size-9 text-[#879596]" />
            <h2 className="mt-3 text-lg font-bold">No orders yet</h2>
            <p className="mt-1 text-sm text-[#565959]">Sign in to view your order history.</p>
            <Button render={<Link href="/login" />} nativeButton={false} className="mt-5 h-9 rounded-full bg-[#ffd814] px-5 font-normal text-[#0f1111] hover:bg-[#f7ca00]">Sign in <ArrowRight className="ml-1 size-4" /></Button>
          </div>
        )}

        {user && isPending && (
          <div className="mt-5 space-y-4">
            {[0, 1, 2].map((i) => <div key={i} className="h-32 animate-pulse rounded-lg border border-[#d5d9d9] bg-white" />)}
          </div>
        )}

        {user && isError && (
          <div className="mt-5 rounded-lg border border-[#d5d9d9] px-5 py-12 text-center">
            <h2 className="text-lg font-bold">Could not load your orders</h2>
            <p className="mt-1 text-sm text-[#565959]">Please try again later.</p>
          </div>
        )}

        {user && !isPending && !isError && (
        <>
        <div className="mt-5 space-y-4">
          {filteredOrders.map((order) => {
            const expanded = expandedId === order.id;
            return (
              <article key={order.id} className="overflow-hidden rounded-lg border border-[#d5d9d9] bg-white shadow-[0_2px_5px_rgba(15,17,17,0.08)]">
                <header className="grid gap-x-6 gap-y-3 border-b border-[#d5d9d9] bg-[#f0f2f2] px-4 py-3 text-xs sm:grid-cols-2 sm:px-5 lg:grid-cols-[1fr_1fr_auto] lg:items-center">
                  <div><p className="uppercase text-[#565959]">Order placed</p><p className="mt-1 text-sm text-[#0f1111]">{order.date}</p></div>
                  <div><p className="uppercase text-[#565959]">Total</p><p className="mt-1 text-sm text-[#0f1111]">{currency.format(order.total)}</p></div>
                  <div className="flex items-center gap-4 lg:justify-end">
                    <div className="lg:text-right">
                      <p className="uppercase text-[#565959]">Order # {order.id.slice(-10)}</p>
                      <div className="mt-1 flex gap-3 lg:justify-end">
                        <button type="button" onClick={() => setExpandedId(expanded ? null : order.id)} className="text-sm text-[#007185] hover:text-[#c45500] hover:underline">
                          {expanded ? "Hide items" : "View items"}
                        </button>
                        <button type="button" onClick={() => toast.info("Invoices are not available yet.")} className="text-sm text-[#007185] hover:text-[#c45500] hover:underline">Invoice</button>
                      </div>
                    </div>
                    <button type="button" onClick={() => setExpandedId(expanded ? null : order.id)} aria-label={expanded ? "Collapse order" : "Expand order"} className="text-[#565959]">
                      {expanded ? <ChevronDown className="size-4" /> : <ChevronRight className="size-4" />}
                    </button>
                  </div>
                </header>

                <div className="flex flex-wrap items-center gap-2 px-4 py-3 sm:px-5">
                  {order.statuses.map((status) => {
                    const statusColor = status === "Delivered" ? "text-[#007600]" : status === "Shipped" ? "text-[#007185]" : status === "Cancelled" ? "text-[#565959]" : "text-[#c45500]";
                    const Icon = status === "Delivered" ? PackageCheck : status === "Shipped" ? Truck : status === "Cancelled" ? RotateCcw : PackageCheck;
                    return (
                      <span key={status} className={`flex items-center gap-1.5 text-sm font-bold ${statusColor}`}>
                        <Icon className="size-4" />{status}
                      </span>
                    );
                  })}
                </div>

                {expanded && <OrderItems orderId={order.id} />}
              </article>
            );
          })}

          {filteredOrders.length === 0 && (
            <div className="rounded-lg border border-[#d5d9d9] px-5 py-12 text-center">
              <PackageCheck className="mx-auto size-9 text-[#879596]" />
              <h2 className="mt-3 text-lg font-bold">No orders found</h2>
              <p className="mt-1 text-sm text-[#565959]">Try another order period.</p>
              <Button render={<Link href="/products" />} nativeButton={false} className="mt-5 h-9 rounded-full bg-[#ffd814] px-5 font-normal text-[#0f1111] hover:bg-[#f7ca00]">Continue shopping <ArrowRight className="ml-1 size-4" /></Button>
            </div>
          )}
        </div>

        {(data?.totalPages ?? 0) > 1 && (
          <div className="mt-6 flex items-center justify-center gap-3">
            <Button
              type="button"
              variant="outline"
              disabled={page <= 1}
              onClick={() => { setPage((p) => Math.max(1, p - 1)); setExpandedId(null); }}
              className="h-9 rounded-full border-[#d5d9d9] bg-white px-4 text-sm font-normal shadow-sm disabled:opacity-50"
            >
              Previous
            </Button>
            <span className="text-sm text-[#565959]">
              Page {data?.currentPage ?? page} of {data?.totalPages}
            </span>
            <Button
              type="button"
              variant="outline"
              disabled={page >= (data?.totalPages ?? 1)}
              onClick={() => { setPage((p) => p + 1); setExpandedId(null); }}
              className="h-9 rounded-full border-[#d5d9d9] bg-white px-4 text-sm font-normal shadow-sm disabled:opacity-50"
            >
              Next
            </Button>
          </div>
        )}
        </>
        )}
      </div>
    </main>
  );
}
