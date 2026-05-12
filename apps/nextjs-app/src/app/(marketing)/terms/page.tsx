"use client";

import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";

export default function TermsPage() {
    return (
        <>
            {/* Header Section */}
            <section className="w-full py-12 md:py-16 bg-gradient-to-b from-primary/10 to-background">
                <div className="container max-w-7xl mx-auto px-4">
                    <div className="flex flex-col gap-4">
                        <h1 className="font-heading text-4xl md:text-5xl font-bold">
                            Terms of Service
                        </h1>
                        <p className="text-lg text-muted-foreground">
                            Last updated: April 2026
                        </p>
                    </div>
                </div>
            </section>

            {/* Terms Content */}
            <section className="w-full py-12 md:py-24">
                <div className="container max-w-4xl mx-auto px-4">
                    <div className="prose prose-lg max-w-none space-y-8">
                        <Card>
                            <CardHeader>
                                <CardTitle>1. Acceptance of Terms</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 text-muted-foreground">
                                <p>
                                    By accessing and using TalosGym, you accept and agree to be bound by the terms
                                    and provision of this agreement. If you do not agree to abide by the above, please
                                    do not use this service.
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>2. Use License</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 text-muted-foreground">
                                <p>
                                    Permission is granted to temporarily download one copy of the materials (information
                                    or software) on TalosGym for personal, non-commercial transitory viewing only. This
                                    is the grant of a license, not a transfer of title, and under this license you may
                                    not:
                                </p>
                                <ul className="list-disc list-inside space-y-2">
                                    <li>Modifying or copying the materials</li>
                                    <li>Using the materials for any commercial purpose or for any public display</li>
                                    <li>Attempting to decompile or reverse engineer any software</li>
                                    <li>Removing any copyright or other proprietary notations from the materials</li>
                                    <li>Transferring the materials to another person or &quot;mirroring&quot; on any other
                                        server
                                    </li>
                                </ul>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>3. Disclaimer of Warranties</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 text-muted-foreground">
                                <p>
                                    The materials on TalosGym are provided on an &apos;as is&apos; basis. TalosGym makes no
                                    warranties, expressed or implied, and hereby disclaims and negates all other
                                    warranties including, without limitation, implied warranties or conditions of
                                    merchantability, fitness for a particular purpose, or non-infringement of
                                    intellectual property or other violation of rights.
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>4. Limitations of Liability</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 text-muted-foreground">
                                <p>
                                    In no event shall TalosGym or its suppliers be liable for any damages (including,
                                    without limitation, damages for loss of data or profit, or due to business
                                    interruption) arising out of the use or inability to use the materials on TalosGym,
                                    even if TalosGym or an authorized representative has been notified orally or in
                                    writing of the possibility of such damage.
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>5. Accuracy of Materials</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 text-muted-foreground">
                                <p>
                                    The materials appearing on TalosGym could include technical, typographical, or
                                    photographic errors. TalosGym does not warrant that any of the materials on the
                                    platform are accurate, complete, or current. TalosGym may make changes to the
                                    materials contained on its platform at any time without notice.
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>6. Materials Link Disclaimer</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 text-muted-foreground">
                                <p>
                                    TalosGym has not reviewed all of the sites linked to its website and is not
                                    responsible for the contents of any such linked site. The inclusion of any link
                                    does not imply endorsement by TalosGym of the site. Use of any such linked website
                                    is at the user&apos;s own risk.
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>7. Modifications</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 text-muted-foreground">
                                <p>
                                    TalosGym may revise these terms of service for its platform at any time without
                                    notice. By using this platform, you are agreeing to be bound by the then current
                                    version of these terms of service.
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>8. Governing Law</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 text-muted-foreground">
                                <p>
                                    These terms and conditions are governed by and construed in accordance with the
                                    laws of Ontario, Canada, and you irrevocably submit to the exclusive jurisdiction
                                    of the courts in that location.
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>9. User Responsibilities</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 text-muted-foreground">
                                <p>As a user of TalosGym, you are responsible for:</p>
                                <ul className="list-disc list-inside space-y-2">
                                    <li>Maintaining the confidentiality of your account credentials</li>
                                    <li>All activities that occur under your account</li>
                                    <li>Not transmitting viruses or harmful code</li>
                                    <li>Not engaging in harassment or abuse of other users</li>
                                    <li>Complying with all applicable laws and regulations</li>
                                </ul>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>10. Fitness Disclaimer</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 text-muted-foreground">
                                <p>
                                    The fitness information provided on TalosGym is for educational purposes only and
                                    should not be considered as medical advice. Before starting any fitness program,
                                    consult with a healthcare professional. TalosGym is not responsible for any injuries
                                    or health complications arising from the use of our platform or fitness advice.
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>11. Contact for Inquiries</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 text-muted-foreground">
                                <p>
                                    If you have any questions about these Terms of Service, please contact us at:
                                </p>
                                <div className="bg-muted p-4 rounded-lg">
                                    <p>TalosGym Inc.</p>
                                    <p>123 Fitness Street</p>
                                    <p>Toronto, ON M5V 3A8</p>
                                    <p>Email: legal@talosgym.app</p>
                                    <p>Phone: +1 (555) 123-4567</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>
        </>
    );
}

