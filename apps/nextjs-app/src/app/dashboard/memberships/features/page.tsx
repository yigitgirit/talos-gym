"use server";

import {getServerApi} from "@/lib/api/server";
import {FeatureManagement} from "@/features/memberships/components/dashboard/feature/feature-management";

export default async function FeatureManagementPage() {
    const initialData = await getServerApi().get('api/management/features')

    return (
        <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
                <FeatureManagement
                    initialData={initialData}
                />
            </div>
        </div>
    );
}