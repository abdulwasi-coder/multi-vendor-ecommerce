"use client";

import { useMemo, useState } from "react";
import {
  BadgeCheck,
  Check,
  ChevronLeft,
  ChevronRight,
  Eye,
  Pencil,
  Search,
  Store,
  UserRound,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverDescription, PopoverHeader, PopoverTitle, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";

const initialVendors = [
  { id: "VEN-1048", name: "Northstar Goods", contact: "Avery Johnson", email: "avery@northstar.co", category: "Home & Living", joined: "Oct 02, 2026", status: "Active" },
  { id: "VEN-1047", name: "Juniper & Co.", contact: "Morgan Chen", email: "morgan@juniper.co", category: "Accessories", joined: "Oct 01, 2026", status: "Pending" },
  { id: "VEN-1046", name: "Fieldwork Supply", contact: "Riley Brooks", email: "riley@fieldwork.co", category: "Outdoors", joined: "Sep 28, 2026", status: "Active" },
  { id: "VEN-1045", name: "Cedar House", contact: "Taylor Kim", email: "hello@cedarhouse.co", category: "Home & Living", joined: "Sep 25, 2026", status: "Pending" },
  { id: "VEN-1044", name: "Sunday Market", contact: "Jordan Lee", email: "jordan@sundaymarket.co", category: "Food & Pantry", joined: "Sep 22, 2026", status: "Suspended" },
  { id: "VEN-1043", name: "Studio Wren", contact: "Casey Rivera", email: "casey@studiowren.co", category: "Art & Design", joined: "Sep 18, 2026", status: "Active" },
];

const users = [
  { id: "USR-2084", name: "Olivia Rhye", email: "olivia@example.com", role: "Customer", joined: "Oct 06, 2026", status: "Active" },
  { id: "USR-2083", name: "Phoenix Baker", email: "phoenix@example.com", role: "Customer", joined: "Oct 05, 2026", status: "Active" },
  { id: "USR-2082", name: "Lana Steiner", email: "lana@example.com", role: "Vendor", joined: "Oct 02, 2026", status: "Active" },
  { id: "USR-2081", name: "Demi Wilkinson", email: "demi@example.com", role: "Customer", joined: "Sep 30, 2026", status: "Inactive" },
  { id: "USR-2080", name: "Candice Wu", email: "candice@example.com", role: "Customer", joined: "Sep 29, 2026", status: "Active" },
  { id: "USR-2079", name: "Natali Craig", email: "natali@example.com", role: "Vendor", joined: "Sep 27, 2026", status: "Active" },
];

const statusStyles = {
  Active: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300",
  Pending: "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300",
  Suspended: "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300",
  Inactive: "border-muted-foreground/20 bg-muted text-muted-foreground",
};

function StatusBadge({ status }) {
  return <Badge variant="outline" className={statusStyles[status] ?? ""}>{status}</Badge>;
}

function PersonCell({ name, email, type = "user" }) {
  return (
    <div className="group flex min-w-48 items-center gap-3">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground transition-all duration-200 group-hover:bg-primary/10 group-hover:text-primary group-hover:ring-4 group-hover:ring-primary/5">
        {type === "vendor" ? <Store className="size-4 transition-transform duration-200 group-hover:scale-110" /> : <UserRound className="size-4 transition-transform duration-200 group-hover:scale-110" />}
      </span>
      <span className="grid gap-0.5">
        <span className="font-medium text-foreground">{name}</span>
        <span className="text-xs text-muted-foreground">{email}</span>
      </span>
    </div>
  );
}

function StatusPicker({ record, kind, onConfirm }) {
  const [open, setOpen] = useState(false);
  const [nextStatus, setNextStatus] = useState(record.status);
  const choices = kind === "vendor" ? ["Active", "Pending", "Suspended"] : ["Active", "Inactive"];

  return <Popover open={open} onOpenChange={(isOpen) => { setOpen(isOpen); if (isOpen) setNextStatus(record.status); }}>
    <PopoverTrigger render={<Button size="icon-sm" variant="ghost" className="transition-colors hover:bg-violet-500/10 hover:text-violet-700 dark:hover:text-violet-300" aria-label={`Change ${record.name} status`} title="Change status" />}><Pencil className="size-4" /></PopoverTrigger>
    <PopoverContent align="end" className="w-64">
      <PopoverHeader><PopoverTitle>Change status</PopoverTitle><PopoverDescription>{record.name}</PopoverDescription></PopoverHeader>
      <div className="grid gap-1">
        {choices.map((choice) => <Button key={choice} type="button" size="sm" variant={nextStatus === choice ? "secondary" : "ghost"} className="justify-start" onClick={() => setNextStatus(choice)}><span className={`mr-2 size-2 rounded-full ${choice === "Active" ? "bg-emerald-500" : choice === "Pending" ? "bg-amber-500" : "bg-rose-500"}`} />{choice}{nextStatus === choice && <Check className="ml-auto size-4" />}</Button>)}
      </div>
      <div className="flex justify-end gap-2 border-t pt-2"><Button type="button" size="sm" variant="outline" onClick={() => setOpen(false)}>Cancel</Button><Button type="button" size="sm" disabled={nextStatus === record.status} onClick={() => { onConfirm(record.id, nextStatus); setOpen(false); }}>Confirm status</Button></div>
    </PopoverContent>
  </Popover>;
}

function EmptyState({ title }) {
  return <TableRow><TableCell colSpan={5} className="h-28 text-center text-muted-foreground">No {title.toLowerCase()} found. Try changing your search or filters.</TableCell></TableRow>;
}

export default function VendorsPage() {
  const [vendorRows, setVendorRows] = useState(initialVendors);
  const [userRows, setUserRows] = useState(users);
  const [tab, setTab] = useState("vendors");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState(null);
  const [viewing, setViewing] = useState(null);
  const [draft, setDraft] = useState(null);
  const [confirming, setConfirming] = useState(false);
  const pageSize = 5;

  const sourceRows = tab === "vendors" ? vendorRows : userRows;
  const filteredRows = useMemo(() => sourceRows.filter((row) => {
    const searchable = `${row.name} ${row.email} ${row.id} ${row.contact ?? ""} ${row.category ?? ""} ${row.role ?? ""}`.toLowerCase();
    return searchable.includes(query.toLowerCase()) && (status === "all" || row.status === status);
  }), [sourceRows, query, status]);
  const pageCount = Math.max(1, Math.ceil(filteredRows.length / pageSize));
  const visibleRows = filteredRows.slice((page - 1) * pageSize, page * pageSize);

  function changeTab(value) {
    setTab(value);
    setQuery("");
    setStatus("all");
    setPage(1);
  }

  function updateVendorStatus(id, nextStatus) {
    setVendorRows((current) => current.map((vendor) => vendor.id === id ? { ...vendor, status: nextStatus } : vendor));
  }

  function updateUserStatus(id, nextStatus) {
    setUserRows((current) => current.map((user) => user.id === id ? { ...user, status: nextStatus } : user));
  }

  function openEditor(kind, record) {
    setViewing(null);
    setEditing({ kind, id: record.id });
    setDraft({ ...record });
    setConfirming(false);
  }

  function openProfile(kind, record) {
    setEditing(null);
    setDraft(null);
    setConfirming(false);
    setViewing({ kind, record });
  }

  function closeEditor(open) {
    if (open) return;
    setEditing(null);
    setViewing(null);
    setDraft(null);
    setConfirming(false);
  }

  function confirmSave() {
    if (!editing || !draft) return;
    if (editing.kind === "vendor") {
      setVendorRows((current) => current.map((vendor) => vendor.id === editing.id ? { ...vendor, ...draft } : vendor));
    } else {
      setUserRows((current) => current.map((user) => user.id === editing.id ? { ...user, ...draft } : user));
    }
    closeEditor(false);
  }

  const activeVendorCount = vendorRows.filter((vendor) => vendor.status === "Active").length;
  const pendingVendorCount = vendorRows.filter((vendor) => vendor.status === "Pending").length;

  return (
    <main className="mx-auto min-h-screen w-full max-w-[1600px] space-y-6 bg-muted/30 px-4 py-6 sm:px-6 lg:px-8">
      <header className="space-y-1 border-b pb-5">
        <p className="text-sm text-muted-foreground">Marketplace directory</p>
        <h1 className="text-2xl font-semibold tracking-tight">Vendors &amp; Users</h1>
        <p className="text-sm text-muted-foreground">Manage seller applications and marketplace accounts.</p>
      </header>

      <section aria-label="Directory summary" className="grid gap-4 sm:grid-cols-3">
        <Card className="group h-full min-h-[184px] gap-4 rounded-2xl border-border/70 py-5 shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:border-sky-300 hover:bg-sky-50/70 hover:shadow-lg hover:shadow-sky-500/10 dark:hover:border-sky-800 dark:hover:bg-sky-950/25"><CardHeader className="min-h-[52px] flex-row items-center justify-between gap-2 space-y-0"><CardTitle className="min-h-11 flex-1 content-center text-base font-semibold leading-snug tracking-tight text-muted-foreground">Total vendors</CardTitle><span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-sky-500/10 text-sky-700 shadow-sm transition-transform duration-300 group-hover:scale-110 dark:text-sky-300"><Store className="size-6" /></span></CardHeader><CardContent className="flex flex-1 flex-col justify-between gap-2"><p className="flex min-h-10 items-center text-3xl font-bold leading-none tracking-tight tabular-nums">{vendorRows.length}</p><p className="flex min-h-10 items-center text-sm text-muted-foreground">Registered sellers</p></CardContent></Card>
        <Card className="group h-full min-h-[184px] gap-4 rounded-2xl border-border/70 py-5 shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:border-emerald-300 hover:bg-emerald-50/70 hover:shadow-lg hover:shadow-emerald-500/10 dark:hover:border-emerald-800 dark:hover:bg-emerald-950/25"><CardHeader className="min-h-[52px] flex-row items-center justify-between gap-2 space-y-0"><CardTitle className="min-h-11 flex-1 content-center text-base font-semibold leading-snug tracking-tight text-muted-foreground">Active vendors</CardTitle><span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-700 shadow-sm transition-transform duration-300 group-hover:scale-110 dark:text-emerald-300"><BadgeCheck className="size-6" /></span></CardHeader><CardContent className="flex flex-1 flex-col justify-between gap-2"><p className="flex min-h-10 items-center text-3xl font-bold leading-none tracking-tight tabular-nums">{activeVendorCount}</p><p className="flex min-h-10 items-center text-sm text-muted-foreground">Approved and selling</p></CardContent></Card>
        <Card className="group h-full min-h-[184px] gap-4 rounded-2xl border-border/70 py-5 shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:border-amber-300 hover:bg-amber-50/70 hover:shadow-lg hover:shadow-amber-500/10 dark:hover:border-amber-800 dark:hover:bg-amber-950/25"><CardHeader className="min-h-[52px] flex-row items-center justify-between gap-2 space-y-0"><CardTitle className="min-h-11 flex-1 content-center text-base font-semibold leading-snug tracking-tight text-muted-foreground">Pending review</CardTitle><span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-700 shadow-sm transition-transform duration-300 group-hover:scale-110 dark:text-amber-300"><Users className="size-6" /></span></CardHeader><CardContent className="flex flex-1 flex-col justify-between gap-2"><p className="flex min-h-10 items-center text-3xl font-bold leading-none tracking-tight tabular-nums">{pendingVendorCount}</p><p className="flex min-h-10 items-center text-sm text-muted-foreground">Applications to review</p></CardContent></Card>
      </section>

      <Card className="overflow-hidden rounded-2xl shadow-sm transition-shadow duration-200 hover:shadow-md">
        <CardHeader className="gap-4 border-b pb-4">
          <div><CardTitle>Directory</CardTitle><CardDescription className="mt-1">Browse and manage every seller and user account.</CardDescription></div>
          <Tabs value={tab} onValueChange={changeTab} className="gap-4">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <TabsList>
                <TabsTrigger value="vendors" className="gap-2 transition-all duration-200 hover:bg-background/70 hover:text-foreground data-active:shadow-sm"><Store className="size-4" />Vendors <span className="text-xs text-muted-foreground">{vendorRows.length}</span></TabsTrigger>
                <TabsTrigger value="users" className="gap-2 transition-all duration-200 hover:bg-background/70 hover:text-foreground data-active:shadow-sm"><Users className="size-4" />Users <span className="text-xs text-muted-foreground">{userRows.length}</span></TabsTrigger>
              </TabsList>
              <div className="flex flex-col gap-2 sm:flex-row">
                <div className="relative w-full sm:w-64"><Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground transition-colors peer-focus:text-primary" /><Input value={query} onChange={(event) => { setQuery(event.target.value); setPage(1); }} placeholder={tab === "vendors" ? "Search vendors…" : "Search users…"} className="peer h-9 pl-9 transition-shadow hover:border-ring/60 focus-visible:shadow-sm" aria-label="Search directory" /></div>
                <Select value={status} onValueChange={(value) => { setStatus(value ?? "all"); setPage(1); }}>
                  <SelectTrigger className="h-9 w-full sm:w-40" aria-label="Filter by status"><SelectValue placeholder="All statuses" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All statuses</SelectItem>
                    <SelectItem value="Active">Active</SelectItem>
                    {tab === "vendors" ? <SelectItem value="Pending">Pending</SelectItem> : <SelectItem value="Inactive">Inactive</SelectItem>}
                    {tab === "vendors" && <SelectItem value="Suspended">Suspended</SelectItem>}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <TabsContent value="vendors" className="-mx-6 -mb-4">
              <div className="space-y-3 px-4 pb-4 xl:hidden">
                {visibleRows.length === 0 ? <p className="py-8 text-center text-sm text-muted-foreground">No vendors found. Try changing your search or filters.</p> : visibleRows.map((vendor) => <article key={vendor.id} className="rounded-xl border bg-card p-4 shadow-sm transition-colors hover:border-sky-300/70 hover:bg-sky-50/30 dark:hover:border-sky-900 dark:hover:bg-sky-950/15">
                  <div className="flex items-start justify-between gap-3"><div className="min-w-0"><p className="truncate font-semibold">{vendor.name}</p><p className="mt-0.5 truncate text-sm text-muted-foreground">{vendor.email}</p></div><div className="flex shrink-0 items-center gap-0.5"><Button size="icon-sm" variant="ghost" aria-label={`View ${vendor.name} profile`} onClick={() => openProfile("vendor", vendor)}><Eye className="size-4" /></Button><StatusPicker record={vendor} kind="vendor" onConfirm={updateVendorStatus} /></div></div>
                  <div className="mt-3 flex flex-wrap items-center gap-2"><Badge variant="secondary">{vendor.category}</Badge><StatusBadge status={vendor.status} /></div>
                  <div className="mt-3 flex items-center justify-between gap-3 border-t pt-3 text-xs text-muted-foreground"><span className="truncate">Contact: {vendor.contact}</span><span className="shrink-0">{vendor.joined}</span></div>
                </article>)}
              </div>
              <div className="hidden overflow-x-auto xl:block">
                <Table>
                  <TableHeader><TableRow className="bg-muted/40 hover:bg-muted/40"><TableHead className="pl-6">Vendor</TableHead><TableHead>Category</TableHead><TableHead>Joined</TableHead><TableHead>Status</TableHead><TableHead className="w-24 min-w-24 text-center">Actions</TableHead></TableRow></TableHeader>
                  <TableBody>
                    {visibleRows.length === 0 ? <EmptyState title="Vendors" /> : visibleRows.map((vendor) => <TableRow key={vendor.id} className="transition-colors duration-150 hover:bg-muted/60">
                      <TableCell className="pl-6"><PersonCell type="vendor" name={vendor.name} email={vendor.email} /></TableCell>
                      <TableCell className="text-muted-foreground">{vendor.category}</TableCell>
                      <TableCell className="whitespace-nowrap text-muted-foreground">{vendor.joined}</TableCell>
                      <TableCell><StatusBadge status={vendor.status} /></TableCell>
                      <TableCell className="w-24 min-w-24 text-center">
                        <div className="inline-flex items-center justify-center gap-1">
                          <Button size="icon-sm" variant="ghost" className="transition-colors hover:bg-sky-500/10 hover:text-sky-700 dark:hover:text-sky-300" aria-label={`View ${vendor.name} profile`} title="View profile" onClick={() => openProfile("vendor", vendor)}><Eye className="size-4" /></Button>
                          <StatusPicker record={vendor} kind="vendor" onConfirm={updateVendorStatus} />
                        </div>
                      </TableCell>
                    </TableRow>)}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="users" className="-mx-6 -mb-4">
              <div className="space-y-3 px-4 pb-4 xl:hidden">
                {visibleRows.length === 0 ? <p className="py-8 text-center text-sm text-muted-foreground">No users found. Try changing your search or filters.</p> : visibleRows.map((user) => <article key={user.id} className="rounded-xl border bg-card p-4 shadow-sm transition-colors hover:border-violet-300/70 hover:bg-violet-50/30 dark:hover:border-violet-900 dark:hover:bg-violet-950/15">
                  <div className="flex items-start justify-between gap-3"><div className="min-w-0"><p className="truncate font-semibold">{user.name}</p><p className="mt-0.5 truncate text-sm text-muted-foreground">{user.email}</p></div><div className="flex shrink-0 items-center gap-0.5"><Button size="icon-sm" variant="ghost" aria-label={`View ${user.name} profile`} onClick={() => openProfile("user", user)}><Eye className="size-4" /></Button><StatusPicker record={user} kind="user" onConfirm={updateUserStatus} /></div></div>
                  <div className="mt-3 flex flex-wrap items-center gap-2"><Badge variant="secondary">{user.role}</Badge><StatusBadge status={user.status} /></div>
                  <p className="mt-3 border-t pt-3 text-xs text-muted-foreground">Joined {user.joined}</p>
                </article>)}
              </div>
              <div className="hidden overflow-x-auto xl:block">
                <Table>
                  <TableHeader><TableRow className="bg-muted/40 hover:bg-muted/40"><TableHead className="pl-6">User</TableHead><TableHead>Role</TableHead><TableHead>Joined</TableHead><TableHead>Status</TableHead><TableHead className="w-24 min-w-24 text-center">Actions</TableHead></TableRow></TableHeader>
                  <TableBody>
                    {visibleRows.length === 0 ? <EmptyState title="Users" /> : visibleRows.map((user) => <TableRow key={user.id} className="transition-colors duration-150 hover:bg-muted/60">
                      <TableCell className="pl-6"><PersonCell name={user.name} email={user.email} /></TableCell>
                      <TableCell><Badge variant="secondary">{user.role}</Badge></TableCell>
                      <TableCell className="whitespace-nowrap text-muted-foreground">{user.joined}</TableCell>
                      <TableCell><StatusBadge status={user.status} /></TableCell>
                      <TableCell className="w-24 min-w-24 text-center"><div className="inline-flex items-center justify-center gap-1"><Button size="icon-sm" variant="ghost" className="transition-colors hover:bg-sky-500/10 hover:text-sky-700 dark:hover:text-sky-300" aria-label={`View ${user.name} profile`} title="View profile" onClick={() => openProfile("user", user)}><Eye className="size-4" /></Button><StatusPicker record={user} kind="user" onConfirm={updateUserStatus} /></div></TableCell>
                    </TableRow>)}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardHeader>
        <CardContent className="flex flex-col justify-between gap-3 pt-4 sm:flex-row sm:items-center">
          <p className="text-sm text-muted-foreground">Showing <span className="font-medium text-foreground">{filteredRows.length === 0 ? 0 : (page - 1) * pageSize + 1}–{Math.min(page * pageSize, filteredRows.length)}</span> of <span className="font-medium text-foreground">{filteredRows.length}</span> {tab}</p>
          <div className="flex items-center justify-between gap-3 sm:justify-end">
            <span className="text-xs text-muted-foreground">Page {page} of {pageCount}</span>
            <div className="flex gap-1"><Button variant="outline" size="icon" className="size-8" aria-label="Previous page" disabled={page <= 1} onClick={() => setPage((current) => Math.max(1, current - 1))}><ChevronLeft className="size-4" /></Button><Button variant="outline" size="icon" className="size-8" aria-label="Next page" disabled={page >= pageCount} onClick={() => setPage((current) => Math.min(pageCount, current + 1))}><ChevronRight className="size-4" /></Button></div>
          </div>
        </CardContent>
      </Card>
      <Sheet open={Boolean(editing || viewing)} onOpenChange={closeEditor}>
        <SheetContent side="right" className="w-full gap-0 overflow-y-auto p-0 sm:max-w-lg">
          <SheetHeader className="border-b px-6 py-5">
            <SheetTitle>{viewing ? "Profile details" : confirming ? "Confirm changes" : `Edit ${editing?.kind === "vendor" ? "vendor" : "user"}`}</SheetTitle>
            <SheetDescription>
              {viewing ? "Account details and current marketplace status." : confirming ? "Review these updates before saving them to the directory." : "Update the account details, then review and confirm before saving."}
            </SheetDescription>
          </SheetHeader>
          {viewing && <div className="space-y-5 px-6 py-6">
            <div className="flex items-center gap-4 rounded-xl border bg-muted/30 p-4">
              <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">{viewing.kind === "vendor" ? <Store className="size-6" /> : <UserRound className="size-6" />}</span>
              <div className="min-w-0"><h3 className="truncate font-semibold">{viewing.record.name}</h3><p className="truncate text-sm text-muted-foreground">{viewing.record.email}</p><p className="mt-1 font-mono text-xs text-muted-foreground">{viewing.record.id}</p></div>
            </div>
            <dl className="divide-y rounded-xl border px-4">
              {(viewing.kind === "vendor" ? [["Contact person", viewing.record.contact], ["Category", viewing.record.category], ["Joined", viewing.record.joined], ["Status", viewing.record.status]] : [["Role", viewing.record.role], ["Joined", viewing.record.joined], ["Status", viewing.record.status]]).map(([label, value]) => <div key={label} className="flex items-center justify-between gap-4 py-3 text-sm"><dt className="text-muted-foreground">{label}</dt><dd className="text-right font-medium">{label === "Status" ? <StatusBadge status={value} /> : value}</dd></div>)}
            </dl>
          </div>}
          {draft && editing && (confirming ? (
            <div className="space-y-4 px-6 py-6">
              <div className="rounded-xl border bg-muted/30 p-4">
                <p className="text-sm font-semibold">{draft.name}</p>
                <p className="mt-1 text-sm text-muted-foreground">{draft.email}</p>
                <dl className="mt-4 grid grid-cols-[100px_1fr] gap-x-3 gap-y-2 text-sm">
                  <dt className="text-muted-foreground">{editing.kind === "vendor" ? "Contact" : "Role"}</dt>
                  <dd className="font-medium">{editing.kind === "vendor" ? draft.contact : draft.role}</dd>
                  <dt className="text-muted-foreground">{editing.kind === "vendor" ? "Category" : "Status"}</dt>
                  <dd className="font-medium">{editing.kind === "vendor" ? draft.category : draft.status}</dd>
                  {editing.kind === "vendor" && <><dt className="text-muted-foreground">Status</dt><dd className="font-medium">{draft.status}</dd></>}
                </dl>
              </div>
              <p className="text-sm text-muted-foreground">Save these changes for <span className="font-medium text-foreground">{draft.id}</span>?</p>
            </div>
          ) : (
            <form id="directory-edit-form" className="space-y-5 px-6 py-6" onSubmit={(event) => { event.preventDefault(); setConfirming(true); }}>
              <div className="space-y-2"><label htmlFor="edit-name" className="text-sm font-medium">{editing.kind === "vendor" ? "Store name" : "Full name"}</label><Input id="edit-name" required value={draft.name} onChange={(event) => setDraft((current) => ({ ...current, name: event.target.value }))} /></div>
              <div className="space-y-2"><label htmlFor="edit-email" className="text-sm font-medium">Email address</label><Input id="edit-email" type="email" required value={draft.email} onChange={(event) => setDraft((current) => ({ ...current, email: event.target.value }))} /></div>
              {editing.kind === "vendor" ? <>
                <div className="space-y-2"><label htmlFor="edit-contact" className="text-sm font-medium">Contact person</label><Input id="edit-contact" required value={draft.contact} onChange={(event) => setDraft((current) => ({ ...current, contact: event.target.value }))} /></div>
                <div className="space-y-2"><label className="text-sm font-medium">Category</label><Select value={draft.category} onValueChange={(value) => value && setDraft((current) => ({ ...current, category: value }))}><SelectTrigger className="w-full"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Home & Living">Home &amp; Living</SelectItem><SelectItem value="Accessories">Accessories</SelectItem><SelectItem value="Outdoors">Outdoors</SelectItem><SelectItem value="Food & Pantry">Food &amp; Pantry</SelectItem><SelectItem value="Art & Design">Art &amp; Design</SelectItem></SelectContent></Select></div>
              </> : <>
                <div className="space-y-2"><label className="text-sm font-medium">Account role</label><Select value={draft.role} onValueChange={(value) => value && setDraft((current) => ({ ...current, role: value }))}><SelectTrigger className="w-full"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Customer">Customer</SelectItem><SelectItem value="Vendor">Vendor</SelectItem><SelectItem value="Admin">Admin</SelectItem></SelectContent></Select></div>
              </>}
            </form>
          ))}
          <SheetFooter className="mt-auto border-t bg-background px-6 py-4 sm:flex-row sm:justify-end">
            {viewing ? <>
              <Button type="button" variant="outline" onClick={() => closeEditor(false)}>Close</Button>
              <Button type="button" onClick={() => openEditor(viewing.kind, viewing.record)}><Pencil className="mr-2 size-4" />Edit profile</Button>
            </> : confirming ? <>
              <Button type="button" variant="outline" onClick={() => setConfirming(false)}>Back to editing</Button>
              <Button type="button" onClick={confirmSave}><Check className="mr-2 size-4" />Confirm and save</Button>
            </> : <>
              <Button type="button" variant="outline" onClick={() => closeEditor(false)}>Cancel</Button>
              <Button type="submit" form="directory-edit-form">Review changes</Button>
            </>}
          </SheetFooter>
        </SheetContent>
      </Sheet>
      <p className="text-xs text-muted-foreground">Directory records and approval actions are currently sample data; connect the vendor and user APIs to persist changes.</p>
    </main>
  );
}
