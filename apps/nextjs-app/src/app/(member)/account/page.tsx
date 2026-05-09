import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getProfileAsync } from '@/features/profile/actions/profile.actions'
import { ProfileDisplay } from '@/features/profile/components/ProfileDisplay'
import {UserResponse} from "@/lib/api/schema";

export const metadata: Metadata = {
  title: 'Profile',
  description: 'Manage your profile information',
}

export default async function ProfilePage() {
  // Fetch the current user profile
  const result = await getProfileAsync()

  // If not authenticated or error fetching profile, redirect to login
  if (!result.success || !result.data) {
    redirect('/auth/login')
  }

  const user: UserResponse = result.data

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Account Info Section */}
      <div className="rounded-lg border bg-card p-5 space-y-4">
        <div>
          <h2 className="font-heading font-semibold text-base mb-4">
            Account Overview
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-xs font-medium text-muted-foreground">Email</p>
            <p className="text-sm font-medium mt-1">{user.email}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">Phone</p>
            <p className="text-sm font-medium mt-1">{user.phoneNumber}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">Status</p>
            <div className="mt-1">
              <span
                className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                  user.status === 'ACTIVE'
                    ? 'bg-green-100 text-green-800'
                    : user.status === 'INACTIVE'
                      ? 'bg-gray-100 text-gray-800'
                      : user.status === 'PENDING'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                }`}
              >
                {user.status}
              </span>
            </div>
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">Roles</p>
            <p className="text-sm font-medium mt-1">{user.roles.join(', ')}</p>
          </div>
        </div>
      </div>

      {/* Edit Profile Section */}
      <div className="rounded-lg border bg-card p-5">
        <div className="mb-6 border-b pb-4">
          <h2 className="font-heading font-semibold text-base">
            Personal Information
          </h2>
          <p className="text-sm text-muted-foreground mt-1">Update your name maybe idk.</p>
        </div>

        <ProfileDisplay user={user} />
      </div>
    </div>
  )
}
