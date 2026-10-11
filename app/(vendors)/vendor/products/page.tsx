import Link from "next/link";
import { ArrowDown, ArrowUpRight, Eye, Package, Plus, Search, SlidersHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { products } from "@/lib/vendor-products";

const money = (value: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);

export default function VendorProductsPage() {
  const inventory = products.reduce((sum, product) => sum + product.stock, 0);
  return (
    <main className="mx-auto min-h-screen w-full max-w-400 space-y-7 bg-muted/20 px-4 py-7 sm:px-7 lg:px-10">
      <header className="flex flex-col justify-between gap-5 border-b pb-6 sm:flex-row sm:items-end">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">Store management / Catalog</p>
          <h1 className="text-3xl font-semibold tracking-tight">Products</h1>
          <p className="max-w-xl text-sm text-muted-foreground">Manage your catalog, keep an eye on stock, and make updates to your listings.</p>
        </div>
        <Button render={<Link href="/vendor/create" />}><Plus /> Add product</Button>
      </header>

      <section className="grid gap-4 sm:grid-cols-3" aria-label="Product summary">
        {[
          { label: "Products listed", value: products.length.toString(), note: "Across your catalog", icon: Package },
          { label: "Units in stock", value: inventory.toString(), note: "Available to sell", icon: SlidersHorizontal },
          { label: "Low stock", value: products.filter((product) => product.stock < 10).length.toString(), note: "Fewer than 10 units", icon: ArrowDown },
        ].map((item) => {
          const Icon = item.icon;
          return <Card key={item.label} className="gap-4 py-5"><CardHeader className="flex flex-row items-start justify-between space-y-0 px-5"><div><CardDescription>{item.label}</CardDescription><CardTitle className="mt-2 text-2xl">{item.value}</CardTitle></div><span className="rounded-lg bg-muted p-2.5"><Icon className="size-4 text-muted-foreground" /></span></CardHeader><CardContent className="px-5 text-xs text-muted-foreground">{item.note}</CardContent></Card>;
        })}
      </section>

      <Card className="overflow-hidden rounded-2xl border-border/70 shadow-sm">
        <CardHeader className="gap-4 border-b sm:flex-row sm:items-center sm:justify-between">
          <div><CardTitle>All products</CardTitle><CardDescription className="mt-1">Your store catalog and current inventory.</CardDescription></div>
          <div className="flex gap-2"><label className="relative min-w-0 flex-1 sm:w-64"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input aria-label="Search products" placeholder="Search products" className="pl-9" /></label><Button variant="outline" aria-label="Filter products"><SlidersHorizontal /></Button></div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto"><Table>
            <TableHeader><TableRow><TableHead className="pl-6">Product</TableHead><TableHead>Category</TableHead><TableHead>Price</TableHead><TableHead>Stock</TableHead><TableHead>Status</TableHead><TableHead className="pr-6 text-right">Actions</TableHead></TableRow></TableHeader>
            <TableBody>{products.map((product) => <TableRow key={product.id}>
              <TableCell className="min-w-56 pl-6"><Link href={`/vendor/products/${product.id}`} className="group flex items-center gap-3"><div className="flex size-11 shrink-0 items-center justify-center rounded-lg border bg-muted/70 text-muted-foreground"><Package className="size-5" /></div><span><span className="block font-medium group-hover:underline">{product.name}</span><span className="text-xs text-muted-foreground">{product.id} · {product.brand}</span></span></Link></TableCell>
              <TableCell className="text-muted-foreground">{product.categoryID}</TableCell><TableCell className="font-medium">{money(product.price * (1 - product.discount / 100))}{product.discount > 0 && <span className="ml-2 text-xs text-muted-foreground line-through">{money(product.price)}</span>}</TableCell><TableCell>{product.stock} units</TableCell><TableCell><Badge variant={product.stock < 10 ? "secondary" : "outline"} className={product.stock < 10 ? "text-amber-700" : "text-emerald-700"}>{product.stock < 10 ? "Low stock" : "In stock"}</Badge></TableCell>
              <TableCell className="pr-6 text-right"><Button variant="ghost" size="sm" render={<Link href={`/vendor/products/${product.id}`} />}><Eye className="size-4" /><span className="sr-only">View {product.name}</span></Button><Button variant="ghost" size="sm" render={<Link href={`/vendor/create?productID=${product.id}`} />}><ArrowUpRight className="size-4" /><span className="sr-only">Edit {product.name}</span></Button></TableCell>
            </TableRow>)}</TableBody>
          </Table></div>
          <div className="border-t px-6 py-3 text-xs text-muted-foreground">Showing {products.length} sample products. Connect your catalog API to load live inventory.</div>
        </CardContent>
      </Card>
    </main>
  );
}
