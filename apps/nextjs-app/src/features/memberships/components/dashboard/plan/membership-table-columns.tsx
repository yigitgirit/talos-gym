"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { ColumnDef } from "@tanstack/react-table"
import { toast } from "sonner"

import { MembershipPlanResponse, FeatureResponse } from "@/lib/api/schema"
import { deletePlanAction } from "@/features/memberships/actions/membership.action"
import { useServerAction } from "@/hooks/useServerAction"

import { Badge } from "@/components/ui/badge"
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
import { MoreHorizontal, Loader2, CheckCircle2, XCircle } from "lucide-react"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle
} from "@/components/ui/sheet"
import { EditPlanForm } from "@/features/memberships/components/dashboard/plan/edit-plan-form"

const GlobalBadge = ({ isGlobal }: { isGlobal: boolean }) => (
    <Badge variant={isGlobal ? "default" : "secondary"} className="w-24 justify-center gap-1.5">
        {isGlobal ? (
            <> <CheckCircle2 className="h-3 w-3" /> Global </>
        ) : (
            <> <XCircle className="h-3 w-3" /> Local </>
        )}
    </Badge>
)

const PlanActionsCell = ({
                             plan,
                             features
                         }: {
    plan: MembershipPlanResponse,
    features: FeatureResponse[]
}) => {
    const router = useRouter()
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)
    const [showEditSheet, setShowEditSheet] = useState(false)

    const { execute, isPending } = useServerAction(deletePlanAction, {
        onSuccess: () => {
            toast.success("Plan deleted successfully")
            setShowDeleteDialog(false)
            router.refresh()
        },
        onError: (error) => {
            toast.error(error.message || "Failed to delete plan")
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
                    <DropdownMenuItem onClick={() => setShowEditSheet(true)}>
                        Edit Plan
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        className="text-destructive cursor-pointer"
                        onSelect={() => setShowDeleteDialog(true)}
                    >
                        Delete Plan
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <Sheet open={showEditSheet} onOpenChange={setShowEditSheet}>
                <SheetContent side="right" className="w-full sm:max-w-md flex flex-col p-0 gap-0">
                    <SheetHeader className="p-6 border-b">
                        <SheetTitle>Edit Plan</SheetTitle>
                        <SheetDescription>Update membership tier details.</SheetDescription>
                    </SheetHeader>
                    <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                        <EditPlanForm
                            plan={plan}
                            features={features}
                            setOpen={setShowEditSheet}
                        />
                    </div>
                    <SheetFooter className="p-6 border-t">
                        <Button
                            type="submit"
                            form="edit-plan-form"
                        >
                            Save Changes
                        </Button>
                    </SheetFooter>
                </SheetContent>
            </Sheet>

            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Permanently delete <strong>{plan.name}</strong>? This cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
                        <Button
                            variant="destructive"
                            onClick={() => execute({ planId: plan.id.toString() })}
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

export const getPlanColumns = (features: FeatureResponse[]): ColumnDef<MembershipPlanResponse>[] => [
    {
        accessorKey: "name",
        header: () => <div className="pl-4">Plan</div>,
        cell: ({ row }) => (
            <div className="pl-4 font-semibold text-primary">{row.original.name}</div>
        ),
    },
    {
        accessorKey: "isGlobal",
        header: "Scope",
        cell: ({ row }) => <GlobalBadge isGlobal={row.original.isGlobal} />,
    },
    {
        accessorKey: "features",
        header: () => <div className="text-right">Features</div>,
        cell: ({ row }) => (
            <div className="text-right font-medium tabular-nums">
                {row.original.features.length}
            </div>
        ),
    },
    {
        id: "actions",
        cell: ({ row }) => <PlanActionsCell plan={row.original} features={features} />,
    },
]