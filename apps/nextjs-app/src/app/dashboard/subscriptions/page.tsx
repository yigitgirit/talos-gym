'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { MoreHorizontalIcon } from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const MOCK_SUBSCRIPTIONS = [
    {
        id: 1,
        subscriptionName: 'Gold Annual',
        price: 599.99,
        billingCycle: 'Yearly',
        club: 'Downtown Gym',
        activeMembers: 245,
        status: 'active',
        createdDate: '2023-01-10',
    },
    {
        id: 2,
        subscriptionName: 'Silver Monthly',
        price: 29.99,
        billingCycle: 'Monthly',
        club: 'Uptown Gym',
        activeMembers: 128,
        status: 'active',
        createdDate: '2024-03-15',
    },
    {
        id: 3,
        subscriptionName: 'Platinum Quarterly',
        price: 199.99,
        billingCycle: 'Quarterly',
        club: 'Downtown Gym',
        activeMembers: 89,
        status: 'active',
        createdDate: '2024-02-20',
    },
    {
        id: 4,
        subscriptionName: 'Basic Monthly',
        price: 19.99,
        billingCycle: 'Monthly',
        club: 'Eastside Fitness',
        activeMembers: 0,
        status: 'inactive',
        createdDate: '2023-11-05',
    },
]

const statusColors = {
    active: 'bg-green-100 text-green-800 dark:bg-green-900/30',
    inactive: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30',
}

export default function SubscriptionsPage() {
    return (
        <div className="flex flex-1 flex-col gap-6 p-4 lg:p-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Subscriptions</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Manage subscription plans
                    </p>
                </div>
                <Button>Create Subscription</Button>
            </div>

            <div className="rounded-lg border overflow-hidden">
                <Table>
                    <TableHeader className="bg-muted">
                        <TableRow>
                            <TableHead>Subscription Name</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Billing Cycle</TableHead>
                            <TableHead>Club</TableHead>
                            <TableHead>Active Members</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="w-12"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {MOCK_SUBSCRIPTIONS.map((subscription) => (
                            <TableRow key={subscription.id}>
                                <TableCell className="font-medium">
                                    {subscription.subscriptionName}
                                </TableCell>
                                <TableCell>${subscription.price}</TableCell>
                                <TableCell>{subscription.billingCycle}</TableCell>
                                <TableCell>{subscription.club}</TableCell>
                                <TableCell>{subscription.activeMembers}</TableCell>
                                <TableCell>
                                    <Badge
                                        className={`capitalize ${statusColors[subscription.status as keyof typeof statusColors]}`}
                                    >
                                        {subscription.status}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon">
                                                <MoreHorizontalIcon className="size-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem>View Details</DropdownMenuItem>
                                            <DropdownMenuItem>Edit</DropdownMenuItem>
                                            <DropdownMenuItem className="text-destructive">
                                                Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}