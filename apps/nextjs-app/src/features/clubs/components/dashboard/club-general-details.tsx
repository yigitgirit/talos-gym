"use client"

import * as React from "react"
import { ClubResponse } from "@/lib/api/schema/club.schema"
import { EditClubForm } from "./edit-club-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPinIcon, GlobeIcon, ActivityIcon, PencilIcon } from "lucide-react"

// --- Subcomponents for separation of concerns ---

function ClubHeader({ club }: { club: ClubResponse }) {
    return (
        <CardHeader>
            <div className="flex justify-between items-start">
                <div>
                    <CardTitle className="text-2xl">{club.name}</CardTitle>
                    <CardDescription className="mt-1 flex flex-wrap items-center gap-2">
                        <span>{club.slug || "No slug"}</span>
                        <span className="hidden sm:inline">•</span>
                        <Badge variant={club.active ? "default" : "secondary"}>
                            {club.active ? "Active" : "Inactive"}
                        </Badge>
                    </CardDescription>
                </div>
            </div>
        </CardHeader>
    );
}

function ClubDescriptionGallery({ club }: { club: ClubResponse }) {
    return (
        <div className="space-y-6">
            <div>
                <h4 className="text-sm font-medium mb-2 text-muted-foreground">Description</h4>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {club.description || "No description provided."}
                </p>
            </div>
            
            <div>
                <h4 className="text-sm font-medium mb-3 text-muted-foreground">Gallery</h4>
                {club.photoUrls && club.photoUrls.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-2">
                        {club.photoUrls.map((url, i) => (
                            <div key={i} className="aspect-square rounded-md overflow-hidden bg-muted border">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={url} alt={`${club.name} photo ${i+1}`} className="w-full h-full object-cover" />
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-muted-foreground italic">No photos available.</p>
                )}
            </div>
        </div>
    );
}

function ClubLocation({ club }: { club: ClubResponse }) {
    return (
        <div>
            <h4 className="text-sm font-medium mb-3 text-muted-foreground">Location & Address</h4>
            <div className="bg-muted/40 rounded-lg p-4 space-y-3 border">
                <div className="flex items-start gap-3">
                    <MapPinIcon className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    <div>
                        <p className="text-sm font-medium">
                            {club.address.city || "No City"}, {club.address.district || "No District"}
                        </p>
                        {club.address.fullAddress && (
                            <p className="text-xs text-muted-foreground mt-0.5">{club.address.fullAddress}</p>
                        )}
                        <div className="flex flex-col sm:flex-row flex-wrap gap-x-4 gap-y-1 mt-2">
                            <p className="text-xs text-muted-foreground">
                                <span className="font-medium">Provider:</span> {club.address.provider || "N/A"}
                            </p>
                            {club.address.externalLocationId && (
                                <p className="text-xs text-muted-foreground">
                                    <span className="font-medium">External ID:</span> {club.address.externalLocationId}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ClubSettings({ club }: { club: ClubResponse }) {
    return (
        <div>
            <h4 className="text-sm font-medium mb-3 text-muted-foreground">Settings & Integrations</h4>
            <div className="bg-muted/40 rounded-lg p-4 space-y-4 border">
                <div className="flex items-center gap-3">
                    <GlobeIcon className="w-4 h-4 text-primary shrink-0" />
                    <div>
                        <p className="text-xs text-muted-foreground">Timezone</p>
                        <p className="text-sm font-medium">{club.timeZone || "Not set"}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <ActivityIcon className="w-4 h-4 text-primary shrink-0" />
                    <div>
                        <p className="text-xs text-muted-foreground">Score Multiplier</p>
                        <p className="text-sm font-medium">x{club.scoreMultiplier?.toFixed(2) || "1.00"}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

// --- Main Component ---

export function ClubGeneralDetails({ club }: { club: ClubResponse }) {
    const [isEditing, setIsEditing] = React.useState(false)

    if (isEditing) {
        return (
            <div className="space-y-6">
                <div>
                    <h2 className="text-lg font-semibold">Edit General Details</h2>
                    <p className="text-sm text-muted-foreground">Update the public-facing details, address, and contact info for this club.</p>
                </div>
                <EditClubForm club={club} />
                <div className="flex justify-end pt-4 border-t">
                    <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel Edit</Button>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-lg font-semibold">General Details</h2>
                    <p className="text-sm text-muted-foreground">Public-facing details, address, and integrations.</p>
                </div>
                <Button onClick={() => setIsEditing(true)} className="w-full sm:w-auto">
                    <PencilIcon className="w-4 h-4 mr-2" />
                    Edit Details
                </Button>
            </div>

            <Card className="overflow-hidden">
                <ClubHeader club={club} />
                {/* On small/medium screens, grid-cols-1 forces vertical layout. On lg screens, it splits into 2 columns. */}
                <CardContent className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <ClubDescriptionGallery club={club} />
                    
                    <div className="space-y-6">
                        <ClubLocation club={club} />
                        <ClubSettings club={club} />
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}