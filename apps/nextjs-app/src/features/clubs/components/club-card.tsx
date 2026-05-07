import { ClubResponse } from "@/lib/api/schema/club.schema";
import { MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface ClubCardProps {
  club: ClubResponse;
}

export function ClubCard({ club }: Readonly<ClubCardProps>) {
  const coverImage = club.photoUrls?.[0] || null;
  const city = club.address?.city || "Unknown";
  const district = club.address?.district || "Unknown";

  return (
    <div className="group">
      <Link href={`/clubs/${club.slug}`} className="block group-hover:opacity-90 transition-opacity">
        <div className="rounded-lg overflow-hidden bg-white dark:bg-gray-800">
          {coverImage ? (
            <div className="relative h-64">
              <Image
                src={coverImage}
                alt={club.name}
                fill
                className="object-cover rounded-t-lg"
              />
            </div>
          ) : (
            <div className="bg-gray-200 border-2 border-dashed rounded-t-lg w-full h-64 flex items-center justify-center">
              <span className="text-gray-500">No image</span>
            </div>
          )}
          <div className="p-4">
            <h3 className="text-lg font-bold truncate">{club.name}</h3>
            <div className="flex items-center mt-2 text-sm text-gray-500 dark:text-gray-400">
              <MapPin className="w-4 h-4 mr-1" />
              <span className="truncate">
                {city}, {district}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}