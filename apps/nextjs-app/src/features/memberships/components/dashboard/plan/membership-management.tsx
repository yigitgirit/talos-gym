"use client"

import React, { useMemo } from "react"
import { LayoutGrid, Table2 } from "lucide-react"

import { MembershipPlanResponse, FeatureResponse } from "@/lib/api/schema"
import { GenericDataTable } from "@/components/layout/dashboard/generic-data-table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { MembershipToolbar } from "@/features/memberships/components/dashboard/plan/membership-toolbar"
import { getPlanColumns } from "@/features/memberships/components/dashboard/plan/membership-table-columns"
import { PlanFeatureMatrix } from "@/features/memberships/components/dashboard/plan/membership-plan-matrix"

type MembershipManagementProps = {
    initialData: MembershipPlanResponse[]
    allAvailableFeatures: FeatureResponse[]
}

export function MembershipManagement({ initialData, allAvailableFeatures }: MembershipManagementProps) {

    const columns = useMemo(() => getPlanColumns(allAvailableFeatures), [allAvailableFeatures])

    const activeMatrixFeatures = useMemo(() => {
        const usedFeatures = initialData.flatMap(plan => plan.features)
        return Array.from(new Map(usedFeatures.map(f => [f.id, f])).values())
    }, [initialData])

    return (
        <div className="space-y-10 flex flex-col">

            {/* --- MEMBERSHIP PLANS SECTION --- */}
            <section className="space-y-4">
                <Tabs defaultValue="table" className="w-full">

                    {/* Header: Tabs on left, Toolbar on right */}
                    <div className="flex items-center justify-between gap-4">
                        <TabsList className="bg-muted/50 p-1 h-auto rounded-lg">
                            <TabsTrigger
                                value="table"
                                className="h-8 gap-1.5 px-3 text-sm"
                            >
                                <Table2 className="h-4 w-4" /> Table
                            </TabsTrigger>
                            <TabsTrigger
                                value="matrix"
                                className="h-8 gap-1.5 px-3 text-sm"
                            >
                                <LayoutGrid className="h-4 w-4" /> Matrix
                            </TabsTrigger>
                        </TabsList>

                        <MembershipToolbar features={allAvailableFeatures} />
                    </div>

                    {/* Content Views */}
                    <TabsContent value="table" className="mt-4 focus-visible:outline-none">
                        <GenericDataTable columns={columns} data={initialData} />
                    </TabsContent>

                    <TabsContent value="matrix" className="mt-4 focus-visible:outline-none">
                        <PlanFeatureMatrix plans={initialData} features={activeMatrixFeatures} />
                    </TabsContent>
                </Tabs>
            </section>
        </div>
    )
}