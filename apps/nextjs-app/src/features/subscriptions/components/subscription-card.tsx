'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { AlertCircle, CheckCircle, Clock, Loader2, XCircle } from 'lucide-react'
import { useServerAction } from '@/hooks/useServerAction'
import { cancelMySubscriptionAction } from '@/features/subscriptions/actions/subscription.action'
import type { SubscriptionResponse } from '@/lib/api/schema'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'

type SubscriptionStatus = 'ACTIVE' | 'CANCELED' | 'EXPIRED' | 'PENDING_PAYMENT'

const statusConfig: Record<SubscriptionStatus, { label: string; icon: React.ReactNode; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
    ACTIVE: {
        label: 'Active',
        icon: <CheckCircle className="w-4 h-4" />,
        variant: 'default',
    },
    CANCELED: {
        label: 'Canceled',
        icon: <XCircle className="w-4 h-4" />,
        variant: 'destructive',
    },
    EXPIRED: {
        label: 'Expired',
        icon: <Clock className="w-4 h-4" />,
        variant: 'secondary',
    },
    PENDING_PAYMENT: {
        label: 'Pending',
        icon: <AlertCircle className="w-4 h-4" />,
        variant: 'outline',
    },
}

// ─────────────────────────────────────────────────────────────
// Utility Functions
// ─────────────────────────────────────────────────────────────

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    })
}

const calculateDaysRemaining = (endDate: string) => {
    const endDateObj = new Date(endDate)
    const now = new Date()
    return Math.ceil((endDateObj.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
}

// ─────────────────────────────────────────────────────────────
// Sub Components
// ─────────────────────────────────────────────────────────────

type SubscriptionStatusBadgeProps = {
    readonly status: string
    readonly isExpiringSoon: boolean
}

function SubscriptionStatusBadge({ status, isExpiringSoon }: SubscriptionStatusBadgeProps) {
    const config = statusConfig[status as SubscriptionStatus]

    return (
        <div className="flex items-center gap-2">
            <Badge variant={config.variant} className="gap-1">
                {config.icon}
                {config.label}
            </Badge>
            {isExpiringSoon && (
                <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200 gap-1">
                    <AlertCircle className="w-3 h-3" />
                    <span className="text-xs">Expires soon</span>
                </Badge>
            )}
        </div>
    )
}

type CancelSubscriptionDialogProps = {
    readonly isOpen: boolean
    readonly onOpenChange: (open: boolean) => void
    readonly planName: string
    readonly endDate: string
    readonly isPending: boolean
    readonly onConfirm: () => void
}

function CancelSubscriptionDialog({
    isOpen,
    onOpenChange,
    planName,
    endDate,
    isPending,
    onConfirm,
}: CancelSubscriptionDialogProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <XCircle className="w-5 h-5 text-destructive" />
                        Cancel Subscription?
                    </DialogTitle>
                    <DialogDescription>
                        Are you sure you want to cancel your{' '}
                        <span className="font-medium text-foreground">{planName}</span> subscription?
                        You'll lose access at the end of your current cycle.
                    </DialogDescription>
                </DialogHeader>

                <div className="bg-destructive/10 border border-destructive/20 rounded p-3 text-sm">
                    <p className="text-destructive font-medium">Access ends: {formatDate(endDate)}</p>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
                        Keep It
                    </Button>
                    <Button variant="destructive" onClick={onConfirm} disabled={isPending}>
                        {isPending && <Loader2 className="w-3 h-3 animate-spin mr-1.5" />}
                        {isPending ? 'Canceling...' : 'Cancel'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

// ─────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────

type Props = {
    readonly subscription: SubscriptionResponse
    readonly onSubscriptionCanceled?: () => void
}

export function SubscriptionCard({ subscription, onSubscriptionCanceled }: Props) {
    const router = useRouter();
    const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false)

    const isActive = subscription.status === 'ACTIVE'
    const daysRemaining = calculateDaysRemaining(subscription.endDate)
    const isExpiringSoon = isActive && daysRemaining <= 7 && daysRemaining > 0

    const cancelAction = useServerAction(cancelMySubscriptionAction, {
        onSuccess: () => {
            toast.success('Subscription canceled.')
            setIsCancelDialogOpen(false)
            onSubscriptionCanceled?.()
        },
        onError: (error) => toast.error(error.message || 'Failed to cancel'),
    })

    const handleConfirmCancel = () => {
        cancelAction.execute({ id: subscription.id })
        router.refresh();
    }

    return (
        <>
            <div className="flex items-center justify-between p-5 border rounded-lg bg-card hover:bg-accent/5 transition-colors gap-4">
                {/* 1. Main Info & Status */}
                <div className="flex items-center gap-3 min-w-50">
                    <div>
                        <h3 className="font-medium text-sm leading-none mb-1">{subscription.planName}</h3>
                        <SubscriptionStatusBadge status={subscription.status} isExpiringSoon={isExpiringSoon} />
                    </div>
                </div>

                {/* 2. Financials/Timeline (Hidden on mobile if needed) */}
                <div className="hidden sm:flex flex-1 items-center justify-around text-sm">
                    <div className="flex flex-col">
                        <span className="text-[10px] uppercase text-muted-foreground font-bold tracking-tight">Price</span>
                        <span>${subscription.totalAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[10px] uppercase text-muted-foreground font-bold tracking-tight">Ends</span>
                        <span>{formatDate(subscription.endDate)}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[10px] uppercase text-muted-foreground font-bold tracking-tight">Remaining</span>
                        <span className={isExpiringSoon ? "text-orange-500 font-medium" : ""}>
                            {daysRemaining > 0 ? `${daysRemaining} days` : 'Expired'}
                        </span>
                    </div>
                </div>

                {/* 3. Actions */}
                <div className="flex items-center justify-end">
                    {isActive && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsCancelDialogOpen(true)}
                            disabled={cancelAction.isPending}
                            className="h-8 text-destructive hover:bg-destructive/10"
                        >
                            {cancelAction.isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Cancel'}
                        </Button>
                    )}
                </div>
            </div>

            <CancelSubscriptionDialog
                isOpen={isCancelDialogOpen}
                onOpenChange={setIsCancelDialogOpen}
                planName={subscription.planName}
                endDate={subscription.endDate}
                isPending={cancelAction.isPending}
                onConfirm={handleConfirmCancel}
            />
        </>
    )
}
