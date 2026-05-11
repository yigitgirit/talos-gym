"use client"

import * as React from "react"
import {NavMain} from "@/components/layout/dashboard/nav-main"
import {NavSecondary} from "@/components/layout/dashboard/nav-secondary"
import {NavUser} from "@/components/layout/dashboard/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import {
  CircleHelpIcon,
  CreditCardIcon,
  DatabaseIcon,
  DumbbellIcon,
  FileBadgeIcon,
  FileChartColumnIcon,
  FileIcon,
  LayoutDashboardIcon,
  SearchIcon,
  Settings2Icon,
  UsersIcon
} from "lucide-react"
import {Logo} from "@/components/layout/logo";
import {NavGroup} from "@/components/layout/dashboard/nav-group";

const data = {
    navMain: [
        {
            title: "Dashboard",
            url: "/dashboard",
            icon: (
                <LayoutDashboardIcon
                />
            ),
        },
        {
            title: "Users",
            url: "/dashboard/users",
            icon: <UsersIcon/>,
        },
        {
            title: "Subscriptions",
            url: "/dashboard/subscriptions",
            icon: <CreditCardIcon/>,
        },
    ],
    navClouds: [
        {
            title: "Clubs",
            url: "/dashboard/clubs",
            icon: <DumbbellIcon/>,
        },
        {
            title: "Memberships",
            url: "/dashboard/memberships",
            icon: <FileBadgeIcon />,
            items: [
                { title: "Plans", url: "/dashboard/memberships" },
                { title: "Features", url: "/dashboard/memberships/features" },
                { title: "Offers", url: "/dashboard/memberships/offers" },
                { title: "Configs", url: "/dashboard/memberships/subscription-configs" },
            ],
        },
    ],
    navSecondary: [
        {
            title: "Settings",
            url: "#",
            icon: (
                <Settings2Icon
                />
            ),
        },
        {
            title: "Get Help",
            url: "#",
            icon: (
                <CircleHelpIcon
                />
            ),
        },
        {
            title: "Search",
            url: "#",
            icon: (
                <SearchIcon
                />
            ),
        },
    ],
    documents: [
        {
            name: "Data Library",
            url: "#",
            icon: (
                <DatabaseIcon
                />
            ),
        },
        {
            name: "Reports",
            url: "#",
            icon: (
                <FileChartColumnIcon
                />
            ),
        },
        {
            name: "Word Assistant",
            url: "#",
            icon: (
                <FileIcon
                />
            ),
        },
    ],
}

export function AppSidebar({...props}: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar collapsible="offcanvas" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            asChild
                            className="data-[slot=sidebar-menu-button]:p-1.5!"
                        >
                            <Logo/>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={data.navMain}/>
                <NavGroup label="FOUNDATION" items={data.navClouds}/>
                <NavSecondary items={data.navSecondary} className="mt-auto"/>
            </SidebarContent>
            <SidebarFooter>
                <NavUser/>
            </SidebarFooter>
        </Sidebar>
    )
}
