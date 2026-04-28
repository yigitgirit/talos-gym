import { Metadata } from "next"
import { LoginForm, AuthLayout} from "@/features/auth"

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}): Promise<Metadata> {
  const resolvedSearchParams = await searchParams;
  const isRegistered = resolvedSearchParams?.registered === "true";

  const title = isRegistered ? "Welcome to TalosGym" : "Login - TalosGym";
  const description = isRegistered 
    ? "Your account has been created. Sign in to start your fitness journey."
    : "Sign in to your TalosGym account to manage your workouts and fitness goals.";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedSearchParams = await searchParams;
  const isRegistered = resolvedSearchParams?.registered === "true";

  return (
    <AuthLayout
      title={isRegistered ? "Registration Successful" : "Welcome back"}
      description={isRegistered ? "Please sign in to your new account to continue" : "Sign in to your account to continue"}
    >
      <LoginForm />
    </AuthLayout>
  )
}
