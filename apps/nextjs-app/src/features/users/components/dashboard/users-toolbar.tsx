"use client"

import {Button} from "@/components/ui/button"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {Plus, Search, X} from "lucide-react"
import Link from "next/link"
import {ToolbarLayout} from "@/components/layout/dashboard/toolbar-layout"
import {useBufferedInput} from "@/hooks/use-buffered-input"
import {InputGroup, InputGroupAddon, InputGroupInput} from "@/components/ui/input-group"
import {type UserSearchUrl} from "@/features/users"

type UsersToolbarProps = {
    filters: UserSearchUrl;
    updateFiltersAction: (updates: Partial<UserSearchUrl>, resetPage?: boolean) => void;
    clearFiltersAction: () => void;
    hasActiveFilters: boolean;
}

export function UsersToolbar({filters, updateFiltersAction, clearFiltersAction, hasActiveFilters}: UsersToolbarProps) {
    const searchProps = useBufferedInput({
        value: filters.search ?? "",
        onChange: (val) => updateFiltersAction({search: val ? String(val) : undefined}),
    });

    return (
        <ToolbarLayout
            filters={
                <>
                    {/* Search User (Name/Email) Input */}
                    <InputGroup className="w-full sm:w-62.5">
                        <InputGroupAddon align="inline-start">
                            <Search className="h-4 w-4 text-muted-foreground"/>
                        </InputGroupAddon>
                        <InputGroupInput
                            {...searchProps}
                            placeholder="Search users..."
                            className="h-9 text-sm"
                        />
                    </InputGroup>

                    {/* User Status Dropdown */}
                    <div className="w-full sm:w-37.5">
                        <Select
                            value={filters.status ?? "all"}
                            onValueChange={(value) => {
                                if (value === "all") updateFiltersAction({status: undefined})
                                else updateFiltersAction({status: value}) // Assuming status is mapped as a string in UserSearchUrl
                            }}
                        >
                            <SelectTrigger className="h-9 text-sm bg-background">
                                <SelectValue placeholder="Status"/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Statuses</SelectItem>
                                <SelectItem value="ACTIVE">Active</SelectItem>
                                <SelectItem value="INACTIVE">Inactive</SelectItem>
                                <SelectItem value="PENDING">Pending</SelectItem>
                                <SelectItem value="BANNED">Banned</SelectItem>
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
                            <X className="ml-2 h-3 w-3"/>
                        </Button>
                    )}
                </>
            }
            actions={null}
        />
    )
}