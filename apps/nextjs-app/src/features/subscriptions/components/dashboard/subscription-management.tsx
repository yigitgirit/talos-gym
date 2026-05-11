"use client"

import {useEffect, useRef, useState} from "react"
import {SubscriptionSearchUrlSchema} from "@/features/subscriptions"
import {useUrlFilters} from "@/features/common/hooks/useUrlFilters"
import {getAllSubscriptionsAction} from "@/features/subscriptions/actions/subscription.action"
import {useServerAction} from "@/hooks/useServerAction"
import {PagedSubscriptionResponse} from "@/lib/api/schema"
import {SubscriptionsToolbar} from "@/features/subscriptions/components/dashboard/subscriptions-toolbar";
import {subscriptionColumns} from "@/features/subscriptions/components/dashboard/subscriptions-table-columns";
import {PaginationControl} from "@/components/layout/dashboard/pagination-control";
import {GenericDataTable} from "@/components/layout/dashboard/generic-data-table";

type SubscriptionManagementProps = {
    initialData: PagedSubscriptionResponse
}

export function SubscriptionManagement({initialData}: SubscriptionManagementProps) {
    const [tableData, setTableData] = useState<PagedSubscriptionResponse>(initialData);
    const isFirstRender = useRef(true);

    const {filters, updateFilters, clearFilters, hasAnyFilter} = useUrlFilters({
        schema: SubscriptionSearchUrlSchema,
    });

    const {execute, isPending} = useServerAction(getAllSubscriptionsAction, {
        onSuccess: (data) => {
            if (data) setTableData(data);
        }
    });

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        const apiFilters = {
            ...filters,
            status: filters.status === "all" ? undefined : filters.status,
        };

        execute(apiFilters);
    }, [filters, execute]);

    return (
        <div className="space-y-4">
            <SubscriptionsToolbar
                filters={filters}
                updateFiltersAction={updateFilters}
                clearFiltersAction={clearFilters}
                hasActiveFilters={hasAnyFilter}
            />

            <div className={isPending ? "opacity-60 pointer-events-none transition-opacity" : "transition-opacity"}>
                <GenericDataTable
                    columns={subscriptionColumns}
                    data={tableData.items}
                />
            </div>

            <PaginationControl
                page={filters.page || 1}
                totalPages={tableData.metadata.totalPages}
                totalElements={tableData.metadata.totalItems}
                onPageChange={(newPage) => updateFilters({page: newPage}, false)}
                isLoading={isPending}
            />
        </div>
    )
}