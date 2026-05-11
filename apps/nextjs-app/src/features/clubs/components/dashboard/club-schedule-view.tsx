"use client"

import * as React from "react"
import { format, parseISO } from "date-fns"
import { 
    CalendarIcon, 
    ClockIcon, 
    AlertTriangleIcon
} from "lucide-react"

import { ClubResponse } from "@/lib/api/schema/club.schema"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { EditOperatingHoursModal } from "./edit-operating-hours-modal"
import { ScheduleOverrideModal } from "./schedule-override-modal"
import { ScheduleOverrideActions } from "./schedule-override-actions"

const DAYS_ORDER = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'] as const;

export function ClubScheduleView({ club }: { club: ClubResponse }) {
    const operatingHours = club.operatingHours || []
    const overrides = club.scheduleOverrides || []

    // Ensure days are rendered in correct Mon-Sun order
    const sortedHours = React.useMemo(() => {
        return DAYS_ORDER.map(day => {
            return operatingHours.find(h => h.dayOfWeek === day) || {
                dayOfWeek: day,
                openingTime: null,
                closingTime: null,
                closed: true
            }
        })
    }, [operatingHours]);

    // Sort overrides by date nearest to furthest
    const sortedOverrides = React.useMemo(() => {
        return [...overrides].sort((a, b) => 
            new Date(a.overrideDate).getTime() - new Date(b.overrideDate).getTime()
        )
    }, [overrides]);

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-lg font-semibold">Schedule & Operating Hours</h2>
                <p className="text-sm text-muted-foreground">Manage the regular opening hours and exceptions for this location.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                {/* 1. Periodic Operating Hours */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <div>
                            <CardTitle className="text-base flex items-center gap-2">
                                <ClockIcon className="w-5 h-5 text-primary" />
                                Weekly Operating Hours
                            </CardTitle>
                            <CardDescription>The standard recurring weekly schedule.</CardDescription>
                        </div>
                        <EditOperatingHoursModal club={club} sortedHours={sortedHours} />
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="divide-y">
                            {sortedHours.map(hour => (
                                <div key={hour.dayOfWeek} className="flex items-center justify-between px-6 py-4 hover:bg-muted/30 transition-colors">
                                    <span className="font-medium text-sm capitalize">
                                        {hour.dayOfWeek.toLowerCase()}
                                    </span>
                                    <div className="flex items-center">
                                        {hour.closed ? (
                                            <Badge variant="secondary" className="text-muted-foreground">Closed</Badge>
                                        ) : (
                                            <span className="text-sm font-medium">
                                                {hour.openingTime?.substring(0, 5)} - {hour.closingTime?.substring(0, 5)}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* 2. Schedule Overrides (Alien attacks, holidays, etc.) */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <div>
                            <CardTitle className="text-base flex items-center gap-2">
                                <AlertTriangleIcon className="w-5 h-5 text-warning" />
                                Schedule Exceptions
                            </CardTitle>
                            <CardDescription>Holidays, renovations, or global alien attacks.</CardDescription>
                        </div>
                        <ScheduleOverrideModal clubId={club.id.toString()} />
                    </CardHeader>
                    <CardContent className="p-0">
                        {sortedOverrides.length === 0 ? (
                            <div className="p-8 text-center border-t border-dashed">
                                <CalendarIcon className="w-8 h-8 text-muted-foreground/50 mx-auto mb-3" />
                                <p className="text-sm font-medium">No upcoming exceptions</p>
                                <p className="text-xs text-muted-foreground mt-1">The standard weekly hours will apply.</p>
                            </div>
                        ) : (
                            <div className="divide-y">
                                {sortedOverrides.map(override => (
                                    <div key={override.id} className="flex items-center justify-between gap-4 px-6 py-4 hover:bg-muted/30 transition-colors">
                                        <div className="flex flex-col flex-1 min-w-0">
                                            <span className="font-semibold text-sm truncate">
                                                {format(parseISO(override.overrideDate), "MMM do, yyyy")}
                                            </span>
                                            <span className="text-xs text-muted-foreground truncate">
                                                {override.reason || "No reason specified"}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3 shrink-0 ml-auto text-right">
                                            {override.closed ? (
                                                <Badge variant="destructive" className="bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/10">
                                                    Closed Exception
                                                </Badge>
                                            ) : (
                                                <Badge variant="outline" className="border-warning/30 text-warning bg-warning/10">
                                                    Modified: {override.openingTime?.substring(0, 5)} - {override.closingTime?.substring(0, 5)}
                                                </Badge>
                                            )}
                                            <ScheduleOverrideActions clubId={club.id.toString()} override={override} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
