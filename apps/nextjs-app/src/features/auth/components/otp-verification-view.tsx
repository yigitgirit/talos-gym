"use client";

import * as React from "react"
import { useCallback, useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { AlertCircle, CheckCircle2, Clock, Loader2 } from "lucide-react"

import { usePendingRegistrationStore } from "@/features/auth/store/pending-registration"
import { verifyOTPAsync, resendVerificationAsync } from "@/features/auth/actions/auth.actions"
import { useServerAction } from "@/hooks/useServerAction"
import { useCountdownTimer } from "@/features/common/hooks/useCountdownTimer"
import { useVisibilityAutoFocus } from "@/features/common/hooks/useVisibilityAutoFocus"
import { maskPhone } from "@/features/common/utils/formatters"
import { toast } from "sonner"
import {getErrorMessage} from "@/constants/error-codes"
import { AuthLayout } from "@/features/auth/components/auth-layout"
import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldGroup } from "@/components/ui/field"
import { OTPInputDefaultPreview } from "@/components/ui/otp"
import { cn } from "@/lib/utils"
import {handleFormServerErrors} from "@/features/common/utils/form-errors";

const formSchema = z.object({
    pin: z.string().length(6, { message: "Code must be 6 digits." }),
})

export function OtpVerificationView() {
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

    return (
        <AuthLayout title="Verify your number" description={`We've sent a 6-digit code to ${maskPhone(referenceId)}`}>
            <OTPVerificationContent referenceId={referenceId} />
        </AuthLayout>
    )
}

function OTPVerificationContent({ referenceId }: { referenceId: string }) {
    const router = useRouter()

    const [success, setSuccess] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: { pin: "" },
    })

    const pinValue = form.watch("pin")

    const { timeLeft, isFinished: canResend, resetTimer } = useCountdownTimer(60)
    const otpInputRef = useVisibilityAutoFocus<HTMLInputElement>(!pinValue) // Only auto-focus if empty

    const verifyAction = useServerAction(verifyOTPAsync, {
        onSuccess: () => {
            setSuccess(true)
            setTimeout(() => {
                router.push("/auth/login?registered=true")
            }, 2000)
        },
        onError: (error) => {
            handleFormServerErrors(error, form.setError)
        }
    });

    const resendAction = useServerAction(resendVerificationAsync, {
        onSuccess: () => {
            resetTimer()
            form.reset({ pin: "" })
            verifyAction.reset()
            otpInputRef.current?.focus()
            toast.success("Verification code resent successfully!");
        },
        onError: (error) => {
            toast.error(getErrorMessage(error.code, error.message));
        }
    });

    const handleSubmit = form.handleSubmit((data) => {
        verifyAction.execute({
            referenceId, // Phone number (currently), UUID token (future)
            code: data.pin,
            purpose: "PHONE_VERIFICATION"
        });
    })

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

    const statusMessage = success ? "Verification successful!" : rootErrorMessage
    const isError = !success && !!rootErrorMessage

    const isSubmitting = verifyAction.isPending
    const isResending = resendAction.isPending
    const isSubmitDisabled = isSubmitting || success || pinValue.length !== 6

    const submitText = isSubmitting ? "Verifying..." : success ? "Verified!" : "Verify & Continue"
    const resendText = isResending ? "Sending code..." : canResend ? "Resend" : "Wait"

    return (
        <div className="flex w-full flex-col gap-4">
            {statusMessage && (
                <div
                    aria-live={isError ? "assertive" : "polite"}
                    className={cn(
                        "flex gap-2.5 rounded-lg border p-3",
                        isError
                            ? "border-destructive-border bg-destructive-subtle text-destructive"
                            : "border-accent-border bg-accent-subtle text-accent-foreground"
                    )}
                    role={isError ? "alert" : "status"}
                >
                    {isError ? (
                        <AlertCircle className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
                    ) : (
                        <CheckCircle2 className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
                    )}
                    <p className="text-sm font-medium">{statusMessage}</p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <FieldGroup className="gap-3">
                    <Field data-invalid={Boolean(form.formState.errors.pin) || undefined}>
                        <Controller
                            name="pin"
                            control={form.control}
                            render={({ field }) => (
                                <OTPInputDefaultPreview
                                    {...field}
                                    ref={(e) => {
                                        field.ref(e)
                                        if (otpInputRef) otpInputRef.current = e
                                    }}
                                    onChange={(val) => {
                                        field.onChange(val)
                                        if (verifyAction.error) verifyAction.reset()
                                    }}
                                    slotCount={6}
                                    disabled={success || isSubmitting}
                                    aria-invalid={Boolean(form.formState.errors.pin)}
                                />
                            )}
                        />

                        {form.formState.errors.pin && (
                            <FieldError errors={[{ message: form.formState.errors.pin.message || "Invalid code" }]} />
                        )}
                    </Field>

                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground" aria-live="polite">
                        <Clock className="size-4" aria-hidden="true" />
                        {canResend ? (
                            <span>Code expired. You can resend now.</span>
                        ) : (
                            <span>Resend in {String(timeLeft).padStart(2, "0")}s</span>
                        )}
                    </div>

                    <Button type="submit" className="mt-1 h-10 w-full" disabled={isSubmitDisabled}>
                        {isSubmitting && <Loader2 className="mr-2 size-4 animate-spin" />}
                        {submitText}
                    </Button>
                </FieldGroup>
            </form>

            <div className="mt-4 text-center text-sm">
                <Button
                    type="button"
                    variant="link"
                    onClick={handleResend}
                    disabled={!canResend || isResending || isSubmitting}
                    className="h-auto p-0"
                >
                    Didn't receive the code? {resendText}
                </Button>
            </div>
        </div>
    )
}
