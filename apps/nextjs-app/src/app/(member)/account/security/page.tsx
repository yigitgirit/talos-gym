import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getProfileAsync } from '@/features/profile/actions/profile.actions'

import { ChangePasswordForm } from '@/features/profile/components/security/change-password-form'
import { ContactMethodsSection } from '@/features/profile/components/security/contact-methods-section'
import { DangerZoneSection } from '@/features/profile/components/security/danger-zone-section'

export const metadata: Metadata = {
    title: 'Security',
    description: 'Manage your account security, passwords, and contact methods',
}

export default async function SecurityPage() {
    const result = await getProfileAsync()

    if (!result.success || !result.data) {
        redirect('/auth/login')
    }

    const user = result.data

    return (
        <div className="space-y-6 max-w-3xl">
            {/* Change Password Section */}
            <div className="rounded-lg border bg-card p-5">
                <div className="mb-6 border-b pb-4">
                    <h2 className="font-heading font-semibold text-base">
                        Change Password
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1">Update your password to keep your account secure.</p>
                </div>
                <ChangePasswordForm />
            </div>

            {/* Contact Methods Section */}
            <div className="rounded-lg border bg-card p-5">
                <div className="mb-6 border-b pb-4">
                    <h2 className="font-heading font-semibold text-base">
                        Contact Methods
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1">Manage your email and phone number for account recovery and notifications.</p>
                </div>
                <ContactMethodsSection user={user} />
            </div>

            {/* Danger Zone Section */}
            <div className="rounded-lg border bg-card p-5">
                <DangerZoneSection />
            </div>
        </div>
    )
}
