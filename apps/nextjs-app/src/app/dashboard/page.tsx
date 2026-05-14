import { ChartAreaInteractive } from "@/features/dashboard/components/chart-area-interactive"
import { SectionCards } from "@/features/dashboard/components/section-cards"
import { getServerApi } from "@/lib/api/server"

export default async function DashboardPage() {
    const api = getServerApi()
    
    let totalUsers = 0
    let totalClubs = 0
    let totalMemberships = 0
    let totalSubscriptions = 0

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

    try {
        const plansData = await api.get('api/management/plans')
        totalMemberships = plansData?.length || 0
    } catch (e) {
        console.error("Failed to fetch memberships total", e)
    }

    try {
        const subscriptionsData = await api.get('api/management/subscriptions', { params: { size: 1 } })
        totalSubscriptions = subscriptionsData?.metadata?.totalItems || 0
    } catch (e) {
        console.error("Failed to fetch subscriptions total", e)
    }

    return (
        <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                <SectionCards 
                    totalUsers={totalUsers} 
                    totalClubs={totalClubs} 
                    totalMemberships={totalMemberships}
                    totalSubscriptions={totalSubscriptions}
                />
                
                <div className="px-4 lg:px-6">
                    <ChartAreaInteractive />
                </div>
            </div>
        </div>
    )
}
