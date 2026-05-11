"use server";

import {NextPageSearchParams} from "@/features/common/types/search-params"
import {parseSearchParams} from "@/lib/search-params-utils"
import {OfferSearchUrlSchema} from "@/features/memberships/schemas";
import {OfferManagement} from "@/features/memberships/components/dashboard/offer/offer-management";
import {getServerApi} from "@/lib/api/server";
import {OfferAdminResponse} from "@/lib/api/schema";

type PageProps = {
    searchParams: Promise<NextPageSearchParams>;
};

export default async function OfferManagementPage({searchParams}: PageProps) {
    const filters = await parseSearchParams(searchParams, OfferSearchUrlSchema);
    const api = getServerApi();
    let initialData: OfferAdminResponse[] = [];
    try {
        initialData = await api.get('api/management/offers', {params: filters});
    } catch (e) {
        console.error("Failed to fetch offers", e);
    }

    return (
        <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
                <OfferManagement
                    initialData={initialData}
                />
            </div>
        </div>
    )
}