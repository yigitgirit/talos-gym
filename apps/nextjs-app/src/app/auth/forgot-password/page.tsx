import type { Metadata } from "next"
import { ForgotPasswordView } from "@/features/auth/components/forgot-password-view"

export const metadata: Metadata = {
    title: "Forgot Password",
    description: "Reset your password",
}

export default function ForgotPasswordPage() {
    return <ForgotPasswordView />
}
