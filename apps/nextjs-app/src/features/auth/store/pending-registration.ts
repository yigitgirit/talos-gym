/**
 * Pending Registration Store
 * Manages data needed for OTP verification after registration
 *
 * referenceId: Currently the phone number, but future-proof for UUID tokens
 * email: User's email for reference
 *
 * Separation of Concern: Registration state isolated from auth state
 */

import { create } from "zustand"

interface PendingRegistrationState {
  referenceId: string | null
  email: string | null

  // Actions
  setPendingRegistration: (referenceId: string, email: string) => void
  clearPendingRegistration: () => void
  getReferenceId: () => string | null
}

export const usePendingRegistrationStore = create<PendingRegistrationState>((set, get) => ({
  referenceId: null,
  email: null,

  setPendingRegistration: (referenceId, email) => {
    console.log("[PendingRegistration] Setting data - referenceId:", referenceId)
    set({
      referenceId,
      email
    })
  },

  clearPendingRegistration: () => {
    console.log("[PendingRegistration] Clearing data")
    set({
      referenceId: null,
      email: null
    })
  },

  getReferenceId: () => {
    const { referenceId } = get()
    return referenceId
  }
}))

