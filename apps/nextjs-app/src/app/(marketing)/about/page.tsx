"use client";

import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {ChevronRight, Globe, Target, Users, Zap} from "lucide-react";

export default function AboutPage() {
    return (
        <>
            {/* Header Section */}
            <section className="w-full py-12 md:py-16 bg-gradient-to-b from-primary/10 to-background">
                <div className="container max-w-7xl mx-auto px-4">
                    <div className="flex flex-col gap-4">
                        <h1 className="font-heading text-4xl md:text-5xl font-bold">
                            About TalosGym
                        </h1>
                        <p className="text-lg text-muted-foreground max-w-2xl">
                            Revolutionizing fitness through community, technology, and dedication.
                        </p>
                    </div>
                </div>
            </section>

            {/* Mission & Vision */}
            <section className="w-full py-16 md:py-24">
                <div className="container max-w-7xl mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-12">
                        <div>
                            <h2 className="font-heading text-3xl font-bold mb-4">
                                Our Mission
                            </h2>
                            <p className="text-lg text-muted-foreground mb-4">
                                At TalosGym, we believe fitness should be accessible, social, and
                                rewarding. Our mission is to connect fitness enthusiasts with gyms
                                and create a supportive community that motivates everyone to reach
                                their goals.
                            </p>
                            <p className="text-lg text-muted-foreground">
                                We&apos;re building the platform that makes fitness a lifestyle, not just
                                a chore.
                            </p>
                        </div>
                        <div>
                            <h2 className="font-heading text-3xl font-bold mb-4">
                                Our Vision
                            </h2>
                            <p className="text-lg text-muted-foreground mb-4">
                                We envision a world where fitness is woven into daily life, where
                                communities support each other&apos;s growth, and where technology enables
                                personalized fitness experiences at scale.
                            </p>
                            <p className="text-lg text-muted-foreground">
                                By 2030, we aim to be the leading fitness community platform used by
                                millions globally.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="w-full py-16 md:py-24 bg-muted/30">
                <div className="container max-w-7xl mx-auto px-4">
                    <h2 className="font-heading text-3xl font-bold mb-12 text-center">
                        Our Core Values
                    </h2>
                    <div className="grid md:grid-cols-4 gap-6">
                        <Card>
                            <CardHeader>
                                <Users className="w-8 h-8 text-primary mb-2"/>
                                <CardTitle>Community</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">
                                    We believe in the power of community to inspire and motivate.
                                    Every member matters.
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <Target className="w-8 h-8 text-primary mb-2"/>
                                <CardTitle>Accountability</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">
                                    We&apos;re committed to helping you achieve your goals with honesty
                                    and transparency.
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <Zap className="w-8 h-8 text-primary mb-2"/>
                                <CardTitle>Innovation</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">
                                    Technology should enhance fitness, not complicate it. We innovate
                                    for impact.
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <Globe className="w-8 h-8 text-primary mb-2"/>
                                <CardTitle>Inclusivity</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">
                                    Fitness is for everyone. We welcome all body types, abilities, and
                                    experience levels.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Team Stats */}
            <section className="w-full py-16 md:py-24">
                <div className="container max-w-7xl mx-auto px-4">
                    <h2 className="font-heading text-3xl font-bold mb-12 text-center">
                        By The Numbers
                    </h2>
                    <div className="grid md:grid-cols-4 gap-8 text-center">
                        <div>
                            <div className="font-heading text-4xl font-bold text-primary mb-2">
                                50K+
                            </div>
                            <p className="text-muted-foreground">Active Members</p>
                        </div>
                        <div>
                            <div className="font-heading text-4xl font-bold text-primary mb-2">
                                500+
                            </div>
                            <p className="text-muted-foreground">Partner Gyms</p>
                        </div>
                        <div>
                            <div className="font-heading text-4xl font-bold text-primary mb-2">
                                8
                            </div>
                            <p className="text-muted-foreground">Countries</p>
                        </div>
                        <div>
                            <div className="font-heading text-4xl font-bold text-primary mb-2">
                                4+
                            </div>
                            <p className="text-muted-foreground">Years Strong</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Story */}
            <section className="w-full py-16 md:py-24 bg-muted/30">
                <div className="container max-w-7xl mx-auto px-4 max-w-2xl">
                    <h2 className="font-heading text-3xl font-bold mb-8 text-center">
                        Our Story
                    </h2>
                    <div className="space-y-6 text-lg text-muted-foreground">
                        <p>
                            TalosGym was born from a simple observation: most people struggle with
                            fitness not because of lack of motivation, but because they lack community
                            and accountability.
                        </p>
                        <p>
                            Founded in 2020 by a group of fitness enthusiasts who got tired of
                            juggling multiple apps, we set out to create a unified platform that
                            connects people with gyms, coaches, and each other.
                        </p>
                        <p>
                            What started as a small project in a garage has grown into a thriving
                            platform serving thousands of users across multiple countries. Today,
                            we continue to innovate and expand, always keeping our community at the
                            heart of everything we do.
                        </p>
                        <p>
                            We&apos;re just getting started. Join us on this journey to revolutionize
                            fitness.
                        </p>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="w-full py-16 md:py-24">
                <div className="container max-w-7xl mx-auto px-4">
                    <div className="text-center">
                        <h2 className="font-heading text-3xl md:text-4xl font-bold mb-6">
                            Ready to Join the Movement?
                        </h2>
                        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                            Start your fitness journey with TalosGym today and discover what
                            community-driven fitness can achieve.
                        </p>
                        <Button size="lg" className="gap-2">
                            Get Started <ChevronRight className="w-4 h-4"/>
                        </Button>
                    </div>
                </div>
            </section>
        </>
    );
}

