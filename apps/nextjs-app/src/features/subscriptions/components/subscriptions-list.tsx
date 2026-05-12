'use client'

import { SubscriptionCard } from './subscription-card'
import type { SubscriptionResponse } from '@/lib/api/schema'

type Props = {
    readonly subscriptions: SubscriptionResponse[]
    readonly onSubscriptionCanceled?: () => void
}

export function SubscriptionsList({ subscriptions, onSubscriptionCanceled }: Props) {
    return (
        <div className="space-y-4">
            {subscriptions.map((subscription) => (
                <SubscriptionCard
                    key={subscription.id}
                    subscription={subscription}
                    onSubscriptionCanceled={onSubscriptionCanceled}
                />
            ))}
        </div>
    )
}

