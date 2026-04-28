"use client";

import React, {useEffect, useState} from "react";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {Input} from "@/components/ui/input";
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import {ChevronRight, Dumbbell, MapPin, Search, Users, X} from "lucide-react";

// ...existing mock data...

// Mock data for clubs
const MOCK_CLUBS = [
    {
        id: 1,
        name: "FitHub Downtown",
        city: "Toronto",
        province: "Ontario",
        opportunities: ["Swimming", "Gym", "Yoga"],
        image: "/clubs/pexels-amar-9958669.jpg",
        rating: 4.8,
        members: 1250,
    },
    {
        id: 2,
        name: "Elite Gym Studios",
        city: "Vancouver",
        province: "British Columbia",
        opportunities: ["Gym", "CrossFit", "Personal Training"],
        image: "/clubs/pexels-anastasia-shuraeva-4944435.jpg",
        rating: 4.6,
        members: 890,
    },
    {
        id: 3,
        name: "Wellness Spa & Fitness",
        city: "Montreal",
        province: "Quebec",
        opportunities: ["Spa", "Yoga", "Pilates", "Swimming"],
        image: "/clubs/pexels-artbovich-7031706.jpg",
        rating: 4.9,
        members: 2100,
    },
    {
        id: 4,
        name: "CrossFit Arena",
        city: "Calgary",
        province: "Alberta",
        opportunities: ["CrossFit", "Gym", "Boxing"],
        image: "/clubs/pexels-artbovich-7031717.jpg",
        rating: 4.7,
        members: 650,
    },
    {
        id: 5,
        name: "YogaFlow Studio",
        city: "Toronto",
        province: "Ontario",
        opportunities: ["Yoga", "Pilates", "Meditation"],
        image: "/clubs/pexels-artempodrez-5942021.jpg",
        rating: 4.9,
        members: 430,
    },
    {
        id: 6,
        name: "Aqua Center",
        city: "Vancouver",
        province: "British Columbia",
        opportunities: ["Swimming", "Water Aerobics", "Diving"],
        image: "/clubs/pexels-eran-design-2158190390-35215421.jpg",
        rating: 4.5,
        members: 760,
    },
    {
        id: 7,
        name: "Premium Fitness Club",
        city: "Montreal",
        province: "Quebec",
        opportunities: ["Gym", "Swimming", "Spa", "Personal Training"],
        image: "/clubs/pexels-eyecon-design-500632474-17211446.jpg",
        rating: 4.8,
        members: 1580,
    },
    {
        id: 8,
        name: "Boxfit Warriors",
        city: "Calgary",
        province: "Alberta",
        opportunities: ["Boxing", "Gym", "MMA"],
        image: "/clubs/pexels-foadshariyati-29526372.jpg",
        rating: 4.6,
        members: 520,
    },
];

const OPPORTUNITIES = [
    "Gym",
    "Swimming",
    "Yoga",
    "Spa",
    "Pilates",
    "CrossFit",
    "Boxing",
    "Personal Training",
    "Meditation",
    "Water Aerobics",
    "MMA",
    "Diving",
];

const CITIES = Array.from(new Set(MOCK_CLUBS.map((club) => club.city))).sort((a, b) => a.localeCompare(b));
const PROVINCES = Array.from(
    new Set(MOCK_CLUBS.map((club) => club.province))
).sort((a, b) => a.localeCompare(b));

export default function ClubsPage() {
    const [clubs, setClubs] = useState(MOCK_CLUBS);
    const [searchName, setSearchName] = useState("");
    const [selectedCity, setSelectedCity] = useState("");
    const [selectedProvince, setSelectedProvince] = useState("");
    const [selectedOpportunities, setSelectedOpportunities] = useState<string[]>(
        []
    );

    // Refilter whenever filters change
    useEffect(() => {
        let filtered = MOCK_CLUBS;

        if (searchName) {
            filtered = filtered.filter((club) =>
                club.name.toLowerCase().includes(searchName.toLowerCase())
            );
        }

        if (selectedCity) {
            filtered = filtered.filter((club) => club.city === selectedCity);
        }

        if (selectedProvince) {
            filtered = filtered.filter((club) => club.province === selectedProvince);
        }

        if (selectedOpportunities.length > 0) {
            filtered = filtered.filter((club) =>
                selectedOpportunities.some((opp) => club.opportunities.includes(opp))
            );
        }

        setClubs(filtered);
    }, [searchName, selectedCity, selectedProvince, selectedOpportunities]);

    return (
        <>
            {/* Header Section */}
            <section className="w-full py-12 md:py-16 bg-linear-to-b from-primary/10 to-background">
                <div className="container max-w-7xl mx-auto px-4">
                    <div className="flex flex-col gap-4">
                        <h1 className="font-heading text-4xl md:text-5xl font-bold">
                            Find Your Perfect Gym
                        </h1>
                        <p className="text-lg text-muted-foreground max-w-2xl">
                            Discover fitness clubs near you with the opportunities you love.
                        </p>
                    </div>
                </div>
            </section>

            {/* Filters Section - Optimized */}
            <section className="w-full py-8 bg-linear-to-b from-background to-background border-b border-border/50">
                <div className="container max-w-7xl mx-auto px-4">
                    {/* Filter Container with Background */}
                    <div
                        className="bg-linear-to-br from-primary/5 via-primary/3 to-transparent border border-primary/10 rounded-xl p-6 backdrop-blur-sm space-y-5">
                        {/* Filter Title */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Search className="w-5 h-5 text-primary"/>
                                <h2 className="font-heading text-lg font-bold">Find Your Gym</h2>
                            </div>
                            {(searchName || selectedProvince || selectedCity || selectedOpportunities.length > 0) && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                        setSearchName("");
                                        setSelectedCity("");
                                        setSelectedProvince("");
                                        setSelectedOpportunities([]);
                                    }}
                                    className="gap-1"
                                >
                                    <X className="w-4 h-4"/>
                                    Clear All
                                </Button>
                            )}
                        </div>

                        {/* Filters Grid */}
                        <div className="space-y-4">
                            {/* Row 1: Search */}
                            <div className="w-full">
                                <label className="block text-sm font-semibold mb-2 text-foreground">
                                    Search Club Name
                                </label>
                                <div className="relative">
                                    <Search
                                        className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none"/>
                                    <Input
                                        placeholder="Search by club name..."
                                        value={searchName}
                                        onChange={(e) => setSearchName(e.target.value)}
                                        className="w-full pl-10 bg-background/50 border-primary/20 focus:border-primary/40 transition-colors"
                                    />
                                </div>
                            </div>

                            {/* Row 2: Location & Opportunities - Wrapping Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-max">
                                {/* Province Selection */}
                                <div>
                                    <label className="block text-sm font-semibold mb-2 text-foreground">
                                        Province
                                    </label>
                                    <select
                                        value={selectedProvince}
                                        onChange={(e) => setSelectedProvince(e.target.value)}
                                        className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                                    >
                                        <option value="">All Provinces</option>
                                        {PROVINCES.map((province) => (
                                            <option key={province} value={province}>
                                                {province}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* City Selection */}
                                <div>
                                    <label className="block text-sm font-semibold mb-2 text-foreground">
                                        City
                                    </label>
                                    <select
                                        value={selectedCity}
                                        onChange={(e) => setSelectedCity(e.target.value)}
                                        className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                                    >
                                        <option value="">All Cities</option>
                                        {CITIES.filter(
                                            (city) =>
                                                !selectedProvince ||
                                                MOCK_CLUBS.find(
                                                    (c) =>
                                                        c.city === city &&
                                                        c.province === selectedProvince
                                                )
                                        ).map((city) => (
                                            <option key={city} value={city}>
                                                {city}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Services & Activities Combobox */}
                                <div className="sm:col-span-2 lg:col-span-2">
                                    <label className="block text-sm font-semibold mb-2 text-foreground">
                                        Services & Activities
                                    </label>
                                    <Combobox value="" onValueChange={(value) => {
                                        if (value && !selectedOpportunities.includes(value)) {
                                            setSelectedOpportunities([...selectedOpportunities, value]);
                                        }
                                    }}>
                                        <ComboboxChips>
                                            {selectedOpportunities.map((opp) => (
                                                <ComboboxChip
                                                    key={opp}
                                                    showRemove={true}
                                                >
                                                    {opp}
                                                </ComboboxChip>
                                            ))}
                                            <ComboboxChipsInput
                                                placeholder={selectedOpportunities.length === 0 ? "Select services..." : ""}
                                                disabled={false}
                                            />
                                        </ComboboxChips>
                                        <ComboboxContent>
                                            <ComboboxList>
                                                {OPPORTUNITIES.filter(opp => !selectedOpportunities.includes(opp)).map((opp) => (
                                                    <ComboboxItem key={opp} value={opp}>
                                                        {opp}
                                                    </ComboboxItem>
                                                ))}
                                            </ComboboxList>
                                            <ComboboxEmpty>All services selected</ComboboxEmpty>
                                        </ComboboxContent>
                                    </Combobox>
                                </div>
                            </div>

                            {/* Results Counter */}
                            <div className="flex items-center justify-between pt-2 border-t border-primary/10">
                                <div className="text-sm text-foreground">
                                    Results: <span className="text-primary font-bold">{clubs.length}</span> of{" "}
                                    <span className="text-muted-foreground">{MOCK_CLUBS.length}</span> clubs
                                </div>
                                {clubs.length === 0 && (
                                    <span className="text-sm text-destructive">No clubs match your criteria</span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Clubs Grid */}
            <section className="w-full py-12 md:py-16">
                <div className="container max-w-7xl mx-auto px-4">
                    {clubs.length > 0 ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {clubs.map((club) => (
                                <Card key={club.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                                    {/* Club Image */}
                                    <div className="relative w-full h-48 bg-muted overflow-hidden">
                                        <div
                                            className="w-full h-full bg-linear-to-br from-primary/20 to-primary/5 flex items-center justify-center"
                                            style={{
                                                backgroundImage: `url('${club.image}')`,
                                                backgroundSize: "cover",
                                                backgroundPosition: "center",
                                            }}
                                        >
                                            <div className="w-full h-full bg-black/20 flex items-center justify-center">
                                                <Dumbbell className="w-12 h-12 text-white/50"/>
                                            </div>
                                        </div>
                                        <Badge className="absolute top-3 right-3 bg-primary">
                                            ⭐ {club.rating}
                                        </Badge>
                                    </div>

                                    {/* Club Info */}
                                    <CardHeader>
                                        <CardTitle className="text-lg">{club.name}</CardTitle>
                                        <div className="flex items-center gap-1 text-sm text-muted-foreground mt-2">
                                            <MapPin className="w-4 h-4"/>
                                            {club.city}, {club.province}
                                        </div>
                                    </CardHeader>

                                    <CardContent className="space-y-4">
                                        {/* Members */}
                                        <div className="flex items-center gap-2 text-sm">
                                            <Users className="w-4 h-4 text-primary"/>
                                            <span>{club.members} active members</span>
                                        </div>

                                        {/* Opportunities */}
                                        <div>
                                            <p className="text-sm font-medium mb-2">Opportunities:</p>
                                            <div className="flex flex-wrap gap-1">
                                                {club.opportunities.map((opp) => (
                                                    <Badge key={opp} variant="secondary" className="text-xs">
                                                        {opp}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>

                                        {/* CTA Button */}
                                        <Button className="w-full gap-2">
                                            View Details <ChevronRight className="w-4 h-4"/>
                                        </Button>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-lg text-muted-foreground">
                                No clubs found matching your criteria.
                            </p>
                            <Button
                                variant="outline"
                                className="mt-4"
                                onClick={() => {
                                    setSearchName("");
                                    setSelectedCity("");
                                    setSelectedProvince("");
                                    setSelectedOpportunities([]);
                                }}
                            >
                                Clear Filters
                            </Button>
                        </div>
                    )}
                </div>
            </section>
        </>
    );
}

