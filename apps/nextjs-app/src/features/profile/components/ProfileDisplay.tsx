'use client'

import { useState } from 'react'
import { type UserResponse } from '@/lib/api/schema'
import { ProfileForm } from './ProfileForm'
import { CheckCircle2 } from 'lucide-react'

interface ProfileDisplayProps {
  readonly user: UserResponse
}

export function ProfileDisplay({ user }: ProfileDisplayProps) {
  const [updatedUser, setUpdatedUser] = useState<UserResponse | null>(null)
  const [showSuccess, setShowSuccess] = useState(false)

  const displayUser = updatedUser || user

  const handleSuccess = (data: UserResponse) => {
    setUpdatedUser(data)
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 3000)
  }

  return (
    <>
      {showSuccess && (
        <div className="mb-3 rounded bg-green-50 border border-green-200 p-2.5 flex gap-2">
          <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
          <p className="text-xs text-green-700">Profile updated successfully!</p>
        </div>
      )}

      <ProfileForm user={displayUser} onSuccess={handleSuccess} />
    </>
  )
}
