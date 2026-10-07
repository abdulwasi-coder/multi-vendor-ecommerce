"use client";

import { useMemo, useState } from "react";
import {
  BadgeCheck,
  Check,
  ChevronLeft,
  ChevronRight,
  Search,
  Store,
  UserRound,
  Users,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

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

function EmptyState({ title }) {
  return <TableRow><TableCell colSpan={6} className="h-28 text-center text-muted-foreground">No {title.toLowerCase()} found. Try changing your search or filters.</TableCell></TableRow>;
}

export default function VendorsPage() {
  const [vendorRows, setVendorRows] = useState(initialVendors);
  const [userRows, setUserRows] = useState(users);
  const [tab, setTab] = useState("vendors");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
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

  function toggleUserStatus(id) {
    setUserRows((current) => current.map((user) => user.id === id ? { ...user, status: user.status === "Active" ? "Inactive" : "Active" } : user));
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
        <Card className="group rounded-2xl shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-md"><CardHeader className="flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Total vendors</CardTitle><Store className="size-4 text-muted-foreground transition-colors group-hover:text-primary" /></CardHeader><CardContent><p className="text-2xl font-bold tabular-nums">{vendorRows.length}</p><p className="mt-1 text-xs text-muted-foreground">Registered sellers</p></CardContent></Card>
        <Card className="group rounded-2xl shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md dark:hover:border-emerald-900"><CardHeader className="flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Active vendors</CardTitle><BadgeCheck className="size-4 text-emerald-600 transition-transform duration-200 group-hover:scale-110" /></CardHeader><CardContent><p className="text-2xl font-bold tabular-nums">{activeVendorCount}</p><p className="mt-1 text-xs text-muted-foreground">Approved and selling</p></CardContent></Card>
        <Card className="group rounded-2xl shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-amber-300 hover:shadow-md dark:hover:border-amber-900"><CardHeader className="flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Pending review</CardTitle><Users className="size-4 text-amber-600 transition-transform duration-200 group-hover:scale-110" /></CardHeader><CardContent><p className="text-2xl font-bold tabular-nums">{pendingVendorCount}</p><p className="mt-1 text-xs text-muted-foreground">Applications to review</p></CardContent></Card>
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
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader><TableRow className="bg-muted/40 hover:bg-muted/40"><TableHead className="pl-6">Vendor</TableHead><TableHead>Category</TableHead><TableHead>Joined</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Action</TableHead></TableRow></TableHeader>
                  <TableBody>
                    {visibleRows.length === 0 ? <EmptyState title="Vendors" /> : visibleRows.map((vendor) => <TableRow key={vendor.id} className="transition-colors duration-150 hover:bg-muted/60">
                      <TableCell className="pl-6"><PersonCell type="vendor" name={vendor.name} email={vendor.email} /></TableCell>
                      <TableCell className="text-muted-foreground">{vendor.category}</TableCell>
                      <TableCell className="whitespace-nowrap text-muted-foreground">{vendor.joined}</TableCell>
                      <TableCell><StatusBadge status={vendor.status} /></TableCell>
                      <TableCell className="pr-6 text-right">
                        {vendor.status === "Pending" ? <div className="inline-flex gap-1"><Button size="sm" className="h-7 transition-all hover:-translate-y-px hover:shadow-sm" onClick={() => updateVendorStatus(vendor.id, "Active")}><Check className="mr-1 size-3.5" />Approve</Button><Button size="sm" variant="outline" className="h-7 transition-all hover:-translate-y-px hover:border-rose-300 hover:bg-rose-50 hover:text-rose-700 dark:hover:border-rose-900 dark:hover:bg-rose-950/40 dark:hover:text-rose-300" onClick={() => updateVendorStatus(vendor.id, "Suspended")}><X className="mr-1 size-3.5" />Decline</Button></div> : <Button size="sm" variant="outline" className="h-7 transition-all hover:-translate-y-px hover:border-primary/40 hover:shadow-sm" onClick={() => updateVendorStatus(vendor.id, vendor.status === "Active" ? "Suspended" : "Active")}>{vendor.status === "Active" ? "Suspend" : "Reactivate"}</Button>}
                      </TableCell>
                    </TableRow>)}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="users" className="-mx-6 -mb-4">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader><TableRow className="bg-muted/40 hover:bg-muted/40"><TableHead className="pl-6">User</TableHead><TableHead>Role</TableHead><TableHead>Joined</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Account</TableHead></TableRow></TableHeader>
                  <TableBody>
                    {visibleRows.length === 0 ? <EmptyState title="Users" /> : visibleRows.map((user) => <TableRow key={user.id} className="transition-colors duration-150 hover:bg-muted/60">
                      <TableCell className="pl-6"><PersonCell name={user.name} email={user.email} /></TableCell>
                      <TableCell><Badge variant="secondary">{user.role}</Badge></TableCell>
                      <TableCell className="whitespace-nowrap text-muted-foreground">{user.joined}</TableCell>
                      <TableCell><StatusBadge status={user.status} /></TableCell>
                      <TableCell className="pr-6 text-right"><Button size="sm" variant="outline" className="h-7 transition-all hover:-translate-y-px hover:border-primary/40 hover:shadow-sm" onClick={() => toggleUserStatus(user.id)}>{user.status === "Active" ? "Deactivate" : "Reactivate"}</Button></TableCell>
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
      <p className="text-xs text-muted-foreground">Directory records and approval actions are currently sample data; connect the vendor and user APIs to persist changes.</p>
    </main>
  );
}
