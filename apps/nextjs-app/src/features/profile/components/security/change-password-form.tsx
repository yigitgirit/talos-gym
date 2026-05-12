"use client"

import {Controller, useForm} from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod"
import {toast} from "sonner"
import {ChangePasswordRequest, ChangePasswordRequestSchema} from "@/lib/api/schema"
import {changePasswordAsync} from "@/features/profile/actions/profile.actions"
import {useServerAction} from "@/hooks/useServerAction"

import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Field, FieldError, FieldLabel} from "@/components/ui/field"
import {AlertCircle, Loader2} from "lucide-react"

export function ChangePasswordForm() {
    const form = useForm<ChangePasswordRequest>({
        resolver: zodResolver(ChangePasswordRequestSchema),
        mode: 'onBlur',
        defaultValues: {
            currentPassword: "",
            newPassword: "",
            confirmNewPassword: "",
        },
    })

    const {execute, isPending, error} = useServerAction(changePasswordAsync, {
        onSuccess: () => {
            toast.success("Password updated successfully.")
            form.reset()
        },
        showGlobalError: false,
    })

    const onSubmit = form.handleSubmit((data) => {
        execute(data)
    })

    return (
        <div className="w-full">
            {error && (
                <div className="mb-4 rounded bg-destructive/10 border border-destructive/20 p-2.5 flex gap-2">
                    <AlertCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5"/>
                    <p className="text-xs text-destructive">{error.message}</p>
                </div>
            )}

            <form onSubmit={onSubmit} className="space-y-2.5">
                <Controller
                    name="currentPassword"
                    control={form.control}
                    render={({field, fieldState}) => (
                        <Field>
                            <FieldLabel htmlFor="currentPassword" className="text-xs font-medium block">
                                Current Password
                            </FieldLabel>
                            <Input
                                {...field}
                                id="currentPassword"
                                type="password"
                                placeholder="Enter current password"
                                disabled={isPending}
                                aria-invalid={fieldState.invalid}
                                className="h-8 text-sm max-w-md"
                            />
                            {fieldState.invalid && fieldState.error && (
                                <FieldError errors={[fieldState.error]}/>
                            )}
                        </Field>
                    )}
                />

                <Controller
                    name="newPassword"
                    control={form.control}
                    render={({field, fieldState}) => (
                        <Field>
                            <FieldLabel htmlFor="newPassword" className="text-xs font-medium block">
                                New Password
                            </FieldLabel>
                            <Input
                                {...field}
                                id="newPassword"
                                type="password"
                                placeholder="Enter new password"
                                disabled={isPending}
                                aria-invalid={fieldState.invalid}
                                className="h-8 text-sm max-w-md"
                            />
                            {fieldState.invalid && fieldState.error && (
                                <FieldError errors={[fieldState.error]}/>
                            )}
                        </Field>
                    )}
                />

                <Controller
                    name="confirmNewPassword"
                    control={form.control}
                    render={({field, fieldState}) => (
                        <Field>
                            <FieldLabel htmlFor="confirmNewPassword" className="text-xs font-medium block">
                                Confirm New Password
                            </FieldLabel>
                            <Input
                                {...field}
                                id="confirmNewPassword"
                                type="password"
                                placeholder="Confirm new password"
                                disabled={isPending}
                                aria-invalid={fieldState.invalid}
                                className="h-8 text-sm max-w-md"
                            />
                            {fieldState.invalid && fieldState.error && (
                                <FieldError errors={[fieldState.error]}/>
                            )}
                        </Field>
                    )}
                />

                <div className="pt-2">
                    <Button
                        type="submit"
                        disabled={isPending}
                        className="h-8 text-sm flex items-center justify-center gap-1.5"
                    >
                        {isPending && <Loader2 className="w-3 h-3 animate-spin"/>}
                        {isPending ? "Updating..." : "Update Password"}
                    </Button>
                </div>
            </form>
        </div>
    )
}