import {UserResponse} from "@/lib/api/schema";

export interface AuthState {
  user: UserResponse | null
  isAuthenticated: boolean
  isLoading: boolean
  setUser: (user: UserResponse | null) => void
  setIsLoading: (isLoading: boolean) => void
  logout: () => void
}

