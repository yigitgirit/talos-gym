"use client"

import * as React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { verifyOTPAsync, resendOTPAsync } from "@/features/auth/actions"
import { useServerAction } from "@/hooks/useServerAction"
import { useCountdownTimer } from "@/features/common/hooks/useCountdownTimer"
import { useVisibilityAutoFocus } from "@/features/common/hooks/useVisibilityAutoFocus"
import { maskPhone } from "@/features/common/utils/formatters"
import { OTPVerificationForm } from "./otp-verification-form"
import {toast} from "sonner";

interface OTPVerificationPageProps {
    referenceId: string;
    phoneNumber: string;
}

export function OTPVerificationPage({ referenceId, phoneNumber }: Readonly<OTPVerificationPageProps>) {
    const router = useRouter()

    const [success, setSuccess] = useState(false)
    const [otpValue, setOtpValue] = useState("")

    const { timeLeft, isFinished: canResend, resetTimer } = useCountdownTimer(60)
    const otpInputRef = useVisibilityAutoFocus<HTMLInputElement>(!otpValue) // Only auto-focus if empty

    // 1. The Verification Action
    const verifyAction = useServerAction(verifyOTPAsync, {
        onSuccess: () => {
            setSuccess(true)
            setTimeout(() => {
                router.push("/auth/login?registered=true")
            }, 2000)
        }
    });

    // 2. The Resend Action
    const resendAction = useServerAction(resendOTPAsync, {
        onSuccess: () => {
            resetTimer()
            setOtpValue("")
            otpInputRef.current?.focus()
            toast.success("Verification code resent successfully!");
        }
    });

    const handleSubmit = (e: React.SubmitEvent) => {
        e.preventDefault();
        const code = otpValue.trim()

        if (code.length !== 6) {
            return
        }

        verifyAction.execute({
            referenceId, // Perfectly typed as string!
            code,
            purpose: "PHONE_VERIFICATION"
        });
    }
    
    return (
        <OTPVerificationForm
            maskedPhone={maskPhone(phoneNumber)} // Perfectly typed as string!
            otpValue={otpValue}
            onOtpChange={setOtpValue}
            onSubmit={handleSubmit}
            onResend={() => resendAction.execute({ identifier: referenceId })}
            isVerifying={verifyAction.isPending}
            isResending={resendAction.isPending}
            isSuccess={success}
            canResend={canResend}
            timeLeft={timeLeft}
            rootError={verifyAction.error?.message}
            fieldError={verifyAction.error?.details?.find(d => d.field === 'code')?.message}
            inputRef={otpInputRef}
        />
    )
}
