"use client"

import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { AlertCircle, Loader2 } from "lucide-react"

import { ForgotPasswordRequest, ForgotPasswordRequestSchema } from "@/lib/api/schema"
import { forgotPasswordAsync } from "@/features/auth/actions/auth.actions"
import { useServerAction } from "@/hooks/useServerAction"
import { handleFormServerErrors } from "@/features/common/utils/form-errors"

import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { PhoneInputField } from "@/components/ui/phone-input"

interface ForgotPasswordInitiateProps {
    onSuccess: (phoneNumber: string) => void
}

export function ForgotPasswordInitiate({ onSuccess }: ForgotPasswordInitiateProps) {
    const form = useForm<ForgotPasswordRequest>({
        resolver: zodResolver(ForgotPasswordRequestSchema),
        mode: "onBlur",
        defaultValues: { phoneNumber: "" },
    })

    const action = useServerAction(forgotPasswordAsync, {
        onSuccess: () => {
            onSuccess(form.getValues("phoneNumber"))
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

            <form onSubmit={onSubmit} className="space-y-4">
                <Controller
                    name="phoneNumber"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field>
                            <FieldLabel htmlFor="phoneNumber" className="text-sm font-medium">
                                Phone Number
                            </FieldLabel>
                            <PhoneInputField
                                {...field}
                                id="phoneNumber"
                                placeholder="+90 555 000 00 00"
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

                <Button type="submit" className="w-full h-10" disabled={action.isPending}>
                    {action.isPending && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                    {action.isPending ? "Sending code..." : "Send Verification Code"}
                </Button>
            </form>
        </div>
    )
}
