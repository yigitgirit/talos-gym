'use client'

import Link from 'next/link'
import { Heart, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function EmptySubscriptionState() {
    return (
        <div className="rounded-lg border border-dashed border-muted-foreground/30 p-8 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted mb-4">
                <Heart className="w-6 h-6 text-muted-foreground" />
            </div>

            <h3 className="font-heading font-semibold text-lg mb-2">No Active Subscription</h3>

            <p className="text-sm text-muted-foreground max-w-sm mx-auto mb-6">
                You're not currently subscribed to any gym membership plan. You can still enjoy facilities and programs as a guest!
            </p>

            <div className="flex gap-3 justify-center flex-wrap">
                <Button asChild>
                    <Link href="/membership-plans">
                        Browse Plans
                    </Link>
                </Button>
                <Button variant="outline" asChild>
                    <Link href="/contact">
                        Contact Support
                    </Link>
                </Button>
            </div>
        </div>
    )
}

