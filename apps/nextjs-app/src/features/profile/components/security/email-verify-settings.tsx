'use client'

import {useState} from 'react'
import {Controller, useForm} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'
import {z} from 'zod'
import {toast} from 'sonner'
import {AlertCircle, Loader2} from 'lucide-react'

import {verifyEmailAsync} from '@/features/profile/actions/profile.actions'
import {useServerAction} from '@/hooks/useServerAction'
import {verifyOTPAsync} from '@/features/auth/actions/auth.actions'
import {handleFormServerErrors} from '@/features/common/utils/form-errors'

import {Button} from '@/components/ui/button'
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

export function EmailVerifySettings({email, userId}: Props) {
    const [isOtpDialogOpen, setIsOtpDialogOpen] = useState(false)

    // --- Email Verify Action ---
    const verifyEmailAction = useServerAction(verifyEmailAsync, {
        onSuccess: () => {
            setIsOtpDialogOpen(true)
            toast.success('Verification code sent to your current email.')
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
            toast.success('Email successfully verified!')
            setIsOtpDialogOpen(false)
            otpForm.reset()
        },
        onError: (error) => {
            handleFormServerErrors(error, otpForm.setError)
        },
    })

    // --- Handlers ---
    const handleVerifyClick = () => {
        verifyEmailAction.execute()
    }

    const handleOtpSubmit = otpForm.handleSubmit((data) => {
        verifyOtpAction.execute({
            referenceId: String(userId),
            code: data.code,
            purpose: 'EMAIL_VERIFICATION',
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
            otpForm.reset()
        }
    }

    // --- Derived state ---
    const otpRootError = otpForm.formState.errors.root?.message

    return (
        <div className="pt-1">
            {verifyEmailAction.error && (
                <div className="mb-2 rounded bg-destructive/10 border border-destructive/20 p-2.5 flex gap-2">
                    <AlertCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                    <p className="text-xs text-destructive">{verifyEmailAction.error.message}</p>
                </div>
            )}
            
            <Button
                type="button"
                variant="link"
                className="px-0 h-auto text-xs text-muted-foreground font-normal"
                onClick={handleVerifyClick}
                disabled={verifyEmailAction.isPending}
            >
                {verifyEmailAction.isPending && <Loader2 className="w-3 h-3 animate-spin mr-1.5 inline" />}
                {verifyEmailAction.isPending ? 'Sending...' : 'Send verification code to current email'}
            </Button>

            {/* OTP Verification Dialog */}
            <Dialog open={isOtpDialogOpen} onOpenChange={handleDialogOpenChange}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Verify your email address</DialogTitle>
                        <DialogDescription>
                            We sent a 6-digit code to <span className="font-medium text-foreground">{email}</span>.
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
