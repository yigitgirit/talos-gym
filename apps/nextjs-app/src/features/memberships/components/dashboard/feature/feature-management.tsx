"use client";

import React from "react";
import { FeatureResponse } from "@/lib/api/schema";
import { GenericDataTable } from "@/components/layout/dashboard/generic-data-table";
import { featureColumns } from "./feature-table-columns";
import { FeatureToolbar } from "./feature-toolbar";

type FeatureManagementProps = {
    initialData: FeatureResponse[];
};

export function FeatureManagement({ initialData }: FeatureManagementProps) {
    return (
        <div className="space-y-4">
            <div className="flex justify-end">
                <FeatureToolbar />
            </div>

            <GenericDataTable
                columns={featureColumns}
                data={initialData}
            />
        </div>
    );
}