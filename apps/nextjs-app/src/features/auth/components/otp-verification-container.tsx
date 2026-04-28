"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { usePendingRegistrationStore } from "@/features/auth/store/pending-registration"
import { OTPVerificationPage } from "./otp-verification-page"

// Current situtation is not optimized
export function OTPVerificationContainer() {
    const router = useRouter()

    const referenceId = usePendingRegistrationStore(state => state.referenceId)
    const phoneNumber = usePendingRegistrationStore(state => state.phoneNumber)

    useEffect(() => {
        if (!referenceId || !phoneNumber) {
            toast.error("Session expired. Please log in or register again.")
            router.replace("/auth/register")
        }
    }, [referenceId, phoneNumber, router])

    if (!referenceId || !phoneNumber) {
        return null;
    }

    return <OTPVerificationPage referenceId={referenceId} phoneNumber={phoneNumber} />
}