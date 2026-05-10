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
                {/* If your UserManagement component doesn't already have horizontal padding (px-4),
                  you can wrap it in a div like the ChartAreaInteractive:
                  <div className="px-4 lg:px-6">
                */}
                <ClubManagement
                    initialData={initialData}
                />
            </div>
        </div>
    )
}


// export default function ClubsPage() {
//     const [isModalOpen, setIsModalOpen] = useState(false)
//
//     return (
//         <div className="flex flex-1 flex-col gap-6 p-4 lg:p-6">
//             <div className="flex items-center justify-between">
//                 <div>
//                     <h1 className="text-2xl font-bold">Clubs</h1>
//                     <p className="text-sm text-muted-foreground mt-1">
//                         Manage gym clubs and locations
//                     </p>
//                 </div>
//                 <Button onClick={() => setIsModalOpen(true)}>
//                     <PlusIcon className="mr-2 h-4 w-4" />
//                     Create Club
//                 </Button>
//             </div>
//
//             <CreateClubSheet open={isModalOpen} onOpenChange={setIsModalOpen} />
//         </div>
//     )
// }