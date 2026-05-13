"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useServerAction } from '@/hooks/useServerAction';
import { searchClubsAction } from '@/features/clubs/actions/club.actions';
import { useOnboardingStore } from './store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ChevronRight, Loader2, MapPin } from 'lucide-react';
import { Combobox, ComboboxContent, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxList } from '@/components/ui/combobox';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { ClubResponse } from '@/lib/api/schema';

export function Step1ClubDiscovery() {
  const router = useRouter();
  const { clubId, setClub } = useOnboardingStore();
  const [selectedClub, setSelectedClub] = useState<ClubResponse | null>(null);

  const { execute, data, isPending } = useServerAction(searchClubsAction);

  useEffect(() => {
    execute({ size: 100 });
  }, [execute]);

  useEffect(() => {
    if (data?.items && clubId) {
      const found = data.items.find((c: ClubResponse) => c.id === clubId);
      if (found) setSelectedClub(found);
    }
  }, [data, clubId]);

  const handleNext = () => {
    if (selectedClub) {
      setClub(selectedClub.id, selectedClub.slug);
      router.push('?step=2');
    }
  };

  const clubs = data?.items || [];
  // Extract unique cities
  const cities = Array.from(new Set(clubs.map((c: ClubResponse) => c.address.city).filter(Boolean)));
  const [selectedCity, setSelectedCity] = useState<string>('');

  const filteredClubs = selectedCity ? clubs.filter((c: ClubResponse) => c.address.city === selectedCity) : clubs;

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Select Your Home Club</CardTitle>
        <p className="text-sm text-muted-foreground">
          Choose the location where you will primarily train.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {isPending ? (
          <div className="flex items-center justify-center h-32">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            <div className="space-y-3">
              <Label className="text-base font-semibold">City</Label>
              <Combobox value={selectedCity} onValueChange={(val) => setSelectedCity(val || '')}>
                <ComboboxInput placeholder="Filter by city..." showTrigger />
                <ComboboxContent>
                  <ComboboxList>
                    <ComboboxItem value="">All Cities</ComboboxItem>
                    {cities.map((city) => (
                      <ComboboxItem key={city} value={city}>
                        {city}
                      </ComboboxItem>
                    ))}
                  </ComboboxList>
                  <ComboboxEmpty>No cities found</ComboboxEmpty>
                </ComboboxContent>
              </Combobox>
            </div>

            <div className="space-y-3">
              <Label className="text-base font-semibold">Club</Label>
              <Combobox
                value={selectedClub?.name || ""}
                onValueChange={(val) => {
                  const club = clubs.find((c: ClubResponse) => c.name === val);
                  if (club) setSelectedClub(club);
                }}
              >
                <ComboboxInput placeholder="Search and select club..." showTrigger />
                <ComboboxContent>
                  <ComboboxList>
                    {filteredClubs.map((club: ClubResponse) => (
                      <ComboboxItem key={club.id} value={club.name}>
                        <div className="flex flex-col">
                          <span className="font-medium">{club.name}</span>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <MapPin className="w-3 h-3" /> {club.address.city}
                          </span>
                        </div>
                      </ComboboxItem>
                    ))}
                  </ComboboxList>
                  <ComboboxEmpty>No clubs available</ComboboxEmpty>
                </ComboboxContent>
              </Combobox>
            </div>

            {selectedClub && (
              <>
                <Separator />
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 space-y-2 animate-in fade-in">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-foreground flex items-center gap-2">
                        {selectedClub.name}
                        {selectedClub.active ? (
                            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">Open</Badge>
                        ) : (
                            <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20">Coming Soon</Badge>
                        )}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {selectedClub.address.fullAddress}
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}

            <div className="flex justify-end gap-3 pt-4">
              <Button onClick={handleNext} disabled={!selectedClub} className="gap-2">
                Continue to Plans <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
