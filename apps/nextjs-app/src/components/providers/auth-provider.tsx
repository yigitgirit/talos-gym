"use client"

import { ReactNode, useRef } from "react"
import { useAuthStore } from "@/features/auth/store"
import { UserResponse } from "@/lib/api/schema"

interface AuthProviderProps {
  initialUser: UserResponse | null;
  children: ReactNode;
}

/**
 * AuthProvider hydrates the client-side Zustand store with the server-fetched session.
 */
export function AuthProvider({ initialUser, children }: Readonly<AuthProviderProps>) {
  const isInitialized = useRef(false)

  if (!isInitialized.current) {
    useAuthStore.getState().setUser(initialUser)
    useAuthStore.getState().setIsLoading(false)
    isInitialized.current = true
  }

  return <>{children}</>
}
