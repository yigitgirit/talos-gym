"use client"

import {useEffect, useRef, useState} from "react"
import {useUrlFilters} from "@/features/common/hooks/useUrlFilters"
import {useServerAction} from "@/hooks/useServerAction"
import {PaginationControl} from "@/components/layout/dashboard/pagination-control";
import {GenericDataTable} from "@/components/layout/dashboard/generic-data-table";
import {getUsersAsync, UserSearchUrlSchema} from "@/features/users";
import {PagedUserResponse} from "@/lib/api/schema";
import {userColumns} from "@/features/users/components/dashboard/users-table-columns";
import {UsersToolbar} from "@/features/users/components/dashboard/users-toolbar";

type UserManagementProps = {
    initialData: PagedUserResponse
}

export function UserManagement({initialData}: UserManagementProps) {
    const [tableData, setTableData] = useState<PagedUserResponse>(initialData);
    const isFirstRender = useRef(true);

    const {filters, updateFilters, clearFilters, hasAnyFilter} = useUrlFilters({
        schema: UserSearchUrlSchema,
    });

    const {execute, isPending} = useServerAction(getUsersAsync, {
        onSuccess: (data) => {
            if (data) setTableData(data);
        }
    });

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        execute(filters);
    }, [filters, execute]);

    return (
        <div className="space-y-4">
            <UsersToolbar
                filters={filters}
                updateFiltersAction={updateFilters}
                clearFiltersAction={clearFilters}
                hasActiveFilters={hasAnyFilter}
            />

            <div className={isPending ? "opacity-60 pointer-events-none transition-opacity" : "transition-opacity"}>
                <GenericDataTable
                    columns={userColumns}
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