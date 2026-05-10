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
  CameraIcon,
  CircleHelpIcon,
  CreditCardIcon,
  DatabaseIcon,
  DumbbellIcon,
  FileBadgeIcon,
  FileChartColumnIcon,
  FileIcon,
  FileTextIcon,
  FolderIcon,
  LayoutDashboardIcon,
  SearchIcon,
  Settings2Icon,
  UsersIcon
} from "lucide-react"
import {Logo} from "@/components/layout/logo";

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
        // {
        //     title: "Analytics",
        //     url: "/dashboard/analytics",
        //     icon: (
        //         <ChartBarIcon
        //         />
        //     ),
        // },
        // {
        //     title: "Projects",
        //     url: "/dashboard/projects",
        //     icon: (
        //         <FolderIcon
        //         />
        //     ),
        // },
        // {
        //     title: "Team",
        //     url: "/dashboard/team",
        //     icon: (
        //         <UsersIcon
        //         />
        //     ),
        // },
        {
            title: "Users",
            url: "/dashboard/users",
            icon: <UsersIcon/>,
        },
        {
            title: "Clubs",
            url: "/dashboard/clubs",
            icon: <DumbbellIcon/>,
        },
        {
            title: "Memberships",
            url: "/dashboard/memberships",
            icon: <FileBadgeIcon/>,
        },
        {
            title: "Subscriptions",
            url: "/dashboard/subscriptions",
            icon: <CreditCardIcon/>,
        },
    ],
    navClouds: [
        {
            title: "Capture",
            icon: (
                <CameraIcon
                />
            ),
            isActive: true,
            url: "#",
            items: [
                {
                    title: "Active Proposals",
                    url: "#",
                },
                {
                    title: "Archived",
                    url: "#",
                },
            ],
        },
        {
            title: "Proposal",
            icon: (
                <FileTextIcon
                />
            ),
            url: "#",
            items: [
                {
                    title: "Active Proposals",
                    url: "#",
                },
                {
                    title: "Archived",
                    url: "#",
                },
            ],
        },
        {
            title: "Prompts",
            icon: (
                <FileTextIcon
                />
            ),
            url: "#",
            items: [
                {
                    title: "Active Proposals",
                    url: "#",
                },
                {
                    title: "Archived",
                    url: "#",
                },
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
                {/*<NavClouds items={data.navClouds}/>*/}
                {/*<NavDocuments items={data.documents} />*/}
                <NavSecondary items={data.navSecondary} className="mt-auto"/>
            </SidebarContent>
            <SidebarFooter>
                <NavUser/>
            </SidebarFooter>
            {/*<SidebarRail></SidebarRail>*/}
        </Sidebar>
    )
}
