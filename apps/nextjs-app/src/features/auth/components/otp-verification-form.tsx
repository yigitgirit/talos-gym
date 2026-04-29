import * as React from "react"
import { AuthLayout } from "@/features/auth/components/auth-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field"
import { AlertCircle, CheckCircle2, Clock, Smartphone } from "lucide-react"
import { OTPInputDefaultPreview } from "@/components/ui/input-otp"

interface OTPVerificationFormProps {
    maskedPhone: string;
    otpValue: string;
    onOtpChange: (value: string) => void;
    onSubmit: (e: React.SubmitEvent) => void;
    onResend: () => void;
    isVerifying: boolean;
    isResending: boolean;
    isSuccess: boolean;
    canResend: boolean;
    timeLeft: number;
    rootError?: string | null;
    fieldError?: string | null;
    inputRef: React.RefObject<HTMLInputElement | null>;
}

export function OTPVerificationForm(props: Readonly<OTPVerificationFormProps>) {
    const {
        maskedPhone, otpValue, onOtpChange, onSubmit, onResend,
        isVerifying, isResending, isSuccess, canResend, timeLeft,
        rootError, fieldError, inputRef
    } = props;

    const buttonText = isVerifying ? "Verifying..." : isSuccess ? "Verified!" : "Verify & Continue";

    return (
        <AuthLayout title="Verify your number" description={`We've sent a 6-digit code to ${maskedPhone}`}>
            <div className="space-y-4">
                <div className="flex justify-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full">
                        <Smartphone className="w-6 h-6 text-blue-600" />
                    </div>
                </div>

                <Card size="sm" className="bg-gray-50 border-gray-200 py-0">
                    <CardContent className="p-4 sm:p-5">
                        {rootError && !fieldError && (
                            <div className="mb-4 rounded-lg bg-red-50 border border-red-200 p-3 flex gap-2.5">
                                <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                                <p className="text-sm text-red-900 font-medium">{rootError}</p>
                            </div>
                        )}
                        {fieldError && (
                            <div className="mb-4 rounded-lg bg-red-50 border border-red-200 p-3 flex gap-2.5">
                                <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                                <p className="text-sm text-red-900 font-medium">{fieldError}</p>
                            </div>
                        )}
                        {isSuccess && (
                            <div className="mb-4 rounded-lg bg-green-50 border border-green-200 p-3 flex gap-2.5">
                                <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                                <p className="text-sm text-green-800">Verification successful! Redirecting...</p>
                            </div>
                        )}

                        <form onSubmit={onSubmit}>
                            <FieldGroup className="space-y-3">
                                <Field>
                                    <FieldLabel className="text-sm font-medium">Verification code</FieldLabel>
                                    <FieldDescription className="text-xs">Enter the 6-digit code from your SMS.</FieldDescription>
                                    
                                    <OTPInputDefaultPreview
                                        ref={inputRef}
                                        value={otpValue}
                                        onChange={onOtpChange}
                                        disabled={isSuccess || isVerifying}
                                    />
                                </Field>

                                <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                                    <Clock className="w-4 h-4" />
                                    {canResend ? <span>Code expired. You can resend now.</span> : <span>Resend in {String(timeLeft).padStart(2, "0")}s</span>}
                                </div>

                                <Button type="submit" className="w-full h-10 mt-1" disabled={isVerifying || isSuccess || otpValue.length !== 6}>
                                    {buttonText}
                                </Button>
                            </FieldGroup>
                        </form>
                    </CardContent>
                </Card>

                <div className="text-center text-sm">
                    <Button type="button" variant="link" onClick={onResend} disabled={!canResend || isResending || isVerifying} className="h-auto p-0">
                        Didn&apos;t receive the code? {isResending ? "Sending OTP now..." : (canResend ? "Resend" : "Wait")}
                    </Button>
                </div>
            </div>
        </AuthLayout>
    )
}