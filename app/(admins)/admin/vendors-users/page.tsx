import { ViewingAllUser } from "@/Otherfiles/vendor-int";

export default function VendorsPage() {
  return (
    <main className="admin-dashboard-surface mx-auto min-h-screen w-full max-w-400 space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      <header className="space-y-1 border-b border-amber-100/10 pb-5">
        <h1 className="text-2xl font-semibold tracking-tight">
          Vendors & Users
        </h1>
        <p className="text-sm text-muted-foreground">
          Manage seller applications and marketplace accounts.
        </p>
      </header>

      <ViewingAllUser />
      <p className="text-xs text-muted-foreground">
        Directory records and approval actions are currently sample data;
        connect the vendor and user APIs to persist changes.
      </p>
    </main>
  );
}
