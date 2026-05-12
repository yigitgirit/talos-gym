'use client'

import {useState} from 'react'
import {Controller, useForm} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'
import {z} from 'zod'
import {toast} from 'sonner'
import {AlertCircle, Loader2} from 'lucide-react'

import {PhoneChangeInitiateRequest, PhoneChangeInitiateRequestSchema} from '@/lib/api/schema'
import {initiatePhoneChangeAsync} from '@/features/profile/actions/profile.actions'
import {useServerAction} from '@/hooks/useServerAction'
import {verifyOTPAsync} from '@/features/auth/actions/auth.actions'
import {handleFormServerErrors} from '@/features/common/utils/form-errors'

import {Button} from '@/components/ui/button'
import {Field, FieldError, FieldLabel} from '@/components/ui/field'
import {PhoneInputField} from '@/components/ui/phone-input'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {OTPInputDefaultPreview} from '@/components/ui/otp'

type Props = {
    readonly phoneNumber: string
    readonly userId: number
}

const otpSchema = z.object({
    code: z.string().length(6, 'Code must be 6 digits'),
})

type OtpFormData = z.infer<typeof otpSchema>

export function PhoneSettings({phoneNumber, userId}: Props) {
    const [isOtpDialogOpen, setIsOtpDialogOpen] = useState(false)
    const [pendingPhone, setPendingPhone] = useState<string | null>(null)

    // --- Phone Change Form ---
    const phoneForm = useForm<PhoneChangeInitiateRequest>({
        resolver: zodResolver(PhoneChangeInitiateRequestSchema),
        mode: 'onBlur',
        defaultValues: {newPhoneNumber: phoneNumber || ''},
    })

    // --- Phone Change Action ---
    const phoneChangeAction = useServerAction(initiatePhoneChangeAsync, {
        onSuccess: (_, args) => {
            setPendingPhone(args.newPhoneNumber)
            setIsOtpDialogOpen(true)
            toast.success('Verification code sent to your new phone number.')
        },
        onError: (error) => {
            handleFormServerErrors(error, phoneForm.setError)
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
            toast.success('Phone number successfully updated!')
            setIsOtpDialogOpen(false)
            setPendingPhone(null)
            phoneForm.reset()
            otpForm.reset()
        },
        onError: (error) => {
            handleFormServerErrors(error, otpForm.setError)
        },
    })

    // --- Handlers ---
    const handlePhoneChangeSubmit = phoneForm.handleSubmit((data) => {
        phoneChangeAction.execute(data)
    })

    const handleOtpSubmit = otpForm.handleSubmit((data) => {
        verifyOtpAction.execute({
            referenceId: String(userId),
            code: data.code,
            purpose: 'PHONE_CHANGE',
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
            setPendingPhone(null)
            otpForm.reset()
        }
    }

    // --- Derived state ---
    const phoneRootError = phoneForm.formState.errors.root?.message
    const otpRootError = otpForm.formState.errors.root?.message

    return (
        <div className="space-y-4">
            {/* Phone Change Form */}
            <div className="space-y-2.5">
                {phoneRootError && (
                    <div className="rounded bg-destructive/10 border border-destructive/20 p-2.5 flex gap-2">
                        <AlertCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5"/>
                        <p className="text-xs text-destructive">{phoneRootError}</p>
                    </div>
                )}

                <form onSubmit={handlePhoneChangeSubmit}>
                    <Controller
                        name="newPhoneNumber"
                        control={phoneForm.control}
                        render={({field, fieldState}) => (
                            <Field>
                                <FieldLabel htmlFor="newPhoneNumber" className="text-xs font-medium block">
                                    Phone Number
                                </FieldLabel>
                                <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
                                    <PhoneInputField
                                        {...field}
                                        id="newPhoneNumber"
                                        placeholder="+90 555 000 00 00"
                                        disabled={phoneChangeAction.isPending}
                                        aria-invalid={fieldState.invalid}
                                        className="h-8 text-sm flex-1 max-w-md"
                                    />
                                    <Button
                                        type="submit"
                                        variant="secondary"
                                        disabled={phoneChangeAction.isPending || phoneForm.watch('newPhoneNumber') === phoneNumber}
                                        className="h-8 text-sm flex items-center justify-center gap-1.5"
                                    >
                                        {phoneChangeAction.isPending && <Loader2 className="w-3 h-3 animate-spin"/>}
                                        {phoneChangeAction.isPending ? 'Sending...' : 'Change Phone'}
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
                        <DialogTitle>Verify your phone number</DialogTitle>
                        <DialogDescription>
                            We sent a 6-digit code to <span
                            className="font-medium text-foreground">{pendingPhone}</span>.
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

