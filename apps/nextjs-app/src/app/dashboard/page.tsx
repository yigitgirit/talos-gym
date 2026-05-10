import { ChartAreaInteractive } from "@/features/dashboard/components/chart-area-interactive"
import { SectionCards } from "@/features/dashboard/components/section-cards"
import { getServerApi } from "@/lib/api/server"

export default async function DashboardPage() {
    const api = getServerApi()
    
    let totalUsers = 0
    let totalClubs = 0

    try {
        const usersData = await api.get('api/management/users', { params: { size: 1 } })
        totalUsers = usersData?.metadata?.totalItems || 0
    } catch (e) {
        console.error("Failed to fetch users total", e)
    }

    try {
        const clubsData = await api.get('api/clubs', { params: { size: 1 } })
        totalClubs = clubsData?.metadata?.totalItems || 0
    } catch (e) {
        console.error("Failed to fetch clubs total", e)
    }

    // 3. Mock Data
    const mockTotalMemberships = 14250
    const mockTotalSubscriptions = 8430

    return (
        <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                <SectionCards 
                    totalUsers={totalUsers} 
                    totalClubs={totalClubs} 
                    totalMemberships={mockTotalMemberships}
                    totalSubscriptions={mockTotalSubscriptions}
                />
                
                <div className="px-4 lg:px-6">
                    <ChartAreaInteractive />
                </div>

                {/*<DataTable data={data} />*/}
            </div>
        </div>
    )
}
