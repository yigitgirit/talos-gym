"use client"

import * as React from "react"
import { Controller, useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldError,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { registerSchema, type RegisterInput } from "@/features/auth/schemas"
import { useServerAction } from "@/hooks/useServerAction"
import { registerAsync } from "@/features/auth/actions/auth.actions"
import { AlertCircle, Loader2 } from "lucide-react"
import { usePendingRegistrationStore } from "@/features/auth/store/pending-registration"
import { handleFormServerErrors } from "@/features/common/utils/form-errors"
import { PhoneInputField } from "@/components/ui/phone-input"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";

export function RegisterForm() {
  const router = useRouter()
  const setPendingRegistration = usePendingRegistrationStore((state) => state.setPendingRegistration)

  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    mode: "onBlur",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
      gender: undefined,
    },
  })

  const { execute, isPending } = useServerAction(registerAsync, {
    onSuccess: (_, input) => {
        setPendingRegistration(input.phoneNumber, input.email)
        router.push("/auth/verify-otp")
    },
    onError: (error) => {
      handleFormServerErrors(error, form.setError)
    }
  })

  const handleSubmit = (values: RegisterInput) => {
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <Controller
            name="firstName"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel htmlFor="register-firstName" className="text-xs font-medium block">
                  First name
                </FieldLabel>
                <Input
                  {...field}
                  id="register-firstName"
                  placeholder="Alaattin"
                  disabled={isPending}
                  aria-invalid={fieldState.invalid}
                  autoComplete="given-name"
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
                <FieldLabel htmlFor="register-lastName" className="text-xs font-medium block">
                  Last name
                </FieldLabel>
                <Input
                  {...field}
                  id="register-lastName"
                  placeholder="Düzdere"
                  disabled={isPending}
                  aria-invalid={fieldState.invalid}
                  autoComplete="family-name"
                  className="h-8 text-sm"
                />
                {fieldState.invalid && fieldState.error && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>

        {/* Email */}
        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel htmlFor="register-email" className="text-xs font-medium block">
                Email
              </FieldLabel>
              <Input
                {...field}
                id="register-email"
                type="email"
                placeholder="your-email@example.com"
                disabled={isPending}
                aria-invalid={fieldState.invalid}
                autoComplete="email"
                className="h-8 text-sm"
              />
              {fieldState.invalid && fieldState.error && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />

        {/* Phone & Gender - Responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <Controller
            name="phoneNumber"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel htmlFor="register-phone" className="text-xs font-medium block">
                  Phone
                </FieldLabel>
                <PhoneInputField
                  {...field}
                  id="register-phone"
                  placeholder="+90 555 000 00 00"
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
                <FieldLabel htmlFor="register-gender" className="text-xs font-medium block">
                  Gender
                </FieldLabel>
                  <Select
                      value={field.value ?? ""}
                      onValueChange={(value) => field.onChange(value || undefined)}
                      disabled={isPending}
                  >
                      <SelectTrigger
                          id="register-gender"
                          onBlur={field.onBlur}
                          aria-invalid={fieldState.invalid}
                          className="w-full"
                      >
                          <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                          <SelectItem value="NOT_SPECIFIED">Not Specified</SelectItem>
                          <SelectItem value="MALE">Male</SelectItem>
                          <SelectItem value="FEMALE">Female</SelectItem>
                          <SelectItem value="EITHER">Either</SelectItem>
                      </SelectContent>
                  </Select>
                {fieldState.invalid && fieldState.error && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>

        {/* Password Row - Responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <Controller
            name="password"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel htmlFor="register-password" className="text-xs font-medium block">
                  Password
                </FieldLabel>
                <Input
                  {...field}
                  id="register-password"
                  type="password"
                  placeholder="••••••••"
                  disabled={isPending}
                  aria-invalid={fieldState.invalid}
                  autoComplete="new-password"
                  className="h-8 text-sm"
                />
                {fieldState.invalid && fieldState.error && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="confirmPassword"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel htmlFor="register-confirmPassword" className="text-xs font-medium block">
                  Confirm
                </FieldLabel>
                <Input
                  {...field}
                  id="register-confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  disabled={isPending}
                  aria-invalid={fieldState.invalid}
                  autoComplete="new-password"
                  className="h-8 text-sm"
                />
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
          {isPending ? "Creating..." : "Create Account"}
        </Button>
      </form>

      {/* Sign in link */}
      <div className="text-center text-sm mt-4">
        <p className="text-muted-foreground">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-primary font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
