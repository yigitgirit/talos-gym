"use client";

import {Button} from "@/components/ui/button";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/components/ui/accordion";
import {BarChart3, CheckCircle, ChevronRight, HeartHandshake, Users, Zap} from "lucide-react";

interface Plan {
    name: string;
    price: number;
    period: string;
    description: string;
    features: string[];
    highlighted?: boolean;
    cta: string;
}

const PLANS: Plan[] = [
    {
        name: "Starter",
        price: 0,
        period: "free",
        description: "Perfect for getting started with your fitness journey",
        features: [
            "Basic workout tracking",
            "Access to 1 local club",
            "Community features",
            "Limited analytics",
            "Mobile app access",
            "Monthly progress reports",
        ],
        cta: "Get Started",
    },
    {
        name: "Pro",
        price: 9.99,
        period: "month",
        description: "For serious fitness enthusiasts",
        features: [
            "Advanced workout tracking",
            "Unlimited club access",
            "Full community features",
            "Detailed analytics & insights",
            "Mobile & Web app",
            "Weekly progress reports",
            "Personalized recommendations",
            "Priority support",
            "Exclusive events access",
        ],
        highlighted: true,
        cta: "Subscribe Now",
    },
    {
        name: "Elite",
        price: 19.99,
        period: "month",
        description: "Maximum benefits with personal coaching",
        features: [
            "Everything in Pro",
            "Dedicated personal coach",
            "1-on-1 virtual coaching sessions",
            "Custom workout plans",
            "Nutrition guidance",
            "Performance optimization",
            "Group training sessions",
            "VIP event access",
            "Priority support 24/7",
            "Unlimited coaching sessions",
        ],
        cta: "Get Elite",
    },
];

const COMPARISON_FEATURES = [
    {
        category: "Tracking & Analytics",
        items: [
            "Workout tracking",
            "Performance metrics",
            "Progress analytics",
            "AI insights",
        ],
    },
    {
        category: "Community & Social",
        items: ["Community access", "Challenge participation", "Social features", "Group events"],
    },
    {
        category: "Support & Coaching",
        items: [
            "Email support",
            "Chat support",
            "Personal coach",
            "1-on-1 sessions",
        ],
    },
    {
        category: "App & Platform",
        items: ["Mobile app", "Web access", "Offline mode", "Advanced features"],
    },
];

export default function MembershipPlansPage() {
    return (
        <>
            {/* Header Section */}
            <section className="w-full py-12 md:py-16 bg-gradient-to-b from-primary/10 to-background">
                <div className="container max-w-7xl mx-auto px-4">
                    <div className="flex flex-col gap-4 text-center">
                        <h1 className="font-heading text-4xl md:text-5xl font-bold">
                            Plans for Every Goal
                        </h1>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Choose the perfect plan to match your fitness goals. Upgrade or
                            downgrade anytime.
                        </p>
                    </div>
                </div>
            </section>

            {/* Plans Grid */}
            <section className="w-full py-16 md:py-24">
                <div className="container max-w-7xl mx-auto px-4">
                    <div className="grid md:grid-cols-3 gap-6">
                        {PLANS.map((plan) => (
                            <Card
                                key={plan.name}
                                className={`relative overflow-hidden transition-all ${
                                    plan.highlighted
                                        ? "border-primary shadow-2xl scale-105"
                                        : ""
                                }`}
                            >
                                {plan.highlighted && (
                                    <div
                                        className="absolute top-0 left-0 right-0 bg-primary text-primary-foreground py-2 text-center text-sm font-semibold">
                                        Most Popular
                                    </div>
                                )}

                                <CardHeader className={plan.highlighted ? "mt-8" : ""}>
                                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                                    <p className="text-sm text-muted-foreground mt-2">
                                        {plan.description}
                                    </p>
                                </CardHeader>

                                <CardContent className="space-y-6">
                                    {/* Pricing */}
                                    <div>
                                        <div className="flex items-baseline gap-1">
                        <span className="font-heading text-4xl font-bold">
                          ${plan.price}
                        </span>
                                            <span className="text-sm text-muted-foreground">
                          /{plan.period}
                        </span>
                                        </div>
                                    </div>

                                    {/* Features List */}
                                    <ul className="space-y-3">
                                        {plan.features.map((feature) => (
                                            <li
                                                key={feature}
                                                className="flex gap-3 items-start text-sm"
                                            >
                                                <CheckCircle className="w-5 h-5 text-primary shrink-0 mt-0.5"/>
                                                <span>{feature}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    {/* CTA Button */}
                                    <Button
                                        className="w-full gap-2"
                                        variant={plan.highlighted ? "default" : "outline"}
                                        size="lg"
                                    >
                                        {plan.cta} <ChevronRight className="w-4 h-4"/>
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Enterprise Section */}
            <section className="w-full py-16 md:py-24 bg-muted/30">
                <div className="container max-w-7xl mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-8 items-center">
                        <div>
                            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
                                Enterprise for Gyms
                            </h2>
                            <p className="text-lg text-muted-foreground mb-6">
                                Elevate your gym with TalosGym&apos;s enterprise solution. White-label
                                technology, custom branding, and dedicated support for your
                                members.
                            </p>
                            <ul className="space-y-3 mb-8">
                                <li className="flex gap-3 items-start">
                                    <HeartHandshake className="w-5 h-5 text-primary shrink-0 mt-0.5"/>
                                    <span>Dedicated account manager</span>
                                </li>
                                <li className="flex gap-3 items-start">
                                    <Zap className="w-5 h-5 text-primary shrink-0 mt-0.5"/>
                                    <span>Custom API integrations</span>
                                </li>
                                <li className="flex gap-3 items-start">
                                    <Users className="w-5 h-5 text-primary shrink-0 mt-0.5"/>
                                    <span>White-label mobile & web apps</span>
                                </li>
                                <li className="flex gap-3 items-start">
                                    <BarChart3 className="w-5 h-5 text-primary shrink-0 mt-0.5"/>
                                    <span>Advanced analytics & reporting</span>
                                </li>
                            </ul>
                            <Button size="lg" className="gap-2">
                                Request Demo <ChevronRight className="w-4 h-4"/>
                            </Button>
                        </div>
                        <div
                            className="h-96 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-border flex items-center justify-center text-muted-foreground">
                            <div className="text-center">
                                <Users className="w-16 h-16 mx-auto mb-4 opacity-50"/>
                                <p>Enterprise Partnership</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Feature Comparison */}
            <section className="w-full py-16 md:py-24">
                <div className="container max-w-7xl mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
                            Feature Comparison
                        </h2>
                        <p className="text-lg text-muted-foreground">
                            See what&apos;s included in each plan
                        </p>
                    </div>

                    <div className="space-y-8">
                        {COMPARISON_FEATURES.map((category) => (
                            <div key={category.category}>
                                <h3 className="font-heading font-bold text-xl mb-4">
                                    {category.category}
                                </h3>
                                <div className="grid md:grid-cols-4 gap-4">
                                    {category.items.map((item) => (
                                        <div key={item}
                                             className="flex items-center gap-2 p-3 rounded-lg border border-border">
                                            <CheckCircle className="w-5 h-5 text-primary shrink-0"/>
                                            <span className="text-sm">{item}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="w-full py-16 md:py-24 bg-muted/30">
                <div className="container max-w-7xl mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
                            Frequently Asked Questions
                        </h2>
                    </div>

                    <Accordion type="single" collapsible className="w-full">
                        {[
                            {
                                q: "Can I change plans anytime?",
                                a: "Yes! You can upgrade or downgrade your plan at any time. Changes take effect on your next billing cycle.",
                            },
                            {
                                q: "Do you offer refunds?",
                                a: "We offer a 14-day money-back guarantee if you're not satisfied with your subscription.",
                            },
                            {
                                q: "Is there a contract?",
                                a: "No contracts! Cancel anytime. All plans are month-to-month with no long-term commitment.",
                            },
                            {
                                q: "What payment methods do you accept?",
                                a: "We accept all major credit cards, PayPal, and Apple Pay.",
                            },
                        ].map((item, i) => (
                            <AccordionItem key={i} value={`item-${i}`}>
                                <AccordionTrigger>{item.q}</AccordionTrigger>
                                <AccordionContent>
                                    <p className="text-muted-foreground">{item.a}</p>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            </section>
        </>
    );
}

