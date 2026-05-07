"use client"

import * as React from "react"
import { useCallback, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { verifyOTPAsync, resendOTPAsync } from "@/features/auth/actions/auth.actions"
import { useServerAction } from "@/hooks/useServerAction"
import { useCountdownTimer } from "@/features/common/hooks/useCountdownTimer"
import { useVisibilityAutoFocus } from "@/features/common/hooks/useVisibilityAutoFocus"
import { maskPhone } from "@/features/common/utils/formatters"
import { OTPVerificationForm } from "./otp-verification-form"
import {toast} from "sonner";
import { getErrorMessage } from "@/constants/error-codes";
import { AuthLayout } from "@/features/auth/components/auth-layout"

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
            verifyAction.reset()
            otpInputRef.current?.focus()
            toast.success("Verification code resent successfully!");
        },
        onError: (error) => {
            toast.error(getErrorMessage(error.code, error.message));
        }
    });

    const handleOtpChange = useCallback((value: string) => {
        setOtpValue(value)
        if (verifyAction.error) {
            verifyAction.reset()
        }
    }, [verifyAction])

    const handleSubmit = useCallback((e: React.SubmitEvent<HTMLFormElement>) => {
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
    }, [otpValue, referenceId, verifyAction])

    const handleResend = useCallback(() => {
        if (!canResend || resendAction.isPending || verifyAction.isPending) {
            return
        }

        resendAction.execute({ identifier: referenceId })
    }, [canResend, referenceId, resendAction, verifyAction.isPending])
    
    const verifyError = verifyAction.error;

    const fieldErrorMessage = verifyError?.details?.find(detail => detail.field === "code")?.message;
    const rootErrorMessage = verifyError && !fieldErrorMessage
        ? getErrorMessage(verifyError.code, verifyError.message)
        : undefined;
    const maskedPhone = useMemo(() => maskPhone(referenceId), [referenceId])
    const statusMessage = success ? "Verification successful! Redirecting..." : rootErrorMessage
    const statusTone = success ? "success" : "error"

    return (
        <AuthLayout title="Verify your number" description={`We've sent a 6-digit code to ${maskedPhone}`}>
            <OTPVerificationForm
                value={otpValue}
                onValueChange={handleOtpChange}
                onSubmit={handleSubmit}
                onResend={handleResend}
                isSubmitting={verifyAction.isPending}
                isResending={resendAction.isPending}
                isComplete={success}
                canResend={canResend}
                timeLeft={timeLeft}
                statusMessage={statusMessage}
                statusTone={statusTone}
                fieldError={fieldErrorMessage}
                inputRef={otpInputRef}
                description="Enter the 6-digit code from your SMS."
            />
        </AuthLayout>
    )
}
