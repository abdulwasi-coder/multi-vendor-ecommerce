import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Box, Image as ImageIcon, Package, Pencil, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { products } from "@/lib/vendor-products";

const money = (value: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);

export default async function VendorProductDetailPage({ params }: PageProps<"/vendor/products/[productID]">) {
  const { productID } = await params;
  const product = products.find((item) => item.id === productID);
  if (!product) notFound();
  const salePrice = product.price * (1 - product.discount / 100);

  return <main className="mx-auto min-h-screen w-full max-w-400 space-y-7 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-sky-100/70 via-violet-50/60 to-amber-50/50 px-4 py-7 sm:px-7 lg:px-10">
    <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-5">
      <div><Button variant="ghost" size="sm" className="mb-3 -ml-2 text-muted-foreground" render={<Link href="/vendor/products" />}><ArrowLeft /> Back to products</Button><div className="flex flex-wrap items-center gap-2"><Badge variant="secondary" className="bg-violet-100 font-mono text-violet-800">{product.id}</Badge><Badge variant="secondary" className={product.stock < 10 ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800"}>{product.stock < 10 ? "Low stock" : "In stock"}</Badge></div><h1 className="mt-3 bg-gradient-to-r from-slate-950 via-violet-900 to-sky-800 bg-clip-text text-3xl font-semibold tracking-tight text-transparent">{product.name}</h1><p className="mt-1 text-sm text-muted-foreground">{product.brand} <span className="mx-1">·</span> {product.categoryID}</p></div>
      <Button render={<Link href={`/vendor/create?productID=${product.id}`} />}><Pencil /> Edit product</Button>
    </div>
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(300px,0.85fr)]">
      <Card className="overflow-hidden rounded-2xl border-sky-200/80 bg-white/90 shadow-md shadow-sky-950/5"><div className="relative flex min-h-72 items-center justify-center overflow-hidden bg-gradient-to-br from-sky-100 via-violet-100 to-rose-100 sm:min-h-[440px]"><div className="absolute -left-16 -top-16 size-56 rounded-full bg-sky-300/30 blur-3xl" /><div className="absolute -bottom-20 -right-10 size-64 rounded-full bg-fuchsia-300/30 blur-3xl" /><div className="relative flex size-36 items-center justify-center rounded-[2rem] border border-white/80 bg-white/70 text-violet-600 shadow-xl shadow-violet-900/10 backdrop-blur"><ImageIcon className="size-14" /></div><Badge className="absolute bottom-4 left-4 border border-white/80 bg-white/80 text-slate-700 shadow-sm backdrop-blur">Product gallery</Badge></div><CardContent className="border-t border-sky-100 bg-white/80 p-5"><div className="flex items-center gap-2 text-sm font-medium"><ImageIcon className="size-4 text-sky-700" /> Product photos</div><p className="mt-1 text-xs text-muted-foreground">No product images have been added yet.</p></CardContent></Card>
      <div className="space-y-6">
        <Card className="rounded-2xl border-emerald-200/80 bg-white/90 shadow-sm shadow-emerald-950/5"><CardHeader className="bg-gradient-to-r from-emerald-50 to-white"><CardDescription className="font-medium text-emerald-800">Current price</CardDescription><CardTitle className="flex flex-wrap items-baseline gap-2 text-3xl text-emerald-950">{money(salePrice)}{product.discount > 0 && <span className="text-base font-normal text-muted-foreground line-through">{money(product.price)}</span>}</CardTitle>{product.discount > 0 && <Badge variant="secondary" className="w-fit bg-rose-100 text-rose-800">{product.discount}% discount</Badge>}</CardHeader><Separator /><CardContent className="grid grid-cols-2 gap-4 pt-5"><div className="rounded-xl bg-sky-50 p-3"><p className="text-xs text-sky-800/70">Available stock</p><p className="mt-1 flex items-center gap-2 font-semibold text-sky-950"><Package className="size-4 text-sky-700" />{product.stock} units</p></div><div className="rounded-xl bg-violet-50 p-3"><p className="text-xs text-violet-800/70">Category</p><p className="mt-1 flex items-center gap-2 font-semibold text-violet-950"><Tag className="size-4 text-violet-700" />{product.categoryID}</p></div></CardContent></Card>
        <Card className="rounded-2xl border-amber-200/80 bg-white/90 shadow-sm shadow-amber-950/5"><CardHeader className="bg-gradient-to-r from-amber-50 to-white"><CardTitle>Description</CardTitle></CardHeader><CardContent><p className="text-sm leading-6 text-muted-foreground">{product.description}</p></CardContent></Card>
        <Card className="rounded-2xl border-violet-200/80 bg-white/90 shadow-sm shadow-violet-950/5"><CardHeader className="bg-gradient-to-r from-violet-50 to-white"><CardTitle>Product details</CardTitle><CardDescription>Specifications and listing information.</CardDescription></CardHeader><CardContent className="space-y-4"><div className="flex justify-between gap-4 text-sm"><span className="text-muted-foreground">Brand</span><span className="text-right font-medium">{product.brand}</span></div><div className="flex justify-between gap-4 text-sm"><span className="text-muted-foreground">Color</span><span className="text-right font-medium">{product.color}</span></div><Separator /><div className="flex items-start gap-2"><Box className="mt-0.5 size-4 shrink-0 text-violet-700" /><div className="min-w-0"><p className="text-sm font-medium">Attributes</p><div className="mt-2 space-y-1 text-sm text-muted-foreground">{product.attributes.split("\n").filter(Boolean).map((attribute) => <p key={attribute}>{attribute}</p>)}</div></div></div></CardContent></Card>
        <Button className="w-full bg-gradient-to-r from-violet-700 to-indigo-600 text-white shadow-md shadow-violet-900/15 hover:from-violet-800 hover:to-indigo-700" render={<Link href={`/vendor/create?productID=${product.id}`} />}>Edit listing <ArrowUpRight /></Button>
      </div>
    </div>
    <p className="text-xs text-muted-foreground">Product information shown here is sample data until connected to your vendor API.</p>
  </main>;
}
