"use client";

import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";

export default function PrivacyPage() {
    return (
        <>
            {/* Header Section */}
            <section className="w-full py-12 md:py-16 bg-gradient-to-b from-primary/10 to-background">
                <div className="container max-w-7xl mx-auto px-4">
                    <div className="flex flex-col gap-4">
                        <h1 className="font-heading text-4xl md:text-5xl font-bold">
                            Privacy Policy
                        </h1>
                        <p className="text-lg text-muted-foreground">
                            Last updated: April 2026
                        </p>
                    </div>
                </div>
            </section>

            {/* Privacy Content */}
            <section className="w-full py-12 md:py-24">
                <div className="container max-w-4xl mx-auto px-4">
                    <div className="prose prose-lg max-w-none space-y-8">
                        <Card>
                            <CardHeader>
                                <CardTitle>1. Introduction</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 text-muted-foreground">
                                <p>
                                    TalosGym Inc. (&quot;Company,&quot; &quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting
                                    your privacy. This Privacy Policy explains how we collect, use, disclose, and
                                    safeguard your information when you visit our website and mobile application.
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>2. Information We Collect</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 text-muted-foreground">
                                <div>
                                    <h3 className="font-heading font-bold mb-2">Personal Information</h3>
                                    <p>
                                        We collect information you provide directly, such as your name, email address,
                                        phone number, and fitness-related data.
                                    </p>
                                </div>
                                <div>
                                    <h3 className="font-heading font-bold mb-2">Usage Information</h3>
                                    <p>
                                        We automatically collect information about your interactions with our platform,
                                        including pages visited, features used, and timestamps.
                                    </p>
                                </div>
                                <div>
                                    <h3 className="font-heading font-bold mb-2">Device Information</h3>
                                    <p>
                                        We collect device identifiers, operating system, browser type, and other
                                        technical information.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>3. How We Use Your Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 text-muted-foreground">
                                <ul className="list-disc list-inside space-y-2">
                                    <li>Provide, maintain, and improve our services</li>
                                    <li>Send promotional communications and updates</li>
                                    <li>Respond to your inquiries and support requests</li>
                                    <li>Analyze usage patterns to enhance user experience</li>
                                    <li>Prevent fraud and ensure security</li>
                                    <li>Comply with legal obligations</li>
                                </ul>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>4. Information Sharing and Disclosure</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 text-muted-foreground">
                                <p>
                                    We do not sell, rent, or lease your personal information to third parties. We may
                                    share information with:
                                </p>
                                <ul className="list-disc list-inside space-y-2">
                                    <li>Service providers who assist in operating our platform</li>
                                    <li>Your gym and coaches (with your consent)</li>
                                    <li>Law enforcement when required by law</li>
                                    <li>Business partners for analytics and improvements</li>
                                </ul>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>5. Data Security</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 text-muted-foreground">
                                <p>
                                    We implement comprehensive security measures including encryption, firewalls, and
                                    secure servers to protect your personal information. However, no method of
                                    transmission over the internet is completely secure.
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>6. Your Privacy Rights</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 text-muted-foreground">
                                <p>Depending on your location, you may have the right to:</p>
                                <ul className="list-disc list-inside space-y-2">
                                    <li>Access your personal information</li>
                                    <li>Correct inaccurate data</li>
                                    <li>Delete your data</li>
                                    <li>Opt-out of marketing communications</li>
                                    <li>Port your data to another service</li>
                                </ul>
                                <p className="mt-4">
                                    To exercise these rights, contact us at privacy@talosgym.app.
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>7. Cookies and Tracking Technologies</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 text-muted-foreground">
                                <p>
                                    We use cookies and similar tracking technologies to enhance your experience,
                                    remember preferences, and analyze usage patterns. You can control cookie
                                    preferences through your browser settings.
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>8. Third-Party Links</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 text-muted-foreground">
                                <p>
                                    Our platform may contain links to third-party websites. We are not responsible
                                    for their privacy practices. Please review their privacy policies before sharing
                                    information.
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>9. Contact Us</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 text-muted-foreground">
                                <p>
                                    If you have questions about this Privacy Policy, please contact us at:
                                </p>
                                <div className="bg-muted p-4 rounded-lg">
                                    <p>TalosGym Inc.</p>
                                    <p>123 Fitness Street</p>
                                    <p>Toronto, ON M5V 3A8</p>
                                    <p>Email: privacy@talosgym.app</p>
                                    <p>Phone: +1 (555) 123-4567</p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>10. Policy Updates</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 text-muted-foreground">
                                <p>
                                    We may update this Privacy Policy periodically. We will notify you of significant
                                    changes via email or prominent notice on our platform. Your continued use of our
                                    services following such notification constitutes your acceptance of the updated
                                    policy.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>
        </>
    );
}

