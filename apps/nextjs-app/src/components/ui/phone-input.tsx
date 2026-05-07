import * as React from "react"
import "react-phone-number-input/style.css"
import PhoneInput from "react-phone-number-input"

import { cn } from "@/lib/utils"

function PhoneInputField({ className, ...props }: React.ComponentProps<typeof PhoneInput>) {
  return (
    <PhoneInput
      international
      defaultCountry="TR"
      className={cn(
        "flex h-9 w-full min-w-0 rounded-md border border-input bg-background px-2.5 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none focus-within:border-focus-ring focus-within:ring-3 focus-within:ring-focus-ring-subtle has-[input:disabled]:pointer-events-none has-[input:disabled]:cursor-not-allowed has-[input:disabled]:opacity-50 has-[input[aria-invalid=true]]:border-destructive-border has-[input[aria-invalid=true]]:ring-3 has-[input[aria-invalid=true]]:ring-destructive-subtle md:text-sm",
        "[&_.PhoneInputCountryIcon]:w-5 [&_.PhoneInputCountryIcon]:h-3.5",
        "[&_.PhoneInputInput]:min-w-0 [&_.PhoneInputInput]:border-none [&_.PhoneInputInput]:bg-transparent [&_.PhoneInputInput]:focus:outline-none [&_.PhoneInputInput]:w-full [&_.PhoneInputInput]:text-base md:[&_.PhoneInputInput]:text-sm [&_.PhoneInputInput]:ml-2",
        className
      )}
      {...props}
    />
  )
}

export { PhoneInputField }
