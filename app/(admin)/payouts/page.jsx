"use client";

import { useState } from "react";
import { ArrowDownToLine, Banknote, Check, Clock3, Wallet } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const initialPayouts = [
  { id: "PAY-8031", vendor: "Juniper & Co.", email: "morgan@juniper.co", amount: 1240.5, method: "Bank transfer", requested: "Oct 07, 2026", status: "Pending" },
  { id: "PAY-8030", vendor: "Northstar Goods", email: "avery@northstar.co", amount: 2864, method: "Bank transfer", requested: "Oct 06, 2026", status: "Pending" },
  { id: "PAY-8029", vendor: "Fieldwork Supply", email: "riley@fieldwork.co", amount: 748.25, method: "PayPal", requested: "Oct 04, 2026", status: "Paid" },
  { id: "PAY-8028", vendor: "Studio Wren", email: "casey@studiowren.co", amount: 1930, method: "Bank transfer", requested: "Oct 02, 2026", status: "Paid" },
  { id: "PAY-8027", vendor: "Cedar House", email: "hello@cedarhouse.co", amount: 520, method: "PayPal", requested: "Sep 30, 2026", status: "On hold" },
];

const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
const payoutTone = {
  Pending: "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300",
  Paid: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300",
  "On hold": "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300",
};

export default function AdminPayoutsPage() {
  const [payouts, setPayouts] = useState(initialPayouts);
  const pending = payouts.filter((payout) => payout.status === "Pending");
  const pendingTotal = pending.reduce((sum, payout) => sum + payout.amount, 0);
  const settledTotal = payouts.filter((payout) => payout.status === "Paid").reduce((sum, payout) => sum + payout.amount, 0);
  const updateStatus = (id, status) => setPayouts((current) => current.map((payout) => payout.id === id ? { ...payout, status } : payout));
  const cards = [
    { label: "Pending payouts", value: money.format(pendingTotal), caption: `${pending.length} requests awaiting review`, icon: Clock3, tone: "bg-amber-500/10 text-amber-700 dark:text-amber-300", hover: "hover:border-amber-300 hover:bg-amber-50/70 hover:shadow-amber-500/10 dark:hover:border-amber-800 dark:hover:bg-amber-950/25" },
    { label: "Paid this period", value: money.format(settledTotal), caption: "Successfully settled", icon: Check, tone: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300", hover: "hover:border-emerald-300 hover:bg-emerald-50/70 hover:shadow-emerald-500/10 dark:hover:border-emerald-800 dark:hover:bg-emerald-950/25" },
    { label: "Payout requests", value: payouts.length.toLocaleString(), caption: "Across all vendors", icon: Wallet, tone: "bg-sky-500/10 text-sky-700 dark:text-sky-300", hover: "hover:border-sky-300 hover:bg-sky-50/70 hover:shadow-sky-500/10 dark:hover:border-sky-800 dark:hover:bg-sky-950/25" },
  ];

  return <main className="mx-auto min-h-screen w-full max-w-[1600px] space-y-6 bg-muted/30 px-4 py-6 sm:px-6 lg:px-8">
    <header className="flex flex-col gap-3 border-b pb-5 sm:flex-row sm:items-end sm:justify-between"><div className="space-y-1"><p className="text-sm text-primary">Marketplace finance</p><h1 className="text-2xl font-semibold tracking-tight">Payouts</h1><p className="text-sm text-muted-foreground">Review vendor payout requests and settlement status.</p></div><Button variant="outline" className="w-fit" onClick={() => window.print()}><ArrowDownToLine className="mr-2 size-4" />Export / print</Button></header>
    <section aria-label="Payout summary" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {cards.map(({ label, value, caption, icon: Icon, tone, hover }) => <Card key={label} className={`group h-full min-h-[184px] gap-4 rounded-2xl border-border/70 py-5 shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg ${hover}`}><CardHeader className="min-h-[52px] flex-row items-center justify-between gap-2 space-y-0"><CardTitle className="min-h-11 flex-1 content-center text-base font-semibold leading-snug tracking-tight text-muted-foreground">{label}</CardTitle><span className={`flex size-12 shrink-0 items-center justify-center rounded-xl ${tone} shadow-sm transition-transform duration-300 group-hover:scale-110`}><Icon className="size-6" /></span></CardHeader><CardContent className="flex flex-1 flex-col justify-between gap-2"><p className="flex min-h-10 items-center text-3xl font-bold leading-none tracking-tight tabular-nums">{value}</p><p className="flex min-h-10 items-center text-sm text-muted-foreground">{caption}</p></CardContent></Card>)}
    </section>
    <Card className="overflow-hidden rounded-2xl shadow-sm"><CardHeader><CardTitle>Vendor requests</CardTitle><p className="text-sm text-muted-foreground">Approve completed transfers or hold a request for review.</p></CardHeader><CardContent className="px-0 sm:px-6"><div className="space-y-3 px-4 pb-4 xl:hidden">{payouts.map((payout) => <article key={payout.id} className="rounded-xl border bg-card p-4 shadow-sm transition-colors hover:border-amber-300/70 hover:bg-amber-50/30 dark:hover:border-amber-900 dark:hover:bg-amber-950/15"><div className="flex items-start justify-between gap-3"><div className="min-w-0"><h3 className="truncate font-semibold">{payout.vendor}</h3><p className="mt-0.5 truncate text-xs text-muted-foreground">{payout.email}</p></div><Badge variant="outline" className={payoutTone[payout.status]}>{payout.status}</Badge></div><div className="mt-3 grid grid-cols-2 gap-2 border-t pt-3 text-sm"><div><p className="text-xs text-muted-foreground">Amount</p><p className="font-semibold tabular-nums">{money.format(payout.amount)}</p></div><div><p className="text-xs text-muted-foreground">Requested</p><p>{payout.requested}</p></div><div><p className="text-xs text-muted-foreground">Method</p><p>{payout.method}</p></div><p className="self-end text-right font-mono text-xs text-muted-foreground">{payout.id}</p></div>{payout.status === "Pending" && <div className="mt-3 flex gap-2 border-t pt-3"><Button size="sm" className="flex-1" onClick={() => updateStatus(payout.id, "Paid")}><Check className="mr-1 size-3.5" />Mark paid</Button><Button size="sm" variant="outline" className="flex-1" onClick={() => updateStatus(payout.id, "On hold")}>Hold</Button></div>}{payout.status === "On hold" && <Button size="sm" variant="outline" className="mt-3 w-full" onClick={() => updateStatus(payout.id, "Pending")}>Reopen request</Button>}</article>)}</div><div className="hidden overflow-x-auto xl:block"><Table className="min-w-[760px]"><TableHeader><TableRow className="bg-muted/40 hover:bg-muted/40"><TableHead className="pl-6">Vendor</TableHead><TableHead>Request</TableHead><TableHead>Requested</TableHead><TableHead>Method</TableHead><TableHead>Status</TableHead><TableHead className="w-40 min-w-40 text-center">Action</TableHead></TableRow></TableHeader><TableBody>
      {payouts.map((payout) => <TableRow key={payout.id} className="transition-colors hover:bg-muted/60"><TableCell className="pl-6"><span className="block font-medium">{payout.vendor}</span><span className="text-xs text-muted-foreground">{payout.email}</span></TableCell><TableCell><span className="block font-mono text-xs text-muted-foreground">{payout.id}</span><span className="font-semibold tabular-nums">{money.format(payout.amount)}</span></TableCell><TableCell className="whitespace-nowrap text-muted-foreground">{payout.requested}</TableCell><TableCell>{payout.method}</TableCell><TableCell><Badge variant="outline" className={payoutTone[payout.status]}>{payout.status}</Badge></TableCell><TableCell className="w-40 min-w-40 text-center">{payout.status === "Pending" ? <div className="inline-flex gap-1"><Button size="sm" className="h-7" onClick={() => updateStatus(payout.id, "Paid")}><Check className="mr-1 size-3.5" />Mark paid</Button><Button size="sm" variant="outline" className="h-7 hover:border-rose-300 hover:bg-rose-50 hover:text-rose-700" onClick={() => updateStatus(payout.id, "On hold")}>Hold</Button></div> : payout.status === "On hold" ? <Button size="sm" variant="outline" className="h-7" onClick={() => updateStatus(payout.id, "Pending")}>Reopen</Button> : <span className="text-xs text-muted-foreground">Settled</span>}</TableCell></TableRow>)}
    </TableBody></Table></div></CardContent></Card>
    <p className="text-xs text-muted-foreground">Payout records and review actions are sample data until connected to the finance API.</p>
  </main>;
}
