/**
 * Pending Registration Store
 * Manages data needed for OTP verification after registration
 * Separation of Concern: Registration state isolated from auth state
 */

import { create } from "zustand"

interface PendingRegistrationState {
  referenceId: string | null
  phoneNumber: string | null
  email: string | null

  // Actions
  setPendingRegistration: (referenceId: string, phoneNumber: string, email: string) => void
  clearPendingRegistration: () => void
  getReferenceId: () => string | null
  getPhoneNumber: () => string | null
}

export const usePendingRegistrationStore = create<PendingRegistrationState>((set, get) => ({
  referenceId: null,
  phoneNumber: null,
  email: null,

  setPendingRegistration: (referenceId, phoneNumber, email) => {
    console.log("[PendingRegistration] Setting data - referenceId:", referenceId, "phone:", phoneNumber)
    set({
      referenceId,
      phoneNumber,
      email
    })
  },

  clearPendingRegistration: () => {
    console.log("[PendingRegistration] Clearing data")
    set({
      referenceId: null,
      phoneNumber: null,
      email: null
    })
  },

  getReferenceId: () => {
    const { referenceId } = get()
    return referenceId
  },

  getPhoneNumber: () => {
    const { phoneNumber } = get()
    return phoneNumber
  }
}))

