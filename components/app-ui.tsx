import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight, CircleAlert, LockKeyhole } from "lucide-react";
import { cn } from "@/lib/utils";

export function PageFrame({ eyebrow, title, description, children, action }: { eyebrow?: string; title?: string; description?: string; children?: ReactNode; action?: ReactNode }) {
  return <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">{(title || eyebrow || description || action) && <div className="mb-7 flex flex-wrap items-end justify-between gap-4 border-b border-border/80 pb-5 sm:mb-8 sm:pb-6"><div className="min-w-0">{eyebrow && <p className="mb-2 text-xs font-semibold uppercase tracking-[.16em] text-muted-foreground">{eyebrow}</p>}{title && <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h1>}{description && <p className="mt-2.5 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">{description}</p>}</div>{action}</div>}{children}</main>;
}

export function Surface({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <section className={cn("surface-raised rounded-xl p-4 sm:p-5", className)}>{children}</section>;
}

export function Notice({ title, children, kind = "info" }: { title: string; children: ReactNode; kind?: "info" | "error" }) {
  return <div role={kind === "error" ? "alert" : "status"} className={`rounded-md border p-4 ${kind === "error" ? "border-destructive/25 bg-destructive/[0.045]" : "border-border/80 bg-muted/60"}`}><div className="flex gap-3"><CircleAlert aria-hidden="true" className={`mt-0.5 shrink-0 ${kind === "error" ? "text-destructive" : "text-primary"}`} size={18} /><div><h2 className="text-sm font-semibold">{title}</h2><div className="mt-1 text-sm leading-6 text-muted-foreground">{children}</div></div></div></div>;
}

export function BlockedNotice({ title, detail }: { title: string; detail: string }) {
  return <Notice title={title}><span className="inline-flex items-center gap-1.5"><LockKeyhole size={14} aria-hidden="true" />{detail}</span></Notice>;
}

export function EmptyState({ title, detail, href, linkLabel }: { title: string; detail: string; href?: string; linkLabel?: string }) {
  return <div className="py-12 text-center"><p className="font-medium">{title}</p><p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">{detail}</p>{href && linkLabel && <Link href={href} className="mt-4 inline-flex min-h-11 items-center gap-2 text-sm font-medium underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">{linkLabel}<ArrowRight size={15} aria-hidden="true" /></Link>}</div>;
}

export const inputClass = "control-inset min-h-11 w-full rounded-lg border border-input/70 px-3 text-sm outline-none transition-[box-shadow,border-color] placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/35 disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground";
export const buttonClass = "inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground shadow-soft transition-[transform,box-shadow,background-color] hover:-translate-y-px hover:bg-primary/95 hover:shadow-raised active:translate-y-0 active:shadow-inset focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-55";
