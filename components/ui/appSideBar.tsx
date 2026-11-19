"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  Users,
  ShoppingCart,
  Package,
  Component,
  House,
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

const navigationItems = [
  { title: "Home", href: "/", icon: House, color: "cream" },
  { title: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard, color: "gold" },
  { title: "Orders", href: "/admin/orders-ledger", icon: ShoppingCart, color: "amber" },
  { title: "Products", href: "/admin/products", icon: Package, color: "cream" },
  { title: "Vendors & Users", href: "/admin/vendors-users", icon: Users, color: "bronze" },
];

const creationItems = [
  { title: "Category", href: "/admin/category", icon: Component, color: "gold" },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { setOpenMobile, state } = useSidebar();
  const [hoverExpanded, setHoverExpanded] = useState(false);

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
      className="admin-sidebar-surface text-amber-50"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* 1. TOP: COMPANY IMAGE */}
      <SidebarHeader className="border-b border-amber-100/10! px-3 py-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="flex items-center gap-2 rounded-xl transition-colors hover:bg-amber-300/[0.08] hover:text-amber-50"
              size="lg"
              render={
                <Link href="/admin/dashboard" onClick={handleNavigation} />
              }
            >
              <div className="flex size-8 items-center justify-center rounded-lg">
                <Image
                  src="/logo3.jpg"
                  height={55}
                  width={50}
                  alt="Company Logo"
                  className="w-full rounded-md h-full"
                  priority
                />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden group-data-[hover-expanded=true]:grid">
                <span className="truncate  font-semibold tracking-wider">
                  Marketly Admin
                  
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <div className="mt-2 flex items-center gap-2 rounded-xl border border-amber-100/10 bg-amber-200/[0.04] px-2 py-2">
              <div className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-amber-200/20 bg-amber-300/10">
                <Image
                  src="/person.jpg"
                  height={64}
                  width={64}
                  alt=""
                  className="size-full object-cover"
                />
              </div>
              <div className="min-w-0 group-data-[collapsible=icon]:hidden group-data-[hover-expanded=true]:block">
                <span className="block truncate text-sm font-semibold text-amber-50">John Smith</span>
                <span className="block truncate text-xs text-amber-100/55">Administrator</span>
              </div>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-amber-100/50 text-[10px] font-semibold tracking-[0.14em] uppercase">
            Workspace
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => {
                const isActive =
                  item.href === pathname ||
                  pathname.startsWith(`${item.href}/`);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      className="admin-sidebar-link flex items-center gap-2 rounded-lg transition-colors hover:bg-amber-300/[0.08] hover:text-amber-50 data-[active=true]:bg-amber-400/15 data-[active=true]:text-amber-100 data-[active=true]:shadow-[inset_2px_0_0_#e8b94f]"
                      data-item-color={item.color}
                      isActive={isActive}
                      render={
                        <Link onClick={handleNavigation} href={item.href} />
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
          <SidebarGroupLabel className="text-amber-100/50 text-[10px] font-semibold tracking-[0.14em] uppercase">
            Catalog
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {creationItems.map((item) => {
                const isActive =
                  item.href === pathname ||
                  pathname.startsWith(`${item.href}/`);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      className="admin-sidebar-link flex items-center gap-2 rounded-lg transition-colors hover:bg-amber-300/[0.08] hover:text-amber-50 data-[active=true]:bg-amber-400/15 data-[active=true]:text-amber-100 data-[active=true]:shadow-[inset_2px_0_0_#e8b94f]"
                      data-item-color={item.color}
                      isActive={isActive}
                      render={
                        <Link onClick={handleNavigation} href={item.href} />
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
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <LogoutButton variant="sidebar" className="rounded-lg text-amber-100/70 transition-colors hover:bg-rose-400/10 hover:text-rose-200" />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
