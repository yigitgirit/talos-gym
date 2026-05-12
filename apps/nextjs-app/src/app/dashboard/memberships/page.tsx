"use server";

import {MembershipManagement} from "@/features/memberships/components/dashboard/plan/membership-management";
import {getServerApi} from "@/lib/api/server";

export default async function MembershipManagementPage() {
    const api = getServerApi();

    const [plansResponse, featuresResponse] = await Promise.all([
        api.get('api/management/plans', {
            next: { tags: ['membership-plans'] }
        }),
        api.get('api/management/features')
    ]);

    return (
        <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
                <MembershipManagement
                    initialData={plansResponse || []}
                    allAvailableFeatures={featuresResponse || []}
                />
            </div>
        </div>
    );
}