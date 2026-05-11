'use client'

import { useMemo } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { SubscriptionsList } from './subscriptions-list'
import { EmptySubscriptionState } from './empty-subscription-state'
import type { SubscriptionResponse } from '@/lib/api/schema'

type Props = {
    readonly subscriptions: SubscriptionResponse[]
    readonly onSubscriptionCanceled?: () => void
}

export function SubscriptionsTabs({ subscriptions, onSubscriptionCanceled }: Props) {
    // Filter subscriptions by status
    const activeSubscriptions = useMemo(
        () => subscriptions.filter((sub) => sub.status === 'ACTIVE' || sub.status === 'PENDING_PAYMENT'),
        [subscriptions]
    )

    const pastSubscriptions = useMemo(
        () => subscriptions.filter((sub) => sub.status === 'EXPIRED'),
        [subscriptions]
    )

    const canceledSubscriptions = useMemo(
        () => subscriptions.filter((sub) => sub.status === 'CANCELED'),
        [subscriptions]
    )

    const hasAnySubscriptions = subscriptions.length > 0

    return (
        <Tabs defaultValue="active" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="active">
                    Active
                    {activeSubscriptions.length > 0 && (
                        <span className="ml-2 inline-flex items-center justify-center w-5 h-5 text-xs font-semibold text-white bg-emerald-600 rounded-full">
                            {activeSubscriptions.length}
                        </span>
                    )}
                </TabsTrigger>
                <TabsTrigger value="past">
                    Past
                    {pastSubscriptions.length > 0 && (
                        <span className="ml-2 inline-flex items-center justify-center w-5 h-5 text-xs font-semibold text-white bg-amber-600 rounded-full">
                            {pastSubscriptions.length}
                        </span>
                    )}
                </TabsTrigger>
                <TabsTrigger value="canceled">
                    Canceled
                    {canceledSubscriptions.length > 0 && (
                        <span className="ml-2 inline-flex items-center justify-center w-5 h-5 text-xs font-semibold text-white bg-red-600 rounded-full">
                            {canceledSubscriptions.length}
                        </span>
                    )}
                </TabsTrigger>
            </TabsList>

            {/* Active Tab */}
            <TabsContent value="active" className="space-y-4">
                {activeSubscriptions.length > 0 ? (
                    <SubscriptionsList
                        subscriptions={activeSubscriptions}
                        onSubscriptionCanceled={onSubscriptionCanceled}
                    />
                ) : (
                    <EmptySubscriptionState />
                )}
            </TabsContent>

            {/* Past Tab */}
            <TabsContent value="past" className="space-y-4">
                {pastSubscriptions.length > 0 ? (
                    <div className="space-y-4">
                        {pastSubscriptions.map((sub) => (
                            <SubscriptionsList key={sub.id} subscriptions={[sub]} />
                        ))}
                    </div>
                ) : (
                    <div className="rounded-lg border border-dashed border-muted-foreground/30 p-8 text-center">
                        <p className="text-sm text-muted-foreground">No expired subscriptions.</p>
                    </div>
                )}
            </TabsContent>

            {/* Canceled Tab */}
            <TabsContent value="canceled" className="space-y-4">
                {canceledSubscriptions.length > 0 ? (
                    <div className="space-y-4">
                        {canceledSubscriptions.map((sub) => (
                            <SubscriptionsList key={sub.id} subscriptions={[sub]} />
                        ))}
                    </div>
                ) : (
                    <div className="rounded-lg border border-dashed border-muted-foreground/30 p-8 text-center">
                        <p className="text-sm text-muted-foreground">No canceled subscriptions.</p>
                    </div>
                )}
            </TabsContent>
        </Tabs>
    )
}

