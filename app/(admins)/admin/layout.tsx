import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/ui/appSideBar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="admin-workspace min-w-0 flex-1">
        <div className="sticky top-0 z-20 flex h-14 items-center border-b border-amber-200/10 bg-[#17140e]/95 px-4 backdrop-blur-sm">
          <SidebarTrigger
            aria-label="Toggle admin navigation"
            className="size-9 rounded-lg border border-amber-200/15 bg-[#292317] text-amber-100/80 shadow-sm transition-colors hover:border-amber-200/30 hover:bg-[#3a301e] hover:text-amber-100 [&_svg]:size-4"
          />
        </div>
        {children}
      </main>
    </SidebarProvider>
  );
}
