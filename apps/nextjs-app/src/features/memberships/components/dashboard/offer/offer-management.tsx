"use client"

import {useState, useEffect, useRef} from "react"
import { OfferSearchUrlSchema } from "@/features/memberships/schemas"
import { useUrlFilters } from "@/features/common/hooks/useUrlFilters"
// import { searchOffersAction } from "@/features/memberships/actions/membership.action"
// import { useServerAction } from "@/hooks/useServerAction"
import { OfferAdminResponse } from "@/lib/api/schema"
import {OfferToolbar} from "@/features/memberships/components/dashboard/offer/offer-toolbar"
import {offerColumns} from "@/features/memberships/components/dashboard/offer/offer-table-columns"
// import {PaginationControl} from "@/components/layout/dashboard/pagination-control"
import {GenericDataTable} from "@/components/layout/dashboard/generic-data-table"

type OfferManagementProps = {
    initialData: OfferAdminResponse[]
}

export function OfferManagement({ initialData }: OfferManagementProps) {
    const [tableData, setTableData] = useState<OfferAdminResponse[]>(initialData);
    const isFirstRender = useRef(true);

    const { filters, updateFilters, clearFilters, hasAnyFilter } = useUrlFilters({
        schema: OfferSearchUrlSchema,
    });

    // Update tableData if initialData changes (e.g. from server component re-fetching)
    useEffect(() => {
        setTableData(initialData);
    }, [initialData]);

    const isPending = false;

    // Filter tableData locally based on search if needed, or rely on server action.
    // Assuming server search via URL params works, initialData is already filtered.

    return (
        <div className="space-y-4">
            <OfferToolbar
                filters={filters}
                updateFiltersAction={updateFilters}
                clearFiltersAction={clearFilters}
                hasActiveFilters={hasAnyFilter}
                />

            <div className={isPending ? "opacity-60 pointer-events-none transition-opacity" : "transition-opacity"}>
                <GenericDataTable
                    columns={offerColumns}
                    data={tableData}
                />
            </div>
        </div>
    )
}
