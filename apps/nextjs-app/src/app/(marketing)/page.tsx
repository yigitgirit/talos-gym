"use client";

import Image from "next/image";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Award, BarChart3, ChevronRight, Clock, Globe, Smartphone, Target, TrendingUp, Users, Zap} from "lucide-react";


const HeroSection = ({ videoUrl }: { videoUrl: string }) => (
    <section className="w-full relative overflow-hidden" style={{height: 'calc(100vh - 64px)'}}>
        {/* Background Video or Image */}
        {videoUrl ? (
            <video
                autoPlay
                loop
                muted
                playsInline
                poster="/hero-section-poster.jpeg"
                className="absolute inset-0 w-full h-full object-cover z-0"
            >
                <source src={videoUrl} type="video/mp4" />
            </video>
        ) : (
            <div
                className="absolute inset-0 w-full h-full object-cover z-0"
                style={{
                    backgroundImage: 'url(/hero-section-poster.jpeg)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}
            />
        )}

        {/* Left gradient overlay - responsive */}
        <div className="hero-scrim absolute inset-0 z-1"/>

        {/* Content - Left aligned, responsive */}
        <div className="relative z-10 w-full h-full flex items-center">
            <div className="w-full py-8 sm:py-12">
                <div className="container max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                    <div className="max-w-2xl">
                        {/* Label - smaller on mobile */}
                        <div className="flex items-center gap-2 mb-4 sm:mb-6">
                            <div className="w-2 h-2 rounded-full bg-overlay-foreground/50"></div>
                            <p className="text-overlay-foreground/60 text-xs sm:text-sm font-medium">Join 50,000+ athletes
                                worldwide</p>
                        </div>

                        {/* Title - responsive sizing */}
                        <h1 className="font-heading text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold text-overlay-foreground mb-4 sm:mb-6 leading-tight">
                            Your Fitness
                            <br/>
                            Community Awaits
                        </h1>

                        {/* Description - responsive sizing */}
                        <p className="text-overlay-muted text-sm sm:text-base md:text-lg mb-6 sm:mb-8 leading-relaxed max-w-xl">
                            Connect with thousands of fitness enthusiasts. Track your progress, join challenges, share
                            achievements, and reach your goals faster with a supportive community.
                        </p>

                        {/* Features list - responsive grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-8 sm:mb-10 max-w-sm">
                            <div className="flex items-center gap-2">
                                <div className="w-1 h-4 bg-overlay-foreground/70 rounded-full shrink-0"></div>
                                <span className="text-overlay-muted text-xs sm:text-sm font-medium">Real-time Tracking</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-1 h-4 bg-overlay-foreground/70 rounded-full shrink-0"></div>
                                <span className="text-overlay-muted text-xs sm:text-sm font-medium">Live Challenges</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-1 h-4 bg-overlay-foreground/70 rounded-full shrink-0"></div>
                                <span className="text-overlay-muted text-xs sm:text-sm font-medium">Community Support</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-1 h-4 bg-overlay-foreground/70 rounded-full shrink-0"></div>
                                <span className="text-overlay-muted text-xs sm:text-sm font-medium">Exclusive Rewards</span>
                            </div>
                        </div>

                        {/* CTA Buttons - responsive sizing */}
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                            <Button
                                size="sm"
                                className="gap-2 bg-overlay-foreground text-overlay hover:bg-overlay-foreground/90 font-semibold transition-all text-sm sm:text-base"
                            >
                                Start Free <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4"/>
                            </Button>
                            <Button
                                size="sm"
                                className="gap-2 border border-overlay-border bg-overlay-subtle text-overlay-foreground hover:bg-overlay-foreground/20 font-semibold transition-all backdrop-blur-sm text-sm sm:text-base"
                            >
                                Learn More
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Scroll indicator - hidden on small screens */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 hidden sm:block">
            <div className="animate-bounce text-overlay-foreground/40">
                <ChevronRight className="w-6 h-6 rotate-90"/>
            </div>
        </div>
    </section>
);

const GymConceptsSection = () => (
    <section id="features" className="w-full py-12 sm:py-16 md:py-20 lg:py-32 px-4 sm:px-6 md:px-8">
        <div className="container max-w-7xl mx-auto">
            <div className="text-center mb-8 sm:mb-12">
                <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-4">
                    Gym Concepts Reimagined
                </h2>
                <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto px-2">
                    Experience fitness beyond the equipment. Join our thriving community features.
                </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                <Card>
                    <CardHeader>
                        <div className="flex items-start justify-between">
                            <div>
                                <Users className="w-6 sm:w-8 h-6 sm:h-8 text-primary mb-3 sm:mb-4"/>
                                <CardTitle className="text-base sm:text-lg">Exclusive Clubs</CardTitle>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                            Join specialized clubs based on your fitness interests. From powerlifting to yoga, find your
                            tribe and train together.
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <div className="flex items-start justify-between">
                            <div>
                                <Zap className="w-6 sm:w-8 h-6 sm:h-8 text-primary mb-3 sm:mb-4"/>
                                <CardTitle className="text-base sm:text-lg">Social Hub</CardTitle>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                            Share achievements, motivate friends, and celebrate milestones together. Connect with
                            like-minded fitness enthusiasts.
                        </p>
                    </CardContent>
                </Card>
                <Card className="sm:col-span-2 lg:col-span-1">
                    <CardHeader>
                        <div className="flex items-start justify-between">
                            <div>
                                <Target className="w-6 sm:w-8 h-6 sm:h-8 text-primary mb-3 sm:mb-4"/>
                                <CardTitle className="text-base sm:text-lg">Sportive Actions</CardTitle>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                            Participate in challenges, competitions, and events. Compete with your community and test
                            your limits.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    </section>
);

const AppMarketingSection = () => (
    <section id="app" className="w-full py-12 sm:py-16 md:py-20 lg:py-32 bg-muted/30 px-4 sm:px-6 md:px-8">
        <div className="container max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
                <div>
                    <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">
                        Fitness in Your Pocket
                    </h2>
                    <p className="text-sm sm:text-base md:text-lg text-muted-foreground mb-6 sm:mb-8">
                        Access TalosGym anywhere, anytime. Our mobile and web apps sync seamlessly, keeping your fitness
                        data always up to date.
                    </p>
                    <ul className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                        <li className="flex gap-3 items-start">
                            <Smartphone className="w-4 h-4 sm:w-5 sm:h-5 text-primary mt-1 shrink-0"/>
                            <div>
                                <p className="font-medium text-sm sm:text-base">Native Mobile Apps</p>
                                <p className="text-xs sm:text-sm text-muted-foreground">iOS and Android apps with
                                    offline support</p>
                            </div>
                        </li>
                        <li className="flex gap-3 items-start">
                            <Globe className="w-4 h-4 sm:w-5 sm:h-5 text-primary mt-1 shrink-0"/>
                            <div>
                                <p className="font-medium text-sm sm:text-base">Progressive Web App</p>
                                <p className="text-xs sm:text-sm text-muted-foreground">Access from any browser,
                                    anywhere</p>
                            </div>
                        </li>
                        <li className="flex gap-3 items-start">
                            <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-primary mt-1 shrink-0"/>
                            <div>
                                <p className="font-medium text-sm sm:text-base">Real-time Sync</p>
                                <p className="text-xs sm:text-sm text-muted-foreground">All your data synced across
                                    devices instantly</p>
                            </div>
                        </li>
                    </ul>
                    {/* App Store Badges */}
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 flex-wrap">
                        <a href="https://apps.apple.com/app/talosgym" target="_blank" rel="noopener noreferrer"
                           className="inline-block">
                            <Image
                                src="/Download_on_the_App_Store_Badge.svg"
                                alt="Download on App Store"
                                width={120}
                                height={40}
                                className="h-10 sm:h-12 w-auto"
                            />
                        </a>
                        <a href="https://play.google.com/store/apps/details?id=com.talosgym" target="_blank"
                           rel="noopener noreferrer" className="inline-block">
                            <Image
                                src="/Google_Play_Store_badge_EN.svg"
                                alt="Get it on Google Play"
                                width={135}
                                height={40}
                                className="h-10 sm:h-12 w-auto"
                            />
                        </a>
                    </div>
                </div>
                <div
                    className="h-64 sm:h-80 md:h-96 rounded-lg sm:rounded-xl bg-linear-to-br from-primary/20 to-primary/5 border border-border flex items-center justify-center text-muted-foreground">
                    <div className="text-center">
                        <Smartphone className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-2 sm:mb-4 opacity-50"/>
                        <p className="text-xs sm:text-sm">App Preview Area</p>
                    </div>
                </div>
            </div>
        </div>
    </section>
);

const AnalyticsSection = () => (
    <section className="w-full py-12 sm:py-16 md:py-20 lg:py-32 px-4 sm:px-6 md:px-8">
        <div className="container max-w-7xl mx-auto">
            <div className="text-center mb-8 sm:mb-12">
                <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-4">
                    Track Everything That Matters
                </h2>
                <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto px-2">
                    Powerful analytics and insights to help you understand your progress.
                </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                <div
                    className="h-64 sm:h-72 md:h-80 rounded-lg sm:rounded-xl bg-linear-to-br from-primary/20 to-primary/5 border border-border flex items-center justify-center text-muted-foreground">
                    <div className="text-center">
                        <BarChart3 className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-2 sm:mb-4 opacity-50"/>
                        <p className="text-xs sm:text-sm">Analytics Dashboard</p>
                    </div>
                </div>
                <div className="flex flex-col justify-center gap-4 sm:gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                                <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-primary shrink-0"/>
                                Detailed Metrics
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-xs sm:text-sm">Track volume, intensity, and consistency across all your
                                workouts with granular detail.</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                                <Award className="w-4 h-4 sm:w-5 sm:h-5 text-primary shrink-0"/>
                                Performance Insights
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-xs sm:text-sm">Get personalized recommendations to optimize your training
                                and break through plateaus.</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    </section>
);

const CommunitySection = () => (
    <section className="w-full py-12 sm:py-16 md:py-20 lg:py-32 bg-muted/30 px-4 sm:px-6 md:px-8">
        <div className="container max-w-7xl mx-auto">
            <div className="text-center mb-8 sm:mb-12">
                <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-4">
                    Built by Community, For Community
                </h2>
                <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto px-2">
                    Join over 50,000+ active members pushing their limits together.
                </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex flex-col justify-center gap-4 sm:gap-6">
                    <div className="flex gap-3 sm:gap-4">
                        <div
                            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                            <Users className="w-5 h-5 sm:w-6 sm:h-6 text-primary"/>
                        </div>
                        <div>
                            <h3 className="font-heading font-bold text-sm sm:text-base mb-1">Active Members</h3>
                            <p className="text-xs sm:text-sm text-muted-foreground">Support network of dedicated fitness
                                enthusiasts</p>
                        </div>
                    </div>
                    <div className="flex gap-3 sm:gap-4">
                        <div
                            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                            <Target className="w-5 h-5 sm:w-6 sm:h-6 text-primary"/>
                        </div>
                        <div>
                            <h3 className="font-heading font-bold text-sm sm:text-base mb-1">Daily Challenges</h3>
                            <p className="text-xs sm:text-sm text-muted-foreground">Compete and collaborate with the
                                community</p>
                        </div>
                    </div>
                    <div className="flex gap-3 sm:gap-4">
                        <div
                            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                            <Award className="w-5 h-5 sm:w-6 sm:h-6 text-primary"/>
                        </div>
                        <div>
                            <h3 className="font-heading font-bold text-sm sm:text-base mb-1">Rewards & Badges</h3>
                            <p className="text-xs sm:text-sm text-muted-foreground">Earn recognition for your
                                achievements</p>
                        </div>
                    </div>
                </div>
                <div
                    className="h-64 sm:h-72 md:h-80 rounded-lg sm:rounded-xl bg-linear-to-br from-primary/20 to-primary/5 border border-border flex items-center justify-center text-muted-foreground">
                    <div className="text-center">
                        <Users className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-2 sm:mb-4 opacity-50"/>
                        <p className="text-xs sm:text-sm">Community Showcase</p>
                    </div>
                </div>
            </div>
        </div>
    </section>
);

const PricingSection = () => (
    <section className="w-full py-12 sm:py-16 md:py-20 lg:py-32 px-4 sm:px-6 md:px-8">
        <div className="container max-w-7xl mx-auto">
            <div className="text-center mb-8 sm:mb-12">
                <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-4">
                    Plans for Every Fitness Level
                </h2>
                <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto px-2">
                    Choose the perfect plan to start your journey today.
                </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base sm:text-lg">Starter</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4">
                        <div className="text-2xl sm:text-3xl font-bold font-heading">Free</div>
                        <ul className="space-y-2 text-xs sm:text-sm">
                            <li className="flex gap-2">
                                <span className="text-primary shrink-0">✓</span> Basic workout tracking
                            </li>
                            <li className="flex gap-2">
                                <span className="text-primary shrink-0">✓</span> Community access
                            </li>
                            <li className="flex gap-2">
                                <span className="text-primary shrink-0">✓</span> Limited analytics
                            </li>
                        </ul>
                        <Button variant="outline" className="w-full text-xs sm:text-sm" size="sm">
                            Get Started
                        </Button>
                    </CardContent>
                </Card>
                <Card className="border-primary sm:col-span-2 lg:col-span-1">
                    <CardHeader>
                        <CardTitle className="text-base sm:text-lg">Pro</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4">
                        <div className="text-2xl sm:text-3xl font-bold font-heading">$9.99<span
                            className="text-sm sm:text-lg text-muted-foreground">/mo</span></div>
                        <ul className="space-y-2 text-xs sm:text-sm">
                            <li className="flex gap-2">
                                <span className="text-primary shrink-0">✓</span> Advanced analytics
                            </li>
                            <li className="flex gap-2">
                                <span className="text-primary shrink-0">✓</span> Personalized coaching
                            </li>
                            <li className="flex gap-2">
                                <span className="text-primary shrink-0">✓</span> Priority support
                            </li>
                        </ul>
                        <Button className="w-full text-xs sm:text-sm" size="sm">
                            Subscribe Now
                        </Button>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base sm:text-lg">Enterprise</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4">
                        <div className="text-2xl sm:text-3xl font-bold font-heading">Custom</div>
                        <ul className="space-y-2 text-xs sm:text-sm">
                            <li className="flex gap-2">
                                <span className="text-primary shrink-0">✓</span> Dedicated account manager
                            </li>
                            <li className="flex gap-2">
                                <span className="text-primary shrink-0">✓</span> Custom integrations
                            </li>
                            <li className="flex gap-2">
                                <span className="text-primary shrink-0">✓</span> White-label options
                            </li>
                        </ul>
                        <Button variant="outline" className="w-full text-xs sm:text-sm" size="sm">
                            Contact Sales
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    </section>
);

const CTASection = () => (
    <section
        className="w-full py-12 sm:py-16 md:py-20 lg:py-32 bg-linear-to-r from-primary to-primary/80 text-primary-foreground px-4 sm:px-6 md:px-8">
        <div className="container max-w-7xl mx-auto text-center">
            <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">
                Ready to Transform Your Fitness?
            </h2>
            <p className="text-sm sm:text-base md:text-lg mb-6 sm:mb-8 max-w-2xl mx-auto opacity-90">
                Join thousands of athletes already using TalosGym. Start your free trial today, no credit card required.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                <Button size="sm" 
                        className="gap-2 bg-primary-foreground text-primary hover:bg-primary-foreground/90 text-xs sm:text-sm md:text-base">
                    Start Free Trial <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4"/>
                </Button>
                <Button size="sm" variant="outline"
                        className="gap-2 bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10 text-xs sm:text-sm md:text-base">
                    Schedule Demo
                </Button>
            </div>
        </div>
    </section>
);


export default function Home() {
    const videoUrl = "https://wyuetersls0cldjq.public.blob.vercel-storage.com/4367640-hd_1920_1080_30fps.mp4";

    return (
        <>
            <HeroSection videoUrl={videoUrl} />
            <GymConceptsSection/>
            <AppMarketingSection/>
            <AnalyticsSection/>
            <CommunitySection/>
            <PricingSection/>
            <CTASection/>
        </>
    );
}
