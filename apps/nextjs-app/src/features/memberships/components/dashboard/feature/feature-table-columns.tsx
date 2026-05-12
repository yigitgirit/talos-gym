"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { ColumnDef } from "@tanstack/react-table"
import { toast } from "sonner"
import { MoreHorizontal, Loader2 } from "lucide-react"

import { FeatureResponse } from "@/lib/api/schema"
import { deleteFeatureAction } from "@/features/memberships/actions/membership.action"
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
import { EditFeatureForm } from "@/features/memberships/components/dashboard/feature/edit-feature-form"

const FeatureActionsCell = ({ feature }: { feature: FeatureResponse }) => {
    const router = useRouter()
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)
    const [showEditDialog, setShowEditDialog] = useState(false)

    const { execute, isPending } = useServerAction(deleteFeatureAction, {
        onSuccess: () => {
            toast.success("Feature deleted successfully")
            setShowDeleteDialog(false)
            router.refresh()
        },
        onError: (error) => {
            toast.error(error.message || "Failed to delete feature. It might be in use by a plan.")
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
                        Edit Feature
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        className="text-destructive cursor-pointer"
                        onSelect={() => setShowDeleteDialog(true)}
                    >
                        Delete Feature
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Edit Feature Dialog */}
            <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Edit Feature</DialogTitle>
                        <DialogDescription>Update the details of this amenity.</DialogDescription>
                    </DialogHeader>
                    <EditFeatureForm feature={feature} />
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation */}
            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Feature?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete <strong>{feature.name}</strong>?
                            This action cannot be undone. If this feature is attached to active plans, the deletion might fail.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
                        <Button
                            variant="destructive"
                            onClick={() => execute({ featureId: feature.id.toString() })}
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

export const featureColumns: ColumnDef<FeatureResponse>[] = [
    {
        accessorKey: "name",
        header: () => <div className="pl-4">Feature Name</div>,
        cell: ({ row }) => (
            <div className="pl-4 font-semibold text-primary">{row.original.name}</div>
        ),
    },
    {
        accessorKey: "description",
        header: "Description",
        cell: ({ row }) => {
            const desc = row.original.description;
            return (
                <div className="text-sm text-muted-foreground max-w-[400px] truncate" title={desc || ""}>
                    {desc || <span className="italic opacity-50">No description provided</span>}
                </div>
            )
        },
    },
    {
        id: "actions",
        cell: ({ row }) => <FeatureActionsCell feature={row.original} />,
    },
]