'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const MOCK_REVENUE_DATA = [
    { month: 'Jan', revenue: 45000, subscriptions: 12000, memberships: 33000 },
    { month: 'Feb', revenue: 52000, subscriptions: 13500, memberships: 38500 },
    { month: 'Mar', revenue: 48000, subscriptions: 12000, memberships: 36000 },
    { month: 'Apr', revenue: 61000, subscriptions: 15000, memberships: 46000 },
    { month: 'May', revenue: 55000, subscriptions: 13500, memberships: 41500 },
    { month: 'Jun', revenue: 67000, subscriptions: 16500, memberships: 50500 },
]

const MOCK_MEMBERS_DATA = [
    { month: 'Jan', activeMembers: 2400, pendingMembers: 240 },
    { month: 'Feb', activeMembers: 3398, pendingMembers: 221 },
    { month: 'Mar', activeMembers: 2800, pendingMembers: 229 },
    { month: 'Apr', activeMembers: 3908, pendingMembers: 200 },
    { month: 'May', activeMembers: 4800, pendingMembers: 221 },
    { month: 'Jun', activeMembers: 3800, pendingMembers: 250 },
]

const MOCK_STATS = [
    { label: 'Total Revenue', value: '$328,000', change: '+12.5%' },
    { label: 'Active Members', value: '4,800', change: '+8.2%' },
    { label: 'Active Subscriptions', value: '1,240', change: '+5.1%' },
    { label: 'Avg Membership Duration', value: '18 months', change: '+2.3%' },
]

export default function AnalyticsPage() {
    return (
        <div className="flex flex-1 flex-col gap-6 p-4 lg:p-6">
            <div>
                <h1 className="text-2xl font-bold">Analytics</h1>
                <p className="text-sm text-muted-foreground mt-1">
                    Monitor gym performance and key metrics
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                {MOCK_STATS.map((stat) => (
                    <Card key={stat.label}>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                {stat.label}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                            <p className="text-xs text-green-600 mt-2">{stat.change}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Revenue Trend</CardTitle>
                        <CardDescription>Monthly revenue breakdown</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={250}>
                            <LineChart data={MOCK_REVENUE_DATA}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey="subscriptions"
                                    stroke="#8884d8"
                                    dot={false}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="memberships"
                                    stroke="#82ca9d"
                                    dot={false}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Membership Growth</CardTitle>
                        <CardDescription>Active vs pending members</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={MOCK_MEMBERS_DATA}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="activeMembers" fill="#8884d8" />
                                <Bar dataKey="pendingMembers" fill="#82ca9d" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}