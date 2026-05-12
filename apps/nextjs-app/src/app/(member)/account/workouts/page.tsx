import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'My Workouts',
  description: 'Track your workout history and routines',
}

export default function WorkoutsPage() {
  return (
    <div className="space-y-6 max-w-3xl">
      <div className="rounded-lg border bg-card p-5">
        <div className="mb-6 border-b pb-4">
          <h2 className="font-heading font-semibold text-base">
            Workout History
          </h2>
          <p className="text-sm text-muted-foreground mt-1">View your past workouts and track your progress.</p>
        </div>
        <div className="text-sm text-muted-foreground">
          No workouts recorded yet. Time to hit the gym!
        </div>
      </div>
    </div>
  )
}
