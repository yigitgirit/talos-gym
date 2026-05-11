"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { ColumnDef } from "@tanstack/react-table"
import { toast } from "sonner"
import { MoreHorizontal, Loader2 } from "lucide-react"

import { PlanSubscriptionConfigResponse } from "@/lib/api/schema"
import { deletePlanSubscriptionConfigAction } from "@/features/memberships/actions/membership.action"
import { useServerAction } from "@/hooks/useServerAction"

import { Button } from "@/components/ui/button"
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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { EditConfigForm } from "@/features/memberships/components/dashboard/config/edit-config-form"

const ConfigActionsCell = ({ config }: { config: PlanSubscriptionConfigResponse }) => {
    const router = useRouter()
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)
    const [showEditDialog, setShowEditDialog] = useState(false)

    const { execute, isPending } = useServerAction(deletePlanSubscriptionConfigAction, {
        onSuccess: () => {
            toast.success("Subscription configuration deleted successfully")
            setShowDeleteDialog(false)
            router.refresh()
        },
        onError: (error) => {
            toast.error(error.message || "Failed to delete config.")
            setShowDeleteDialog(false)
        },
    })

    return (
        <div className="text-right">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => setShowEditDialog(true)}>
                        Edit Config
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        className="text-destructive cursor-pointer"
                        onSelect={() => setShowDeleteDialog(true)}
                    >
                        Delete Config
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Edit Config Dialog */}
            <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Edit Config</DialogTitle>
                        <DialogDescription>Update the details of this config.</DialogDescription>
                    </DialogHeader>
                    <EditConfigForm config={config} />
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation */}
            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Config?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete this subscription configuration?
                            This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
                        <Button
                            variant="destructive"
                            onClick={() => execute({ planId: config.planId.toString(), configId: config.id.toString() })}
                            disabled={isPending}
                        >
                            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Delete
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}

export const configColumns: ColumnDef<PlanSubscriptionConfigResponse>[] = [
    {
        accessorKey: "planName",
        header: () => <div className="pl-4">Plan Name</div>,
        cell: ({ row }) => (
            <div className="pl-4 font-semibold text-primary">{row.original.planName}</div>
        ),
    },
    {
        accessorKey: "subscriptionType",
        header: "Type",
        cell: ({ row }) => (
            <div>{row.original.subscriptionType?.name}</div>
        ),
    },
    {
        accessorKey: "multiplier",
        header: "Multiplier",
        cell: ({ row }) => (
            <div>x{row.original.multiplier}</div>
        ),
    },
    {
        accessorKey: "discountRate",
        header: "Discount",
        cell: ({ row }) => {
            const dr = row.original.discountRate;
            return <div>{dr ? `${(dr * 100).toFixed(0)}%` : '0%'}</div>
        },
    },
    {
        accessorKey: "installments",
        header: "Installments",
        cell: ({ row }) => (
            <div>{row.original.installments}</div>
        ),
    },
    {
        id: "actions",
        cell: ({ row }) => <ConfigActionsCell config={row.original} />,
    },
]