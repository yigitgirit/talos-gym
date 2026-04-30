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
import { getErrorMessage } from "@/constants/error-codes";

interface OTPVerificationPageProps {
    referenceId: string;
}

export function OTPVerificationPage({ referenceId }: Readonly<OTPVerificationPageProps>) {
    const router = useRouter()

    const [success, setSuccess] = useState(false)
    const [otpValue, setOtpValue] = useState("")

    const { timeLeft, isFinished: canResend, resetTimer } = useCountdownTimer(60)
    const otpInputRef = useVisibilityAutoFocus<HTMLInputElement>(!otpValue) // Only auto-focus if empty

    const verifyAction = useServerAction(verifyOTPAsync, {
        onSuccess: () => {
            setSuccess(true)
            setTimeout(() => {
                router.push("/auth/login?registered=true")
            }, 2000)
        }
    });

    const resendAction = useServerAction(resendOTPAsync, {
        onSuccess: () => {
            resetTimer()
            setOtpValue("")
            otpInputRef.current?.focus()
            toast.success("Verification code resent successfully!");
        },
        onError: (error) => {
            toast.error(getErrorMessage(error.code, error.message));
        }
    });

    const handleSubmit = (e: React.SubmitEvent) => {
        e.preventDefault();
        const code = otpValue.trim()

        if (code.length !== 6) {
            return
        }

        verifyAction.execute({
            referenceId, // Phone number (currently), UUID token (future)
            code,
            purpose: "PHONE_VERIFICATION"
        });

        console.log("Verifying OTP - referenceId:", referenceId, "code:", code)
    }
    
    const verifyError = verifyAction.error;

    const rootErrorMessage = verifyError
        ? getErrorMessage(verifyError.code, verifyError.message) 
        : undefined;
    const fieldErrorMessage = verifyError?.details?.find(d => d.field === 'code')?.message;

    return (
        <OTPVerificationForm
            maskedPhone={maskPhone(referenceId)} // referenceId is the phone number
            otpValue={otpValue}
            onOtpChange={setOtpValue}
            onSubmit={handleSubmit}
            onResend={() => resendAction.execute({ identifier: referenceId })}
            isVerifying={verifyAction.isPending}
            isResending={resendAction.isPending}
            isSuccess={success}
            canResend={canResend}
            timeLeft={timeLeft}
            rootError={rootErrorMessage}
            fieldError={fieldErrorMessage}
            inputRef={otpInputRef}
        />
    )
}
