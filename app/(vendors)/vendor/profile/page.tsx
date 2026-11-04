"use client";

import Image from "next/image";
import Link from "next/link";
import { type FormEvent, type ReactNode, useEffect, useState } from "react";
import {
  ArrowLeft,
  Check,
  ChevronsUpDown,
  KeyRound,
  Pencil,
  MapPin,
  Phone,
  Save,
  ShieldCheck,
  Store,
  UserRound,
  X,
} from "lucide-react";
import { isAxiosError } from "axios";
import { useQueryClient } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ALLOWED_COUNTRIES } from "@/Otherfiles/ZOD";
import api from "@/lib/axios";
import { toast } from "sonner";
import { useVendorProfile } from "@/Otherfiles/tanstack/vendor-profile";

const PHONE_CODES = [
  ...new Set(ALLOWED_COUNTRIES.map((country) => country.phoneCode)),
];

function findCountry(countryValue: string) {
  return (
    ALLOWED_COUNTRIES.find((country) => country.value === countryValue) ??
    ALLOWED_COUNTRIES.find(
      (country) => country.label.toLowerCase() === countryValue.toLowerCase(),
    )
  );
}

function getPhoneDetails(countryValue: string, phone: string) {
  const country = findCountry(countryValue);
  const matchingPhoneCode = [...PHONE_CODES]
    .sort((a, b) => b.length - a.length)
    .find((code) => phone.startsWith(code));
  const phoneCode = matchingPhoneCode ?? country?.phoneCode ?? "+44";
  const localNumber = phone.startsWith(phoneCode)
    ? phone.slice(phoneCode.length)
    : phone;

  return {
    phoneCode,
    localNumber: localNumber.replace(/\D/g, ""),
  };
}

export default function VendorProfilePage() {
  const query = useVendorProfile();
  const queryClient = useQueryClient();
  const profile = query.data;
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [imageFile, setImageFile] = useState<File>();
  const [imagePreview, setImagePreview] = useState("");
  const [countryOpen, setCountryOpen] = useState(false);
  const [editCountry, setEditCountry] = useState("");
  const [phoneCode, setPhoneCode] = useState("+44");
  const [localPhoneNumber, setLocalPhoneNumber] = useState("");

  useEffect(
    () => () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    },
    [imagePreview],
  );

  const imageUrl = imagePreview || profile?.Companyimage?.publicId;

  function closeEditor() {
    setIsEditing(false);
    setImageFile(undefined);
    setImagePreview("");
  }

  function openEditor() {
    if (!profile) return;
    const phoneDetails = getPhoneDetails(profile.country, profile.mobilenumber);

    setEditCountry(findCountry(profile.country)?.value ?? "");
    setPhoneCode(phoneDetails.phoneCode);
    setLocalPhoneNumber(phoneDetails.localNumber);
    setIsEditing(true);
  }

  async function handleProfileSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!profile || isSaving) return;
    if (!editCountry) {
      toast.error("Please select a country.");
      return;
    }

    const formData = new FormData(event.currentTarget);
    formData.set("country", editCountry);
    formData.set("mobilenumber", `${phoneCode}${localPhoneNumber}`);
    if (imageFile) formData.set("companyimage", imageFile);
    setIsSaving(true);

    try {
      const response = await api.put<{
        success: boolean;
        message?: string;
        vendor?: typeof profile;
      }>("/vendor/updateProfile", formData);

      if (!response.data.success || !response.data.vendor) {
        throw new Error(response.data.message ?? "Could not update your profile.");
      }

      queryClient.setQueryData(["vendor-profile"], response.data.vendor);
      toast.success(response.data.message ?? "Profile updated successfully.");
      closeEditor();
    } catch (error) {
      const message = isAxiosError<{ message?: string }>(error)
        ? error.response?.data?.message
        : error instanceof Error
          ? error.message
          : undefined;
      toast.error(
        typeof message === "string" && message.trim()
          ? message
          : "Could not update your profile. Please try again.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function handlePasswordChange(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isChangingPassword) return;

    const form = event.currentTarget;
    const formData = new FormData(form);
    setIsChangingPassword(true);

    try {
      const response = await api.put<{
        success: boolean;
        message?: string;
      }>("/vendor/changePassword", {
        email: formData.get("email"),
        password: formData.get("password"),
      });

      if (!response.data.success) {
        throw new Error(response.data.message ?? "Could not change your password.");
      }

      form.reset();
      toast.success(response.data.message ?? "Password changed successfully.");
    } catch (error) {
      const message = isAxiosError<{ message?: string }>(error)
        ? error.response?.data?.message
        : error instanceof Error
          ? error.message
          : undefined;
      toast.error(
        typeof message === "string" && message.trim()
          ? message
          : "Could not change your password. Please try again.",
      );
    } finally {
      setIsChangingPassword(false);
    }
  }

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
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className="w-fit gap-1.5 rounded-full bg-background px-2.5 py-1 text-xs font-normal capitalize text-muted-foreground"
            >
              <ShieldCheck className="size-3" />
              {profile.status}
            </Badge>
            {!isEditing && (
              <Button type="button" onClick={openEditor}>
                <Pencil /> Edit profile
              </Button>
            )}
          </div>
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
            {isEditing && (
              <Card className="border-[#dfe4df] shadow-sm shadow-[#192c25]/5">
                <CardHeader className="border-b">
                  <CardTitle>Edit vendor profile</CardTitle>
                  <CardDescription>
                    Update your contact information and public store details.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleProfileSave} className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <label className="space-y-1.5 text-sm font-medium">
                        First name
                        <Input name="name" required minLength={2} maxLength={120} defaultValue={profile.name} />
                      </label>
                      <label className="space-y-1.5 text-sm font-medium">
                        Last name
                        <Input name="lastName" required minLength={2} maxLength={120} defaultValue={profile.lastName} />
                      </label>
                      <div className="space-y-1.5 text-sm font-medium">
                        <span className="block">Country</span>
                        <input type="hidden" name="country" value={editCountry} />
                        <Popover open={countryOpen} onOpenChange={setCountryOpen}>
                          <PopoverTrigger
                            render={
                              <Button
                                type="button"
                                variant="outline"
                                aria-label="Select your country"
                                className="h-11 w-full justify-between rounded-xl font-normal"
                              >
                                {findCountry(editCountry)?.label ??
                                  "Select your country..."}
                                <ChevronsUpDown className="size-4 shrink-0 opacity-50" />
                              </Button>
                            }
                          />
                          <PopoverContent
                            className="max-h-72 w-75 p-0"
                            align="start"
                          >
                            <Command>
                              <CommandInput placeholder="Search country..." />
                              <CommandList>
                                <CommandEmpty>No country found.</CommandEmpty>
                                <CommandGroup>
                                  {ALLOWED_COUNTRIES.map((country) => (
                                    <CommandItem
                                      key={country.value}
                                      value={country.label}
                                      onSelect={() => {
                                        setEditCountry(country.value);
                                        setPhoneCode(country.phoneCode);
                                        setLocalPhoneNumber((current) =>
                                          current.slice(
                                            0,
                                            15 -
                                              country.phoneCode.replace(
                                                /\D/g,
                                                "",
                                              ).length,
                                          ),
                                        );
                                        setCountryOpen(false);
                                      }}
                                    >
                                      <Check
                                        className={
                                          editCountry === country.value
                                            ? "opacity-100"
                                            : "opacity-0"
                                        }
                                      />
                                      {country.label}
                                      <span className="ml-auto font-mono text-xs text-muted-foreground">
                                        {country.phoneCode}
                                      </span>
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                      </div>
                      <div className="space-y-1.5 text-sm font-medium">
                        <label className="block" htmlFor="edit-mobile-number">
                          Mobile number
                        </label>
                        <div className="flex items-center gap-2">
                          <Select
                            value={phoneCode}
                            onValueChange={(value) => {
                              if (value) {
                                setPhoneCode(value);
                                setLocalPhoneNumber((current) =>
                                  current.slice(
                                    0,
                                    15 - value.replace(/\D/g, "").length,
                                  ),
                                );
                              }
                            }}
                          >
                            <SelectTrigger
                              className="h-11 w-24 rounded-xl"
                              aria-label="Mobile country calling code"
                            >
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {PHONE_CODES.map((code) => (
                                <SelectItem key={code} value={code}>
                                  {code}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Input
                            id="edit-mobile-number"
                            type="tel"
                            inputMode="numeric"
                            autoComplete="tel-national"
                            required
                            minLength={Math.max(
                              1,
                              8 - phoneCode.replace(/\D/g, "").length,
                            )}
                            maxLength={15 - phoneCode.replace(/\D/g, "").length}
                            value={localPhoneNumber}
                            onChange={(event) =>
                              setLocalPhoneNumber(
                                event.target.value.replace(/\D/g, ""),
                              )
                            }
                            placeholder="712345678"
                          />
                        </div>
                      </div>
                      <label className="space-y-1.5 text-sm font-medium">
                        Store name
                        <Input name="companyName" required minLength={2} maxLength={120} defaultValue={profile.companyName} />
                      </label>
                      <label className="space-y-1.5 text-sm font-medium">
                        Store URL
                        <Input name="storeSlug" required minLength={2} maxLength={120} pattern="[a-zA-Z0-9-]+" defaultValue={profile.storeSlug} />
                      </label>
                    </div>
                    <label className="block space-y-1.5 text-sm font-medium">
                      Store description
                      <Textarea
                        name="storeDescription"
                        required
                        minLength={2}
                        maxLength={2000}
                        defaultValue={profile.storeDescription}
                        className="min-h-28"
                      />
                    </label>
                    <label className="block space-y-1.5 text-sm font-medium">
                      Store image (optional)
                      <Input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={(event) => {
                          const file = event.target.files?.[0];
                          setImageFile(file);
                          setImagePreview((current) => {
                            if (current) URL.revokeObjectURL(current);
                            return file ? URL.createObjectURL(file) : "";
                          });
                        }}
                      />
                    </label>
                    <div className="flex justify-end gap-2">
                      <Button type="button" variant="outline" onClick={closeEditor} disabled={isSaving}>
                        <X /> Cancel
                      </Button>
                      <Button type="submit" disabled={isSaving}>
                        <Save /> {isSaving ? "Saving..." : "Save changes"}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}
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
                  value={findCountry(profile.country)?.label ?? profile.country}
                  icon={<MapPin className="size-4" />}
                />
              </CardContent>
            </Card>

            <Card className="border-[#dfe4df] shadow-sm shadow-[#192c25]/5">
              <CardHeader className="border-b">
                <div className="flex items-center gap-3">
                  <span className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary">
                    <KeyRound className="size-5" />
                  </span>
                  <div>
                    <CardTitle>Change password</CardTitle>
                    <CardDescription className="mt-1">
                      Confirm your account email and choose a new password.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <label className="block space-y-1.5 text-sm font-medium">
                    Account email
                    <Input
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      maxLength={254}
                    />
                  </label>
                  <label className="block space-y-1.5 text-sm font-medium">
                    New password
                    <Input
                      name="password"
                      type="password"
                      autoComplete="new-password"
                      required
                      minLength={8}
                      maxLength={128}
                    />
                  </label>
                  <p className="text-xs text-muted-foreground">
                    Use at least 8 characters. You must be signed in to change
                    your password.
                  </p>
                  <div className="flex justify-end">
                    <Button type="submit" disabled={isChangingPassword}>
                      <KeyRound />
                      {isChangingPassword ? "Changing..." : "Change password"}
                    </Button>
                  </div>
                </form>
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
                  imagePreview ? (
                    <img
                      src={imagePreview}
                      alt={`${profile.companyName} store`}
                      className="size-full object-cover"
                    />
                  ) : (
                    <Image
                      src={imageUrl}
                      alt={`${profile.companyName} store`}
                      width={64}
                      height={64}
                      className="size-full object-cover"
                    />
                  )
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
