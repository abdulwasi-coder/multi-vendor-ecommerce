"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { vendorApi } from "@/services/platform";
import { buttonClass, inputClass } from "@/components/app-ui";

const fields = [
  ["name", "First name", "text"], ["lastName", "Last name", "text"], ["companyName", "Business name", "text"], ["country", "Country", "text"], ["mobilenumber", "Mobile number", "tel"], ["storeSlug", "Store slug", "text"],
] as const;

export function VendorApplication() {
  const [pending, setPending] = useState(false); const [error, setError] = useState(""); const [preview, setPreview] = useState(""); const router = useRouter();
  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview); }, [preview]);
  async function submit(form: FormData) { setError(""); const file = form.get("companyimage"); if (!(file instanceof File) || file.size === 0) { setError("Choose a store image to continue."); return; } if (file.size > 5 * 1024 * 1024) { setError("Choose an image smaller than 5 MB."); return; } const data = new FormData(); for (const key of ["name", "companyName", "lastName", "country", "mobilenumber", "storeDescription", "storeSlug"]) data.append(key, String(form.get(key) ?? "").trim()); data.append("companyimage", file); setPending(true); try { await vendorApi.register(data); toast.success("Vendor application submitted for review."); router.push("/vendor/application-status"); } catch (cause) { setError(cause instanceof Error ? cause.message : "The application could not be submitted."); } finally { setPending(false); } }
  return <form action={submit} className="grid gap-5 sm:grid-cols-2">{fields.map(([name, label, type]) => <label key={name} className="space-y-1.5 text-sm font-medium">{label}<input name={name} type={type} required className={inputClass} /></label>)}<label className="space-y-1.5 text-sm font-medium sm:col-span-2">Store description<textarea name="storeDescription" rows={4} required maxLength={1000} className={`${inputClass} h-auto py-3`} /></label><label className="space-y-1.5 text-sm font-medium sm:col-span-2">Store image (max 5 MB)<input name="companyimage" type="file" accept="image/*" required onChange={(event) => setPreview(event.target.files?.[0] ? URL.createObjectURL(event.target.files[0]) : "")} className="block min-h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm file:mr-3 file:rounded-sm file:border-0 file:bg-muted file:px-3 file:py-1.5" />{preview && <Image src={preview} alt="Store image preview" width={128} height={128} unoptimized className="mt-2 h-32 w-32 rounded-md object-cover" />}</label>{error && <p role="alert" className="text-sm text-destructive sm:col-span-2">{error}</p>}<div className="sm:col-span-2"><button disabled={pending} className={buttonClass}>{pending ? "Submitting…" : "Submit application"}</button></div></form>;
}
