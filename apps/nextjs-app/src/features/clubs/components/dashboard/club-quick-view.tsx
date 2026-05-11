"use client";

import {useRouter} from "next/navigation";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger
} from "@/components/ui/drawer";
import {Button} from "@/components/ui/button";
import {Separator} from "@/components/ui/separator";
import {Activity, Globe2, MapPin, TrendingUpIcon} from "lucide-react";
import * as React from "react";
import {useIsMobile} from "@/hooks/use-mobile";
import {ClubResponse} from "@/lib/api/schema/club.schema";
import {Badge} from "@/components/ui/badge";
import {type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent} from "@/components/ui/chart";
import {Area, AreaChart, CartesianGrid, XAxis} from "recharts";
import Link from "next/link";

const chartData = [
    {month: "January", members: 1200, guests: 300},
    {month: "February", members: 1350, guests: 450},
    {month: "March", members: 1400, guests: 380},
    {month: "April", members: 1600, guests: 520},
    {month: "May", members: 1750, guests: 480},
    {month: "June", members: 2100, guests: 600},
];

const chartConfig = {
    members: {
        label: "Members",
        color: "var(--primary)",
    },
    guests: {
        label: "Guests",
        color: "var(--primary)",
    },
} satisfies ChartConfig

interface ClubQuickViewProps {
    club: ClubResponse;
    children: React.ReactNode;
}

export function ClubQuickView({club, children}: ClubQuickViewProps) {
    const router = useRouter();
    const isMobile = useIsMobile();
    const [isOpen, setIsOpen] = React.useState(false);

    return (
        <Drawer open={isOpen} onOpenChange={setIsOpen} direction={isMobile ? "bottom" : "right"}>
            <DrawerTrigger asChild>
                {children}
            </DrawerTrigger>
            <DrawerContent className={isMobile ? "" : "w-full sm:max-w-md h-full max-h-screen rounded-l-xl rounded-r-none m-0"}>
                <DrawerHeader className="gap-1">
                    <DrawerTitle className="flex items-center justify-between">
                        <Link
                            href={`/dashboard/clubs/${club.id}`}
                            className="hover:underline underline-offset-4 decoration-primary"
                        >
                            {club.name}
                        </Link>
                        <Badge variant={club.active ? "default" : "secondary"}>
                            {club.active ? "Active" : "Inactive"}
                        </Badge>
                    </DrawerTitle>
                    <DrawerDescription>
                        {club.slug}
                    </DrawerDescription>
                </DrawerHeader>
                <div className="flex flex-col gap-6 overflow-y-auto px-4 py-4 text-sm flex-1 custom-scrollbar">

                    {!isMobile && (
                        <>
                            <ChartContainer config={chartConfig}>
                                <AreaChart
                                    accessibilityLayer
                                    data={chartData}
                                    margin={{
                                        left: 0,
                                        right: 10,
                                    }}
                                >
                                    <CartesianGrid vertical={false}/>
                                    <XAxis
                                        dataKey="month"
                                        tickLine={false}
                                        axisLine={false}
                                        tickMargin={8}
                                        tickFormatter={(value) => value.slice(0, 3)}
                                        hide
                                    />
                                    <ChartTooltip
                                        cursor={false}
                                        content={<ChartTooltipContent indicator="dot"/>}
                                    />
                                    <Area
                                        dataKey="guests"
                                        type="natural"
                                        fill="var(--color-guests)"
                                        fillOpacity={0.6}
                                        stroke="var(--color-guests)"
                                        stackId="a"
                                    />
                                    <Area
                                        dataKey="members"
                                        type="natural"
                                        fill="var(--color-members)"
                                        fillOpacity={0.4}
                                        stroke="var(--color-members)"
                                        stackId="a"
                                    />
                                </AreaChart>
                            </ChartContainer>
                            <Separator/>
                            <div className="grid gap-2">
                                <div className="flex gap-2 leading-none font-medium">
                                    Trending up by 15.2% this month{" "}
                                    <TrendingUpIcon className="size-4"/>
                                </div>
                                <div className="text-muted-foreground">
                                    Showing total check-ins (members vs guests) for the last 6 months.
                                    (This is mock btw)
                                </div>
                            </div>
                            <Separator/>
                        </>
                    )}

                    <div className="grid gap-4">
                        <div className="flex items-start gap-3">
                            <MapPin className="h-5 w-5 text-muted-foreground mt-0.5"/>
                            <div>
                                <p className="font-medium">Location</p>
                                <p className="text-muted-foreground">
                                    {club.address.city}, {club.address.district}
                                </p>
                                <p className="text-xs text-muted-foreground">Provider: {club.address.provider}</p>
                            </div>
                        </div>

                        <Separator/>

                        <div className="flex items-start gap-3">
                            <Globe2 className="h-5 w-5 text-muted-foreground mt-0.5"/>
                            <div>
                                <p className="font-medium">Timezone</p>
                                <p className="text-muted-foreground">{club.timeZone}</p>
                            </div>
                        </div>

                        <Separator/>

                        <div className="flex items-start gap-3">
                            <Activity className="h-5 w-5 text-muted-foreground mt-0.5"/>
                            <div>
                                <p className="font-medium">Score Multiplier</p>
                                <p className="text-muted-foreground">x{club.scoreMultiplier.toFixed(2)}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-muted/50 rounded-lg p-4">
                        <h4 className="font-medium mb-2">Description</h4>
                        <p className="text-muted-foreground leading-relaxed">
                            {club.description || "No description provided for this club."}
                        </p>
                    </div>
                </div>
                <DrawerFooter className="flex-col justify-between gap-2">
                    <Button onClick={() => {
                        setIsOpen(false);
                        router.push(`/dashboard/clubs/${club.id}?tab=general`);
                    }}>
                        Edit Club
                    </Button>
                    <DrawerClose asChild>
                        <Button variant="outline">Close</Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
}