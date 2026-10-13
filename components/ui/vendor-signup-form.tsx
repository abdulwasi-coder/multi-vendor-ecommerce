"use client";

import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { ArrowRight, Check, ImagePlus, LockKeyhole, MapPin, ShieldCheck, Store, Upload, UserRound } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function VendorSignupForm() {
  const [imagePreview, setImagePreview] = useState("");
  const [imageName, setImageName] = useState("");
  const [storeSlug, setStoreSlug] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file && file.size > 5 * 1024 * 1024) {
      event.target.value = "";
      toast.error("Image is too large", { description: "Choose an image smaller than 5 MB." });
      return;
    }
    setImageName(file?.name ?? "");
    setImagePreview((current) => {
      if (current) URL.revokeObjectURL(current);
      return file ? URL.createObjectURL(file) : "";
    });
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    toast.success("Your vendor profile is ready", {
      description: `Signup details for user ${formData.get("userId")} were captured. Connect this form to the vendor API to save them.`,
    });
  }

  const inputClassName = "h-11 rounded-xl border-border/80 bg-background px-3.5 shadow-none transition focus-visible:ring-2 focus-visible:ring-primary/20";

  return (
    <main className="min-h-[calc(100dvh-2rem)] bg-[#fbf8f3]">
      <div className="w-full px-3 pb-6 pt-44 sm:px-5 sm:pb-8 sm:pt-32 lg:px-7 lg:pt-32">
        <div className="w-full">
          <header className="mb-8">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3 sm:gap-4">
              <div className="flex items-center gap-3">
                <div className="flex size-11 items-center justify-center rounded-2xl bg-amber-700 text-white shadow-sm shadow-amber-900/15"><Store className="size-5" /></div>
                <div>
                  <p className="text-sm font-semibold tracking-tight">Marketplace</p>
                  <p className="text-xs text-muted-foreground">Vendor onboarding</p>
                </div>
              </div>
              <Badge variant="outline" className="gap-1.5 rounded-full bg-background px-3 py-1 text-muted-foreground"><LockKeyhole className="size-3" /> Secure signup</Badge>
            </div>

            <div>
              <p className="mb-2 text-sm font-medium text-amber-800">A great store starts here</p>
              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Set up your vendor profile</h1>
              <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">Add your details and store information. You can update your profile anytime.</p>
            </div>
          </header>

          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <input type="hidden" name="userId"  />
            <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
              <div className="space-y-5">
                <Card className="rounded-2xl border-border/70 shadow-sm">
                  <CardHeader className="border-b border-border/60 px-5 py-5 sm:px-6">
                    <div className="flex items-start gap-3">
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-800"><UserRound className="size-4" /></div>
                      <div><CardTitle className="text-base">Personal information</CardTitle><CardDescription className="mt-1">Your contact details for account and store updates.</CardDescription></div>
                    </div>
                  </CardHeader>
                  <CardContent className="grid gap-x-5 gap-y-4 px-5 py-5 sm:grid-cols-2 sm:px-6">
                    <Field>
                      <FieldLabel htmlFor="first-name">First name <span className="text-destructive">*</span></FieldLabel>
                      <Input id="first-name" name="name" autoComplete="given-name" required placeholder="e.g. Alex" className={inputClassName} />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="last-name">Last name <span className="text-destructive">*</span></FieldLabel>
                      <Input id="last-name" name="lastname" autoComplete="family-name" required placeholder="e.g. Morgan" className={inputClassName} />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="country">Country <span className="text-destructive">*</span></FieldLabel>
                      <Input id="country" name="country" autoComplete="country-name" required placeholder="Your country" className={inputClassName} />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="mobile-number">Mobile number <span className="text-destructive">*</span></FieldLabel>
                      <Input id="mobile-number" name="mobilenumber" type="tel" autoComplete="tel" required placeholder="+1 555 010 1234" className={inputClassName} />
                    </Field>
                  </CardContent>
                </Card>

                <Card className="rounded-2xl border-border/70 shadow-sm">
                  <CardHeader className="border-b border-border/60 px-5 py-5 sm:px-6">
                    <div className="flex items-start gap-3">
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-800"><Store className="size-4" /></div>
                      <div><CardTitle className="text-base">Your store</CardTitle><CardDescription className="mt-1">Give customers a first impression they’ll remember.</CardDescription></div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-5 px-5 py-5 sm:px-6">
                    <Field>
                      <FieldLabel htmlFor="store-slug">Store URL <span className="text-destructive">*</span></FieldLabel>
                      <div className="flex h-11 items-center overflow-hidden rounded-xl border border-border/80 bg-background focus-within:ring-2 focus-within:ring-amber-700/20">
                        <span className="flex h-full items-center border-r bg-muted/50 px-3 text-sm text-muted-foreground">store/</span>
                        <Input id="store-slug" name="storeslug" value={storeSlug} onChange={(event) => setStoreSlug(event.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "").replace(/-{2,}/g, "-"))} required pattern="[a-z0-9]+(?:-[a-z0-9]+)*" title="Use lowercase letters, numbers, and single hyphens." placeholder="your-store-name" className="h-full border-0 bg-transparent px-3 shadow-none focus-visible:ring-0" />
                      </div>
                      <FieldDescription>Your unique store address. Lowercase letters, numbers, and hyphens only.</FieldDescription>
                    </Field>

                    <Field>
                      <FieldLabel htmlFor="store-description">Store description <span className="text-destructive">*</span></FieldLabel>
                      <Textarea id="store-description" name="storedescription" value={description} onChange={(event) => setDescription(event.target.value)} required maxLength={500} placeholder="Tell customers what makes your store special..." className="min-h-32 resize-y rounded-xl border-border/80 bg-background px-3.5 py-3 shadow-none focus-visible:ring-2 focus-visible:ring-amber-700/20" />
                      <FieldDescription className="text-right">{description.length}/500 characters</FieldDescription>
                    </Field>

                    <Field>
                      <FieldLabel htmlFor="store-image">Store image</FieldLabel>
                      <label htmlFor="store-image" className="group flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-amber-300 bg-amber-50/60 px-5 py-7 text-center transition hover:border-amber-600 hover:bg-amber-50">
                        {imagePreview ? (
                          <img src={imagePreview} alt="Store image preview" className="mb-3 size-20 rounded-2xl border bg-background object-cover shadow-sm" />
                        ) : (
                          <span className="mb-3 flex size-12 items-center justify-center rounded-2xl border border-amber-200 bg-white text-amber-800 shadow-sm transition group-hover:bg-amber-100"><Upload className="size-5" /></span>
                        )}
                        <span className="text-sm font-medium">{imageName || "Click to upload your store image"}</span>
                        <span className="mt-1 text-xs text-muted-foreground">PNG, JPG, or WEBP · up to 5 MB</span>
                        <Input id="store-image" name="image" type="file" accept="image/png,image/jpeg,image/webp" onChange={handleImageChange} className="sr-only" />
                      </label>
                    </Field>
                  </CardContent>
                </Card>

                <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-xs text-muted-foreground"><span className="text-destructive">*</span> Required fields</p>
                  <Button type="submit" size="lg" className="h-11 rounded-xl bg-amber-700 px-6 text-white shadow-sm shadow-amber-900/15 hover:bg-amber-800">Create vendor profile <ArrowRight className="size-4" /></Button>
                </div>
              </div>

              <aside className="grid gap-4 sm:grid-cols-2 xl:sticky xl:top-6 xl:grid-cols-1 xl:self-start">
                <Card className="overflow-hidden rounded-2xl border-border/70 shadow-sm">
                  <div className="h-20 bg-gradient-to-br from-amber-300 via-orange-100 to-[#f8eee0]" />
                  <CardContent className="relative px-5 pb-5">
                    <div className="-mt-9 flex size-16 items-center justify-center overflow-hidden rounded-2xl border-4 border-card bg-background text-muted-foreground shadow-sm">
                      {imagePreview ? <img src={imagePreview} alt="" className="size-full object-cover" /> : <ImagePlus className="size-6 text-amber-700" />}
                    </div>
                    <p className="mt-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">Store preview</p>
                    <h2 className="mt-1 truncate text-lg font-semibold">{storeSlug || "Your store name"}</h2>
                    <p className="mt-1 line-clamp-3 min-h-12 text-sm leading-5 text-muted-foreground">{description || "Your store description will appear here so customers know what you offer."}</p>
                    <div className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground"><MapPin className="size-3.5" />Store profile</div>
                  </CardContent>
                </Card>

                <Card className="rounded-2xl border-amber-200/80 bg-amber-50/70 shadow-none">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-2 font-medium"><ShieldCheck className="size-4 text-amber-800" />Your information is protected</div>
                    <p className="mt-2 text-sm leading-5 text-muted-foreground">Your details are used to set up and manage your vendor account.</p>
                    <div className="mt-4 flex items-center gap-2 border-t border-amber-200 pt-3 text-xs text-muted-foreground"><Check className="size-3.5 text-amber-800" />Account ID <span className="truncate font-mono"></span></div>
                  </CardContent>
                </Card>
              </aside>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
