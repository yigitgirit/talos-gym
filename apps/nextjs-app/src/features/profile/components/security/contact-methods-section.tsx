"use client"

import {UserResponse} from "@/lib/api/schema"
import * as React from "react";
import {EmailSettings} from "@/features/profile/components/security/email-settings";
import {PhoneSettings} from "@/features/profile/components/security/phone-settings";

export function ContactMethodsSection({user}: { readonly user: UserResponse }) {

    return (
        <div className="w-full space-y-6">
            {/* Email Update */}
            <EmailSettings email={user.email} userId={user.id}/>

            {/* Divider */}
            <div className="border-t border-border"/>

            <PhoneSettings phoneNumber={user.phoneNumber} userId={user.id}/>
        </div>
    )
}