"use client"

import * as React from "react"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldError,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  loginPhoneSchema,
  emailLoginSchema,
  type LoginInput
} from "@/features/auth/schemas"
import { useServerAction } from "@/hooks/useServerAction"
import { loginAsync } from "@/features/auth/actions/auth.actions"
import { AlertCircle, Loader2 } from "lucide-react"
import { handleFormServerErrors } from "@/features/common/utils/form-errors"
import { PhoneInputField } from "@/components/ui/phone-input"

export function LoginForm() {
  const [useEmail, setUseEmail] = React.useState(false)

  const schema = useEmail ? emailLoginSchema : loginPhoneSchema

  const form = useForm<LoginInput>({
    resolver: zodResolver(schema),
    mode: "onBlur",
    defaultValues: {
      identifier: "",
      password: "",
    },
  })

  const { execute, isPending } = useServerAction(loginAsync, {
    onSuccess: () => {
      globalThis.location.href = "/";
    },
    onError: (error) => {
      handleFormServerErrors(error, form.setError)
    }
  })

  const handleSubmit = (values: LoginInput) => {
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
        {/* Phone/Email Field */}
        <Controller
          name="identifier"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel htmlFor="login-identifier" className="text-xs font-medium block">
                {useEmail ? "Email" : "Phone Number"}
              </FieldLabel>
              {useEmail ? (
                <Input
                  {...field}
                  id="login-identifier"
                  type="email"
                  placeholder="your-email@example.com"
                  disabled={isPending}
                  aria-invalid={fieldState.invalid}
                  autoComplete="email"
                  className="h-8 text-sm"
                />
              ) : (
                <PhoneInputField
                  {...field}
                  id="login-identifier"
                  placeholder="+90 555 000 00 00"
                  disabled={isPending}
                  aria-invalid={fieldState.invalid}
                  className="h-8 text-sm"
                />
              )}
              {fieldState.invalid && fieldState.error && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />

        {/* Password Field */}
        <Controller
          name="password"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field>
              <div className="flex items-center justify-between mb-1">
                <FieldLabel htmlFor="login-password" className="text-xs font-medium">
                  Password
                </FieldLabel>
                <Link href="/auth/forgot-password" className="text-xs text-primary hover:underline">
                  Forgot my password
                </Link>
              </div>
              <Input
                {...field}
                id="login-password"
                type="password"
                placeholder="••••••••"
                disabled={isPending}
                aria-invalid={fieldState.invalid}
                autoComplete="current-password"
                className="h-8 text-sm"
              />
              {fieldState.invalid && fieldState.error && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isPending}
          className="w-full h-8 text-sm flex items-center justify-center gap-1.5 mt-4"
        >
          {isPending && <Loader2 className="w-3 h-3 animate-spin" />}
          {isPending ? "Signing in..." : "Sign in"}
        </Button>
      </form>

      {/* Sign up and email link */}
      <div className="space-y-2 mt-4">
        <div className="text-center text-sm">
          <p className="text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/auth/register" className="text-primary font-medium hover:underline">
              Sign up
            </Link>
          </p>
        </div>

        {/* Toggle to email signin */}
        {!useEmail && (
          <div className="text-center text-sm">
            <button
              type="button"
              onClick={() => {
                setUseEmail(true)
                form.reset()
                form.clearErrors()
              }}
              className="text-primary hover:underline"
            >
              Sign in with email
            </button>
          </div>
        )}

        {/* Toggle back to phone signin */}
        {useEmail && (
          <div className="text-center text-sm">
            <button
              type="button"
              onClick={() => {
                setUseEmail(false)
                form.reset()
                form.clearErrors()
              }}
              className="text-primary hover:underline"
            >
              Sign in with phone
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
