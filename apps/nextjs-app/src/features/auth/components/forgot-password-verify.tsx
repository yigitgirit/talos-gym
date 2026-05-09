"use client"

import { useCallback, useEffect } from "react"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { AlertCircle, Clock, Loader2 } from "lucide-react"
import { toast } from "sonner"

import { verifyOtpResetAsync, forgotPasswordAsync } from "@/features/auth/actions/auth.actions"
import { useServerAction } from "@/hooks/useServerAction"
import { handleFormServerErrors } from "@/features/common/utils/form-errors"
import { useCountdownTimer } from "@/features/common/hooks/useCountdownTimer"
import { useVisibilityAutoFocus } from "@/features/common/hooks/useVisibilityAutoFocus"

import { Button } from "@/components/ui/button"
import { Field, FieldError } from "@/components/ui/field"
import { OTPInputDefaultPreview } from "@/components/ui/input-otp"

interface ForgotPasswordVerifyProps {
    phoneNumber: string
    onSuccess: (resetToken: string) => void
    onBack: () => void
}

const formSchema = z.object({
    pin: z.string().length(6, { message: "Code must be 6 digits." }),
})

export function ForgotPasswordVerify({ phoneNumber, onSuccess, onBack }: ForgotPasswordVerifyProps) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: { pin: "" },
    })

    const pinValue = form.watch("pin")
    const { timeLeft, isFinished: canResend, resetTimer } = useCountdownTimer(60)
    const otpInputRef = useVisibilityAutoFocus<HTMLInputElement>(!pinValue)

    // --- Verify Action ---
    const verifyAction = useServerAction(verifyOtpResetAsync, {
        onSuccess: (data) => {
            if (data?.resetToken) {
                onSuccess(data.resetToken)
            }
        },
        onError: (error) => {
            handleFormServerErrors(error, form.setError)
        },
        showGlobalError: false,
    })

    // --- Resend Action ---
    const resendAction = useServerAction(forgotPasswordAsync, {
        onSuccess: () => {
            resetTimer()
            form.reset({ pin: "" })
            verifyAction.reset()
            otpInputRef.current?.focus()
            toast.success("Verification code resent successfully!")
        },
        onError: (error) => {
            toast.error(error.message || "Failed to resend code")
        },
        showGlobalError: false,
    })

    const handleSubmit = form.handleSubmit((data) => {
        verifyAction.execute({
            phoneNumber,
            otpCode: data.pin,
        })
    })

    const handleResend = useCallback(() => {
        if (!canResend || resendAction.isPending || verifyAction.isPending) {
            return
        }
        resendAction.execute({ phoneNumber })
    }, [canResend, phoneNumber, resendAction, verifyAction.isPending])

    const rootError = form.formState.errors.root?.message

    return (
        <div className="flex w-full flex-col gap-4">
            {rootError && (
                <div className="rounded bg-destructive/10 border border-destructive/20 p-2.5 flex gap-2">
                    <AlertCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                    <p className="text-xs text-destructive">{rootError}</p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <Field>
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
                                disabled={verifyAction.isPending}
                                aria-invalid={Boolean(form.formState.errors.pin)}
                            />
                        )}
                    />

                    {form.formState.errors.pin && (
                        <FieldError errors={[{ message: form.formState.errors.pin.message || "Invalid code" }]} />
                    )}
                </Field>

                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <Clock className="size-4" />
                    {canResend ? (
                        <span>Code expired. You can resend now.</span>
                    ) : (
                        <span>Resend in {String(timeLeft).padStart(2, "0")}s</span>
                    )}
                </div>

                <Button 
                    type="submit" 
                    className="w-full h-10" 
                    disabled={verifyAction.isPending || pinValue.length !== 6}
                >
                    {verifyAction.isPending && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                    {verifyAction.isPending ? "Verifying..." : "Verify Code"}
                </Button>
            </form>

            <div className="flex flex-col items-center gap-2 mt-2">
                <Button
                    type="button"
                    variant="link"
                    onClick={handleResend}
                    disabled={!canResend || resendAction.isPending || verifyAction.isPending}
                    className="h-auto p-0 text-sm"
                >
                    {resendAction.isPending ? "Sending code..." : "Didn't receive the code? Resend"}
                </Button>
                
                <Button
                    type="button"
                    variant="link"
                    onClick={onBack}
                    className="h-auto p-0 text-xs text-muted-foreground"
                >
                    Wrong number? Go back
                </Button>
            </div>
        </div>
    )
}
