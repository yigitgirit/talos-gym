"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import {ColumnDef} from "@tanstack/react-table"
import {ClubResponse} from "@/lib/api/schema/club.schema"
import {Badge} from "@/components/ui/badge"
import {Button} from "@/components/ui/button"
import {CheckCircle2, MapPin, MoreHorizontal, XCircle, Loader2} from "lucide-react"
import { toast } from "sonner"
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
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import {ClubQuickView} from "./club-quick-view"
import Link from "next/link";
import { useServerAction } from "@/hooks/useServerAction"
import { deleteClubAction } from "@/features/clubs/actions/club.actions"

const ClubActionsCell = ({ club }: { club: ClubResponse }) => {
    const router = useRouter()
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)

    const { execute, isPending } = useServerAction(deleteClubAction, {
        onSuccess: () => {
            toast.success("Club deleted successfully")
            setShowDeleteDialog(false)
            router.refresh()
        },
        onError: (error) => {
            toast.error(error.message || "Failed to delete club")
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
                        onClick={() => navigator.clipboard.writeText(club.id.toString())}
                    >
                        Copy Club ID
                    </DropdownMenuItem>
                    <DropdownMenuSeparator/>
                    <DropdownMenuItem asChild>
                        <Link href={`/dashboard/clubs/${club.id}?tab=general`}>
                            Edit Club
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link href={`/dashboard/clubs/${club.id}`}>
                            View Full Details
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link href={`/dashboard/clubs/${club.id}?tab=schedule`}>
                            Edit Schedule
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator/>
                    <DropdownMenuItem
                        className="text-destructive focus:text-destructive cursor-pointer"
                        onSelect={() => setShowDeleteDialog(true)}
                    >
                        Delete Club
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete the club "{club.name}". This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
                        <Button 
                            variant="destructive" 
                            onClick={() => execute({ id: club.id.toString() })}
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

export const clubColumns: ColumnDef<ClubResponse>[] = [
    {
        accessorKey: "name",
        header: () => <div className="pl-2 sm:pl-4">Club Details</div>,
        cell: ({row}) => {
            const club = row.original

            return (
                <div className="flex flex-col min-w-50 pl-2 sm:pl-4">
                    <ClubQuickView club={club}>
                        <button className="font-semibold cursor-pointer hover:underline text-primary text-left">
                          {club.name}
                        </button>
                    </ClubQuickView>
                    <span className="text-xs text-muted-foreground mt-0.5">
                        {club.slug}
                    </span>
                </div>
            )
        },
    },

    {
        accessorKey: "address",
        header: "Location",
        cell: ({row}) => {
            const {city, district, externalLocationId} = row.original.address

            const handleCopy = (e: React.MouseEvent) => {
                e.stopPropagation();
                if (externalLocationId) {
                    navigator.clipboard.writeText(externalLocationId);
                    toast.success("Copied external ID to clipboard!");
                }
            }

            return (
                city && externalLocationId ? (
                    <TooltipProvider delayDuration={200}>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <div 
                                    onClick={handleCopy}
                                    className="flex items-center gap-2 text-sm text-muted-foreground w-max cursor-pointer hover:text-foreground transition-colors"
                                >
                                    <MapPin className="h-3.5 w-3.5 shrink-0"/>
                                    <span>{city}, {district}</span>
                                </div>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Click to copy external ID</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                ) : (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground w-max">
                        <MapPin className="h-3.5 w-3.5 shrink-0"/>
                        <span>{city ? `${city}, ${district}` : "Location pending"}</span>
                    </div>
                )
            )
        },
    },

    {
        accessorKey: "active",
        header: "Status",
        cell: ({row}) => {
            const isActive = row.original.active

            return (
                <Badge
                    variant={isActive ? "default" : "secondary"}
                    className="w-24 justify-center gap-1.5"
                >
                    {isActive ? (
                        <><CheckCircle2 className="h-3 w-3"/> Active</>
                    ) : (
                        <><XCircle className="h-3 w-3"/> Inactive</>
                    )}
                </Badge>
            )
        },
    },

    {
        accessorKey: "scoreMultiplier",
        header: () => <div className="text-right">Multiplier</div>,
        cell: ({row}) => {
            const multiplier = row.original.scoreMultiplier

            return (
                <div className="text-right font-medium tabular-nums">
                    x{multiplier.toFixed(2)}
                </div>
            )
        },
    },

    {
        id: "actions",
        cell: ({row}) => {
            return <ClubActionsCell club={row.original} />
        },
    },
]