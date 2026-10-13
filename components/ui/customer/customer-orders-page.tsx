"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { ArrowRight, ChevronRight, CircleHelp, PackageCheck, RotateCcw, Search, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { products } from "@/lib/vendor-products";
import { useCustomerCart } from "@/lib/customer-cart-store";

type OrderStatus = "Delivered" | "Shipped" | "Cancelled";
type Order = {
  id: string;
  date: string;
  dateLabel: string;
  total: number;
  status: OrderStatus;
  statusDetail: string;
  productId: string;
  quantity: number;
  estimate?: string;
};

const previewOrders: Order[] = [
  { id: "114-4928173-6201842", date: "2026-10-08", dateLabel: "October 8, 2026", total: 43.20, status: "Delivered", statusDetail: "Delivered October 11", productId: "BT-1042", quantity: 1 },
  { id: "114-8201635-1947208", date: "2026-10-05", dateLabel: "October 5, 2026", total: 86, status: "Shipped", statusDetail: "Arriving Friday", estimate: "Friday, October 16", productId: "BT-1038", quantity: 1 },
  { id: "114-2084716-9305214", date: "2026-09-23", dateLabel: "September 23, 2026", total: 54.40, status: "Delivered", statusDetail: "Delivered September 27", productId: "BT-1021", quantity: 1 },
  { id: "114-6752091-3381640", date: "2026-08-18", dateLabel: "August 18, 2026", total: 72, status: "Cancelled", statusDetail: "This order was cancelled", productId: "BT-1056", quantity: 1 },
];

const tabs = ["Orders", "Not yet shipped", "Buy again", "Cancelled"] as const;
type OrderTab = (typeof tabs)[number];

const currency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

function matchesTab(order: Order, tab: OrderTab) {
  if (tab === "Not yet shipped") return order.status === "Shipped";
  if (tab === "Buy again") return order.status === "Delivered";
  if (tab === "Cancelled") return order.status === "Cancelled";
  return true;
}

export function CustomerOrdersPage() {
  const [activeTab, setActiveTab] = useState<OrderTab>("Orders");
  const [query, setQuery] = useState("");
  const [year, setYear] = useState("2026");
  const addItem = useCustomerCart((state) => state.addItem);

  const filteredOrders = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return previewOrders.filter((order) => {
      const product = products.find((item) => item.id === order.productId);
      const matchesSearch = !normalizedQuery || [order.id, order.status, product?.name, product?.vendorCompanyName]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery);
      const matchesYear = year === "all" || order.date.startsWith(year);
      return matchesTab(order, activeTab) && matchesSearch && matchesYear;
    });
  }, [activeTab, query, year]);

  function buyAgain(productId: string) {
    const product = products.find((item) => item.id === productId);
    if (!product) return;
    const added = addItem(product.id, product.stock);
    toast[added ? "success" : "error"](added ? "Added to your cart" : "This item could not be added", {
      description: product.name,
    });
  }

  return (
    <main className="min-h-screen bg-white pb-14 pt-36 text-[#0f1111] sm:pt-32">
      <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8">
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
          <span className="rounded-full border border-[#d5d9d9] bg-[#f7fafa] px-3 py-1 text-xs text-[#565959]">Preview orders</span>
        </div>

        <nav aria-label="Order categories" className="mt-6 flex gap-6 overflow-x-auto border-b border-[#d5d9d9]">
          {tabs.map((tab) => (
            <button key={tab} type="button" onClick={() => setActiveTab(tab)} aria-current={activeTab === tab ? "page" : undefined}
              className={`-mb-px shrink-0 border-b-2 px-1 pb-3 text-sm ${activeTab === tab ? "border-[#c45500] font-bold text-[#0f1111]" : "border-transparent text-[#565959] hover:text-[#c45500]"}`}>
              {tab}
            </button>
          ))}
        </nav>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-bold">{filteredOrders.length} {filteredOrders.length === 1 ? "order" : "orders"}</p>
          <div className="flex flex-col gap-2 sm:flex-row">
            <form onSubmit={(event) => event.preventDefault()} className="flex h-10 min-w-0 overflow-hidden rounded-lg border border-[#888c8c] shadow-sm sm:w-[340px]">
              <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search all orders" aria-label="Search all orders" className="h-full min-w-0 rounded-none border-0 bg-white px-3 shadow-none focus-visible:ring-0" />
              <button type="submit" aria-label="Search orders" className="grid w-11 shrink-0 place-items-center bg-[#232f3e] text-white transition hover:bg-[#37475a]"><Search className="size-4" /></button>
            </form>
            <label className="flex h-10 items-center gap-2 rounded-lg border border-[#d5d9d9] bg-[#f0f2f2] px-3 text-sm shadow-sm">
              <span className="whitespace-nowrap text-[#565959]">Order placed in</span>
              <select value={year} onChange={(event) => setYear(event.target.value)} aria-label="Filter by order year" className="min-w-20 bg-transparent font-medium text-[#0f1111] outline-none">
                <option value="2026">2026</option>
                <option value="2025">2025</option>
                <option value="all">All years</option>
              </select>
            </label>
          </div>
        </div>

        <div className="mt-5 space-y-4">
          {filteredOrders.map((order) => {
            const product = products.find((item) => item.id === order.productId);
            if (!product) return null;
            const statusColor = order.status === "Delivered" ? "text-[#007600]" : order.status === "Shipped" ? "text-[#007185]" : "text-[#565959]";

            return (
              <article key={order.id} className="overflow-hidden rounded-lg border border-[#d5d9d9] bg-white shadow-[0_2px_5px_rgba(15,17,17,0.08)]">
                <header className="grid gap-x-6 gap-y-3 border-b border-[#d5d9d9] bg-[#f0f2f2] px-4 py-3 text-xs sm:grid-cols-2 sm:px-5 lg:grid-cols-[1fr_1fr_1fr_auto] lg:items-center">
                  <div><p className="uppercase text-[#565959]">Order placed</p><p className="mt-1 text-sm text-[#0f1111]">{order.dateLabel}</p></div>
                  <div><p className="uppercase text-[#565959]">Total</p><p className="mt-1 text-sm text-[#0f1111]">{currency.format(order.total)}</p></div>
                  <div><p className="uppercase text-[#565959]">Ship to</p><button type="button" className="mt-1 text-sm text-[#007185] hover:text-[#c45500] hover:underline">Your address</button></div>
                  <div className="lg:text-right"><p className="uppercase text-[#565959]">Order # {order.id}</p><div className="mt-1 flex gap-3 lg:justify-end"><button type="button" className="text-sm text-[#007185] hover:text-[#c45500] hover:underline">View order details</button><button type="button" className="text-sm text-[#007185] hover:text-[#c45500] hover:underline">Invoice</button></div></div>
                </header>

                <div className="p-4 sm:p-5">
                  <div className={`flex items-center gap-2 text-lg font-bold ${statusColor}`}>
                    {order.status === "Delivered" ? <PackageCheck className="size-5" /> : order.status === "Shipped" ? <Truck className="size-5" /> : <RotateCcw className="size-5" />}
                    {order.statusDetail}
                  </div>
                  {order.estimate && <p className="mt-1 text-sm text-[#565959]">Package is on the way. Estimated delivery: {order.estimate}.</p>}

                  <div className="mt-4 grid gap-5 sm:grid-cols-[112px_minmax(0,1fr)_220px] sm:items-start">
                    <Link href={`/customer/products?q=${encodeURIComponent(product.name)}`} className="relative mx-auto block size-28 overflow-hidden rounded-md bg-[#f7f7f7] sm:mx-0">
                      <Image src={product.images[0]} alt={product.name} fill sizes="112px" className="object-contain p-2 mix-blend-multiply" />
                    </Link>
                    <div className="min-w-0 text-center sm:text-left">
                      <Link href={`/customer/products?q=${encodeURIComponent(product.name)}`} className="font-medium text-[#007185] hover:text-[#c45500] hover:underline">{product.name}</Link>
                      <p className="mt-1 text-sm text-[#565959]">Sold by: {product.vendorCompanyName}</p>
                      <p className="mt-1 text-sm text-[#565959]">Quantity: {order.quantity}</p>
                      <p className="mt-2 font-bold">{currency.format(product.price * (1 - product.discount / 100))}</p>
                    </div>
                    <div className="flex flex-col gap-2">
                      {order.status === "Shipped" ? (
                        <Button type="button" onClick={() => toast.info("Tracking updates will appear here when shipping is connected.")} className="h-9 rounded-full bg-[#ffd814] text-sm font-normal text-[#0f1111] shadow-sm hover:bg-[#f7ca00]">Track package</Button>
                      ) : (
                        <Button type="button" onClick={() => buyAgain(product.id)} className="h-9 rounded-full bg-[#ffd814] text-sm font-normal text-[#0f1111] shadow-sm hover:bg-[#f7ca00]">Buy it again</Button>
                      )}
                      <Button type="button" variant="outline" onClick={() => toast.info("Order details will be available when order history is connected.")} className="h-9 rounded-full border-[#d5d9d9] bg-white text-sm font-normal shadow-sm">View your item</Button>
                      {order.status === "Delivered" && <Link href="/customer/products" className="flex h-9 items-center justify-center gap-2 rounded-full border border-[#d5d9d9] bg-white text-sm shadow-sm hover:bg-[#f7fafa]"><CircleHelp className="size-4" />Get product support</Link>}
                    </div>
                  </div>
                </div>
              </article>
            );
          })}

          {filteredOrders.length === 0 && (
            <div className="rounded-lg border border-[#d5d9d9] px-5 py-12 text-center">
              <PackageCheck className="mx-auto size-9 text-[#879596]" />
              <h2 className="mt-3 text-lg font-bold">No orders found</h2>
              <p className="mt-1 text-sm text-[#565959]">Try another search or order period.</p>
              <Button render={<Link href="/customer/products" />} className="mt-5 h-9 rounded-full bg-[#ffd814] px-5 font-normal text-[#0f1111] hover:bg-[#f7ca00]">Continue shopping <ArrowRight className="ml-1 size-4" /></Button>
            </div>
          )}
        </div>
        <p className="mt-5 text-xs text-[#767676]">Example order history for layout preview. Live order history isn’t connected yet.</p>
      </div>
    </main>
  );
}
