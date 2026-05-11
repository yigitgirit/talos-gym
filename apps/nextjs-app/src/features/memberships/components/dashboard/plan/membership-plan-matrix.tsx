"use client";

import React from "react";
import { Check, Minus } from "lucide-react";
import { MembershipPlanResponse, FeatureResponse } from "@/lib/api/schema";
import { cn } from "@/lib/utils";

type PlanFeatureMatrixProps = {
    plans: MembershipPlanResponse[];
    features: FeatureResponse[];
};

export function PlanFeatureMatrix({ plans, features }: PlanFeatureMatrixProps) {
    /* ------------------------------------------------------------------ */
    /* Render                                                               */
    /* ------------------------------------------------------------------ */

    if (plans.length === 0 || features.length === 0) {
        return (
            <div className="flex items-center justify-center py-12 text-muted-foreground">
                No data available to display the matrix.
            </div>
        );
    }

    return (
        <div className="overflow-x-auto rounded-md border custom-scrollbar">
            <table className="w-full text-sm">
                <thead>
                <tr className="border-b bg-muted/50">
                    <th className="sticky left-0 z-10 min-w-[180px] border-r bg-muted/95 px-4 py-3 text-left font-semibold backdrop-blur">
                        Feature / Plan
                    </th>
                    {plans.map((plan) => (
                        <th
                            key={plan.id}
                            className="min-w-[120px] px-3 py-3 text-center font-semibold"
                        >
                            <div className="flex flex-col items-center gap-1">
                                <span className="truncate max-w-[140px]">{plan.name}</span>
                                {plan.isGlobal && (
                                    <span className="text-[10px] font-normal text-muted-foreground uppercase tracking-wide">
                                            Global
                                        </span>
                                )}
                            </div>
                        </th>
                    ))}
                </tr>
                </thead>
                <tbody>
                {features.map((feature, rowIdx) => (
                    <tr
                        key={feature.id}
                        className={cn(
                            "border-b transition-colors hover:bg-muted/50",
                            rowIdx % 2 === 0 ? "bg-background" : "bg-muted/20"
                        )}
                    >
                        <td className="sticky left-0 z-10 border-r bg-background/95 px-4 py-3 font-medium backdrop-blur">
                            <div className="flex flex-col">
                                <span>{feature.name}</span>
                                {feature.description && (
                                    <span className="text-xs text-muted-foreground line-clamp-1">
                                            {feature.description}
                                        </span>
                                )}
                            </div>
                        </td>
                        {plans.map((plan) => {
                            const hasFeature = plan.features.some((f) => f.id === feature.id);

                            return (
                                <td key={`${plan.id}-${feature.id}`} className="px-3 py-3 text-center">
                                    <div
                                        className="inline-flex items-center justify-center p-1.5"
                                        aria-label={
                                            hasFeature
                                                ? `${feature.name} is included in ${plan.name}`
                                                : `${feature.name} is not included in ${plan.name}`
                                        }
                                    >
                                        {hasFeature ? (
                                            <Check className="h-4 w-4 text-emerald-600" />
                                        ) : (
                                            <Minus className="h-4 w-4 text-muted-foreground/30" />
                                        )}
                                    </div>
                                </td>
                            );
                        })}
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}