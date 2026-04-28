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
} from "@/features/auth/validations"
import { useServerAction } from "@/hooks/useServerAction"
import { loginAsync } from "@/features/auth/actions"
import { AlertCircle, Loader2 } from "lucide-react"

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
      if (error.details && error.details.length > 0) {
        error.details.forEach((detail) => {
          form.setError(detail.field as keyof LoginInput, {
            type: "server",
            message: detail.message
          })
        })
      } else {
        form.setError("root", {
          type: "server",
          message: error.message
        })
      }
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
        <div className="mb-3 rounded bg-red-50 border border-red-200 p-2.5 flex gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          <p className="text-xs text-red-900">{rootError}</p>
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
              <Input
                {...field}
                id="login-identifier"
                type={useEmail ? "email" : "tel"}
                placeholder={useEmail ? "your-email@example.com" : "+90 555 0000"}
                disabled={isPending}
                aria-invalid={fieldState.invalid}
                autoComplete={useEmail ? "email" : "tel"}
                className="h-8 text-sm"
              />
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
                <Link
                  href="/auth/forgot-password"
                  className="text-xs text-blue-600 hover:text-blue-700 hover:underline"
                >
                  Forgot?
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
          <p className="text-gray-600">
            Don&apos;t have an account?{" "}
            <Link href="/auth/register" className="text-blue-600 hover:text-blue-700 font-medium">
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
              className="text-blue-600 hover:text-blue-700 hover:underline"
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
              className="text-blue-600 hover:text-blue-700 hover:underline"
            >
              Sign in with phone
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
