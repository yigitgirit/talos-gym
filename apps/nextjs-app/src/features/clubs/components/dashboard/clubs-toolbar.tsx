"use client"

import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X, Plus, Search, MapPin, Map } from "lucide-react"
import Link from "next/link"
import { ClubSearchUrl } from "@/features/clubs"
import { ToolbarLayout } from "@/components/layout/dashboard/toolbar-layout"
import {useBufferedInput} from "@/hooks/use-buffered-input";
import {InputGroup, InputGroupAddon, InputGroupInput} from "@/components/ui/input-group"

type ClubsToolbarProps = {
    filters: ClubSearchUrl;
    updateFiltersAction: (updates: Partial<ClubSearchUrl>, resetPage?: boolean) => void;
    clearFiltersAction: () => void;
    hasActiveFilters: boolean;
}

export function ClubsToolbar({ filters, updateFiltersAction, clearFiltersAction, hasActiveFilters }: ClubsToolbarProps) {
    const searchProps = useBufferedInput({
        value: filters.search ?? "",
        onChange: (val) => updateFiltersAction({ search: val ? String(val) : undefined }),
    });

    const cityProps = useBufferedInput({
        value: filters.city ?? "",
        onChange: (val) => updateFiltersAction({ city: val ? String(val) : undefined }),
    });

    const districtProps = useBufferedInput({
        value: filters.district ?? "",
        onChange: (val) => updateFiltersAction({ district: val ? String(val) : undefined }),
    });

    return (
        <ToolbarLayout
            filters={
                <>
                    {/* Search Club Name Input */}
                    <InputGroup className="w-full sm:w-[250px]">
                        <InputGroupAddon align="inline-start">
                            <Search className="h-4 w-4 text-muted-foreground" />
                        </InputGroupAddon>
                        <InputGroupInput
                            {...searchProps}
                            placeholder="Search clubs..."
                            className="h-9 text-sm bg-background"
                        />
                    </InputGroup>

                    {/* City Input */}
                    <InputGroup className="w-full sm:w-[150px]">
                        <InputGroupAddon align="inline-start">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                        </InputGroupAddon>
                        <InputGroupInput
                            {...cityProps}
                            placeholder="City"
                            className="h-9 text-sm bg-background"
                        />
                    </InputGroup>

                    {/* District Input */}
                    <InputGroup className="w-full sm:w-[150px]">
                        <InputGroupAddon align="inline-start">
                            <Map className="h-4 w-4 text-muted-foreground" />
                        </InputGroupAddon>
                        <InputGroupInput
                            {...districtProps}
                            placeholder="District"
                            className="h-9 text-sm bg-background"
                        />
                    </InputGroup>

                    {/* Active Status Dropdown (No buffering needed) */}
                    <div className="w-full sm:w-[150px]">
                        <Select
                            value={filters.active !== undefined ? String(filters.active) : "all"}
                            onValueChange={(value) => {
                                if (value === "all") updateFiltersAction({ active: undefined })
                                else updateFiltersAction({ active: value === "true" })
                            }}
                        >
                            <SelectTrigger className="h-9 text-sm bg-background">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Statuses</SelectItem>
                                <SelectItem value="true">Active</SelectItem>
                                <SelectItem value="false">Inactive</SelectItem>
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
                <Button className="h-9" asChild>
                    <Link href="/dashboard/clubs/create">
                        <Plus className="mr-2 h-4 w-4" /> Create Club
                    </Link>
                </Button>
            }
        />
    )
}