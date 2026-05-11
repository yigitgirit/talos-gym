"use client"

import React, {useState} from "react"
import {useRouter} from "next/navigation"
import {ColumnDef} from "@tanstack/react-table"
import {SubscriptionResponse} from "@/lib/api/schema/subscription.schema"
import {Badge} from "@/components/ui/badge"
import {Button} from "@/components/ui/button"
import {Loader2, MoreHorizontal} from "lucide-react"
import {toast} from "sonner"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {useServerAction} from "@/hooks/useServerAction"
import {cancelSubscriptionAdminAction} from "@/features/subscriptions/actions/subscription.action"

const SubscriptionActionsCell = ({subscription}: { subscription: SubscriptionResponse }) => {
    const router = useRouter()
    const [showCancelDialog, setShowCancelDialog] = useState(false)

    const {execute, isPending} = useServerAction(cancelSubscriptionAdminAction, {
        onSuccess: () => {
            toast.success("Subscription cancelled successfully")
            setShowCancelDialog(false)
            router.refresh()
        },
        onError: (error) => {
            toast.error(error.message || "Failed to cancel subscription")
            setShowCancelDialog(false)
        }
    })

    return (
        <div className="text-right">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4 text-muted-foreground"/>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem
                        onClick={() => navigator.clipboard.writeText(subscription.id.toString())}
                    >
                        Copy Sub ID
                    </DropdownMenuItem>
                    <DropdownMenuSeparator/>
                    <DropdownMenuItem
                        className="text-destructive focus:text-destructive cursor-pointer"
                        onSelect={() => setShowCancelDialog(true)}
                        disabled={subscription.status === 'CANCELED' || subscription.status === 'EXPIRED'}
                    >
                        Cancel Sub
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will cancel the subscription for plan "{subscription.planName}". This action cannot be
                            undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isPending}>Back</AlertDialogCancel>
                        <Button
                            variant="destructive"
                            onClick={() => execute({id: subscription.id})}
                            disabled={isPending}
                        >
                            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                            Cancel Subscription
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}

const statusColors = {
    ACTIVE: 'bg-green-100 text-green-800 dark:bg-green-900/30',
    CANCELED: 'bg-red-100 text-red-800 dark:bg-red-900/30',
    EXPIRED: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30',
    PENDING_PAYMENT: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30',
}

export const subscriptionColumns: ColumnDef<SubscriptionResponse>[] = [
    {
        accessorKey: "planName",
        header: () => <div className="pl-2 sm:pl-4">Plan Name</div>,
        cell: ({row}) => {
            const subscription = row.original
            return (
                <div className="flex flex-col min-w-50 pl-2 sm:pl-4">
                    <span className="font-semibold text-foreground">
                        {subscription.planName}
                    </span>
                    <span className="text-xs text-muted-foreground mt-0.5">
                        ID: {subscription.id}
                    </span>
                </div>
            )
        },
    },

    {
        accessorKey: "totalAmount",
        header: "Total Amount",
        cell: ({row}) => {
            const amount = row.original.totalAmount
            return (
                <div className="font-medium">
                    ${amount.toFixed(2)}
                </div>
            )
        },
    },

    {
        accessorKey: "startDate",
        header: "Duration",
        cell: ({row}) => {
            const {startDate, endDate} = row.original

            return (
                <div className="text-sm">
                    <div><span
                        className="text-muted-foreground">Start:</span> {new Date(startDate).toLocaleDateString('en-EN')}</div>
                    <div><span className="text-muted-foreground">End:</span> {new Date(endDate).toLocaleDateString('en-EN')}
                    </div>
                </div>
            )
        },
    },

    {
        accessorKey: "status",
        header: "Status",
        cell: ({row}) => {
            const status = row.original.status

            return (
                <Badge
                    variant="outline"
                    className={`justify-center gap-1.5 capitalize ${statusColors[status as keyof typeof statusColors] || ''}`}
                >
                    {status.replace('_', ' ').toLowerCase()}
                </Badge>
            )
        },
    },

    {
        id: "actions",
        cell: ({row}) => {
            return <SubscriptionActionsCell subscription={row.original}/>
        },
    },
]