"use client"

import {useState, useEffect, useRef} from "react"
import { ClubSearchUrlSchema } from "@/features/clubs"
import { useUrlFilters } from "@/features/common/hooks/useUrlFilters"
import { searchClubsAction } from "@/features/clubs/actions/club.actions"
import { useServerAction } from "@/hooks/useServerAction"
import { PagedClubResponse } from "@/lib/api/schema/club.schema"
import {ClubsToolbar} from "@/features/clubs/components/dashboard/clubs-toolbar";
import {clubColumns} from "@/features/clubs/components/dashboard/clubs-table-columns";
import {PaginationControl} from "@/components/layout/dashboard/pagination-control";
import {GenericDataTable} from "@/components/layout/dashboard/generic-data-table";

type ClubManagementProps = {
    initialData: PagedClubResponse
}

// Concerns with this component:
// - It has a state that stores the data, duplication?
// - where should pagination or sorting actually be?

// First, data is rendered server side and passed here
// then the app leave the fetching/filtering to client side, using server actions
//
// Every time this component renders it gets the new filters from search parameters
export function ClubManagement({ initialData }: ClubManagementProps) {
    // 1. Local state seeded by SSR
    const [tableData, setTableData] = useState<PagedClubResponse>(initialData);
    const isFirstRender = useRef(true);

    // 2. Initialize URL filter hook
    const { filters, updateFilters, clearFilters, hasAnyFilter } = useUrlFilters({
        schema: ClubSearchUrlSchema,
    });

    // 3. Server Action Hook
    const { execute, isPending } = useServerAction(searchClubsAction, {
        onSuccess: (data) => {
            if (data) setTableData(data);
        }
    });

    // 4. Trigger the action when URL filters change
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return; // Skip fetch on initial mount (SSR already gave us the data)
        }

        execute(filters);
    }, [filters, execute]);

    return (
        <div className="space-y-4">
            <ClubsToolbar
                filters={filters}
                updateFiltersAction={updateFilters}
                clearFiltersAction={clearFilters}
                hasActiveFilters={hasAnyFilter}
                />

            <div className={isPending ? "opacity-60 pointer-events-none transition-opacity" : "transition-opacity"}>
                <GenericDataTable
                    columns={clubColumns}
                    data={tableData.items}
                />
            </div>

                {/* Example Pagination Component */}
            <PaginationControl
                page={filters.page || 1}
                totalPages={tableData.metadata.totalPages}
                totalElements={tableData.metadata.totalItems}
                onPageChange={(newPage) => updateFilters({ page: newPage }, false)}
                isLoading={isPending}
            />
        </div>
    )
}