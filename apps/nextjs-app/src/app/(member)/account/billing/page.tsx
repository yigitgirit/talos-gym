import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Billing & Invoices',
  description: 'Manage your payment methods and view billing history',
}

export default function BillingPage() {
  return (
    <div className="space-y-6 max-w-3xl">
      <div className="rounded-lg border bg-card p-5">
        <div className="mb-6 border-b pb-4">
          <h2 className="font-heading font-semibold text-base">
            Payment Methods
          </h2>
          <p className="text-sm text-muted-foreground mt-1">Manage the payment methods used for your subscriptions and purchases.</p>
        </div>
        <div className="text-sm text-muted-foreground">
          No payment methods added yet.
        </div>
      </div>

      <div className="rounded-lg border bg-card p-5">
        <div className="mb-6 border-b pb-4">
          <h2 className="font-heading font-semibold text-base">
            Billing History
          </h2>
          <p className="text-sm text-muted-foreground mt-1">View your past invoices and receipts.</p>
        </div>
        <div className="text-sm text-muted-foreground">
          No billing history available.
        </div>
      </div>
    </div>
  )
}
