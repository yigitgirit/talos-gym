"use client"

import {Button} from "@/components/ui/button"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {FileText, Search, User, X} from "lucide-react"
import {SubscriptionSearchUrl} from "@/features/subscriptions"
import {ToolbarLayout} from "@/components/layout/dashboard/toolbar-layout"
import {useBufferedInput} from "@/hooks/use-buffered-input";
import {InputGroup, InputGroupAddon, InputGroupInput} from "@/components/ui/input-group"

type SubscriptionsToolbarProps = {
    filters: SubscriptionSearchUrl;
    updateFiltersAction: (updates: Partial<SubscriptionSearchUrl>, resetPage?: boolean) => void;
    clearFiltersAction: () => void;
    hasActiveFilters: boolean;
}

export function SubscriptionsToolbar({
                                         filters,
                                         updateFiltersAction,
                                         clearFiltersAction,
                                         hasActiveFilters
                                     }: SubscriptionsToolbarProps) {
    const paymentRefProps = useBufferedInput({
        value: filters.paymentReference ?? "",
        onChange: (val) => updateFiltersAction({paymentReference: val ? String(val) : undefined}),
    });

    const planIdProps = useBufferedInput({
        value: filters.planId ? String(filters.planId) : "",
        onChange: (val) => {
            const num = Number(val);
            updateFiltersAction({planId: !isNaN(num) && num > 0 ? num : undefined});
        },
    });

    const userIdProps = useBufferedInput({
        value: filters.userId ? String(filters.userId) : "",
        onChange: (val) => {
            const num = Number(val);
            updateFiltersAction({userId: !isNaN(num) && num > 0 ? num : undefined});
        },
    });

    return (
        <ToolbarLayout
            filters={
                <>
                    {/* Payment Reference Input */}
                    <InputGroup className="w-full sm:w-[200px]">
                        <InputGroupAddon align="inline-start">
                            <Search className="h-4 w-4 text-muted-foreground"/>
                        </InputGroupAddon>
                        <InputGroupInput
                            {...paymentRefProps}
                            placeholder="Payment Reference"
                            className="h-9 text-sm"
                        />
                    </InputGroup>

                    {/* Plan ID Input */}
                    <InputGroup className="w-full sm:w-[150px]">
                        <InputGroupAddon align="inline-start">
                            <FileText className="h-4 w-4 text-muted-foreground"/>
                        </InputGroupAddon>
                        <InputGroupInput
                            {...planIdProps}
                            placeholder="Plan ID"
                            type="number"
                            className="h-9 text-sm"
                        />
                    </InputGroup>

                    {/* User ID Input */}
                    <InputGroup className="w-full sm:w-[150px]">
                        <InputGroupAddon align="inline-start">
                            <User className="h-4 w-4 text-muted-foreground"/>
                        </InputGroupAddon>
                        <InputGroupInput
                            {...userIdProps}
                            placeholder="User ID"
                            type="number"
                            className="h-9 text-sm"
                        />
                    </InputGroup>

                    {/* Status Dropdown */}
                    <div className="w-full sm:w-[150px]">
                        <Select
                            value={filters.status !== undefined ? String(filters.status) : "all"}
                            onValueChange={(value) => {
                                if (value === "all") updateFiltersAction({status: undefined})
                                else updateFiltersAction({status: value as any})
                            }}
                        >
                            <SelectTrigger className="h-9 text-sm bg-background">
                                <SelectValue placeholder="Status"/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Statuses</SelectItem>
                                <SelectItem value="ACTIVE">Active</SelectItem>
                                <SelectItem value="PENDING_PAYMENT">Pending</SelectItem>
                                <SelectItem value="EXPIRED">Expired</SelectItem>
                                <SelectItem value="CANCELED">Canceled</SelectItem>
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
            actions={
                <Button className="h-9">
                    Export
                </Button>
            }
        />
    )
}