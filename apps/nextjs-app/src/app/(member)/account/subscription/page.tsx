import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { AlertCircle } from 'lucide-react'
import { getMySubscriptionsAction } from '@/features/subscriptions/actions/subscription.action'
import { SubscriptionsTabs } from '@/features/subscriptions/components/subscriptions-tabs'
import { EmptySubscriptionState } from '@/features/subscriptions/components/empty-subscription-state'

export const metadata: Metadata = {
    title: 'My Subscriptions',
    description: 'Manage your gym membership and subscription plans',
}

export default async function SubscriptionPage() {
    const result = await getMySubscriptionsAction()

    if (!result.success) {
        redirect('/auth/login')
    }

    const subscriptions = result.data || []
    const hasSubscriptions = subscriptions.length > 0
    const activeCount = subscriptions.filter((s) => s.status === 'ACTIVE' || s.status === 'PENDING_PAYMENT').length

    return (
        <div className="space-y-6 max-w-3xl">
            {/* Info banner - only show if user has active subscription */}
            {activeCount > 0 && (
                <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 flex gap-3">
                    <div className="flex-shrink-0">
                        <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                    </div>
                    <div className="text-sm text-blue-900">
                        <p className="font-medium mb-1">Active Subscription</p>
                        <p>
                            Your subscription is active and in good standing. You have full access to your gym facilities and all included benefits.
                        </p>
                    </div>
                </div>
            )}

            {/* Main content section */}
            <div className="rounded-lg border bg-card p-5">
                <div className="mb-6 border-b pb-4">
                    <h2 className="font-heading font-semibold text-base">
                        {hasSubscriptions ? 'Your Memberships' : 'Gym Membership'}
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1">
                        {hasSubscriptions
                            ? "View and manage your gym memberships. Navigate through tabs to see active, past, and canceled subscriptions."
                            : 'You currently have no gym membership. Browse our flexible membership plans to get started.'}
                    </p>
                </div>

                {/* Content based on subscription status */}
                {hasSubscriptions ? (
                    <SubscriptionsTabs subscriptions={subscriptions} />
                ) : (
                    <EmptySubscriptionState />
                )}
            </div>

            {/* Additional info section for subscribers */}
            {activeCount > 0 && (
                <div className="rounded-lg border bg-card p-5">
                    <h3 className="font-heading font-semibold text-base mb-4">Subscription Information (Not Yet)</h3>

                    <div className="space-y-3">
                        <div className="flex justify-between text-sm py-2 border-b">
                            <span className="text-muted-foreground">Billing Cycle</span>
                            <span className="font-medium">Monthly</span>
                        </div>

                        <div className="flex justify-between text-sm py-2 border-b">
                            <span className="text-muted-foreground">Auto-Renewal</span>
                            <span className="font-medium text-emerald-600">Enabled</span>
                        </div>

                        <div className="flex justify-between text-sm py-2">
                            <span className="text-muted-foreground">Payment Method</span>
                            <span className="font-medium">•••• 4242</span>
                        </div>
                    </div>

                    <p className="text-xs text-muted-foreground mt-4 p-3 bg-muted rounded">
                        💡 <span className="font-medium">Tip:</span> Your membership will not automatically renew on your next billing date.
                        You can cancel anytime, and you'll maintain access until the end of your current billing cycle.
                    </p>
                </div>
            )}
        </div>
    )
}
