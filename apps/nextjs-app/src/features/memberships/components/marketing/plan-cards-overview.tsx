"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, ChevronRight } from "lucide-react";
import { MembershipPlanResponse } from "@/lib/api/schema";

interface PlanCardsOverviewProps {
  plans: MembershipPlanResponse[];
}

export function PlanCardsOverview({ plans }: PlanCardsOverviewProps) {
  if (plans.length === 0) {
    return null;
  }

  // Get the most featured plan to highlight it
  const highlightedPlan = plans.reduce((a, b) =>
    a.features.length > b.features.length ? a : b
  );

  // Sort plans by feature count
  const sortedPlans = [...plans].sort(
    (a, b) => a.features.length - b.features.length
  );

  return (
    <section className="w-full py-8 sm:py-12 md:py-16">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {sortedPlans.map((plan) => {
            const isHighlighted = highlightedPlan?.id === plan.id;
            return (
              <Card
                key={plan.id}
                className={`relative overflow-hidden transition-all border ${
                  isHighlighted ? "border-primary shadow-lg" : ""
                }`}
              >
                {isHighlighted && (
                  <div className="absolute top-0 left-0 right-0 bg-primary text-primary-foreground py-1.5 sm:py-2 text-center text-xs sm:text-sm font-semibold">
                    Most Complete
                  </div>
                )}

                <CardHeader className={isHighlighted ? "mt-10 sm:mt-12" : ""}>
                  <CardTitle className="text-xl sm:text-2xl line-clamp-2">
                    {plan.name}
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      {plan.features.length} features included
                    </p>
                  </div>

                  {/* Key Features Preview */}
                  <ul className="space-y-2">
                    {plan.features.slice(0, 3).map((feature) => (
                      <li
                        key={feature.id}
                        className="flex gap-2 items-start text-xs sm:text-sm"
                      >
                        <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{feature.name}</span>
                      </li>
                    ))}
                    {plan.features.length > 3 && (
                      <li className="text-xs text-muted-foreground">
                        +{plan.features.length - 3} more features
                      </li>
                    )}
                  </ul>

                  {/* CTA Button */}
                  <Button
                    className="w-full gap-2 mt-4"
                    variant={isHighlighted ? "default" : "outline"}
                    size="sm"
                  >
                    <span className="text-xs sm:text-sm">Choose {plan.name}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}

