"use client";

import React, {useState} from "react";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {ChevronRight, Clock, Mail, MapPin, Phone} from "lucide-react";

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const {name, value} = e.target;
        setFormData((prev) => ({...prev, [name]: value}));
    };

    const handleSubmit = (e: React.SubmitEvent) => {
        e.preventDefault();
        console.log("Form submitted:", formData);
        // Reset form
        setFormData({name: "", email: "", subject: "", message: ""});
    };

    return (
        <>
            {/* Header Section */}
            <section className="w-full py-12 md:py-16 bg-linear-to-b from-primary/10 to-background">
                <div className="container max-w-7xl mx-auto px-4">
                    <div className="flex flex-col gap-4">
                        <h1 className="font-heading text-4xl md:text-5xl font-bold">
                            Get In Touch
                        </h1>
                        <p className="text-lg text-muted-foreground max-w-2xl">
                            We&apos;d love to hear from you. Send us a message and we&apos;ll respond as soon as possible.
                        </p>
                    </div>
                </div>
            </section>

            {/* Contact Info Cards */}
            <section className="w-full py-16 md:py-24">
                <div className="container max-w-7xl mx-auto px-4">
                    <div className="grid md:grid-cols-3 gap-6 mb-16">
                        <Card>
                            <CardHeader>
                                <Mail className="w-8 h-8 text-primary mb-2"/>
                                <CardTitle>Email</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground mb-2">
                                    support@talosgym.app
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    We typically respond within 24 hours.
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <Phone className="w-8 h-8 text-primary mb-2"/>
                                <CardTitle>Phone</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground mb-2">
                                    +1 (555) 123-4567
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    Available Monday to Friday, 9am-6pm EST.
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <MapPin className="w-8 h-8 text-primary mb-2"/>
                                <CardTitle>Office</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground mb-2">
                                    123 Fitness Street<br/>
                                    Toronto, ON M5V 3A8
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    Canada
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Contact Form */}
                    <div className="grid md:grid-cols-2 gap-12">
                        <div>
                            <h2 className="font-heading text-2xl font-bold mb-6">
                                Send us a Message
                            </h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Your Name
                                    </label>
                                    <Input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="John Doe"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Email Address
                                    </label>
                                    <Input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="john@example.com"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Subject
                                    </label>
                                    <Input
                                        type="text"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        placeholder="How can we help?"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Message
                                    </label>
                                    <Textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        placeholder="Tell us more about your inquiry..."
                                        rows={5}
                                        required
                                    />
                                </div>

                                <Button type="submit" size="lg" className="gap-2">
                                    Send Message <ChevronRight className="w-4 h-4"/>
                                </Button>
                            </form>
                        </div>

                        {/* Contact Info Sidebar */}
                        <div>
                            <h2 className="font-heading text-2xl font-bold mb-6">
                                Business Hours
                            </h2>
                            <Card>
                                <CardContent className="pt-6">
                                    <div className="space-y-4">
                                        <div className="flex justify-between">
                                            <span>Monday - Friday</span>
                                            <span className="font-medium">9:00 AM - 6:00 PM</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Saturday</span>
                                            <span className="font-medium">10:00 AM - 4:00 PM</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Sunday</span>
                                            <span className="font-medium">Closed</span>
                                        </div>
                                    </div>

                                    <div className="mt-8 pt-8 border-t border-border space-y-4">
                                        <h3 className="font-heading font-bold">
                                            Get Support Faster
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                            Check out our help center for instant answers to common
                                            questions.
                                        </p>
                                        <Button variant="outline" className="w-full">
                                            Visit Help Center
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Live Chat */}
                            <Card className="mt-6">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Clock className="w-5 h-5 text-primary"/>
                                        Live Chat Available
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground mb-4">
                                        Chat with our support team in real-time during business hours.
                                    </p>
                                    <Button className="w-full">
                                        Start Live Chat <ChevronRight className="w-4 h-4"/>
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="w-full py-16 md:py-24 bg-muted/30">
                <div className="container max-w-7xl mx-auto px-4">
                    <h2 className="font-heading text-3xl font-bold mb-12 text-center">
                        Frequently Asked Questions
                    </h2>
                    <div className="space-y-4 max-w-2xl mx-auto">
                        {[
                            {
                                q: "What's the best way to reach customer support?",
                                a: "You can contact us via email, phone, or live chat. Email responses typically come within 24 hours.",
                            },
                            {
                                q: "Do you have a developer API?",
                                a: "Yes! We have comprehensive API documentation available. Contact our enterprise team for access.",
                            },
                            {
                                q: "How can gym owners partner with TalosGym?",
                                a: "We'd love to work with gym owners! Reach out to our partnerships team at partnerships@talosgym.app.",
                            },
                            {
                                q: "Is there a complaints or feedback process?",
                                a: "Absolutely. We value your feedback. Send us any suggestions or concerns, and we'll get back to you promptly.",
                            },
                        ].map((item, i) => (
                            <Card key={i}>
                                <CardHeader>
                                    <CardTitle className="text-lg">{item.q}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground">{item.a}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}

