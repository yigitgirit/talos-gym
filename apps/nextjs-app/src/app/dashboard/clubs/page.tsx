"use server";

import {NextPageSearchParams} from "@/features/common/types/search-params"
import {parseSearchParams} from "@/lib/search-params-utils"
import {ClubSearchUrlSchema} from "@/features/clubs";
import {ClubManagement} from "@/features/clubs/components/dashboard/club-management";
import {getServerApi} from "@/lib/api/server";

type PageProps = {
    searchParams: Promise<NextPageSearchParams>;
};

export default async function ClubManagementPage({searchParams}: PageProps) {
    const filters = await parseSearchParams(searchParams, ClubSearchUrlSchema);
    const initialData = await getServerApi().get('api/clubs', {params: filters});

    return (
        <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
                <ClubManagement
                    initialData={initialData}
                />
            </div>
        </div>
    )
}