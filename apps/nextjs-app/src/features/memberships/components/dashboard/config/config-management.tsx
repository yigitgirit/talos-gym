"use client"

import {useState, useEffect} from "react"
import { PlanSubscriptionConfigResponse, MembershipPlanResponse } from "@/lib/api/schema"
import {GenericDataTable} from "@/components/layout/dashboard/generic-data-table"
import {configColumns} from "@/features/memberships/components/dashboard/config/config-table-columns"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { CreateConfigForm } from "@/features/memberships/components/dashboard/config/create-config-form"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle2, XCircle } from "lucide-react"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

type ConfigManagementProps = {
    plans: MembershipPlanResponse[];
    configsByPlan: Record<number, PlanSubscriptionConfigResponse[]>;
}

export function ConfigManagement({ plans, configsByPlan }: ConfigManagementProps) {
    const [showCreateDialog, setShowCreateDialog] = useState(false)
    const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null)
    const [activeTab, setActiveTab] = useState<string>(plans[0]?.id.toString() || "")

    useEffect(() => {
        if (plans.length > 0 && !plans.find(p => p.id.toString() === activeTab)) {
            setActiveTab(plans[0].id.toString());
        }
    }, [plans]);

    const handleCreateClick = (planId: number) => {
        setSelectedPlanId(planId.toString())
        setShowCreateDialog(true)
    }

    if (!plans || plans.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center border rounded-lg bg-card/50">
                <p className="text-muted-foreground mb-4">No membership plans found.</p>
                <p className="text-sm text-muted-foreground">Create a plan first to add configurations.</p>
            </div>
        )
    }

    return (
        <div className="space-y-6 flex flex-col min-h-0">
            <Tabs value={activeTab} onValueChange={setActiveTab} orientation="vertical" className="w-full flex flex-col md:flex-row gap-4 md:gap-8 flex-1 min-h-0">
                {/* Plan Navigator / Sidebar */}
                <div className="w-full md:w-72 shrink-0 flex flex-col max-h-[60vh] md:max-h-[calc(100vh-140px)]">
                    <ScrollArea className="w-full h-full whitespace-nowrap md:whitespace-normal pr-0 md:pr-4">
                        <TabsList className="flex flex-row md:flex-col h-auto w-max md:w-full items-stretch bg-transparent p-0 gap-2 md:gap-3 border-0">
                            {plans.map((plan) => (
                                <TabsTrigger
                                    key={plan.id}
                                    value={plan.id.toString()}
                                    className={cn(
                                        "justify-start px-4 py-3 md:py-4 rounded-xl min-w-[160px] md:min-w-0 border transition-all text-left h-auto",
                                        "data-[state=active]:bg-card data-[state=active]:border-primary/20 data-[state=active]:shadow-sm",
                                        "data-[state=inactive]:bg-muted/30 data-[state=inactive]:border-transparent data-[state=inactive]:hover:bg-muted/50"
                                    )}
                                >
                                    <div className="flex flex-col items-start w-full gap-1.5 whitespace-normal">
                                        <div className="font-semibold text-sm md:text-base text-foreground leading-tight">{plan.name}</div>
                                        <div className="text-[11px] md:text-xs text-muted-foreground flex items-center gap-1.5 mt-1">
                                            {plan.isGlobal ? (
                                                <><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> Global Plan</>
                                            ) : (
                                                <><XCircle className="w-3.5 h-3.5 text-muted-foreground/50 shrink-0" /> Local Plan</>
                                            )}
                                        </div>
                                    </div>
                                </TabsTrigger>
                            ))}
                        </TabsList>
                        <ScrollBar orientation="horizontal" className="md:hidden" />
                    </ScrollArea>
                </div>

                {/* Configurations Data Table */}
                <div className="flex-1 min-w-0 flex flex-col h-auto">
                    {plans.map((plan) => {
                        const configs = configsByPlan[plan.id] || []
                        
                        return (
                            <TabsContent key={plan.id} value={plan.id.toString()} className="mt-0 border-0 p-0 focus-visible:outline-none flex-1 flex flex-col min-h-0">
                                <Card className="flex flex-col flex-1 min-h-0">
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b shrink-0">
                                        <div className="space-y-1">
                                            <CardTitle className="text-lg md:text-xl">{plan.name} Configurations</CardTitle>
                                            <CardDescription>
                                                {configs.length} active configuration{configs.length !== 1 && 's'}
                                            </CardDescription>
                                        </div>
                                        <Button size="sm" onClick={() => handleCreateClick(plan.id)}>
                                            <Plus className="w-4 h-4 mr-2 hidden sm:block" />
                                            <Plus className="w-4 h-4 sm:hidden" />
                                            <span className="hidden sm:inline">Add Config</span>
                                        </Button>
                                    </CardHeader>
                                    <CardContent className="p-0 flex-1 overflow-auto">
                                        {configs.length > 0 ? (
                                            <div className="p-4 md:p-6">
                                                <div className="overflow-x-auto">
                                                    <GenericDataTable
                                                        columns={configColumns}
                                                        data={configs}
                                                    />
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="p-6 h-full flex items-center justify-center">
                                                <div className="w-full max-w-md py-12 flex flex-col items-center justify-center text-center text-muted-foreground bg-muted/20 rounded-md border border-dashed">
                                                    <p className="mb-4">No subscription configurations found for this plan.</p>
                                                    <Button variant="outline" size="sm" onClick={() => handleCreateClick(plan.id)}>
                                                        Create the first one
                                                    </Button>
                                                </div>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        )
                    })}
                </div>
            </Tabs>

            {/* Create Config Dialog */}
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Create Config</DialogTitle>
                        <DialogDescription>Add a new subscription config.</DialogDescription>
                    </DialogHeader>
                    {selectedPlanId ? (
                        <CreateConfigForm planId={selectedPlanId} setOpen={setShowCreateDialog} />
                    ) : null}
                </DialogContent>
            </Dialog>
        </div>
    )
}
