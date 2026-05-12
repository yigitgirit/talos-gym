'use client'

import * as React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useServerAction } from '@/hooks/useServerAction'
import { updateProfileAsync } from '@/features/profile'
import { UpdateUserRequestSchema, type UpdateUserRequest, type UserResponse } from '@/lib/api/schema'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select'
import {
  Field,
  FieldError,
  FieldLabel,
} from '@/components/ui/field'
import { AlertCircle, Loader2 } from 'lucide-react'
import { handleFormServerErrors } from '@/features/common/utils/form-errors'

interface ProfileFormProps {
  readonly user: UserResponse
  readonly onSuccess?: (data: UserResponse) => void
}

export function ProfileForm({ user, onSuccess }: ProfileFormProps) {
  const form = useForm<UpdateUserRequest>({
    resolver: zodResolver(UpdateUserRequestSchema),
    mode: 'onBlur',
    defaultValues: {
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      gender: user.gender || 'NOT_SPECIFIED',
    },
  })

  const { execute, isPending } = useServerAction(updateProfileAsync, {
    onSuccess: (data) => {
      if (data) {
        onSuccess?.(data)
      }
    },
    onError: (error) => {
      handleFormServerErrors(error, form.setError)
    },
    showGlobalError: false,
  })

  const handleSubmit = (values: UpdateUserRequest) => {
    form.clearErrors()
    execute(values)
  }

  const rootError = form.formState.errors.root?.message

  return (
    <div className="w-full">
      {/* Server Error Banner */}
      {rootError && (
        <div className="mb-3 rounded bg-destructive/10 border border-destructive/20 p-2.5 flex gap-2">
          <AlertCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
          <p className="text-xs text-destructive">{rootError}</p>
        </div>
      )}

      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-2.5">
        {/* Name Row - Responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <Controller
            name="firstName"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel htmlFor="profile-firstName" className="text-xs font-medium block">
                  First Name
                </FieldLabel>
                <Input
                  {...field}
                  id="profile-firstName"
                  placeholder="Enter your first name"
                  disabled={isPending}
                  aria-invalid={fieldState.invalid}
                  className="h-8 text-sm"
                />
                {fieldState.invalid && fieldState.error && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="lastName"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel htmlFor="profile-lastName" className="text-xs font-medium block">
                  Last Name
                </FieldLabel>
                <Input
                  {...field}
                  id="profile-lastName"
                  placeholder="Enter your last name"
                  disabled={isPending}
                  aria-invalid={fieldState.invalid}
                  className="h-8 text-sm"
                />
                {fieldState.invalid && fieldState.error && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="gender"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel htmlFor="profile-gender" className="text-xs font-medium block">
                  Gender
                </FieldLabel>
                <NativeSelect
                  id="profile-gender"
                  name={field.name}
                  value={field.value ?? ''}
                  onBlur={field.onBlur}
                  onChange={(event) => field.onChange(event.target.value || undefined)}
                  disabled={isPending}
                  aria-invalid={fieldState.invalid}
                  className="h-8 text-sm"
                >
                  <NativeSelectOption value="">Select</NativeSelectOption>
                  <NativeSelectOption value="NOT_SPECIFIED">Prefer not to say</NativeSelectOption>
                  <NativeSelectOption value="MALE">Male</NativeSelectOption>
                  <NativeSelectOption value="FEMALE">Female</NativeSelectOption>
                </NativeSelect>
                {fieldState.invalid && fieldState.error && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isPending}
          className="w-full h-8 text-sm flex items-center justify-center gap-1.5 mt-4"
        >
          {isPending && <Loader2 className="w-3 h-3 animate-spin" />}
          {isPending ? 'Saving...' : 'Save Changes'}
        </Button>
      </form>
    </div>
  )
}
