"use client"

import { useState } from "react"
import { AuthLayout } from "@/features/auth/components/auth-layout"
import { ForgotPasswordInitiate } from "./forgot-password-initiate"
import { ForgotPasswordVerify } from "./forgot-password-verify"
import { ForgotPasswordReset } from "./forgot-password-reset"
import { maskPhone } from "@/features/common/utils/formatters"

type Step = "INITIATE" | "VERIFY" | "RESET"

const TITLES: Record<Step, string> = {
    INITIATE: "Forgot Password",
    VERIFY: "Verify your number",
    RESET: "Reset your password",
}

export function ForgotPasswordView() {
    const [step, setStep] = useState<Step>("INITIATE")
    const [phoneNumber, setPhoneNumber] = useState<string | null>(null)
    const [resetToken, setResetToken] = useState<string | null>(null)

    const handleInitiateSuccess = (phone: string) => {
        setPhoneNumber(phone)
        setStep("VERIFY")
    }

    const handleVerifySuccess = (token: string) => {
        setResetToken(token)
        setStep("RESET")
    }

    const handleBackToInitiate = () => {
        setPhoneNumber(null)
        setResetToken(null)
        setStep("INITIATE")
    }

    const getDescription = () => {
        switch (step) {
            case "INITIATE":
                return "Enter your phone number to receive a verification code."
            case "VERIFY":
                return `We've sent a 6-digit code to ${phoneNumber ? maskPhone(phoneNumber) : "your phone"}.`
            case "RESET":
                return "Create a new, strong password for your account."
        }
    }

    return (
        <AuthLayout title={TITLES[step]} description={getDescription()}>
            {step === "INITIATE" && (
                <ForgotPasswordInitiate onSuccess={handleInitiateSuccess} />
            )}

            {step === "VERIFY" && phoneNumber && (
                <ForgotPasswordVerify 
                    phoneNumber={phoneNumber} 
                    onSuccess={handleVerifySuccess}
                    onBack={handleBackToInitiate}
                />
            )}

            {step === "RESET" && resetToken && (
                <ForgotPasswordReset resetToken={resetToken} />
            )}
        </AuthLayout>
    )
}
