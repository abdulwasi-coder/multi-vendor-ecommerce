"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { ArrowLeft, ImagePlus, Plus, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
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

  const inputClassName = "h-10 rounded-lg border-border bg-background px-3 shadow-none transition focus-visible:ring-2 focus-visible:ring-ring/20";

  return (
    <main className="min-h-[calc(100dvh-2rem)] bg-background">
      <div className="mx-auto w-full max-w-6xl px-4 py-3 sm:px-7 lg:px-10">
        <Button variant="ghost" size="sm" className="mb-2 -ml-2 text-muted-foreground" render={<Link href="/vendor/products" />}>
          <ArrowLeft /> Back to products
        </Button>

        <header className="mb-4 border-b pb-4">
          <p className="text-sm text-muted-foreground">Store management <span className="mx-1">/</span> Products</p>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{editing ? "Edit product" : "Add product"}</h1>
            {editing && <Badge variant="outline" className="font-mono text-muted-foreground">{product?.id}</Badge>}
          </div>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">Fill in the product details below. Fields marked with <span className="text-destructive">*</span> are required.</p>
        </header>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
                <Field>
                  <FieldLabel htmlFor="product-name">Product name <span className="text-destructive">*</span></FieldLabel>
                  <Input id="product-name" name="name" required placeholder="e.g. Everyday Canvas Tote" defaultValue={product?.name} className={inputClassName} />
                </Field>
                <Field>
                  <FieldLabel htmlFor="product-brand">Brand</FieldLabel>
                  <Input id="product-brand" name="brand" placeholder="Brand or maker" defaultValue={product?.brand} className={inputClassName} />
                </Field>
                <Field>
                  <FieldLabel htmlFor="product-category">Category <span className="text-destructive">*</span></FieldLabel>
                  <Input id="product-category" name="categoryID" required placeholder="e.g. Bags & accessories" defaultValue={product?.categoryID} className={inputClassName} />
                </Field>
                <Field>
                  <FieldLabel htmlFor="product-color">Color</FieldLabel>
                  <Input id="product-color" name="color" placeholder="e.g. Natural / ink" defaultValue={product?.color} className={inputClassName} />
                </Field>
                <Field>
                  <FieldLabel htmlFor="product-price">Price <span className="text-destructive">*</span></FieldLabel>
                  <div className="relative"><span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm text-muted-foreground">$</span><Input id="product-price" name="price" type="number" min="0" step="0.01" required placeholder="0.00" defaultValue={product?.price} className={`${inputClassName} pl-7`} /></div>
                </Field>
                <Field>
                  <FieldLabel htmlFor="product-stock">Available stock <span className="text-destructive">*</span></FieldLabel>
                  <Input id="product-stock" name="stock" type="number" min="0" required placeholder="0" defaultValue={product?.stock} className={inputClassName} />
                </Field>
                <Field>
                  <FieldLabel htmlFor="product-discount">Discount</FieldLabel>
                  <div className="relative"><Input id="product-discount" name="discount" type="number" min="0" max="100" placeholder="0" defaultValue={product?.discount} className={`${inputClassName} pr-9`} /><span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm text-muted-foreground">%</span></div>
                </Field>
                <Field>
                  <FieldLabel htmlFor="product-attributes">Specifications</FieldLabel>
                  <Input id="product-attributes" name="attributes" placeholder="Material: Cotton · Dimensions: 38 × 42 cm" defaultValue={product?.attributes.replaceAll("\n", " · ")} className={inputClassName} />
                </Field>
                <Field className="sm:col-span-2">
                  <FieldLabel htmlFor="image-url">Product photos</FieldLabel>
                  <div className="flex gap-2"><Input id="image-url" type="url" value={imageUrl} onChange={(event) => setImageUrl(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); addImage(); } }} placeholder="Paste an image URL" className={`${inputClassName} min-w-0`} /><Button type="button" variant="outline" className="h-10 shrink-0 rounded-lg px-3" onClick={addImage} aria-label="Add image URL"><Plus className="size-4" /><span className="hidden sm:inline">Add</span></Button></div>
                  <FieldDescription><ImagePlus className="mr-1 inline size-3.5" />The first image is used as the cover.</FieldDescription>
                </Field>

                {images.length > 0 && <div className="sm:col-span-2 -mt-1 flex flex-wrap gap-2">{images.map((image, index) => <div key={`${image}-${index}`} className="group relative size-16 overflow-hidden rounded-md border bg-muted"><img src={image} alt={`Product photo ${index + 1}`} className="size-full object-cover" /><Button type="button" variant="secondary" size="icon" className="absolute right-1 top-1 size-6 opacity-90" onClick={() => setImages((current) => current.filter((_, imageIndex) => imageIndex !== index))} aria-label={`Remove photo ${index + 1}`}><Trash2 className="size-3" /></Button>{index === 0 && <span className="absolute bottom-1 left-1 rounded bg-background/90 px-1.5 py-0.5 text-[10px] font-medium">Cover</span>}</div>)}</div>}

                <Field className="sm:col-span-2 border-t pt-4">
                  <FieldLabel htmlFor="product-description">Description <span className="text-destructive">*</span></FieldLabel>
                  <Textarea id="product-description" name="description" required placeholder="Describe the product, its materials, fit, and care." defaultValue={product?.description} className="min-h-24 resize-y rounded-lg border-border bg-background px-3 py-2.5 shadow-none focus-visible:ring-2 focus-visible:ring-ring/20" />
                </Field>
          </div>
          <input type="hidden" name="images" value={images.join("\n")} />

          <div className="mt-5 flex justify-end gap-2">
            <Button type="button" variant="outline" className="min-w-24" render={<Link href="/vendor/products" />}>Cancel</Button>
            <Button type="submit" className="min-w-36"><Save />{editing ? "Save changes" : "Save product"}</Button>
          </div>
        </form>
      </div>
    </main>
  );
}
