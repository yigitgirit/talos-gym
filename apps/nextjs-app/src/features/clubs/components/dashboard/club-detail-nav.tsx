"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import {
    SettingsIcon,
    CalendarDaysIcon,
    ShieldCheckIcon,
    BarChart3Icon,
    UsersIcon,
    CreditCardIcon,
    DumbbellIcon,
    KeyIcon,
    MapIcon,
    HistoryIcon
} from "lucide-react";

export const clubNavItems = [
    { id: 'general', label: 'General Details', icon: SettingsIcon },
    { id: 'schedule', label: 'Schedule', icon: CalendarDaysIcon },
    { id: 'management', label: 'Management', icon: ShieldCheckIcon },
    { id: 'analytics', label: 'Analytics', icon: BarChart3Icon },
    { id: 'memberships', label: 'Memberships', icon: UsersIcon },
    { id: 'billing', label: 'Billing & Invoices', icon: CreditCardIcon },
    { id: 'classes', label: 'Classes & Programs', icon: DumbbellIcon },
    { id: 'access-control', label: 'Access Control', icon: KeyIcon },
    { id: 'facilities', label: 'Facilities & Zones', icon: MapIcon },
    { id: 'audit-logs', label: 'Audit Logs', icon: HistoryIcon },
];

interface ClubDetailNavProps {
    clubId: string;
    currentTab: string;
}

export function ClubDetailNav({ clubId, currentTab }: ClubDetailNavProps) {
    return (
        <aside className="w-full lg:w-56 shrink-0 overflow-x-auto lg:overflow-visible custom-scrollbar">
            <nav className="flex lg:flex-col gap-2 min-w-max lg:min-w-0 pb-2 lg:pb-0">
                {clubNavItems.map((item) => (
                    <Link
                        key={item.id}
                        href={`/dashboard/clubs/${clubId}?tab=${item.id}`}
                        className={cn(
                            buttonVariants({ variant: currentTab === item.id ? "secondary" : "ghost" }),
                            "justify-start gap-3",
                            currentTab === item.id 
                                ? "bg-muted font-medium text-primary" 
                                : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                        )}
                    >
                        <item.icon className="w-4 h-4 shrink-0" />
                        {item.label}
                    </Link>
                ))}
            </nav>
        </aside>
    );
}