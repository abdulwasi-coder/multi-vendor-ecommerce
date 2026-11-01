"use client";

import Image from "next/image";
import Link from "next/link";
import { type ReactNode } from "react";
import {
  ArrowLeft,
  MapPin,
  Phone,
  ShieldCheck,
  Store,
  UserRound,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  useVendorProfile,
  type VendorProfile,
} from "@/Otherfiles/tanstack/vendor-profile";

function companyImageUrl(profile: VendorProfile) {
  const image = profile.Companyimage;
  return [image?.cloudinaryId, image?.publicId].find(
    (value) => typeof value === "string" && /^https?:\/\//i.test(value),
  );
}

export default function VendorProfilePage() {
  const query = useVendorProfile();
  const profile = query.data;

  const imageUrl = profile ? companyImageUrl(profile) : undefined;

  return (
    <main className="min-h-screen space-y-5 bg-[#f5f6f4] px-2 py-4 sm:px-4 lg:px-6">
      <header className="flex flex-col justify-between gap-3 border-b border-border/70 pb-4 sm:flex-row sm:items-center">
        <div className="space-y-1">
          <Link
            href="/vendor/dashboard"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground transition hover:text-foreground"
          >
            <ArrowLeft className="size-3.5" /> Vendor dashboard
          </Link>
          <h1 className="text-xl font-semibold tracking-tight">
            My vendor profile
          </h1>
          <p className="text-sm text-muted-foreground">
            Your account details and storefront information.
          </p>
        </div>
        {profile && (
          <Badge
            variant="outline"
            className="w-fit gap-1.5 rounded-full bg-background px-2.5 py-1 text-xs font-normal capitalize text-muted-foreground"
          >
            <ShieldCheck className="size-3" />
            {profile.status}
          </Badge>
        )}
      </header>

      {query.isPending ? (
        <p role="status" className="py-12 text-center text-sm text-muted-foreground">
          Loading your vendor profile...
        </p>
      ) : query.isError ? (
        <div className="rounded-xl border border-destructive/30 bg-background p-6 text-center">
          <p role="alert" className="text-sm text-destructive">
            {query.error instanceof Error
              ? query.error.message
              : "Could not load your vendor profile."}
          </p>
          <button
            type="button"
            className="mt-4 rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted"
            onClick={() => void query.refetch()}
          >
            Try again
          </button>
        </div>
      ) : profile ? (
        <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_320px] xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-5">
            <Card className="border-[#dfe4df] shadow-sm shadow-[#192c25]/5">
              <CardHeader className="border-b">
                <div className="flex items-center gap-3">
                  <span className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary">
                    <UserRound className="size-5" />
                  </span>
                  <div>
                    <CardTitle>Personal information</CardTitle>
                    <CardDescription className="mt-1">
                      Your vendor account contact details.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="grid gap-5 sm:grid-cols-2">
                <ProfileValue
                  label="Name"
                  value={`${profile.name} ${profile.lastName}`.trim()}
                />
                <ProfileValue
                  label="Mobile number"
                  value={profile.mobilenumber}
                  icon={<Phone className="size-4" />}
                />
                <ProfileValue
                  label="Country"
                  value={profile.country}
                  icon={<MapPin className="size-4" />}
                />
              </CardContent>
            </Card>

            <Card className="border-[#dfe4df] shadow-sm shadow-[#192c25]/5">
              <CardHeader className="border-b">
                <div className="flex items-center gap-3">
                  <span className="grid size-10 place-items-center rounded-xl bg-amber-500/10 text-amber-700">
                    <Store className="size-5" />
                  </span>
                  <div>
                    <CardTitle>Store information</CardTitle>
                    <CardDescription className="mt-1">
                      Public details customers see on your store.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-5">
                <ProfileValue label="Store name" value={profile.companyName} />
                <ProfileValue
                  label="Store URL"
                  value={`marketly/${profile.storeSlug}`}
                />
                <ProfileValue
                  label="Store description"
                  value={profile.storeDescription}
                />
              </CardContent>
            </Card>
          </div>

          <Card className="overflow-hidden border-[#dfe4df] shadow-md shadow-[#192c25]/5">
            <div className="h-24 bg-linear-to-br from-[#d8b975] via-[#f4e5c0] to-[#e4ebe5]" />
            <CardContent className="relative">
              <div className="-mt-10 grid size-16 place-items-center overflow-hidden rounded-2xl border-4 border-card bg-[#203b33] text-amber-100 shadow-md">
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt={`${profile.companyName} store`}
                    width={64}
                    height={64}
                    className="size-full object-cover"
                  />
                ) : (
                  <Store className="size-6" />
                )}
              </div>
              <p className="mt-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Your store
              </p>
              <h2 className="mt-1 text-xl font-semibold">
                {profile.companyName}
              </h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {profile.storeDescription}
              </p>
              <div className="mt-4 flex items-center gap-2 border-t pt-4 text-sm text-muted-foreground">
                <MapPin className="size-4" />
                {profile.country}
              </div>
            </CardContent>
          </Card>
        </div>
      ) : null}
    </main>
  );
}

function ProfileValue({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: ReactNode;
}) {
  return (
    <div className="min-w-0">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 flex min-h-6 items-start gap-2 text-sm font-medium text-foreground">
        {icon && <span className="mt-0.5 text-muted-foreground">{icon}</span>}
        {value || (
          <span className="font-normal italic text-muted-foreground">
            Not added
          </span>
        )}
      </p>
    </div>
  );
}
