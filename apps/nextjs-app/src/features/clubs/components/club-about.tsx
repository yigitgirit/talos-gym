import Link from "next/link";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { OperatingHours } from "./operating-hours";
import { ClubResponse } from "@/lib/api/schema/club.schema";

interface ClubAboutProps {
  club: Pick<ClubResponse, 'name' | 'operatingHours' | 'description' | 'address'>;
}

export function ClubAbout({ club }: Readonly<ClubAboutProps>) {
  // Format address for Google Maps search
  const addressQuery = encodeURIComponent(
    `${club.name} ${club.address?.fullAddress || ''}`
  );
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${addressQuery}`;

  return (
    <section className="w-full py-8 md:py-16 border-b border-border">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          
          {/* Left Grid: About & Location */}
          <div className="lg:col-span-2 space-y-8 md:space-y-12">
            <div>
              <h2 className="font-heading text-2xl md:text-3xl font-bold mb-4 md:mb-6">About this Club</h2>
              <div className="prose dark:prose-invert max-w-none text-base md:text-lg text-muted-foreground whitespace-pre-wrap">
                {club.description || "No description provided."}
              </div>
              
              {/* Location Box under description */}
              {club.address && (
                <div className="mt-6 md:mt-8 p-4 md:p-6 bg-muted/50 rounded-xl border border-border/50">
                  <h3 className="font-heading text-lg md:text-xl font-bold mb-3 md:mb-4">Location</h3>
                  <div className="space-y-3 md:space-y-4">
                    <p className="text-muted-foreground text-sm md:text-base">
                      {club.address.fullAddress}<br />
                    </p>
                    <Button asChild variant="outline" className="w-full sm:w-auto gap-2 text-sm md:text-base">
                      <Link href={mapsUrl} target="_blank" rel="noopener noreferrer">
                        <MapPin className="w-4 h-4" />
                        Show in Google Maps
                      </Link>
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Grid: Operating Hours */}
          <div className="lg:col-span-1 order-last lg:order-0">
            {club.operatingHours ? (
              <Card>
                <CardContent>
                  <h3 className="font-heading text-lg md:text-xl font-bold mb-2 md:mb-4">Operating Hours</h3>
                  <OperatingHours hours={club.operatingHours} />
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent>
                  Operating hours not available.
                </CardContent>
              </Card>
            )}
          </div>
          
        </div>
      </div>
    </section>
  );
}