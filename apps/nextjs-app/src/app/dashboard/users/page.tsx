"use server";

import {NextPageSearchParams} from "@/features/common/types/search-params"
import {parseSearchParams} from "@/lib/search-params-utils"
import {getServerApi} from "@/lib/api/server";
import {UserManagement} from "@/features/users/components/dashboard/user-management";
import {UserSearchUrlSchema} from "@/features/users";

type PageProps = {
    searchParams: Promise<NextPageSearchParams>;
};

export default async function UserManagementPage({searchParams}: PageProps) {
    const filters = await parseSearchParams(searchParams, UserSearchUrlSchema);
    const initialData = await getServerApi().get('api/management/users', {params: filters});

    return (
        <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
                <UserManagement
                    initialData={initialData}
                />
            </div>
        </div>
    )
}