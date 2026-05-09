"use client"

import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { AlertCircle, Loader2 } from "lucide-react"

import { ResetPasswordRequest, ResetPasswordRequestSchema } from "@/lib/api/schema"
import { resetPasswordSubmitAsync } from "@/features/auth/actions/auth.actions"
import { useServerAction } from "@/hooks/useServerAction"
import { handleFormServerErrors } from "@/features/common/utils/form-errors"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"

interface ForgotPasswordResetProps {
    resetToken: string
}

export function ForgotPasswordReset({ resetToken }: ForgotPasswordResetProps) {
    const router = useRouter()
    
    const form = useForm<ResetPasswordRequest>({
        resolver: zodResolver(ResetPasswordRequestSchema),
        mode: "onBlur",
        defaultValues: { 
            resetToken: resetToken, 
            newPassword: "", 
            confirmNewPassword: "" 
        },
    })

    const action = useServerAction(resetPasswordSubmitAsync, {
        onSuccess: () => {
            toast.success("Password reset successfully! You can now log in.")
            router.push("/auth/login?reset=success")
        },
        onError: (error) => {
            handleFormServerErrors(error, form.setError)
        },
        showGlobalError: false,
    })

    const onSubmit = form.handleSubmit((data) => {
        action.execute(data)
    })

    const rootError = form.formState.errors.root?.message

    return (
        <div className="flex w-full flex-col gap-4">
            {rootError && (
                <div className="rounded bg-destructive/10 border border-destructive/20 p-2.5 flex gap-2">
                    <AlertCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                    <p className="text-xs text-destructive">{rootError}</p>
                </div>
            )}

            <div className="text-sm text-muted-foreground mb-2">
                Please enter your new password below.
            </div>

            <form onSubmit={onSubmit} className="space-y-4">
                <Controller
                    name="newPassword"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field>
                            <FieldLabel htmlFor="newPassword" className="text-sm font-medium block">
                                New Password
                            </FieldLabel>
                            <Input
                                {...field}
                                id="newPassword"
                                type="password"
                                placeholder="Enter new password"
                                disabled={action.isPending}
                                aria-invalid={fieldState.invalid}
                                className="mt-1"
                            />
                            {fieldState.invalid && fieldState.error && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </Field>
                    )}
                />

                <Controller
                    name="confirmNewPassword"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field>
                            <FieldLabel htmlFor="confirmNewPassword" className="text-sm font-medium block">
                                Confirm New Password
                            </FieldLabel>
                            <Input
                                {...field}
                                id="confirmNewPassword"
                                type="password"
                                placeholder="Confirm new password"
                                disabled={action.isPending}
                                aria-invalid={fieldState.invalid}
                                className="mt-1"
                            />
                            {fieldState.invalid && fieldState.error && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </Field>
                    )}
                />

                <Button type="submit" className="w-full h-10 mt-2" disabled={action.isPending}>
                    {action.isPending && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                    {action.isPending ? "Resetting password..." : "Reset Password"}
                </Button>
            </form>
        </div>
    )
}
