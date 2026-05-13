"use client";

import React from "react";
import { Check, Minus } from "lucide-react";
import { MembershipPlanResponse, FeatureResponse } from "@/lib/api/schema";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type PlanFeatureMatrixPublicProps = {
  plans: MembershipPlanResponse[];
  features: FeatureResponse[];
};

export function PlanFeatureMatrixPublic({
  plans,
  features,
}: PlanFeatureMatrixPublicProps) {
  if (plans.length === 0 || features.length === 0) {
    return (
      <div className="flex items-center justify-center py-12 text-muted-foreground">
        No data available to display the matrix.
      </div>
    );
  }

  // Filter features that are related to at least one plan
  const relatedFeatures = features
    .filter((feature) =>
      plans.some((plan) => plan.features.some((f) => f.id === feature.id))
    )
    .sort((a, b) => {
      // Count how many plans have each feature
      const aCount = plans.filter((plan) =>
        plan.features.some((f) => f.id === a.id)
      ).length;
      const bCount = plans.filter((plan) =>
        plan.features.some((f) => f.id === b.id)
      ).length;
      // Sort descending (features in all plans come first)
      return bCount - aCount;
    });

  // Sort plans: by number of features (more features on the right side)
  const orderedPlans = [...plans].sort((a, b) => {
    return a.features.length - b.features.length;
  });

  return (
    <TooltipProvider>
      <div className="overflow-x-auto rounded-lg border custom-scrollbar">
        <table className="w-full text-xs sm:text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="sticky left-0 z-10 min-w-[140px] sm:min-w-[180px] lg:min-w-[200px] border-r bg-muted/95 px-3 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4 text-left font-semibold backdrop-blur whitespace-nowrap">
                <span className="text-xs sm:text-sm">Features</span>
              </th>
              {orderedPlans.map((plan) => (
                <th
                  key={plan.id}
                  className="min-w-[60px] sm:min-w-[100px] lg:min-w-[140px] px-1.5 sm:px-3 lg:px-4 py-2 sm:py-3 lg:py-4 text-center font-semibold"
                >
                  <span className="text-xs sm:text-base lg:text-md font-bold line-clamp-2">
                    {plan.name}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* Global Feature Row */}
            {orderedPlans.some((p) => p.isGlobal) && (
              <tr className={cn(
                "border-b transition-colors hover:bg-muted/50",
                0 % 2 === 0 ? "bg-background" : "bg-muted/20"
              )}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <td className="sticky left-0 z-10 border-r bg-background/95 px-3 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4 font-medium backdrop-blur cursor-pointer hover:text-primary transition-colors">
                      <span className="block text-xs sm:text-sm lg:text-base font-semibold line-clamp-2">
                        Access to All TalosGym Clubs
                      </span>
                    </td>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="max-w-xs text-xs sm:text-sm">
                    This plan provides access to all TalosGym gym clubs
                  </TooltipContent>
                </Tooltip>
                {orderedPlans.map((plan) => (
                  <td key={`global-${plan.id}`} className="px-1.5 sm:px-3 lg:px-4 py-2 sm:py-3 lg:py-4 text-center">
                    <div
                      className="inline-flex items-center justify-center p-1 sm:p-2"
                      aria-label={`Available at all clubs for ${plan.name}`}
                    >
                      {plan.isGlobal ? (
                        <Check className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600" />
                      ) : (
                        <Minus className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground/30" />
                      )}
                    </div>
                  </td>
                ))}
              </tr>
            )}

            {/* Feature Rows */}
            {relatedFeatures.map((feature, rowIdx) => (
              <tr
                key={feature.id}
                className={cn(
                  "border-b transition-colors hover:bg-muted/50",
                  rowIdx % 2 === 0 ? "bg-background" : "bg-muted/20"
                )}
              >
                <Tooltip>
                  <TooltipTrigger asChild>
                    <td className="sticky left-0 z-10 border-r bg-background/95 px-3 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4 font-medium backdrop-blur cursor-pointer hover:text-primary transition-colors">
                      <span className="block font-heading text-xs sm:text-sm lg:text-base font-semibold line-clamp-2">
                        {feature.name}
                      </span>
                    </td>
                  </TooltipTrigger>
                  {feature.description && (
                    <TooltipContent side="right" className="max-w-xs text-xs sm:text-sm">
                      {feature.description}
                    </TooltipContent>
                  )}
                </Tooltip>
                {orderedPlans.map((plan) => {
                  const hasFeature = plan.features.some(
                    (f) => f.id === feature.id
                  );

                  return (
                    <td
                      key={`${plan.id}-${feature.id}`}
                      className="px-1.5 sm:px-3 lg:px-4 py-2 sm:py-3 lg:py-4 text-center"
                    >
                      <div
                        className="inline-flex items-center justify-center p-1 sm:p-2"
                        aria-label={
                          hasFeature
                            ? `${feature.name} is included in ${plan.name}`
                            : `${feature.name} is not included in ${plan.name}`
                        }
                      >
                        {hasFeature ? (
                          <Check className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600" />
                        ) : (
                          <Minus className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground/30" />
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
    </TooltipProvider>
  );
}

