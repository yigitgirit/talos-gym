"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
    User,
    Shield,
    Bell,
    UserRoundCheck,
    ReceiptText,
    Settings2,
    MapPin,
    CalendarCheck,
    Dumbbell,
    QrCode, ShoppingBag
} from "lucide-react"
import { cn } from "@/lib/utils"

const sidebarNavItems = [
    {
        title: "Profile",
        href: "/account",
        icon: <User className="w-4 h-4" />,
    },
    {
        title: "Sign in & Security",
        href: "/account/security",
        icon: <Shield className="w-4 h-4" />,
    },
    {
        title: "Notifications",
        href: "/account/preferences",
        icon: <Bell className="w-4 h-4" />,
    },
    {
        title: "Billing & Invoices",
        href: "/account/billing",
        icon: <ReceiptText className="w-4 h-4" />,
    },
    {
        title: "Subscription",
        href: "/account/subscription",
        icon: <UserRoundCheck className="w-4 h-4" />,
    },
    {
        title: "My Workouts",
        href: "/account/workouts",
        icon: <Dumbbell className="w-4 h-4" />,
    },
    {
        title: "Class Bookings",
        href: "/account/bookings",
        icon: <CalendarCheck className="w-4 h-4" />,
    },
]

export function AccountSidebarNav() {
    const pathname = usePathname()

    return (
        <nav className="flex md:flex-col gap-2 overflow-x-auto pb-4 md:pb-0">
            {sidebarNavItems.map((item) => {
                const isActive = pathname === item.href

                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            "relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                            isActive
                                ? "bg-primary/10 text-primary"
                                : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        )}
                    >
                        {isActive && (
                            <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-primary rounded-r-full" />
                        )}
                        {item.icon}
                        {item.title}
                    </Link>
                )
            })}
        </nav>
    )
}