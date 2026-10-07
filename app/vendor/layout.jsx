import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { VendorSidebar } from "@/components/ui/vendor-sidebar";

export default function VendorLayout({ children }) {
  return (
    <SidebarProvider>
      <VendorSidebar />
      <main className="min-w-0 flex-1">
        <div className="border-b bg-background px-4 py-2 sm:px-6">
          <SidebarTrigger aria-label="Toggle vendor navigation" />
        </div>
        {children}
      </main>
    </SidebarProvider>
  );
}
