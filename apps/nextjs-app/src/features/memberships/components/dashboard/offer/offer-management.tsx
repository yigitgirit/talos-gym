"use client"

import {useState, useEffect, useRef} from "react"
import { OfferSearchUrlSchema } from "@/features/memberships/schemas"
import { useUrlFilters } from "@/features/common/hooks/useUrlFilters"
import { OfferAdminResponse } from "@/lib/api/schema"
import {OfferToolbar} from "@/features/memberships/components/dashboard/offer/offer-toolbar"
import {offerColumns} from "@/features/memberships/components/dashboard/offer/offer-table-columns"
import {GenericDataTable} from "@/components/layout/dashboard/generic-data-table"

type OfferManagementProps = {
    initialData: OfferAdminResponse[]
}

export function OfferManagement({ initialData }: OfferManagementProps) {
    const [tableData, setTableData] = useState<OfferAdminResponse[]>(initialData);

    const { filters, updateFilters, clearFilters, hasAnyFilter } = useUrlFilters({
        schema: OfferSearchUrlSchema,
    });

    useEffect(() => {
        setTableData(initialData);
    }, [initialData]);

    const isPending = false;

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
