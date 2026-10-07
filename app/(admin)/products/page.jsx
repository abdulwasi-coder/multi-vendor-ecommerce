"use client";

import { useMemo, useState } from "react";
import { Check, Package, Search, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const initialProducts = [
  { id: "PRD-4028", name: "Hand-thrown Ceramic Mug", vendor: "Cedar House", category: "Home & Living", price: 34, status: "Pending" },
  { id: "PRD-4027", name: "Everyday Canvas Tote", vendor: "Northstar Goods", category: "Accessories", price: 48, status: "Published" },
  { id: "PRD-4026", name: "Trail Bottle 750ml", vendor: "Fieldwork Supply", category: "Outdoors", price: 32, status: "Pending" },
  { id: "PRD-4025", name: "Botanical Candle Set", vendor: "Studio Wren", category: "Home & Living", price: 56, status: "Published" },
  { id: "PRD-4024", name: "Wildflower Honey Duo", vendor: "Sunday Market", category: "Food & Pantry", price: 26, status: "Rejected" },
];

const productStatus = {
  Pending: "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300",
  Published: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300",
  Rejected: "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300",
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState(initialProducts);
  const [query, setQuery] = useState("");
  const pending = products.filter((product) => product.status === "Pending").length;
  const shown = useMemo(() => products.filter((product) => `${product.name} ${product.vendor} ${product.category}`.toLowerCase().includes(query.toLowerCase())), [products, query]);
  const updateProduct = (id, status) => setProducts((current) => current.map((product) => product.id === id ? { ...product, status } : product));

  return <main className="mx-auto min-h-screen w-full max-w-[1600px] space-y-6 bg-muted/30 px-4 py-6 sm:px-6 lg:px-8">
    <header className="space-y-1 border-b pb-5"><p className="text-sm text-primary">Marketplace catalog</p><h1 className="text-2xl font-semibold tracking-tight">Products</h1><p className="text-sm text-muted-foreground">Review listings and keep the marketplace catalog up to date.</p></header>
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {[["All listings", products.length, "Catalog submissions", "bg-sky-500/10 text-sky-700 dark:text-sky-300", "hover:border-sky-300 hover:bg-sky-50/70 hover:shadow-sky-500/10 dark:hover:border-sky-800 dark:hover:bg-sky-950/25"], ["Pending review", pending, "Awaiting approval", "bg-amber-500/10 text-amber-700 dark:text-amber-300", "hover:border-amber-300 hover:bg-amber-50/70 hover:shadow-amber-500/10 dark:hover:border-amber-800 dark:hover:bg-amber-950/25"], ["Published", products.filter((product) => product.status === "Published").length, "Visible in marketplace", "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300", "hover:border-emerald-300 hover:bg-emerald-50/70 hover:shadow-emerald-500/10 dark:hover:border-emerald-800 dark:hover:bg-emerald-950/25"]].map(([title, value, description, tone, hover]) => <Card key={title} className={`group h-full min-h-[184px] gap-4 rounded-2xl border-border/70 py-5 shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg ${hover}`}><CardHeader className="min-h-[52px] flex-row items-center justify-between gap-2 space-y-0"><CardTitle className="min-h-11 flex-1 content-center text-base font-semibold leading-snug tracking-tight text-muted-foreground">{title}</CardTitle><span className={`flex size-12 shrink-0 items-center justify-center rounded-xl ${tone} shadow-sm transition-transform duration-300 group-hover:scale-110`}><Package className="size-6" /></span></CardHeader><CardContent className="flex flex-1 flex-col justify-between gap-2"><p className="flex min-h-10 items-center text-3xl font-bold leading-none tracking-tight tabular-nums">{value}</p><p className="flex min-h-10 items-center text-sm text-muted-foreground">{description}</p></CardContent></Card>)}
    </section>
    <Card className="overflow-hidden rounded-2xl shadow-sm">
      <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><CardTitle>Product listings</CardTitle><p className="mt-1 text-sm text-muted-foreground">Approve new listings or remove rejected items from review.</p></div><div className="relative w-full sm:w-72"><Search className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" /><Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search products or vendors" className="pl-9" aria-label="Search products" /></div></CardHeader>
      <CardContent className="px-0 sm:px-6">
        <div className="space-y-3 px-4 pb-4 xl:hidden">{shown.map((product) => <article key={product.id} className="rounded-xl border bg-card p-4 shadow-sm transition-colors hover:border-sky-300/70 hover:bg-sky-50/30 dark:hover:border-sky-900 dark:hover:bg-sky-950/15"><div className="flex items-start justify-between gap-3"><div className="min-w-0"><h3 className="truncate font-semibold">{product.name}</h3><p className="mt-0.5 text-xs text-muted-foreground">{product.id} · {product.vendor}</p></div><span className="shrink-0 font-semibold tabular-nums">${product.price.toFixed(2)}</span></div><div className="mt-3 flex flex-wrap gap-2"><Badge variant="secondary">{product.category}</Badge><Badge variant="outline" className={productStatus[product.status]}>{product.status}</Badge></div>{product.status === "Pending" && <div className="mt-3 flex gap-2 border-t pt-3"><Button size="sm" className="flex-1" onClick={() => updateProduct(product.id, "Published")}><Check className="mr-1 size-3.5" />Approve</Button><Button size="sm" variant="outline" className="flex-1" onClick={() => updateProduct(product.id, "Rejected")}><X className="mr-1 size-3.5" />Reject</Button></div>}</article>)}{shown.length === 0 && <p className="py-8 text-center text-sm text-muted-foreground">No products match your search.</p>}</div>
        <div className="hidden overflow-x-auto xl:block"><Table className="min-w-[760px]"><TableHeader><TableRow className="bg-muted/40 hover:bg-muted/40"><TableHead className="pl-6">Product</TableHead><TableHead>Vendor</TableHead><TableHead>Category</TableHead><TableHead>Price</TableHead><TableHead>Status</TableHead><TableHead className="w-48 min-w-48 text-center">Review</TableHead></TableRow></TableHeader><TableBody>
        {shown.map((product) => <TableRow key={product.id} className="transition-colors hover:bg-muted/60"><TableCell className="pl-6"><span className="block font-medium">{product.name}</span><span className="font-mono text-xs text-muted-foreground">{product.id}</span></TableCell><TableCell>{product.vendor}</TableCell><TableCell className="text-muted-foreground">{product.category}</TableCell><TableCell className="font-medium tabular-nums">${product.price.toFixed(2)}</TableCell><TableCell><Badge variant="outline" className={productStatus[product.status]}>{product.status}</Badge></TableCell><TableCell className="w-48 min-w-48 text-center">{product.status === "Pending" ? <div className="inline-flex gap-1"><Button size="sm" className="h-7" onClick={() => updateProduct(product.id, "Published")}><Check className="mr-1 size-3.5" />Approve</Button><Button size="sm" variant="outline" className="h-7 hover:border-rose-300 hover:bg-rose-50 hover:text-rose-700" onClick={() => updateProduct(product.id, "Rejected")}><X className="mr-1 size-3.5" />Reject</Button></div> : <span className="text-xs text-muted-foreground">No action needed</span>}</TableCell></TableRow>)}
        {shown.length === 0 && <TableRow><TableCell colSpan={6} className="h-24 text-center text-muted-foreground">No products match your search.</TableCell></TableRow>}
      </TableBody></Table></div></CardContent>
    </Card>
    <p className="text-xs text-muted-foreground">Product listings and review actions are sample data until connected to the catalog API.</p>
  </main>;
}
