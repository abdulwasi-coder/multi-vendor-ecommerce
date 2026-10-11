"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import {
  ArrowLeft, Check, CircleDollarSign, ImagePlus, Layers3,
  PackageCheck, Plus, Save, Sparkles, Tag, Trash2, UploadCloud,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "@/components/ui/input-group";
import { Textarea } from "@/components/ui/textarea";
import type { Product } from "@/lib/vendor-products";

export function ProductForm({ product }: { product?: Product }) {
  const [images, setImages] = useState<string[]>(product?.images ?? []);
  const [imageUrl, setImageUrl] = useState("");
  const editing = Boolean(product);

  function addImage() {
    const value = imageUrl.trim();
    if (!value) return;
    setImages((current) => [...current, value]);
    setImageUrl("");
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    toast.success(editing ? "Product changes saved" : "Product added to your catalog", {
      description: "This preview form is not connected to the product API yet.",
    });
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-sky-100/70 via-violet-50/60 to-amber-50/50">
      <div className="mx-auto max-w-7xl px-4 py-7 sm:px-7 lg:px-10">
        <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
          <div>
            <Button variant="ghost" size="sm" className="mb-4 -ml-2 text-muted-foreground" render={<Link href="/vendor/products" />}>
              <ArrowLeft /> Back to products
            </Button>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Catalog</span><span>/</span><span className="text-foreground">{editing ? "Edit product" : "New product"}</span>
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <h1 className="bg-gradient-to-r from-slate-950 via-violet-900 to-sky-800 bg-clip-text text-3xl font-semibold tracking-tight text-transparent">{editing ? "Edit product" : "Add a product"}</h1>
              {editing ? <Badge variant="secondary" className="bg-violet-100 font-mono text-violet-800">{product?.id}</Badge> : <Badge variant="secondary" className="gap-1 bg-sky-100 text-sky-800"><Sparkles className="size-3" /> New listing</Badge>}
            </div>
            <p className="mt-2 max-w-xl text-sm text-muted-foreground">A thoughtful listing helps the right customers find your product.</p>
          </div>
          <div className="hidden items-center gap-2 text-xs text-muted-foreground md:flex">
            <span className="flex size-6 items-center justify-center rounded-full bg-primary text-primary-foreground"><Check className="size-3.5" /></span>
            <span className="font-medium text-foreground">Product details</span><span className="mx-1 h-px w-8 bg-border" />
            <span className="flex size-6 items-center justify-center rounded-full border">2</span><span>Review</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_330px]">
          <div className="space-y-6">
            <Card className="overflow-hidden border-sky-200/80 bg-white/90 shadow-sm shadow-sky-950/5 backdrop-blur-sm">
              <CardHeader className="border-b border-sky-100 bg-gradient-to-r from-sky-50 to-white px-6 py-5">
                <div className="flex items-start gap-3"><div className="rounded-lg bg-sky-100 p-2 text-sky-700 ring-1 ring-sky-200/70"><Tag className="size-4" /></div><div><CardTitle>Basic information</CardTitle><CardDescription className="mt-1">Give your listing a name and a clear description.</CardDescription></div></div>
              </CardHeader>
              <CardContent className="px-6 py-6">
                <FieldGroup className="gap-5">
                  <Field><FieldLabel htmlFor="product-name">Product name <span className="text-destructive">*</span></FieldLabel><Input id="product-name" name="name" required placeholder="e.g. Everyday Canvas Tote" defaultValue={product?.name} className="h-10" /></Field>
                  <Field><FieldLabel htmlFor="product-description">Description <span className="text-destructive">*</span></FieldLabel><Textarea id="product-description" name="description" required placeholder="What makes this product special? Include materials, fit, and care details." defaultValue={product?.description} className="min-h-32 resize-y" /><FieldDescription>Keep it helpful and specific. You can add line breaks for readability.</FieldDescription></Field>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field><FieldLabel htmlFor="product-brand">Brand</FieldLabel><Input id="product-brand" name="brand" placeholder="Brand or maker" defaultValue={product?.brand} className="h-10" /></Field>
                    <Field><FieldLabel htmlFor="product-category">Category ID <span className="text-destructive">*</span></FieldLabel><Input id="product-category" name="categoryID" required placeholder="e.g. bags-accessories" defaultValue={product?.categoryID} className="h-10" /><FieldDescription>Enter the ID used by your catalog.</FieldDescription></Field>
                  </div>
                </FieldGroup>
              </CardContent>
            </Card>

            <Card className="overflow-hidden border-emerald-200/80 bg-white/90 shadow-sm shadow-emerald-950/5 backdrop-blur-sm">
              <CardHeader className="border-b border-emerald-100 bg-gradient-to-r from-emerald-50 to-white px-6 py-5"><div className="flex items-start gap-3"><div className="rounded-lg bg-emerald-100 p-2 text-emerald-700 ring-1 ring-emerald-200/70"><CircleDollarSign className="size-4" /></div><div><CardTitle>Pricing & inventory</CardTitle><CardDescription className="mt-1">Set a price and keep your available stock up to date.</CardDescription></div></div></CardHeader>
              <CardContent className="px-6 py-6">
                <div className="grid gap-5 sm:grid-cols-3">
                  <Field><FieldLabel htmlFor="product-price">Price <span className="text-destructive">*</span></FieldLabel><InputGroup className="h-10"><InputGroupAddon><InputGroupText>$</InputGroupText></InputGroupAddon><InputGroupInput id="product-price" name="price" type="number" min="0" step="0.01" required placeholder="0.00" defaultValue={product?.price} /></InputGroup></Field>
                  <Field><FieldLabel htmlFor="product-discount">Discount</FieldLabel><InputGroup className="h-10"><InputGroupInput id="product-discount" name="discount" type="number" min="0" max="100" placeholder="0" defaultValue={product?.discount} /><InputGroupAddon align="inline-end"><InputGroupText>%</InputGroupText></InputGroupAddon></InputGroup><FieldDescription>Optional sale discount.</FieldDescription></Field>
                  <Field><FieldLabel htmlFor="product-stock">Available stock <span className="text-destructive">*</span></FieldLabel><InputGroup className="h-10"><InputGroupInput id="product-stock" name="stock" type="number" min="0" required placeholder="0" defaultValue={product?.stock} /><InputGroupAddon align="inline-end"><InputGroupText>units</InputGroupText></InputGroupAddon></InputGroup></Field>
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden border-violet-200/80 bg-white/90 shadow-sm shadow-violet-950/5 backdrop-blur-sm">
              <CardHeader className="border-b border-violet-100 bg-gradient-to-r from-violet-50 to-white px-6 py-5"><div className="flex items-start gap-3"><div className="rounded-lg bg-violet-100 p-2 text-violet-700 ring-1 ring-violet-200/70"><Layers3 className="size-4" /></div><div><CardTitle>Options & attributes</CardTitle><CardDescription className="mt-1">Add the details that help customers compare products.</CardDescription></div></div></CardHeader>
              <CardContent className="px-6 py-6"><div className="grid gap-5 sm:grid-cols-2">
                <Field><FieldLabel htmlFor="product-color">Color</FieldLabel><Input id="product-color" name="color" placeholder="e.g. Natural / ink" defaultValue={product?.color} className="h-10" /></Field>
                <Field><FieldLabel htmlFor="product-attributes">Attributes</FieldLabel><Textarea id="product-attributes" name="attributes" placeholder={'Material: 100% cotton\nDimensions: 38 × 42 cm\nCare: Spot clean'} defaultValue={product?.attributes} className="min-h-28 resize-y" /><FieldDescription>One detail per line, such as Material: Cotton.</FieldDescription></Field>
              </div></CardContent>
            </Card>
          </div>

          <aside className="space-y-5 lg:sticky lg:top-6">
            <Card className="overflow-hidden border-rose-200/80 bg-white/90 shadow-sm shadow-rose-950/5 backdrop-blur-sm">
              <CardHeader className="border-b border-rose-100 bg-gradient-to-r from-rose-50 to-white px-5 py-5"><div className="flex items-start gap-3"><div className="rounded-lg bg-rose-100 p-2 text-rose-700 ring-1 ring-rose-200/70"><ImagePlus className="size-4" /></div><div><CardTitle>Product images</CardTitle><CardDescription className="mt-1">Show your product from its best angle.</CardDescription></div></div></CardHeader>
              <CardContent className="space-y-4 p-5">
                <div className="flex min-h-40 flex-col items-center justify-center rounded-xl border border-dashed border-rose-300 bg-gradient-to-br from-rose-50 via-orange-50/70 to-amber-50 px-5 text-center">
                  <span className="mb-3 flex size-10 items-center justify-center rounded-full border border-rose-200 bg-white text-rose-600 shadow-sm"><UploadCloud className="size-5" /></span>
                  <p className="text-sm font-medium">Add product photos</p><p className="mt-1 text-xs leading-relaxed text-muted-foreground">Add a publicly accessible image URL below. Your first image will be the cover.</p>
                </div>
                <Field><FieldLabel htmlFor="image-url">Image URL</FieldLabel><div className="flex gap-2"><Input id="image-url" value={imageUrl} onChange={(event) => setImageUrl(event.target.value)} placeholder="https://example.com/photo.jpg" className="h-10 min-w-0" /><Button type="button" variant="secondary" size="icon" className="size-10 shrink-0" onClick={() => { const value = imageUrl.trim(); if (value) { setImages((current) => [...current, value]); setImageUrl(""); } }} aria-label="Add image URL"><Plus /></Button></div></Field>
                {images.length > 0 && <div className="space-y-2">{images.map((image, index) => <div key={`${image}-${index}`} className="flex min-w-0 items-center gap-3 rounded-lg border bg-background p-2"><div className="size-10 shrink-0 overflow-hidden rounded-md bg-muted"><img src={image} alt={`Product image ${index + 1}`} className="size-full object-cover" /></div><span className="min-w-0 flex-1 truncate text-xs text-muted-foreground">{index === 0 ? "Cover image" : `Image ${index + 1}`}</span><Button type="button" variant="ghost" size="icon" className="size-8 shrink-0 text-muted-foreground hover:text-destructive" onClick={() => setImages((current) => current.filter((_, imageIndex) => imageIndex !== index))} aria-label="Remove image"><Trash2 className="size-4" /></Button></div>)}</div>}
                <input type="hidden" name="images" value={images.join("\n")} />
                <p className="text-xs text-muted-foreground">Use clear, well-lit images. Add multiple angles when available.</p>
              </CardContent>
            </Card>

            <Card className="border-amber-200/80 bg-white/95 shadow-sm shadow-amber-950/5"><CardHeader className="px-5 pb-3 pt-5"><div className="flex items-start gap-3"><div className="rounded-lg bg-amber-100 p-2 text-amber-700 ring-1 ring-amber-200/70"><PackageCheck className="size-4" /></div><div><CardTitle>Listing status</CardTitle><CardDescription className="mt-1">Your product will be ready to review.</CardDescription></div></div></CardHeader><CardContent className="space-y-4 px-5 pb-5"><div className="flex items-center gap-2 rounded-lg bg-amber-50 px-3 py-2.5 text-xs text-amber-800"><Sparkles className="size-3.5 shrink-0" />Complete required fields to prepare your listing.</div><Button type="submit" className="h-10 w-full bg-gradient-to-r from-violet-700 to-indigo-600 text-white shadow-md shadow-violet-900/15 hover:from-violet-800 hover:to-indigo-700"><Save />{editing ? "Save changes" : "Save product"}</Button><Button type="button" variant="outline" className="w-full border-amber-200 hover:bg-amber-50" render={<Link href="/vendor/products" />}>Cancel</Button></CardContent></Card>
            <p className="px-1 text-center text-xs text-muted-foreground">You can edit these details at any time.</p>
          </aside>
        </form>
      </div>
    </main>
  );
}
