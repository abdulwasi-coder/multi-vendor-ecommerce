"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, BookOpen, Users, Settings } from "lucide-react";

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
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "Ledger Accounts", href: "/dashboard/ledger", icon: BookOpen },
  { title: "Vendors & Users", href: "/dashboard/vendors", icon: Users },
  { title: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();

  return (
    <Sidebar collapsible="icon" className="text-slate-400">
      {/* 1. TOP: COMPANY IMAGE */}
      <SidebarHeader className="border-b border-slate-800!">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="flex gap-2 items-center"
              size="lg"
              render={<Link href="/dashboard" />}
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
              <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                <span className="truncate  font-semibold tracking-wider">
                  Bon Ton
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* 2. MIDDLE: NAV LINKS (Home, Inbox, etc.) */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-slate-500 text-xs font-semibold tracking-wider uppercase">
            Dashboard
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => {
                const isActive = item.href === pathname;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      className={`flex gap-1.5 items-center transition-all duration-200 ease-in-out `}
                      isActive={isActive}
                      render={
                        <Link
                          onClick={() => setOpenMobile(false)}
                          href={item.href}
                        />
                      }
                    >
                      <item.icon />
                      <div className="group-data-[collapsible=icon]:hidden">
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

      {/* 3. BOTTOM: BOSS IMAGE */}
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="flex  gap-2 items-center "
              size="lg"
              render={<Link href="/" />}
            >
              <div className="flex size-8 items-center justify-center rounded-lg">
                <Image
                  src="/person.jpg"
                  height={800}
                  width={800}
                  alt="Company Logo"
                  className="w-full rounded-md h-full"
                  priority
                />
              </div>

              <span className="truncate group-data-[collapsible=icon]:hidden font-semibold hover: tracking-wider">
                John Smith
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
