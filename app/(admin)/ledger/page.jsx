"use client";

import { useMemo, useState } from "react";
import { ArrowDownToLine, BookOpen, CircleDollarSign, Search, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const accounts = [
  { id: "LED-2084", vendor: "Northstar Goods", orders: 42, gross: 12840, commission: 1540.8, balance: 11299.2, status: "Payable" },
  { id: "LED-2083", vendor: "Juniper & Co.", orders: 28, gross: 8940, commission: 1072.8, balance: 7867.2, status: "Payable" },
  { id: "LED-2082", vendor: "Fieldwork Supply", orders: 35, gross: 10620, commission: 1274.4, balance: 9345.6, status: "Processing" },
  { id: "LED-2081", vendor: "Cedar House", orders: 19, gross: 5870, commission: 704.4, balance: 5165.6, status: "Payable" },
  { id: "LED-2080", vendor: "Studio Wren", orders: 24, gross: 7220, commission: 866.4, balance: 6353.6, status: "Processing" },
];

const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

export default function AdminLedgerPage() {
  const [query, setQuery] = useState("");
  const visibleAccounts = useMemo(() => accounts.filter((account) => `${account.vendor} ${account.id}`.toLowerCase().includes(query.toLowerCase())), [query]);
  const gross = accounts.reduce((sum, account) => sum + account.gross, 0);
  const commission = accounts.reduce((sum, account) => sum + account.commission, 0);
  const balance = accounts.reduce((sum, account) => sum + account.balance, 0);
  const cards = [
    { title: "Gross volume", value: money.format(gross), caption: "Across vendor accounts", icon: CircleDollarSign, tone: "bg-sky-500/10 text-sky-700 dark:text-sky-300", hover: "hover:border-sky-300 hover:bg-sky-50/70 hover:shadow-sky-500/10 dark:hover:border-sky-800 dark:hover:bg-sky-950/25" },
    { title: "Platform commission", value: money.format(commission), caption: "Marketplace earnings", icon: TrendingUp, tone: "bg-violet-500/10 text-violet-700 dark:text-violet-300", hover: "hover:border-violet-300 hover:bg-violet-50/70 hover:shadow-violet-500/10 dark:hover:border-violet-800 dark:hover:bg-violet-950/25" },
    { title: "Vendor balances", value: money.format(balance), caption: "Pending and payable", icon: BookOpen, tone: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300", hover: "hover:border-emerald-300 hover:bg-emerald-50/70 hover:shadow-emerald-500/10 dark:hover:border-emerald-800 dark:hover:bg-emerald-950/25" },
  ];

  return <main className="mx-auto min-h-screen w-full max-w-[1600px] space-y-6 bg-muted/30 px-4 py-6 sm:px-6 lg:px-8">
    <header className="flex flex-col gap-3 border-b pb-5 sm:flex-row sm:items-end sm:justify-between"><div className="space-y-1"><p className="text-sm text-primary">Marketplace finance</p><h1 className="text-2xl font-semibold tracking-tight">Ledger accounts</h1><p className="text-sm text-muted-foreground">Track vendor earnings, platform commission, and payable balances.</p></div><Button variant="outline" className="w-fit" onClick={() => window.print()}><ArrowDownToLine className="mr-2 size-4" />Export / print</Button></header>
    <section aria-label="Ledger summary" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {cards.map(({ title, value, caption, icon: Icon, tone, hover }) => <Card key={title} className={`group h-full min-h-[184px] gap-4 rounded-2xl border-border/70 py-5 shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg ${hover}`}><CardHeader className="min-h-[52px] flex-row items-center justify-between gap-2 space-y-0"><CardTitle className="min-h-11 flex-1 content-center text-base font-semibold leading-snug tracking-tight text-muted-foreground">{title}</CardTitle><span className={`flex size-12 shrink-0 items-center justify-center rounded-xl ${tone} shadow-sm transition-transform duration-300 group-hover:scale-110`}><Icon className="size-6" /></span></CardHeader><CardContent className="flex flex-1 flex-col justify-between gap-2"><p className="flex min-h-10 items-center text-3xl font-bold leading-none tracking-tight tabular-nums">{value}</p><p className="flex min-h-10 items-center text-sm text-muted-foreground">{caption}</p></CardContent></Card>)}
    </section>
    <Card className="overflow-hidden rounded-2xl shadow-sm"><CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><CardTitle>Vendor balances</CardTitle><p className="mt-1 text-sm text-muted-foreground">Earnings and current balance by seller.</p></div><div className="relative w-full sm:w-72"><Search className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" /><Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search vendor accounts" className="pl-9" aria-label="Search ledger" /></div></CardHeader><CardContent className="px-0 sm:px-6"><div className="space-y-3 px-4 pb-4 xl:hidden">{visibleAccounts.map((account) => <article key={account.id} className="rounded-xl border bg-card p-4 shadow-sm transition-colors hover:border-emerald-300/70 hover:bg-emerald-50/30 dark:hover:border-emerald-900 dark:hover:bg-emerald-950/15"><div className="flex items-start justify-between gap-3"><div className="min-w-0"><h3 className="truncate font-semibold">{account.vendor}</h3><p className="font-mono text-xs text-muted-foreground">{account.id}</p></div><Badge variant="outline" className={account.status === "Payable" ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300" : "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300"}>{account.status}</Badge></div><div className="mt-3 grid grid-cols-2 gap-3 border-t pt-3 text-sm"><div><p className="text-xs text-muted-foreground">Orders</p><p className="font-medium">{account.orders}</p></div><div><p className="text-xs text-muted-foreground">Gross sales</p><p className="font-medium tabular-nums">{money.format(account.gross)}</p></div><div><p className="text-xs text-muted-foreground">Platform fee</p><p className="text-muted-foreground tabular-nums">{money.format(account.commission)}</p></div><div><p className="text-xs text-muted-foreground">Vendor balance</p><p className="font-semibold tabular-nums">{money.format(account.balance)}</p></div></div></article>)}{visibleAccounts.length === 0 && <p className="py-8 text-center text-sm text-muted-foreground">No vendor accounts match your search.</p>}</div><div className="hidden overflow-x-auto xl:block"><Table className="min-w-[820px]"><TableHeader><TableRow className="bg-muted/40 hover:bg-muted/40"><TableHead className="pl-6">Vendor</TableHead><TableHead>Orders</TableHead><TableHead>Gross sales</TableHead><TableHead>Platform fee</TableHead><TableHead>Vendor balance</TableHead><TableHead className="pr-6">Account</TableHead></TableRow></TableHeader><TableBody>
      {visibleAccounts.map((account) => <TableRow key={account.id} className="transition-colors hover:bg-muted/60"><TableCell className="pl-6"><span className="block font-medium">{account.vendor}</span><span className="font-mono text-xs text-muted-foreground">{account.id}</span></TableCell><TableCell className="tabular-nums">{account.orders}</TableCell><TableCell className="tabular-nums">{money.format(account.gross)}</TableCell><TableCell className="text-muted-foreground tabular-nums">{money.format(account.commission)}</TableCell><TableCell className="font-semibold tabular-nums">{money.format(account.balance)}</TableCell><TableCell className="pr-6"><Badge variant="outline" className={account.status === "Payable" ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300" : "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300"}>{account.status}</Badge></TableCell></TableRow>)}
      {visibleAccounts.length === 0 && <TableRow><TableCell colSpan={6} className="h-24 text-center text-muted-foreground">No vendor accounts match your search.</TableCell></TableRow>}
    </TableBody></Table></div></CardContent></Card>
    <p className="text-xs text-muted-foreground">Ledger balances are sample data until connected to the finance API.</p>
  </main>;
}
