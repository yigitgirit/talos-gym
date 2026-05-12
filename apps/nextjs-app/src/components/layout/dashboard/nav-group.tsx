"use client"

import React, { useState } from "react"
import { ChevronDownIcon } from "lucide-react"
import Link from "next/link" // Use Link for Next.js navigation
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubItem,
    SidebarMenuSubButton,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

export function NavGroup({
                             label, // New prop for the header text
                             items,
                         }: {
    label?: string
    items: {
        title: string
        icon: React.ReactNode
        isActive?: boolean
        url: string
        items?: { // Made optional for items without sub-nav
            title: string
            url: string
        }[]
    }[]
}) {
    const [expandedItems, setExpandedItems] = useState<Set<string>>(
        new Set(items.filter((item) => item.isActive).map((item) => item.title))
    )

    const toggleExpanded = (title: string) => {
        const newExpanded = new Set(expandedItems)
        if (newExpanded.has(title)) {
            newExpanded.delete(title)
        } else {
            newExpanded.add(title)
        }
        setExpandedItems(newExpanded)
    }

    return (
        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
            {/* Now displays whatever label you pass in */}
            {label && <SidebarGroupLabel>{label}</SidebarGroupLabel>}
            <SidebarMenu>
                {items.map((item) => {
                    const hasSubItems = item.items && item.items.length > 0;
                    const isExpanded = expandedItems.has(item.title);

                    return (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton
                                onClick={hasSubItems ? () => toggleExpanded(item.title) : undefined}
                                className={cn(hasSubItems && "cursor-pointer")}
                                asChild={!hasSubItems} // Use asChild only for direct links
                            >
                                {hasSubItems ? (
                                    <>
                                        {item.icon}
                                        <span>{item.title}</span>
                                        <ChevronDownIcon
                                            className={cn(
                                                "ml-auto transition-transform duration-200",
                                                isExpanded ? "rotate-180" : ""
                                            )}
                                        />
                                    </>
                                ) : (
                                    <Link href={item.url}>
                                        {item.icon}
                                        <span>{item.title}</span>
                                    </Link>
                                )}
                            </SidebarMenuButton>

                            {hasSubItems && isExpanded && (
                                <SidebarMenuSub>
                                    {item.items?.map((subItem) => (
                                        <SidebarMenuSubItem key={subItem.title}>
                                            <SidebarMenuSubButton asChild>
                                                {/* Use Link instead of <a> for better performance */}
                                                <Link href={subItem.url}>{subItem.title}</Link>
                                            </SidebarMenuSubButton>
                                        </SidebarMenuSubItem>
                                    ))}
                                </SidebarMenuSub>
                            )}
                        </SidebarMenuItem>
                    );
                })}
            </SidebarMenu>
        </SidebarGroup>
    )
}