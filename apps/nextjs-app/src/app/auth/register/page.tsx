import { Metadata } from "next"
import { RegisterForm } from "@/features/auth/components/register-form"
import { AuthLayout } from "@/features/auth/components/auth-layout"

export const metadata: Metadata = {
  title: "Register - TalosGym",
  description: "Create a new TalosGym account to start your fitness journey.",
  openGraph: {
    title: "Register - TalosGym",
    description: "Create a new TalosGym account to start your fitness journey.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Register - TalosGym",
    description: "Create a new TalosGym account to start your fitness journey.",
  },
}

export default function RegisterPage() {
  return (
    <AuthLayout
      title="Create account"
      description="Join TalosGym and start your fitness journey"
      showTerms={true}
    >
      <RegisterForm />
    </AuthLayout>
  )
}
