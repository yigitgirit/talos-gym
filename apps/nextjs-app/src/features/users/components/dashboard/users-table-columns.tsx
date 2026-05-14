"use client"

import React, {useState} from "react"
import {useRouter} from "next/navigation"
import {ColumnDef} from "@tanstack/react-table"
import Link from "next/link"
import {toast} from "sonner"

import {UserResponse} from "@/lib/api/schema"
import {deleteUserAsync} from "@/features/users/actions/users.actions"
import {useServerAction} from "@/hooks/useServerAction"

import {Badge} from "@/components/ui/badge"
import {Button} from "@/components/ui/button"
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
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,} from "@/components/ui/tooltip"

import {Ban, CheckCircle2, Clock, Loader2, Mail, MoreHorizontal, Phone, Shield, XCircle} from "lucide-react"
import {UserQuickView} from "./user-quick-view"

// --- Helper for Status Badges ---
const StatusBadge = ({status}: { status: UserResponse['status'] }) => {
    switch (status) {
        case 'ACTIVE':
            return (
                <Badge variant="default" className="w-24 justify-center gap-1.5">
                    <CheckCircle2 className="h-3 w-3"/> Active
                </Badge>
            )
        case 'BANNED':
            return (
                <Badge variant="destructive" className="w-24 justify-center gap-1.5">
                    <Ban className="h-3 w-3"/> Banned
                </Badge>
            )
        case 'PENDING':
            return (
                <Badge variant="outline" className="w-24 justify-center gap-1.5">
                    <Clock className="h-3 w-3"/> Pending
                </Badge>
            )
        case 'INACTIVE':
        default:
            return (
                <Badge variant="secondary" className="w-24 justify-center gap-1.5">
                    <XCircle className="h-3 w-3"/> Inactive
                </Badge>
            )
    }
}

// --- Dedicated Actions Cell with Delete Dialog ---
const UserActionsCell = ({user}: { user: UserResponse }) => {
    const router = useRouter()
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)

    // Using your custom ApiClient Server Action hook
    const {execute, isPending} = useServerAction(deleteUserAsync, {
        onSuccess: () => {
            toast.success("User deleted successfully")
            setShowDeleteDialog(false)
            router.refresh()
        },
        onError: (error) => {
            // Error handling relies on the ActionError shape from actionClient
            toast.error(error.message || "Failed to delete user")
            setShowDeleteDialog(false)
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
                        onClick={() => {
                            navigator.clipboard.writeText(user.id.toString())
                            toast.success("User ID copied")
                        }}
                    >
                        Copy User ID
                    </DropdownMenuItem>
                    <DropdownMenuSeparator/>
                    <DropdownMenuItem asChild>
                        <Link href={`/dashboard/users/${user.id}`}>
                            View Full Details
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator/>
                    <DropdownMenuItem
                        className="text-destructive focus:text-destructive cursor-pointer"
                        onSelect={() => setShowDeleteDialog(true)}
                    >
                        Delete User
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete the
                            user <strong>{user.firstName} {user.lastName}</strong> ({user.email}). This action cannot be
                            undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
                        <Button
                            variant="destructive"
                            onClick={() => execute({id: user.id.toString()})}
                            disabled={isPending}
                        >
                            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                            Delete
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}

// --- Column Definitions ---
export const userColumns: ColumnDef<UserResponse>[] = [
    {
        accessorKey: "firstName", // We use firstName as the primary key for sorting/filtering purposes
        header: () => <div className="pl-2 sm:pl-4">User Details</div>,
        cell: ({row}) => {
            const user = row.original

            return (
                <div className="flex flex-col min-w-50 pl-2 sm:pl-4">
                    <UserQuickView user={user}>
                        <button className="font-semibold cursor-pointer hover:underline text-primary text-left w-fit">
                            {user.firstName} {user.lastName}
                        </button>
                    </UserQuickView>
                </div>
            )
        },
    },

    {
        accessorKey: "phoneNumber",
        header: "Contact",
        cell: ({row}) => {
            const phone = row.original.phoneNumber

            const handleCopy = (e: React.MouseEvent) => {
                e.stopPropagation()
                if (phone) {
                    navigator.clipboard.writeText(phone)
                    toast.success("Copied phone number!")
                }
            }

            return (
                <TooltipProvider delayDuration={200}>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div
                                onClick={handleCopy}
                                className="flex items-center gap-2 text-sm text-muted-foreground w-max cursor-pointer hover:text-foreground transition-colors"
                            >
                                <Phone className="h-3.5 w-3.5 shrink-0"/>
                                <span>{phone}</span>
                            </div>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Click to copy</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            )
        },
    },

    // --- NEW: Dedicated Email Column ---
    {
        accessorKey: "email",
        header: "Email",
        cell: ({ row }) => {
            const email = row.original.email

            const handleCopy = (e: React.MouseEvent) => {
                e.stopPropagation()
                if (email) {
                    navigator.clipboard.writeText(email)
                    toast.success("Copied email address!")
                }
            }

            return (
                <TooltipProvider delayDuration={200}>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div
                                onClick={handleCopy}
                                className="flex items-center gap-2 text-sm text-muted-foreground w-max cursor-pointer hover:text-foreground transition-colors"
                            >
                                <Mail className="h-3.5 w-3.5 shrink-0" />
                                <span>{email}</span>
                            </div>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Click to copy email</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            )
        },
    },

    {
        accessorKey: "roles",
        header: "Roles",
        cell: ({row}) => {
            const roles = row.original.roles

            return (
                <div className="flex flex-wrap items-center gap-1.5 w-max text-muted-foreground">
                    <Shield className="h-3.5 w-3.5 shrink-0 mr-1"/>
                    {roles.map(role => (
                        <Badge key={role} variant="secondary" className="text-[10px] uppercase font-medium px-1.5 h-5">
                            {role}
                        </Badge>
                    ))}
                </div>
            )
        },
    },

    {
        accessorKey: "status",
        header: "Status",
        cell: ({row}) => <StatusBadge status={row.original.status}/>,
    },

    {
        id: "actions",
        cell: ({row}) => <UserActionsCell user={row.original}/>,
    },
]