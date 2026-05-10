import {CreateClubForm} from "@/features/clubs/components/dashboard/create-club-form"

export default function CreateClubPage() {
    return (
        <div className="container py-8 max-w-4xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Create Club</h1>
                <p className="text-muted-foreground">Add a new club location to the system.</p>
            </div>
            <CreateClubForm/>
        </div>
    )
}