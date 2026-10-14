"use client";

import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import {
  ArrowRight,
  Check,
  ChevronsUpDown,
  ImagePlus,
  LockKeyhole,
  MapPin,
  ShieldCheck,
  Store,
  Upload,
  UserRound,
} from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ALLOWED_COUNTRIES,
  VendorBodySchema,
  VendorSignupInput,
} from "@/Otherfiles/ZOD";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "../popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../command";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../select";

export function VendorSignupForm() {
  const [imagePreview, setImagePreview] = useState("");
  const [imageName, setImageName] = useState("");
  const [storeslug, setStoreSlug] = useState("");
  const [description, setDescription] = useState("");
  const [countryOpen, setCountryOpen] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(VendorBodySchema),
    defaultValues: {
      name: "",
      storeSlug: "",
      storeDescription: "",
      companyName: "",
      lastName: "",
      phoneCode: "+44",
      mobilenumber: "",
      image: undefined,
      country: "",
    },
  });
  const watchCountry = watch("country");

  useEffect(() => {
    if (watchCountry) {
      const matched = ALLOWED_COUNTRIES.find((c) => c.value === watchCountry);
      if (matched) {
        setValue("phoneCode", matched.phoneCode);
      }
    }
  }, [watchCountry, setValue]);

  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    setValue("image", file, { shouldValidate: true });
    if (file) {
      setImageName(file.name);
      setImagePreview((current) => {
        if (current) URL.revokeObjectURL(current);
        return file ? URL.createObjectURL(file) : "";
      });
    } else {
      setImageName("");
      if (imagePreview) URL.revokeObjectURL(imagePreview);
      setImagePreview("");
    }
  }

  async function onSubmit(data: VendorSignupInput) {
    try {
      const multipartPayload = new FormData();
      multipartPayload.append("name", data.name);
      multipartPayload.append("storeSlug", data.storeSlug);
      multipartPayload.append("storeDescription", data.storeDescription);
      multipartPayload.append("companyName", data.companyName);
      multipartPayload.append("lastName", data.lastName);
      multipartPayload.append("country", data.country);
      multipartPayload.append(
        "mobilenumber",
        `${data.phoneCode}${data.mobilenumber}`,
      );
      multipartPayload.append("iamge", data.image);

      toast.success("Your vendor profile details are ready", {
        description: `data is successfully saved.`,
      });
    } catch (error) {
      toast.error("Form transmission crash detected");
    }
  }

  const inputClassName =
    "h-11 rounded-xl border-border/80 bg-background px-3.5 shadow-none transition focus-visible:ring-2 focus-visible:ring-primary/20";

  function cn(arg0: string, arg1: string): string | undefined {
    return [arg0, arg1].filter(Boolean).join(" ") || undefined;
  }

  return (
    <main className="min-h-[calc(100dvh-2rem)] bg-[#fbf8f3]">
      <div className="w-full px-3 pb-6 pt-44 sm:px-5 sm:pb-8 sm:pt-32 lg:px-7 lg:pt-32">
        <div className="w-full">
          <header className="mb-8">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3 sm:gap-4">
              <div className="flex items-center gap-3">
                <div className="flex size-11 items-center justify-center rounded-2xl bg-amber-700 text-white shadow-sm shadow-amber-900/15">
                  <Store className="size-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold tracking-tight">
                    Marketplace
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Vendor onboarding
                  </p>
                </div>
              </div>
              <Badge
                variant="outline"
                className="gap-1.5 rounded-full bg-background px-3 py-1 text-muted-foreground"
              >
                <LockKeyhole className="size-3" /> Secure signup
              </Badge>
            </div>

            <div>
              <p className="mb-2 text-sm font-medium text-amber-800">
                A great store starts here
              </p>
              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                Set up your vendor profile
              </h1>
              <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
                Add your details and store information. You can update your
                profile anytime.
              </p>
            </div>
          </header>

          <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
            <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
              <div className="space-y-5">
                <Card className="rounded-2xl border-border/70 shadow-sm">
                  <CardHeader className="border-b border-border/60 px-5 py-5 sm:px-6">
                    <div className="flex items-start gap-3">
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-800">
                        <UserRound className="size-4" />
                      </div>
                      <div>
                        <CardTitle className="text-base">
                          Personal information
                        </CardTitle>
                        <CardDescription className="mt-1">
                          Your contact details for account and store updates.
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="grid gap-x-5 gap-y-4 px-5 py-5 sm:grid-cols-2 sm:px-6">
                    <Field>
                      <FieldLabel htmlFor="first-name">
                        First name <span className="text-destructive">*</span>
                      </FieldLabel>
                      <Controller
                        control={control}
                        name="name"
                        render={({ field }) => (
                          <Input
                            className={inputClassName}
                            placeholder="e.g. Alex"
                            {...field}
                          />
                        )}
                      ></Controller>
                      <FieldError>{errors.name?.message}</FieldError>
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="last-name">
                        Last name <span className="text-destructive">*</span>
                      </FieldLabel>
                      <Controller
                        control={control}
                        name="lastName"
                        render={({ field }) => (
                          <Input
                            className={inputClassName}
                            placeholder="e.g. Morgan"
                            {...field}
                          />
                        )}
                      ></Controller>
                      <FieldError>{errors.lastName?.message}</FieldError>
                    </Field>
                    <Field>
                      <FieldLabel>Country</FieldLabel>
                      <Controller
                        control={control}
                        name="country"
                        render={({ field }) => (
                          <Popover
                            open={countryOpen}
                            onOpenChange={setCountryOpen}
                          >
                            <PopoverTrigger
                              render={
                                <Button
                                  variant="outline"
                                  className="w-full h-11 rounded-xl justify-between font-normal"
                                >
                                  {field.value
                                    ? ALLOWED_COUNTRIES.find(
                                        (c) => c.value === field.value,
                                      )?.label
                                    : "Select your country..."}
                                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                              }
                            />
                            <PopoverContent
                              className="w-[300px] p-0 max-h-[250px]"
                              align="start"
                            >
                              <Command>
                                <CommandInput placeholder="Search country..." />
                                <CommandList>
                                  <CommandEmpty>No country found.</CommandEmpty>
                                  <CommandGroup>
                                    {ALLOWED_COUNTRIES.map((item) => (
                                      <CommandItem
                                        key={item.value}
                                        value={item.label} // Enables searching by name text string
                                        onSelect={() => {
                                          setValue("country", item.value, {
                                            shouldValidate: true,
                                          }); // Saves 2-letter ISO code
                                          setCountryOpen(false);
                                        }}
                                      >
                                        <Check
                                          className={cn(
                                            "mr-2 h-4 w-4",
                                            field.value === item.value
                                              ? "opacity-100"
                                              : "opacity-0",
                                          )}
                                        />
                                        {item.label}
                                      </CommandItem>
                                    ))}
                                  </CommandGroup>
                                </CommandList>
                              </Command>
                            </PopoverContent>
                          </Popover>
                        )}
                      />
                      <FieldError>{errors.country?.message}</FieldError>
                    </Field>
                    <Field>
                      <FieldLabel>Mobile Number</FieldLabel>
                      <div className="flex items-center gap-1">
                        <div className="w-fit">
                          <Controller
                            control={control}
                            name="phoneCode"
                            render={({ field }) => (
                              <Select
                                onValueChange={field.onChange}
                                value={field.value}
                              >
                                <SelectTrigger className="py-5.25 ">
                                  <SelectValue placeholder="+44" />
                                </SelectTrigger>
                                <SelectContent>
                                  {ALLOWED_COUNTRIES.map((c) => (
                                    <SelectItem
                                      key={c.value}
                                      value={c.phoneCode}
                                    >
                                      <span className="font-mono text-xs">
                                        {c.phoneCode}
                                      </span>
                                      <span className="text-muted-foreground text-xs ml-1">
                                        ({c.value})
                                      </span>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            )}
                          />
                        </div>
                        <div className="flex-1">
                          <Controller
                            control={control}
                            name="mobilenumber"
                            render={({ field }) => (
                              <Input
                                type="tel"
                                inputMode="numeric"
                                className="h-11 border-border/80 bg-background px-3.5 shadow-none transition focus-visible:ring-2 focus-visible:ring-primary/20"
                                placeholder="712345678"
                                {...field}
                              />
                            )}
                          />
                        </div>
                      </div>

                      <FieldError>
                        {errors.mobilenumber?.message ||
                          errors.phoneCode?.message}
                      </FieldError>
                    </Field>
                  </CardContent>
                </Card>

                <Card className="rounded-2xl border-border/70 shadow-sm">
                  <CardHeader className="border-b border-border/60 px-5 py-5 sm:px-6">
                    <div className="flex items-start gap-3">
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-800">
                        <Store className="size-4" />
                      </div>
                      <div>
                        <CardTitle className="text-base">Your store</CardTitle>
                        <CardDescription className="mt-1">
                          Give customers a first impression they'll remember.
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-5 px-5 py-5 sm:px-6">
                    <Field>
                      <FieldLabel htmlFor="store-slug">
                        Store URL <span className="text-destructive">*</span>
                      </FieldLabel>
                      <div className="flex h-11 items-center overflow-hidden rounded-xl border border-border/80 bg-background focus-within:ring-2 focus-within:ring-amber-700/20">
                        <span className="flex h-full items-center border-r bg-muted/50 px-3 text-sm text-muted-foreground">
                          store/
                        </span>
                        <Controller
                          control={control}
                          name="storeSlug"
                          render={({ field }) => (
                            <Input
                              className={inputClassName}
                              placeholder="your-store-name"
                              value={field.value ?? storeslug}
                              onChange={(event) => {
                                const nextValue = event.target.value;
                                setStoreSlug(nextValue);
                                field.onChange(nextValue);
                              }}
                            />
                          )}
                        />
                      </div>
                      <FieldError>{errors.storeSlug?.message}</FieldError>
                      <FieldDescription>
                        Your unique store address. Lowercase letters, numbers,
                        and hyphens only.
                      </FieldDescription>
                    </Field>

                    <Field>
                      <FieldLabel htmlFor="first-name">
                        Company Name <span className="text-destructive">*</span>
                      </FieldLabel>
                      <Controller
                        control={control}
                        name="companyName"
                        render={({ field }) => (
                          <Input
                            className={inputClassName}
                            placeholder="Alex Tech Selling Company"
                            {...field}
                          />
                        )}
                      ></Controller>
                      <FieldError>{errors.companyName?.message}</FieldError>
                    </Field>

                    <Field>
                      <FieldLabel htmlFor="store-description">
                        Store description{" "}
                        <span className="text-destructive">*</span>
                      </FieldLabel>
                      <Controller
                        control={control}
                        name="storeDescription"
                        render={({ field }) => (
                          <Textarea
                            className={inputClassName}
                            placeholder="your-store-name"
                            maxLength={5000}
                            value={String(field.value ?? "")}
                            name={field.name}
                            onBlur={field.onBlur}
                            ref={field.ref}
                            onChange={(event) => {
                              const nextValue = event.target.value;
                              field.onChange(nextValue);
                              setDescription(nextValue);
                            }}
                          />
                        )}
                      ></Controller>
                      <FieldError>
                        {errors.storeDescription?.message}
                      </FieldError>
                      <FieldDescription className="text-right">
                        {description.length}/5000 characters
                      </FieldDescription>
                    </Field>

                    <Field>
                      <Controller
                        control={control}
                        name="image"
                        render={({ field }) => (
                          <div className="relative border-2 border-dashed border-zinc-200 rounded-xl p-4 text-center cursor-pointer bg-zinc-50/50">
                            <input
                              type="file"
                              accept="image/*"
                              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                              onChange={handleImageChange}
                            />
                            <div className="flex flex-col items-center justify-center space-y-2">
                              {imagePreview ? (
                                <div className="size-20 rounded-lg overflow-hidden border bg-white">
                                  <img
                                    src={imagePreview}
                                    alt="Logo preview"
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              ) : (
                                <ImagePlus className="size-8 text-zinc-400" />
                              )}
                              <p className="text-xs font-medium text-zinc-600 truncate max-w-full px-2">
                                {imageName
                                  ? imageName
                                  : "Choose or drag store logo"}
                              </p>
                            </div>
                          </div>
                        )}
                      />
                      <FieldError>{errors.image?.message}</FieldError>
                    </Field>
                  </CardContent>
                </Card>

                <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-xs text-muted-foreground">
                    <span className="text-destructive">*</span> Required fields
                  </p>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    size="lg"
                    className="h-11 rounded-xl bg-amber-700 px-6 text-white shadow-sm shadow-amber-900/15 hover:bg-amber-800"
                  >
                    {isSubmitting ? (
                      <>
                        Create vendor profile <ArrowRight className="size-4" />
                      </>
                    ) : (
                      <>
                        <span>Complete Setup</span> <ArrowRight />{" "}
                      </>
                    )}
                  </Button>
                </div>
              </div>

              <aside className="grid gap-4 sm:grid-cols-2 lg:sticky lg:top-6 lg:grid-cols-1 lg:self-start">
                <Card className="overflow-hidden rounded-2xl border-border/70 shadow-sm">
                  <div className="h-20 bg-gradient-to-br from-amber-300 via-orange-100 to-[#f8eee0]" />
                  <CardContent className="relative px-5 pb-5">
                    <div className="-mt-9 flex size-16 items-center justify-center overflow-hidden rounded-2xl border-4 border-card bg-background text-muted-foreground shadow-sm">
                      {imagePreview ? (
                        <img
                          src={imagePreview}
                          alt=""
                          className="size-full object-cover"
                        />
                      ) : (
                        <ImagePlus className="size-6 text-amber-700" />
                      )}
                    </div>
                    <p className="mt-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Store preview
                    </p>
                    <h2 className="mt-1 truncate text-lg font-semibold">
                      {storeslug || "Your store name"}
                    </h2>
                    <p className="mt-1 line-clamp-3 min-h-12 text-sm leading-5 text-muted-foreground">
                      {description ||
                        "Your store description will appear here so customers know what you offer."}
                    </p>
                    <div className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground">
                      <MapPin className="size-3.5" />
                      Store profile
                    </div>
                  </CardContent>
                </Card>

                <Card className="rounded-2xl border-amber-200/80 bg-amber-50/70 shadow-none">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-2 font-medium">
                      <ShieldCheck className="size-4 text-amber-800" />
                      Your information is protected
                    </div>
                    <p className="mt-2 text-sm leading-5 text-muted-foreground">
                      Your details are used to set up and manage your vendor
                      account.
                    </p>
                    <div className="mt-4 flex items-center gap-2 border-t border-amber-200 pt-3 text-xs text-muted-foreground">
                      <Check className="size-3.5 text-amber-800" />
                      Account ID <span className="truncate font-mono"></span>
                    </div>
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
