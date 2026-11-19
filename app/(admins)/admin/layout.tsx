import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/ui/appSideBar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="admin-workspace min-w-0 flex-1">
        <div className="sticky top-0 z-20 flex h-14 items-center border-b border-amber-100/15 bg-[#2a2317]/85 px-4 shadow-sm shadow-black/10 backdrop-blur-xl">
          <SidebarTrigger
            aria-label="Toggle admin navigation"
            className="size-9 rounded-lg border border-amber-100/20 bg-amber-100/[0.07] text-amber-50 shadow-sm transition-colors hover:border-amber-100/35 hover:bg-amber-100/[0.13] hover:text-white [&_svg]:size-4"
          />
        </div>
        {children}
      </main>
    </SidebarProvider>
  );
}
