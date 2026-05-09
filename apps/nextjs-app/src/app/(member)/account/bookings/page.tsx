import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Class Bookings',
  description: 'Manage your upcoming fitness class reservations',
}

export default function BookingsPage() {
  return (
    <div className="space-y-6 max-w-3xl">
      <div className="rounded-lg border bg-card p-5">
        <div className="mb-6 border-b pb-4">
          <h2 className="font-heading font-semibold text-base">
            Upcoming Classes
          </h2>
          <p className="text-sm text-muted-foreground mt-1">View and manage your upcoming reservations.</p>
        </div>
        <div className="text-sm text-muted-foreground">
          You have no upcoming class bookings.
        </div>
      </div>
      
      <div className="rounded-lg border bg-card p-5">
        <div className="mb-6 border-b pb-4">
          <h2 className="font-heading font-semibold text-base">
            Past Classes
          </h2>
          <p className="text-sm text-muted-foreground mt-1">History of the fitness classes you have attended.</p>
        </div>
        <div className="text-sm text-muted-foreground">
          No past classes found.
        </div>
      </div>
    </div>
  )
}
