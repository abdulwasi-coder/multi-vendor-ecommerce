"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { ArrowLeft, Check, MapPin, Pencil, Phone, ShieldCheck, Store, UserRound, X } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const sampleProfile = {
  firstName: "John",
  lastName: "Smith",
  country: "United States",
  mobileNumber: "+1 555 010 1234",
  storeName: "Bon Ton Studio",
  storeSlug: "bon-ton-studio",
  storeDescription: "Thoughtfully selected goods for everyday living and gifting.",
  imageName: "logo3.jpg",
};

export default function VendorProfilePage() {
  const [profile, setProfile] = useState(sampleProfile);
  const [draft, setDraft] = useState(sampleProfile);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("marketly-vendor-profile-edits");
      if (saved) {
        const savedProfile = { ...sampleProfile, ...JSON.parse(saved) };
        setProfile(savedProfile);
        setDraft(savedProfile);
      }
    } catch {
      localStorage.removeItem("marketly-vendor-profile-edits");
    }
  }, []);

  const name = [profile.firstName, profile.lastName].filter(Boolean).join(" ");

  function startEditing() {
    setDraft({ ...profile });
    setEditing(true);
  }

  function cancelEditing() {
    setDraft({ ...profile });
    setEditing(false);
  }

  function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setProfile(draft);
    localStorage.setItem("marketly-vendor-profile-edits", JSON.stringify(draft));
    setEditing(false);
    toast.success("Profile updated", { description: "Your changes are saved on this device." });
  }

  return (
    <main className="min-h-screen space-y-5 bg-[#f5f6f4] px-2 py-4 sm:px-4 lg:px-6">
      <header className="flex flex-col justify-between gap-3 border-b border-border/70 pb-4 sm:flex-row sm:items-center">
        <div className="space-y-1">
          <Link href="/vendor/dashboard" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground transition hover:text-foreground"><ArrowLeft className="size-3.5" /> Vendor dashboard</Link>
          <h1 className="text-xl font-semibold tracking-tight">My vendor profile</h1>
          <p className="text-sm text-muted-foreground">Your account details and storefront information.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" className="w-fit gap-1.5 rounded-full bg-background px-2.5 py-1 text-xs font-normal text-muted-foreground"><ShieldCheck className="size-3" /> Sample profile data</Badge>
          {editing ? (
            <>
              <Button type="button" variant="outline" size="sm" onClick={cancelEditing}><X className="size-3.5" /> Cancel</Button>
              <Button type="submit" size="sm" form="vendor-profile-edit"><Check className="size-3.5" /> Save changes</Button>
            </>
          ) : (
            <Button type="button" variant="outline" size="sm" onClick={startEditing}><Pencil className="size-3.5" /> Edit profile</Button>
          )}
        </div>
      </header>

      {editing ? (
        <form id="vendor-profile-edit" onSubmit={saveProfile} className="grid items-start gap-4 lg:grid-cols-2">
          <Card className="border-[#dfe4df] shadow-sm shadow-[#192c25]/5">
            <CardHeader className="border-b">
              <div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary"><UserRound className="size-5" /></span><div><CardTitle>Personal information</CardTitle><CardDescription className="mt-1">Update your contact details.</CardDescription></div></div>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-1.5 text-sm font-medium">First name<Input value={draft.firstName} onChange={(event) => setDraft({ ...draft, firstName: event.target.value })} /></label>
              <label className="grid gap-1.5 text-sm font-medium">Last name<Input value={draft.lastName} onChange={(event) => setDraft({ ...draft, lastName: event.target.value })} /></label>
              <label className="grid gap-1.5 text-sm font-medium">Mobile number<Input type="tel" value={draft.mobileNumber} onChange={(event) => setDraft({ ...draft, mobileNumber: event.target.value })} /></label>
              <label className="grid gap-1.5 text-sm font-medium">Country<Input value={draft.country} onChange={(event) => setDraft({ ...draft, country: event.target.value })} /></label>
            </CardContent>
          </Card>
          <Card className="border-[#dfe4df] shadow-sm shadow-[#192c25]/5">
            <CardHeader className="border-b">
              <div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-xl bg-amber-500/10 text-amber-700"><Store className="size-5" /></span><div><CardTitle>Store information</CardTitle><CardDescription className="mt-1">Edit your public storefront details.</CardDescription></div></div>
            </CardHeader>
            <CardContent className="space-y-4">
              <label className="grid gap-1.5 text-sm font-medium">Store name<Input value={draft.storeName} onChange={(event) => setDraft({ ...draft, storeName: event.target.value })} /></label>
              <label className="grid gap-1.5 text-sm font-medium">Store URL<Input value={draft.storeSlug} onChange={(event) => setDraft({ ...draft, storeSlug: event.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "").replace(/-{2,}/g, "-") })} /></label>
              <label className="grid gap-1.5 text-sm font-medium">Store description<Textarea value={draft.storeDescription} onChange={(event) => setDraft({ ...draft, storeDescription: event.target.value })} maxLength={500} className="min-h-28" /></label>
            </CardContent>
          </Card>
        </form>
      ) : (
        <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_320px] xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-5">
            <Card className="border-[#dfe4df] shadow-sm shadow-[#192c25]/5">
              <CardHeader className="border-b">
                <div className="flex items-center gap-3">
                  <span className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary"><UserRound className="size-5" /></span>
                  <div><CardTitle>Personal information</CardTitle><CardDescription className="mt-1">Your vendor account contact details.</CardDescription></div>
                </div>
              </CardHeader>
              <CardContent className="grid gap-5 sm:grid-cols-2">
                <ProfileValue label="Name" value={name} />
                <ProfileValue label="Mobile number" value={profile.mobileNumber} icon={<Phone className="size-4" />} />
                <ProfileValue label="Country" value={profile.country} icon={<MapPin className="size-4" />} />
              </CardContent>
            </Card>

            <Card className="border-[#dfe4df] shadow-sm shadow-[#192c25]/5">
              <CardHeader className="border-b">
                <div className="flex items-center gap-3">
                  <span className="grid size-10 place-items-center rounded-xl bg-amber-500/10 text-amber-700"><Store className="size-5" /></span>
                  <div><CardTitle>Store information</CardTitle><CardDescription className="mt-1">Public details customers see on your store.</CardDescription></div>
                </div>
              </CardHeader>
              <CardContent className="space-y-5">
                <ProfileValue label="Store name" value={profile.storeName} />
                <ProfileValue label="Store URL" value={`marketly/${profile.storeSlug}`} />
                <ProfileValue label="Store description" value={profile.storeDescription} />
                {profile.imageName && <ProfileValue label="Store image file" value={profile.imageName} />}
              </CardContent>
            </Card>
          </div>

          <Card className="overflow-hidden border-[#dfe4df] shadow-md shadow-[#192c25]/5">
            <div className="h-24 bg-gradient-to-br from-[#d8b975] via-[#f4e5c0] to-[#e4ebe5]" />
            <CardContent className="relative">
              <div className="-mt-10 grid size-16 place-items-center rounded-2xl border-4 border-card bg-[#203b33] text-amber-100 shadow-md"><Store className="size-6" /></div>
              <p className="mt-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">Your store</p>
              <h2 className="mt-1 text-xl font-semibold">{profile.storeName}</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{profile.storeDescription}</p>
              <div className="mt-4 flex items-center gap-2 border-t pt-4 text-sm text-muted-foreground"><MapPin className="size-4" />{profile.country}</div>
            </CardContent>
          </Card>
        </div>
      )}
    </main>
  );
}

function ProfileValue({ label, value, icon }: { label: string; value: string; icon?: ReactNode }) {
  return (
    <div className="min-w-0">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-1 flex min-h-6 items-start gap-2 text-sm font-medium text-foreground">
        {icon && <span className="mt-0.5 text-muted-foreground">{icon}</span>}
        {value || <span className="font-normal italic text-muted-foreground">Not added</span>}
      </p>
    </div>
  );
}
