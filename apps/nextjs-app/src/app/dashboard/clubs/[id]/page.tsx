import {getServerApi} from "@/lib/api/server";
import {ClubGeneralDetails} from "@/features/clubs/components/dashboard/club-general-details";
import {ClubScheduleView} from "@/features/clubs/components/dashboard/club-schedule-view";
import {ClubDetailNav} from "@/features/clubs/components/dashboard/club-detail-nav";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {
    ActivityIcon,
    BarChart3Icon,
    CreditCardIcon, 
    MoreHorizontal,
    PlusIcon,
    UsersIcon
} from "lucide-react";

type PageProps = {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function ClubDetailPage(props: PageProps) {
    const params = await props.params;
    const searchParams = await props.searchParams;
    
    const id = params.id;
    const tab = (searchParams.tab as string) || 'general';
    
    const club = await getServerApi().get('api/clubs/:id', {pathParams: {id}});

    return (
        <div className="@container/main flex flex-1 flex-col gap-8 p-4 md:p-6 mx-auto w-full">
            <div className="flex flex-col gap-1">
                <h1 className="text-lg font-semibold tracking-tight">{club.name}</h1>
                <p className="text-muted-foreground">Manage club details, schedule, staff, and view analytics.</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 items-start">
                <ClubDetailNav clubId={club.id.toString()} currentTab={tab} />

                {/* Main Content Area */}
                <main className="flex-1 min-w-0 w-full">
                    {tab === 'general' && <ClubGeneralDetails club={club} />}
                    {tab === 'schedule' && <ClubScheduleView club={club} />}
                    {tab === 'management' && <ManagementView />}
                    {tab === 'analytics' && <AnalyticsView />}
                </main>
            </div>
        </div>
    )
}

function ManagementView() {
    const staffList = [
        { name: 'John Doe', role: 'Club Manager', email: 'john@talosgym.com' },
        { name: 'Sarah Smith', role: 'Head Trainer', email: 'sarah@talosgym.com' },
        { name: 'Mike Johnson', role: 'Receptionist', email: 'mike@talosgym.com' }
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-semibold">Management & Staff</h2>
                    <p className="text-sm text-muted-foreground">Manage club managers, trainers, and staff roles.</p>
                </div>
                <Button size="sm"><PlusIcon className="w-4 h-4 mr-2" /> Add Staff</Button>
            </div>
            <Card>
                <CardContent className="p-0">
                    <div className="divide-y">
                        {staffList.map((staff, i) => (
                            <div key={i} className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                        <UsersIcon className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-sm">{staff.name}</p>
                                        <p className="text-xs text-muted-foreground">{staff.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <Badge variant="secondary">{staff.role}</Badge>
                                    <Button variant="ghost" size="icon"><MoreHorizontal className="w-4 h-4" /></Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

function AnalyticsView() {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-lg font-semibold">Analytics & Performance</h2>
                <p className="text-sm text-muted-foreground">View key metrics and performance indicators for this club.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Total Members</CardTitle>
                        <UsersIcon className="w-4 h-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">2,350</div>
                        <p className="text-xs text-emerald-600 dark:text-emerald-500 mt-1 font-medium">+180 from last month</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
                        <CreditCardIcon className="w-4 h-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">1,890</div>
                        <p className="text-xs text-emerald-600 dark:text-emerald-500 mt-1 font-medium">+5% from last month</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Daily Check-ins</CardTitle>
                        <ActivityIcon className="w-4 h-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">432</div>
                        <p className="text-xs text-muted-foreground mt-1">Average this week</p>
                    </CardContent>
                </Card>
            </div>
            <Card className="h-[300px] flex items-center justify-center bg-muted/20 border-dashed">
                <div className="text-center">
                    <BarChart3Icon className="w-8 h-8 text-muted-foreground mx-auto mb-2 opacity-50" />
                    <p className="text-sm text-muted-foreground">Detailed charts will appear here</p>
                </div>
            </Card>
        </div>
    )
}