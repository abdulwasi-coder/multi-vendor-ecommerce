"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  ShoppingBag,
  ClipboardList,
  Plus,
  Store,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const items = [
  { title: "Dashboard", href: "/vendor/dashboard", icon: LayoutDashboard },
  { title: "Orders", href: "/vendor/orders", icon: ClipboardList },
  { title: "Products", href: "/vendor/products", icon: ShoppingBag },
  { title: "Add product", href: "/vendor/products/create", icon: Plus },
];

export function VendorSidebar() {
  const pathname = usePathname();
  const { setOpenMobile, state } = useSidebar();
  const [hoverExpanded, setHoverExpanded] = useState(false);
  const closeOnNavigate = () => {
    setOpenMobile(false);
    setHoverExpanded(false);
  };

  return (
    <Sidebar
      collapsible="icon"
      hoverExpanded={hoverExpanded}
      onMouseEnter={() => state === "collapsed" && setHoverExpanded(true)}
      onMouseLeave={() => setHoverExpanded(false)}
    >
      <SidebarHeader className="border-b">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" render={<Link href="/vendor/dashboard" onClick={closeOnNavigate} />}>
              <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground"><Store className="size-4" /></span>
              <span className="truncate font-semibold group-data-[collapsible=icon]:hidden group-data-[hover-expanded=true]:inline">Vendor workspace</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map(({ title, href, icon: Icon }) => {
                const active = pathname === href || (href === "/vendor/products" && pathname.startsWith("/vendor/products/") && pathname !== "/vendor/products/create");
                return (
                  <SidebarMenuItem key={href}>
                    <SidebarMenuButton isActive={active} tooltip={title} render={<Link href={href} onClick={closeOnNavigate} />}>
                      <Icon />
                      <span className="group-data-[collapsible=icon]:hidden group-data-[hover-expanded=true]:inline">{title}</span>
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
            <SidebarMenuButton tooltip="Store profile">
              <Store />
              <span className="group-data-[collapsible=icon]:hidden group-data-[hover-expanded=true]:inline">My store</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
