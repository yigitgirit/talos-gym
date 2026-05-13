import { Metadata } from "next"
import { LoginForm, AuthLayout} from "@/features/auth"

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}): Promise<Metadata> {
  const resolvedSearchParams = await searchParams;
  const isRegistered = resolvedSearchParams?.registered === "true";
  const callbackUrl = resolvedSearchParams?.callbackUrl as string | undefined;
  const isFromGetStarted = callbackUrl?.includes('/get-started');

  let title = "Login - TalosGym";
  let description = "Sign in to your TalosGym account to manage your workouts and fitness goals.";

  if (isRegistered) {
    title = "Welcome to TalosGym";
    description = "Your account has been created. Sign in to start your fitness journey.";
  } else if (isFromGetStarted) {
    title = "Sign in to continue - TalosGym";
    description = "Sign in to your account to continue selecting your club and membership plan.";
  }

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
  const callbackUrl = resolvedSearchParams?.callbackUrl as string | undefined;
  const isFromGetStarted = callbackUrl?.includes('/get-started');

  let title = "Welcome back";
  let description = "Sign in to your account to continue";

  if (isRegistered) {
    title = "Registration Successful";
    description = "Please sign in to your new account to continue";
  } else if (isFromGetStarted) {
    title = "Sign in to continue";
    description = "Log in to your account to resume your onboarding and choose your plan.";
  }

  return (
    <AuthLayout
      title={title}
      description={description}
    >
      <LoginForm />
    </AuthLayout>
  )
}
