"use client";

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { ModeToggle } from "@/components/ui/mode-toggle"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import {usePathname} from "next/navigation";
import React from "react";

export function SiteHeader() {
    const pathname = usePathname()

    const generateBreadcrumbs = () => {
        const paths = pathname.split('/').filter(path => path)

        return paths.map((path, index) => {
            const href = `/${paths.slice(0, index + 1).join('/')}`
            const isLast = index === paths.length - 1
            const title = path.charAt(0).toUpperCase() + path.slice(1)

            return (
                <React.Fragment key={path}>
                    <BreadcrumbItem>
                        {isLast ? (
                            <BreadcrumbPage>{title}</BreadcrumbPage>
                        ) : (
                            <BreadcrumbLink href={href}>{title}</BreadcrumbLink>
                        )}
                    </BreadcrumbItem>
                    {!isLast && <BreadcrumbSeparator />}
                </React.Fragment>
            )
        })
    }

    return (
        <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
            <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
                <SidebarTrigger className="-ml-1" />
                <Separator
                    orientation="vertical"
                    className="mx-4 data-[orientation=vertical]:h-4"
                />
                <Breadcrumb>
                <BreadcrumbList>
                    {generateBreadcrumbs()}
                </BreadcrumbList>
                </Breadcrumb>
                <div className="ml-auto flex items-center gap-2">
                    <Button variant="ghost" asChild size="sm" className="hidden sm:flex">
                        <a
                            href="https://github.com/yigitgirit/talos-gym"
                            rel="noopener noreferrer"
                            target="_blank"
                            className="dark:text-foreground"
                        >
                            GitHub
                        </a>
                    </Button>
                    <ModeToggle />
                </div>
            </div>
        </header>
    )
}
