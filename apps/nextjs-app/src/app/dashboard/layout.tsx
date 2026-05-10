import React from "react"
import { AppSidebar } from "@/components/layout/dashboard/app-sidebar"
import { SiteHeader } from "@/components/layout/dashboard/site-header"
import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar"

export default function DashboardLayout({ children }: { readonly children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen w-full bg-background text-foreground">
            <SidebarProvider
                style={
                    {
                        "--sidebar-width": "calc(var(--spacing) * 72)",
                        "--header-height": "calc(var(--spacing) * 12)",
                    } as React.CSSProperties
                }
            >
                <AppSidebar variant="inset" />
                <SidebarInset>
                    <SiteHeader />
                    <main className="flex flex-1 flex-col">
                        {children}
                    </main>
                </SidebarInset>
            </SidebarProvider>
        </div>
    )
}
