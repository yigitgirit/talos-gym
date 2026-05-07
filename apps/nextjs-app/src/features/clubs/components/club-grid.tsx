import { ClubCard } from "./club-card";
import { getServerApi } from "@/lib/api/server";
import { ClubSearchUrl } from "../schemas";

type Props = {
    filters: ClubSearchUrl;
};

export async function ClubGrid({ filters }: Props) {
    const clubs = await getServerApi().get('api/clubs', { params: filters });
    console.log("Fetched clubs with filters:", JSON.stringify(filters), "Response:", clubs);

    if (!clubs || clubs.metadata.totalItems === 0) {
        return (
            <div className="text-center py-24 text-muted-foreground">
                <p className="text-lg">No clubs found matching your criteria.</p>
            </div>
        );
    }

    return (
        <div className="grid md:grid-cols-2 gap-6 mt-8">
            {clubs.items.map((club) => (
                <ClubCard key={club.id} club={club} />
            ))}
        </div>
    );
}
