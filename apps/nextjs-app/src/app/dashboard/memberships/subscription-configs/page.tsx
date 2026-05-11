"use server";

import {ConfigManagement} from "@/features/memberships/components/dashboard/config/config-management";
import {getServerApi} from "@/lib/api/server";
import {PlanSubscriptionConfigResponse, MembershipPlanResponse} from "@/lib/api/schema";

export default async function ConfigManagementPage() {
    const api = getServerApi();
    
    let plans: MembershipPlanResponse[] = [];
    let configsByPlan: Record<number, PlanSubscriptionConfigResponse[]> = {};

    try {
        // Fetch all plans
        plans = await api.get('api/management/plans');
        
        // Fetch configs for each plan
        // In a real scenario, it would be much better to have a single endpoint to fetch all configs
        // grouped by plan, or fetch configs and group them frontend.
        // Given current endpoints, we must loop to get configs for each plan.
        
        const configPromises = plans.map(plan => 
            api.get('api/management/plans/:planId/subscription-configs', {
                pathParams: { planId: String(plan.id) }
            }).then(configs => ({ planId: plan.id, configs }))
              .catch(() => ({ planId: plan.id, configs: [] }))
        );

        const results = await Promise.all(configPromises);
        
        results.forEach(res => {
            configsByPlan[res.planId] = res.configs;
        });

    } catch (e) {
        console.error("Failed to fetch data for configs page", e);
    }

    return (
        <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
                <ConfigManagement
                    plans={plans}
                    configsByPlan={configsByPlan}
                />
            </div>
        </div>
    )
}