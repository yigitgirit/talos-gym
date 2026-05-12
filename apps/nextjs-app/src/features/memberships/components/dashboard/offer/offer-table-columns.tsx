"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { ColumnDef } from "@tanstack/react-table"
import { toast } from "sonner"
import { MoreHorizontal, Loader2 } from "lucide-react"

import { OfferAdminResponse } from "@/lib/api/schema"
import { deleteOfferAction } from "@/features/memberships/actions/membership.action"
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

import { EditOfferForm } from "@/features/memberships/components/dashboard/offer/edit-offer-form"

const OfferActionsCell = ({ offer }: { offer: OfferAdminResponse }) => {
    const router = useRouter()
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)
    const [showEditDialog, setShowEditDialog] = useState(false)

    const { execute, isPending } = useServerAction(deleteOfferAction, {
        onSuccess: () => {
            toast.success("Offer deleted successfully")
            setShowDeleteDialog(false)
            router.refresh()
        },
        onError: (error) => {
            toast.error(error.message || "Failed to delete offer.")
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
                        Edit Offer
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        className="text-destructive cursor-pointer"
                        onSelect={() => setShowDeleteDialog(true)}
                    >
                        Delete Offer
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Edit Offer Dialog */}
            <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Edit Offer</DialogTitle>
                        <DialogDescription>Update the details of this offer.</DialogDescription>
                    </DialogHeader>
                    <EditOfferForm offer={offer} />
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation */}
            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Offer?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete this offer?
                            This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
                        <Button
                            variant="destructive"
                            onClick={() => execute({ offerId: offer.id.toString() })}
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

export const offerColumns: ColumnDef<OfferAdminResponse>[] = [
    {
        accessorKey: "planName",
        header: () => <div className="pl-4">Plan Name</div>,
        cell: ({ row }) => (
            <div className="pl-4 font-semibold text-primary">{row.original.planName}</div>
        ),
    },
    {
        accessorKey: "clubName",
        header: "Club Name",
        cell: ({ row }) => (
            <div>{row.original.clubName}</div>
        ),
    },
    {
        accessorKey: "price",
        header: "Price",
        cell: ({ row }) => (
            <div>{row.original.price} {row.original.currency}</div>
        ),
    },
    {
        id: "actions",
        cell: ({ row }) => <OfferActionsCell offer={row.original} />,
    },
]