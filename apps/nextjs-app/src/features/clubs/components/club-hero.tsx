import Image from "next/image";
import { MapPin, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ClubResponse } from "@/lib/api/schema/club.schema";

interface ClubHeroProps {
  club: Pick<ClubResponse, 'name' | 'photoUrls' | 'scoreMultiplier' | 'address'>;
}

export function ClubHero({ club }: Readonly<ClubHeroProps>) {
  const coverImage = club.photoUrls?.[0] || null;

  return (
    <section className="relative w-full h-[70vh] min-h-87.5 max-h-150 flex items-end bg-background">
      {coverImage ? (
        <>
          <Image 
            src={coverImage} 
            alt={club.name} 
            fill
            className="object-cover"
            priority
          />
          {/* Dark gradient overlay for text readability */}
          <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-transparent" />
        </>
      ) : (
        <div className="absolute inset-0 bg-muted" />
      )}
      
      <div className="container relative z-10 max-w-7xl mx-auto px-4 pb-4 md:pb-6">
        <div className="flex flex-col gap-1 md:gap-2">
          <div className="flex flex-wrap items-center justify-between gap-2 md:gap-4">
            <h1 className="font-heading text-3xl md:text-5xl lg:text-6xl font-bold text-white drop-shadow-md">
              {club.name}
            </h1>
            {club.scoreMultiplier && (
              <Badge variant="secondary" className="px-3 py-6 text-md md:text-base bg-yellow-500/20 text-yellow-300 border-none backdrop-blur-md">
                <Star className="w-4 h-4 fill-current" />
                <span>{club.scoreMultiplier.toFixed(1)}/5.0</span>
              </Badge>
            )}
          </div>

          <div className="flex items-center text-white/80 gap-2 text-base md:text-lg drop-shadow-sm">
            <MapPin className="w-5 h-5 text-primary" />
            <span>{club.address?.city}, {club.address?.district}</span>
          </div>
        </div>
      </div>
    </section>
  );
}