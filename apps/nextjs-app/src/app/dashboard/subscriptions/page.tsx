"use server";

import {NextPageSearchParams} from "@/features/common/types/search-params"
import {parseSearchParams} from "@/lib/search-params-utils"
import {SubscriptionSearchUrlSchema} from "@/features/subscriptions";
import {SubscriptionManagement} from "@/features/subscriptions/components/dashboard/subscription-management";
import {getServerApi} from "@/lib/api/server";

type PageProps = {
    searchParams: Promise<NextPageSearchParams>;
};

export default async function SubscriptionsPage({searchParams}: PageProps) {
    const filters = await parseSearchParams(searchParams, SubscriptionSearchUrlSchema);
    const initialData = await getServerApi().get('api/management/subscriptions', {params: filters});

    return (
        <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
                <SubscriptionManagement
                    initialData={initialData}
                />
            </div>
        </div>
    )
}