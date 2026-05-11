"use client"

import { Button } from "@/components/ui/button"
import { Search, Plus, X } from "lucide-react"
import { OfferSearchUrl } from "@/features/memberships/schemas"
import { ToolbarLayout } from "@/components/layout/dashboard/toolbar-layout"
import {useBufferedInput} from "@/hooks/use-buffered-input";
import {InputGroup, InputGroupAddon, InputGroupInput} from "@/components/ui/input-group"
import { useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { CreateOfferForm } from "@/features/memberships/components/dashboard/offer/create-offer-form"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";

type OfferToolbarProps = {
    filters: OfferSearchUrl;
    updateFiltersAction: (updates: Partial<OfferSearchUrl>, resetPage?: boolean) => void;
    clearFiltersAction: () => void;
    hasActiveFilters: boolean;
}

export function OfferToolbar({ filters, updateFiltersAction, clearFiltersAction, hasActiveFilters }: OfferToolbarProps) {
    const [showCreateDialog, setShowCreateDialog] = useState(false)

    const searchProps = useBufferedInput({
        value: filters.search ?? "",
        onChange: (val) => updateFiltersAction({ search: val ? String(val) : undefined }),
    });

    const clubIdProps = useBufferedInput({
        value: filters.clubId ? String(filters.clubId) : "",
        onChange: (val) => updateFiltersAction({ clubId: val ? parseInt(String(val), 10) : undefined }),
    });

    return (
        <>
            <ToolbarLayout
                filters={
                    <>
                        {/* Club ID Filter Input */}
                        <InputGroup className="w-full sm:w-[150px]">
                            <InputGroupInput
                                {...clubIdProps}
                                type="number"
                                placeholder="Club ID..."
                                className="h-9 text-sm bg-background"
                            />
                        </InputGroup>

                        {/* Global Status Dropdown */}
                        <div className="w-full sm:w-[150px]">
                            <Select
                                value={filters.global !== undefined ? String(filters.global) : "all"}
                                onValueChange={(value) => {
                                    if (value === "all") updateFiltersAction({ global: undefined })
                                    else updateFiltersAction({ global: value === "true" })
                                }}
                            >
                                <SelectTrigger className="h-9 text-sm bg-background">
                                    <SelectValue placeholder="Scope" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All</SelectItem>
                                    <SelectItem value="true">Global</SelectItem>
                                    <SelectItem value="false">Club-Specific</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Clear All Button */}
                        {hasActiveFilters && (
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-9 px-2 text-xs text-muted-foreground hover:text-foreground"
                                onClick={clearFiltersAction}
                            >
                                Clear all
                                <X className="ml-2 h-3 w-3" />
                            </Button>
                        )}
                    </>
                }
                actions={
                    <Button className="h-9" onClick={() => setShowCreateDialog(true)}>
                        <Plus className="mr-2 h-4 w-4" /> Create Offer
                    </Button>
                }
            />

            {/* Create Offer Dialog */}
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Create Offer</DialogTitle>
                        <DialogDescription>Add a new offer here.</DialogDescription>
                    </DialogHeader>
                    <CreateOfferForm />
                </DialogContent>
            </Dialog>
        </>
    )
}
