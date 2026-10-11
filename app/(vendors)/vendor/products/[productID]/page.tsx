import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Box, Package, Pencil, Star, Store, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { VendorProductGallery } from "@/components/vendor-product-gallery";
import { products } from "@/lib/vendor-products";

const money = (value: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);

export default async function VendorProductDetailPage({ params }: PageProps<"/vendor/products/[productID]">) {
  const { productID } = await params;
  const product = products.find((item) => item.id === productID);
  if (!product) notFound();
  const salePrice = product.price * (1 - product.discount / 100);

  return (
    <main className="min-h-[calc(100dvh-2rem)] bg-muted/20">
      <div className="mx-auto w-full max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <header className="mb-5 flex items-center justify-between gap-4 border-b pb-4">
          <div className="min-w-0">
            <Button variant="ghost" size="sm" className="mb-1 h-7 -ml-2 text-muted-foreground" render={<Link href="/vendor/products" />}><ArrowLeft /> Products</Button>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-semibold tracking-tight">{product.name}</h1>
              <Badge variant="outline" className="font-mono">{product.id}</Badge>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">{product.brand}<span className="mx-2">/</span>{product.categoryID}</p>
          </div>
          <Button render={<Link href={`/vendor/create?productID=${product.id}`} />}><Pencil /> Edit product</Button>
        </header>

        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(340px,0.9fr)]">
          <div className="space-y-4">
            <div className="h-[min(48vh,400px)] min-h-[280px] md:h-[min(50vh,460px)] md:min-h-[360px]">
              <VendorProductGallery images={product.images} name={product.name} discount={product.discount} />
            </div>
            <Card className="rounded-xl border-border/80 shadow-sm">
              <CardContent className="grid grid-cols-2 gap-3 p-4 sm:grid-cols-[1.3fr_1fr_1fr] sm:items-center">
                <div className="col-span-2 sm:col-span-1">
                  <p className="text-xs text-muted-foreground">Selling price</p>
                  <p className="mt-1 flex flex-wrap items-baseline gap-2 text-2xl font-semibold tracking-tight">{money(salePrice)}{product.discount > 0 && <span className="text-sm font-normal text-muted-foreground line-through">{money(product.price)}</span>}</p>
                </div>
                <div className="rounded-lg bg-muted/50 px-3 py-2 sm:bg-transparent sm:px-0"><p className="text-xs text-muted-foreground">Available stock</p><p className="mt-1 flex items-center gap-2 text-sm font-medium"><Package className="size-4 text-muted-foreground" />{product.stock} units</p></div>
                <div className="rounded-lg bg-muted/50 px-3 py-2 sm:bg-transparent sm:px-0"><p className="text-xs text-muted-foreground">Category</p><p className="mt-1 flex items-center gap-2 text-sm font-medium"><Tag className="size-4 text-muted-foreground" />{product.categoryID}</p></div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Card className="rounded-xl border-border/80 shadow-sm">
              <CardHeader className="px-5 pb-3 pt-5"><CardTitle className="text-base">Description</CardTitle></CardHeader>
              <CardContent className="px-5 pb-5"><p className="text-sm leading-6 text-muted-foreground">{product.description}</p></CardContent>
            </Card>

            <Card className="rounded-xl border-border/80 shadow-sm">
              <CardHeader className="px-5 pb-3 pt-5"><CardTitle className="text-base">Product details</CardTitle></CardHeader>
              <CardContent className="space-y-3 px-5 pb-5">
                <div className="flex justify-between gap-4 text-sm"><span className="text-muted-foreground">Brand</span><span className="font-medium">{product.brand}</span></div>
                <div className="flex justify-between gap-4 text-sm"><span className="text-muted-foreground">Color</span><span className="font-medium">{product.color}</span></div>
                <Separator />
                <div className="flex items-start justify-between gap-4">
                  <div className="flex min-w-0 items-start gap-2"><Store className="mt-0.5 size-4 shrink-0 text-muted-foreground" /><div className="min-w-0"><p className="text-xs text-muted-foreground">Sold by</p><p className="truncate text-sm font-medium">{product.vendorCompanyName}</p><p className="mt-0.5 text-xs text-muted-foreground">Vendor ID: {product.vendorID}</p></div></div>
                  <div className="shrink-0 text-right"><p className="text-xs text-muted-foreground">Customer rating</p><p className="mt-1 flex items-center justify-end gap-1 text-sm font-medium"><Star className="size-4 fill-amber-400 text-amber-400" />{product.rating.toFixed(1)}<span className="font-normal text-muted-foreground">({product.reviewCount} {product.reviewCount === 1 ? "review" : "reviews"})</span></p></div>
                </div>
                <Separator />
                <div className="flex items-start gap-2"><Box className="mt-0.5 size-4 shrink-0 text-muted-foreground" /><div className="min-w-0"><p className="text-sm font-medium">Specifications</p><div className="mt-1 space-y-1 text-sm text-muted-foreground">{product.attributes.split("\n").filter(Boolean).map((attribute) => <p key={attribute}>{attribute}</p>)}</div></div></div>
              </CardContent>
            </Card>
            <Badge variant="secondary" className={product.stock < 10 ? "bg-amber-100 text-amber-900" : "bg-emerald-100 text-emerald-900"}>{product.stock < 10 ? "Low stock" : "In stock"}</Badge>
          </div>
        </div>
      </div>
    </main>
  );
}
