import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Subscription',
  description: 'Manage your gym membership and plans',
}

export default function SubscriptionPage() {
  return (
    <div className="space-y-6 max-w-3xl">
      <div className="rounded-lg border bg-card p-5">
        <div className="mb-6 border-b pb-4">
          <h2 className="font-heading font-semibold text-base">
            Current Plan
          </h2>
          <p className="text-sm text-muted-foreground mt-1">View details about your active gym membership.</p>
        </div>
        <div className="text-sm text-muted-foreground">
          You don't have an active subscription at the moment.
        </div>
      </div>
    </div>
  )
}
