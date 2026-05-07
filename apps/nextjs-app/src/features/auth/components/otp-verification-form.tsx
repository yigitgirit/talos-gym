import * as React from "react"
import { AlertCircle, CheckCircle2, Clock } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { OTPInputDefaultPreview } from "@/components/ui/input-otp"

type OTPVerificationStatusTone = "error" | "success"

export interface OTPVerificationFormProps {
    value: string
    onValueChange: (value: string) => void
    onSubmit: (event: React.SubmitEvent<HTMLFormElement>) => void
    onResend: () => void
    inputRef?: React.RefObject<HTMLInputElement | null>
    fieldError?: string | null
    statusMessage?: string | null
    statusTone?: OTPVerificationStatusTone
    isSubmitting?: boolean
    isResending?: boolean
    isComplete?: boolean
    canResend?: boolean
    timeLeft?: number
    codeLength?: number
    label?: string
    description?: string
    submitLabel?: string
    submittingLabel?: string
    completeLabel?: string
    resendPrompt?: string
    resendLabel?: string
    resendPendingLabel?: string
    resendWaitLabel?: string
    resendReadyMessage?: string
}

function StatusMessage({
    children,
    tone,
}: Readonly<{
    children: React.ReactNode
    tone: OTPVerificationStatusTone
}>) {
    const isError = tone === "error"
    const Icon = isError ? AlertCircle : CheckCircle2

    return (
        <div
            aria-live={isError ? "assertive" : "polite"}
            className={
                isError
                    ? "mb-3 flex gap-2.5 rounded-lg border border-destructive-border bg-destructive-subtle p-3 text-destructive"
                    : "mb-3 flex gap-2.5 rounded-lg border border-accent-border bg-accent-subtle p-3 text-accent-foreground"
            }
            role={isError ? "alert" : "status"}
        >
            <Icon className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
            <p className="text-sm font-medium">{children}</p>
        </div>
    )
}

export function OTPVerificationForm({
    value,
    onValueChange,
    onSubmit,
    onResend,
    inputRef,
    fieldError,
    statusMessage,
    statusTone = "error",
    isSubmitting = false,
    isResending = false,
    isComplete = false,
    canResend = false,
    timeLeft = 0,
    codeLength = 6,
    label = "Verification code",
    description = "Enter the code you received.",
    submitLabel = "Verify & Continue",
    submittingLabel = "Verifying...",
    completeLabel = "Verified!",
    resendPrompt = "Didn't receive the code?",
    resendLabel = "Resend",
    resendPendingLabel = "Sending code...",
    resendWaitLabel = "Wait",
    resendReadyMessage = "Code expired. You can resend now.",
}: Readonly<OTPVerificationFormProps>) {
    const descriptionId = React.useId()
    const errorId = React.useId()
    const hasFieldError = Boolean(fieldError)
    const isSubmitDisabled = isSubmitting || isComplete || value.length !== codeLength
    const submitText = isSubmitting ? submittingLabel : isComplete ? completeLabel : submitLabel
    const resendText = isResending ? resendPendingLabel : canResend ? resendLabel : resendWaitLabel

    return (
        <div className="w-full">
            {statusMessage && (
                <StatusMessage tone={statusTone}>{statusMessage}</StatusMessage>
            )}

            <form onSubmit={onSubmit} className="flex flex-col gap-3">
                <FieldGroup className="gap-3">
                    <Field data-invalid={hasFieldError || undefined}>
                        <FieldLabel className="text-sm font-medium">{label}</FieldLabel>
                        <FieldDescription id={descriptionId} className="text-xs">
                            {description}
                        </FieldDescription>

                        <OTPInputDefaultPreview
                            aria-describedby={hasFieldError ? `${descriptionId} ${errorId}` : descriptionId}
                            aria-invalid={hasFieldError}
                            disabled={isComplete || isSubmitting}
                            onChange={onValueChange}
                            ref={inputRef}
                            slotCount={codeLength}
                            value={value}
                        />
                        {fieldError && (
                            <FieldError id={errorId} errors={[{ message: fieldError }]} />
                        )}
                    </Field>

                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground" aria-live="polite">
                        <Clock className="size-4" aria-hidden="true" />
                        {canResend ? (
                            <span>{resendReadyMessage}</span>
                        ) : (
                            <span>Resend in {String(timeLeft).padStart(2, "0")}s</span>
                        )}
                    </div>

                    <Button type="submit" className="mt-1 h-10 w-full" disabled={isSubmitDisabled}>
                        {submitText}
                    </Button>
                </FieldGroup>
            </form>

            <div className="mt-4 text-center text-sm">
                <Button
                    type="button"
                    variant="link"
                    onClick={onResend}
                    disabled={!canResend || isResending || isSubmitting}
                    className="h-auto p-0"
                >
                    {resendPrompt} {resendText}
                </Button>
            </div>
        </div>
    )
}
