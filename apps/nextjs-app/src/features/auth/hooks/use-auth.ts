'use client'

import { useAuthStore } from '@/features/auth/store'
import { logoutAsync } from '../actions'
import { useShallow } from 'zustand/react/shallow'
import { useServerAction } from '@/hooks/useServerAction'

/**
 * Hook to get current auth state
 */
export function useAuth() {
  return useAuthStore(
    useShallow((state) => ({
      user: state.user,
      isAuthenticated: state.isAuthenticated,
      isLoading: state.isLoading,
    }))
  )
}

export function useLogout() {
  const logoutStore = useAuthStore((state) => state.logout);

  const { execute, isPending } = useServerAction(logoutAsync, {
    onSuccess: () => {
      logoutStore();
      globalThis.location.href = '/';
    }
  });

  // Return mutate to keep it backward compatible with the components currently using it
  return { execute, isPending };
}
