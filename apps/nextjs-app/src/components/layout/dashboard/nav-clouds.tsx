"use client"

import { useState } from "react"
import { ChevronDownIcon } from "lucide-react"
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

export function NavClouds({
                              items,
                          }: {
    items: {
        title: string
        icon: React.ReactNode
        isActive?: boolean
        url: string
        items: {
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
            <SidebarGroupLabel>Clouds</SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                            onClick={() => toggleExpanded(item.title)}
                            className="cursor-pointer"
                            asChild={false}
                        >
                            {item.icon}
                            <span>{item.title}</span>
                            {item.items && item.items.length > 0 && (
                                <ChevronDownIcon
                                    className={cn(
                                        "ml-auto transition-transform duration-200",
                                        expandedItems.has(item.title) ? "rotate-180" : ""
                                    )}
                                />
                            )}
                        </SidebarMenuButton>

                        {item.items && item.items.length > 0 && expandedItems.has(item.title) && (
                            <SidebarMenuSub>
                                {item.items.map((subItem) => (
                                    <SidebarMenuSubItem key={subItem.title}>
                                        <SidebarMenuSubButton asChild>
                                            <a href={subItem.url}>{subItem.title}</a>
                                        </SidebarMenuSubButton>
                                    </SidebarMenuSubItem>
                                ))}
                            </SidebarMenuSub>
                        )}
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    )
}