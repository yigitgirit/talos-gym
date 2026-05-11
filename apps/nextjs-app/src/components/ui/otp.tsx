"use client"

import * as React from "react"
import {
  OTPInput as OTPInputLib,
  OTPInputContext,
  type OTPInputProps,


} from "input-otp"

import {cn} from "@/lib/utils"
import {MinusIcon} from "lucide-react"

/**
 * InputOTPGroup - Container for OTP slots with shadcn styling
 */
function InputOTPGroup({className, ...props}: React.ComponentProps<"div">) {
  return (
      <div
          className={cn(
              "flex items-center rounded-md has-aria-invalid:border-destructive-border has-aria-invalid:ring-3 has-aria-invalid:ring-destructive-subtle",
              className
          )}
          {...props}
      />
  )
}

/**
 * InputOTPSlot - Individual OTP input slot with shadcn styling
 * Uses SlotProps from library context
 */
function InputOTPSlot({
                        index,
                        className,
                        ...props
                      }: React.ComponentProps<"div"> & { index: number }) {
  const ctx = React.useContext(OTPInputContext)
  const {char, hasFakeCaret, isActive} = ctx?.slots[index] ?? {}

  return (
      <div
          className={cn(
              "relative flex size-9 items-center justify-center border-y border-r border-input bg-background text-sm shadow-xs transition-all outline-none first:rounded-l-md first:border-l last:rounded-r-md aria-invalid:border-destructive-border data-[active=true]:z-10 data-[active=true]:border-focus-ring data-[active=true]:ring-3 data-[active=true]:ring-focus-ring-subtle data-[active=true]:aria-invalid:border-destructive-border data-[active=true]:aria-invalid:ring-destructive-subtle",
              className
          )}
          data-active={isActive}
          {...props}
      >
        {char}
        {hasFakeCaret && (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div className="h-4 w-px animate-caret-blink bg-foreground duration-1000"/>
            </div>
        )}
      </div>
  )
}

/**
 * InputOTPSeparator - Visual separator between slots
 */
function InputOTPSeparator(props: React.ComponentProps<"div">) {
  return (
      <div
          className="flex items-center [&_svg:not([class*='size-'])]:size-4"
          role="separator"
          {...props}
      >
        <MinusIcon/>
      </div>
  )
}

/**
 * OTPInput - Wrapper around input-otp with shadcn styling
 * Extends OTPInputProps from library and adds slotCount prop
 */
interface OTPInputWrapperProps extends Omit<OTPInputProps, "children" | "render" | "maxLength"> {
  slotCount?: number
}

const OTPInputDefaultPreview = React.forwardRef<HTMLInputElement, OTPInputWrapperProps>(
    ({slotCount = 6, containerClassName, ...props}, ref) => (
        <OTPInputLib
            ref={ref}
            maxLength={slotCount}
            containerClassName={cn(
                "cn-input-otp flex items-center has-disabled:opacity-50 mt-2 justify-center",
                containerClassName
            )}
            spellCheck={false}
            {...props}
        >
          <InputOTPGroup>
            {Array.from({length: slotCount}).map((_, i) => (
                <InputOTPSlot key={i} index={i} className="size-10"/>
            ))}
          </InputOTPGroup>
        </OTPInputLib>
    )
)
OTPInputDefaultPreview.displayName = "OTPInput"

// Re-export all library types and constants
export {
  OTPInputDefaultPreview,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
}

export {
  OTPInputContext,
  type OTPInputProps,
  type RenderProps,
  type SlotProps,
  REGEXP_ONLY_DIGITS,
  REGEXP_ONLY_CHARS,
  REGEXP_ONLY_DIGITS_AND_CHARS} from "input-otp"
