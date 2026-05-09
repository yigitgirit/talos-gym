'use client'

import {useState} from 'react'
import {Controller, useForm} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'
import {z} from 'zod'
import {toast} from 'sonner'
import {AlertCircle, Loader2} from 'lucide-react'

import {EmailChangeInitiateRequest, EmailChangeInitiateRequestSchema} from '@/lib/api/schema'
import {initiateEmailChangeAsync} from '@/features/profile/actions/profile.actions'
import {useServerAction} from '@/hooks/useServerAction'
import {verifyOTPAsync} from '@/features/auth/actions/auth.actions'
import {handleFormServerErrors} from '@/features/common/utils/form-errors'

import {Button} from '@/components/ui/button'
import {Input} from '@/components/ui/input'
import {Field, FieldError, FieldLabel} from '@/components/ui/field'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import {OTPInputDefaultPreview} from '@/components/ui/input-otp'

type Props = {
    readonly email: string
    readonly userId: number
}

const otpSchema = z.object({
    code: z.string().length(6, 'Code must be 6 digits'),
})

type OtpFormData = z.infer<typeof otpSchema>

export function EmailChangeSettings({email, userId}: Props) {
    const [isOtpDialogOpen, setIsOtpDialogOpen] = useState(false)
    const [pendingEmail, setPendingEmail] = useState<string | null>(null)

    // --- Email Change Form ---
    const emailForm = useForm<EmailChangeInitiateRequest>({
        resolver: zodResolver(EmailChangeInitiateRequestSchema),
        mode: 'onBlur',
        defaultValues: {newEmail: email || ''},
    })

    // --- Email Change Action ---
    const emailChangeAction = useServerAction(initiateEmailChangeAsync, {
        onSuccess: (_, args) => {
            setPendingEmail(args.newEmail)
            setIsOtpDialogOpen(true)
            toast.success('Verification code sent to your new email.')
        },
        onError: (error) => {
            handleFormServerErrors(error, emailForm.setError)
        },
    })

    // --- OTP Form ---
    const otpForm = useForm<OtpFormData>({
        resolver: zodResolver(otpSchema),
        defaultValues: {code: ''},
    })

    // --- OTP Verification Action ---
    const verifyOtpAction = useServerAction(verifyOTPAsync, {
        onSuccess: () => {
            toast.success('Email successfully updated!')
            setIsOtpDialogOpen(false)
            setPendingEmail(null)
            emailForm.reset()
            otpForm.reset()
        },
        onError: (error) => {
            handleFormServerErrors(error, otpForm.setError)
        },
    })

    // --- Handlers ---
    const handleEmailChangeSubmit = emailForm.handleSubmit((data) => {
        emailChangeAction.execute(data)
    })

    const handleOtpSubmit = otpForm.handleSubmit((data) => {
        verifyOtpAction.execute({
            referenceId: String(userId),
            code: data.code,
            purpose: 'EMAIL_CHANGE',
        })
    })

    const handleOtpCodeChange = (val: string) => {
        otpForm.setValue('code', val)
        if (otpForm.formState.errors.code) {
            otpForm.clearErrors('code')
        }
    }

    const handleDialogOpenChange = (open: boolean) => {
        if (!open) {
            setIsOtpDialogOpen(false)
            setPendingEmail(null)
            otpForm.reset()
        }
    }

    // --- Derived state ---
    const emailRootError = emailForm.formState.errors.root?.message
    const otpRootError = otpForm.formState.errors.root?.message

    return (
        <div className="space-y-4">
            {/* Email Change Form */}
            <div className="space-y-2.5">
                {emailRootError && (
                    <div className="rounded bg-destructive/10 border border-destructive/20 p-2.5 flex gap-2">
                        <AlertCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5"/>
                        <p className="text-xs text-destructive">{emailRootError}</p>
                    </div>
                )}

                <form onSubmit={handleEmailChangeSubmit}>
                    <Controller
                        name="newEmail"
                        control={emailForm.control}
                        render={({field, fieldState}) => (
                            <Field>
                                <FieldLabel htmlFor="newEmail" className="text-xs font-medium block">
                                    Email
                                </FieldLabel>
                                <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
                                    <Input
                                        {...field}
                                        id="newEmail"
                                        type="email"
                                        placeholder="Enter new email address"
                                        disabled={emailChangeAction.isPending}
                                        aria-invalid={fieldState.invalid}
                                        className="h-8 text-sm flex-1 max-w-md"
                                    />
                                    <Button
                                        type="submit"
                                        disabled={emailChangeAction.isPending || emailForm.watch('newEmail') === email}
                                        className="h-8 text-sm flex items-center justify-center gap-1.5"
                                    >
                                        {emailChangeAction.isPending && <Loader2 className="w-3 h-3 animate-spin"/>}
                                        {emailChangeAction.isPending ? 'Sending...' : 'Update Email'}
                                    </Button>
                                </div>
                                {fieldState.invalid && fieldState.error && (
                                    <FieldError errors={[fieldState.error]}/>
                                )}
                            </Field>
                        )}
                    />
                </form>
            </div>

            {/* OTP Verification Dialog */}
            <Dialog open={isOtpDialogOpen} onOpenChange={handleDialogOpenChange}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Consider verifying your email address</DialogTitle>
                        <DialogDescription>
                            We sent a 6-digit code to <span className="font-medium text-foreground">{pendingEmail}</span>.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleOtpSubmit} className="space-y-4">
                        <Controller
                            name="code"
                            control={otpForm.control}
                            render={({field}) => (
                                <OTPInputDefaultPreview
                                    {...field}
                                    slotCount={6}
                                    disabled={verifyOtpAction.isPending}
                                    aria-invalid={Boolean(otpForm.formState.errors.code || otpRootError)}
                                    onChange={handleOtpCodeChange}
                                />
                            )}
                        />

                        {otpForm.formState.errors.code && (
                            <p className="text-sm text-destructive">{otpForm.formState.errors.code.message}</p>
                        )}

                        {otpRootError && (
                            <div className="rounded bg-destructive/10 border border-destructive/20 p-2.5 flex gap-2">
                                <AlertCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5"/>
                                <p className="text-xs text-destructive">{otpRootError}</p>
                            </div>
                        )}

                        <DialogFooter>
                            <Button
                                type="submit"
                                disabled={verifyOtpAction.isPending || otpForm.watch('code').length !== 6}
                            >
                                {verifyOtpAction.isPending && <Loader2 className="w-3 h-3 animate-spin mr-2"/>}
                                {verifyOtpAction.isPending ? 'Verifying...' : 'Confirm Code'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}

