"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  PackagePlus,
  Truck,
  UserRound,
} from "lucide-react";
import { LogoutButton } from "@/components/ui/logout-button";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  useSidebar,
} from "@/components/ui/sidebar";
import Image from "next/image";
import { useVendorProfile } from "@/Otherfiles/tanstack/vendor-profile";

const workspaceItems = [
  { title: "Dashboard", href: "/vendor/dashboard", icon: LayoutDashboard, color: "blue" },
  { title: "Orders", href: "/vendor/orders", icon: ShoppingCart, color: "violet" },
];
const catalogItems = [
  { title: "Products", href: "/vendor/products", icon: Package, color: "emerald" },
  { title: "Create Product", href: "/vendor/create", icon: PackagePlus, color: "amber" },
];
const operationsItems = [
  { title: "Logistics", href: "/vendor/logitics", icon: Truck, color: "blue" },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { setOpenMobile, state } = useSidebar();
  const [hoverExpanded, setHoverExpanded] = useState(false);
  const profileQuery = useVendorProfile();
  const profile = profileQuery.data;
  const storeImage = profile?.Companyimage?.publicId;

  const handleMouseEnter = () => {
    if (state === "collapsed") {
      setHoverExpanded(true);
    }
  };

  const handleMouseLeave = () => {
    setHoverExpanded(false);
  };

  const handleNavigation = () => {
    setOpenMobile(false);
    setHoverExpanded(false);
  };

  return (
    <Sidebar
      collapsible="icon"
      hoverExpanded={hoverExpanded}
      className="vendor-sidebar-surface text-slate-100"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >

      <SidebarHeader className="border-b border-white/10! px-3 py-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="flex items-center gap-2 rounded-xl transition-colors duration-150 hover:bg-white/[0.07] hover:text-white"
              size="lg"
              isActive={pathname.startsWith("/vendor/profile")}
              render={<Link href="/vendor/profile" onClick={handleNavigation} />}
            >
              <div className="flex size-9 items-center justify-center overflow-hidden rounded-lg bg-white/10">
                {storeImage ? (
                  <Image
                    src={storeImage}
                    height={55}
                    width={50}
                    alt={`${profile?.companyName ?? "Vendor"} store`}
                    className="h-full w-full rounded-lg object-cover"
                  />
                ) : (
                  <UserRound className="size-5 text-slate-300" aria-hidden="true" />
                )}
              </div>
              <div className="grid min-w-0 flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden group-data-[hover-expanded=true]:grid">
                <span className="truncate font-semibold">
                  {profile ? `${profile.name} ${profile.lastName}`.trim() : profileQuery.isPending ? "Loading profile..." : "Vendor profile"}
                </span>
                <span className="truncate text-xs text-slate-400">{profile?.companyName ?? "Account settings"}</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

     
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-slate-400 text-[10px] font-semibold tracking-[0.14em] uppercase">
            Workspace
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {workspaceItems.map((item) => {
                const isActive = item.href === pathname || pathname.startsWith(`${item.href}/`);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      className="vendor-sidebar-link flex items-center gap-2 rounded-lg transition-colors duration-150 hover:bg-white/[0.07] hover:text-white data-[active=true]:bg-blue-500/15 data-[active=true]:text-blue-200 data-[active=true]:shadow-[inset_2px_0_0_#60a5fa]"
                      data-item-color={item.color}
                      isActive={isActive}
                      render={
                        <Link
                          onClick={handleNavigation}
                          href={item.href}
                        />
                      }
                    >
                      <item.icon />
                      <div className="group-data-[collapsible=icon]:hidden group-data-[hover-expanded=true]:block">
                        <span>{item.title}</span>
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel className="text-slate-400 text-[10px] font-semibold tracking-[0.14em] uppercase">
            Catalog
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {catalogItems.map((item) => {
                const isActive = item.href === pathname || pathname.startsWith(`${item.href}/`);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      className="vendor-sidebar-link flex items-center gap-2 rounded-lg transition-colors duration-150 hover:bg-white/[0.07] hover:text-white data-[active=true]:bg-blue-500/15 data-[active=true]:text-blue-200 data-[active=true]:shadow-[inset_2px_0_0_#60a5fa]"
                      data-item-color={item.color}
                      isActive={isActive}
                      render={
                        <Link
                          onClick={handleNavigation}
                          href={item.href}
                        />
                      }
                    >
                      <item.icon />
                      <div className="group-data-[collapsible=icon]:hidden group-data-[hover-expanded=true]:block">
                        <span>{item.title}</span>
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel className="text-slate-400 text-[10px] font-semibold tracking-[0.14em] uppercase">
            Operations
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {operationsItems.map((item) => {
                const isActive = item.href === pathname || pathname.startsWith(`${item.href}/`);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      className="vendor-sidebar-link flex items-center gap-2 rounded-lg transition-colors duration-150 hover:bg-white/[0.07] hover:text-white data-[active=true]:bg-blue-500/15 data-[active=true]:text-blue-200 data-[active=true]:shadow-[inset_2px_0_0_#60a5fa]"
                      data-item-color={item.color}
                      isActive={isActive}
                      render={<Link onClick={handleNavigation} href={item.href} />}
                    >
                      <item.icon />
                      <span className="group-data-[collapsible=icon]:hidden group-data-[hover-expanded=true]:block">{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <LogoutButton variant="sidebar" className="rounded-lg text-slate-300 transition-colors hover:bg-red-500/10 hover:text-red-300" />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
