'use client'

import { useState } from 'react'
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

const MOCK_MEMBERSHIPS = [
  {
    id: 1,
    memberName: 'John Doe',
    membershipType: 'Gold',
    club: 'Downtown Gym',
    startDate: '2024-01-15',
    endDate: '2025-01-15',
    status: 'active',
    monthlyPrice: 49.99,
  },
  {
    id: 2,
    memberName: 'Jane Smith',
    membershipType: 'Silver',
    club: 'Uptown Gym',
    startDate: '2023-06-20',
    endDate: '2024-12-20',
    status: 'inactive',
    monthlyPrice: 29.99,
  },
  {
    id: 3,
    memberName: 'Mike Johnson',
    membershipType: 'Platinum',
    club: 'Downtown Gym',
    startDate: '2024-03-01',
    endDate: '2025-03-01',
    status: 'active',
    monthlyPrice: 79.99,
  },
  {
    id: 4,
    memberName: 'Sarah Williams',
    membershipType: 'Gold',
    club: 'Eastside Fitness',
    startDate: '2024-02-10',
    endDate: '2025-02-10',
    status: 'active',
    monthlyPrice: 49.99,
  },
  {
    id: 5,
    memberName: 'Tom Brown',
    membershipType: 'Silver',
    club: 'Downtown Gym',
    startDate: '2024-05-05',
    endDate: '2025-05-05',
    status: 'pending',
    monthlyPrice: 29.99,
  },
]

const statusColors = {
  active: 'bg-green-100 text-green-800 dark:bg-green-900/30',
  inactive: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30',
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30',
}

export default function MembershipsPage() {
  return (
      <div className="flex flex-1 flex-col gap-6 p-4 lg:p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Memberships</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Manage all gym memberships
            </p>
          </div>
          <Button>Add Membership</Button>
        </div>

        <div className="rounded-lg border overflow-hidden">
          <Table>
            <TableHeader className="bg-muted">
              <TableRow>
                <TableHead>Member Name</TableHead>
                <TableHead>Membership Type</TableHead>
                <TableHead>Club</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Monthly Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_MEMBERSHIPS.map((membership) => (
                  <TableRow key={membership.id}>
                    <TableCell className="font-medium">
                      {membership.memberName}
                    </TableCell>
                    <TableCell>{membership.membershipType}</TableCell>
                    <TableCell>{membership.club}</TableCell>
                    <TableCell>{membership.startDate}</TableCell>
                    <TableCell>{membership.endDate}</TableCell>
                    <TableCell>${membership.monthlyPrice}</TableCell>
                    <TableCell>
                      <Badge
                          className={`capitalize ${statusColors[membership.status as keyof typeof statusColors]}`}
                      >
                        {membership.status}
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
                            Deactivate
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