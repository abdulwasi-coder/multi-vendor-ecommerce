import { ViewingAllUser } from "@/Otherfiles/vendor-int";

export default function VendorsPage() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-400 space-y-6 bg-muted/30 px-4 py-6 sm:px-6 lg:px-8">
      <header className="space-y-1 border-b pb-5">
        <p className="text-sm text-muted-foreground">Marketplace directory</p>
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
