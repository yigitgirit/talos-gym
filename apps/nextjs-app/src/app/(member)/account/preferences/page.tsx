import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getNotificationPreferencesAsync } from '@/features/preferences/actions/preferences.actions'
import { NotificationPreferencesForm } from '@/features/preferences/components/notification-preferences-form'

export const metadata: Metadata = {
  title: 'Notification Preferences',
  description: 'Manage your notification preferences and communication channels',
}

export default async function NotificationPreferencesPage() {
  // Fetch notification preferences
  const result = await getNotificationPreferencesAsync()

  // If not authenticated or error fetching preferences, redirect to login
  if (!result.success || !result.data) {
    redirect('/auth/login')
  }

  const preferences = result.data

  return (
    <div className="space-y-6 max-w-3xl">
        <div className="rounded-lg border bg-card p-5">
            <div className="mb-6 border-b pb-4">
                <h2 className="font-heading font-semibold text-base">
                    Notification Preferences
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                    Customize how and when you receive notifications about important events.
                </p>
            </div>
            <NotificationPreferencesForm preferences={preferences} />
        </div>
    </div>
  )
}
