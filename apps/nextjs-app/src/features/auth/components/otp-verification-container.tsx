"use client"

import { useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { usePendingRegistrationStore } from "@/features/auth/store/pending-registration"
import { OTPVerificationPage } from "./otp-verification-page"

// Current situation: referenceId is the phone number
// Future: referenceId will be an opaque token (UUID)
export function OTPVerificationContainer() {
    const router = useRouter()
    const hasHandledMissingReference = useRef(false)

    const referenceId = usePendingRegistrationStore(state => state.referenceId)

    useEffect(() => {
        if (referenceId || hasHandledMissingReference.current) {
            return
        }

        hasHandledMissingReference.current = true
        toast.error("Session expired. Please log in or register again.")
        router.replace("/auth/register")
    }, [referenceId, router])

    if (!referenceId) {
        return null
    }

    return <OTPVerificationPage referenceId={referenceId} />
}
