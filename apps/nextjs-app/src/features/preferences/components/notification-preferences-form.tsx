'use client'

import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { useState } from 'react'
import { AlertCircle, Loader2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Field, FieldLabel } from '@/components/ui/field'
import { Checkbox } from '@/components/ui/checkbox'

import {
  UpdateNotificationPreferenceRequest,
  UpdateNotificationPreferenceRequestSchema,
  UserNotificationPreferenceDto,
  NotificationCategory,
  NotificationChannel,
} from '@/lib/api/schema'
import { updateNotificationPreferenceAsync } from '@/features/preferences/actions/preferences.actions'
import { useServerAction } from '@/hooks/useServerAction'
import { handleFormServerErrors } from '@/features/common/utils/form-errors'

interface NotificationPreferencesFormProps {
  readonly preferences: UserNotificationPreferenceDto[]
}

const NOTIFICATION_CATEGORIES: Partial<Record<NotificationCategory, { label: string; description: string }>> = {
  GENERAL_ANNOUNCEMENT: {
    label: 'General Announcements',
    description: 'Receive general announcements and updates',
  },
  REMINDER: {
    label: 'Reminders',
    description: 'Receive reminder notifications',
  },
  SECURITY_ALERT: {
    label: 'Security Alerts',
    description: 'Receive security alerts and warnings',
  },
}

const NOTIFICATION_CHANNELS: Partial<Record<NotificationChannel, string>> = {
  EMAIL: 'Email',
  SMS: 'SMS',
  PUSH_NOTIFICATION: 'Push',
}

export function NotificationPreferencesForm({ preferences }: NotificationPreferencesFormProps) {
  const defaultCategory = (preferences?.find((p) =>
    Object.keys(NOTIFICATION_CATEGORIES).includes(p.category)
  )?.category || 'GENERAL_ANNOUNCEMENT') as NotificationCategory

  const [selectedCategory, setSelectedCategory] = useState<NotificationCategory>(defaultCategory)

  const currentPref = preferences.find((p) => p.category === selectedCategory)

  const form = useForm<UpdateNotificationPreferenceRequest>({
    resolver: zodResolver(UpdateNotificationPreferenceRequestSchema),
    mode: 'onChange',
    defaultValues: {
      category: defaultCategory,
      channels: currentPref?.channels || [],
    },
  })

  const { execute, isPending, error } = useServerAction(updateNotificationPreferenceAsync, {
    onSuccess: () => {
      toast.success('Notification preference updated successfully')
    },
    onError: (error) => {
      handleFormServerErrors(error, form.setError)
    },
    showGlobalError: false,
  })

  const onSubmit = form.handleSubmit((data) => {
    execute(data)
  })

  const handleCategoryChange = (category: NotificationCategory) => {
    setSelectedCategory(category)
    const pref = preferences.find((p) => p.category === category)
    form.setValue('category', category)
    form.setValue('channels', pref?.channels || [])
  }

  return (
    <div className="w-full">
      {error && (
        <div className="mb-4 rounded bg-destructive/10 border border-destructive/20 p-2.5 flex gap-2">
          <AlertCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
          <p className="text-xs text-destructive">{error.message}</p>
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-6">
        {/* Categories Section */}
        <Field>
          <FieldLabel className="text-sm font-medium">Notification Types</FieldLabel>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-3">
            {Object.entries(NOTIFICATION_CATEGORIES).map(([key, { label, description }]) => (
              <button
                key={key}
                type="button"
                onClick={() => handleCategoryChange(key as NotificationCategory)}
                className={`text-left p-3 rounded-lg border transition-all ${
                  selectedCategory === key
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50 hover:bg-muted/50'
                }`}
              >
                <div className="font-medium text-sm">{label}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{description}</div>
              </button>
            ))}
          </div>
        </Field>

        {/* Channels Section */}
        {selectedCategory && NOTIFICATION_CATEGORIES[selectedCategory] && (
          <Field>
            <FieldLabel className="text-sm font-medium">
              Notification Channels for {NOTIFICATION_CATEGORIES[selectedCategory]?.label}
            </FieldLabel>

            <div className="mt-3 space-y-3 p-4 rounded-lg bg-muted/50 border">
              <Controller
                name="channels"
                control={form.control}
                render={({ field }) => (
                  <>
                    {Object.entries(NOTIFICATION_CHANNELS).map(([key, label]) => {
                      const channel = key as NotificationChannel
                      const isChecked = field.value?.includes(channel) ?? false

                      return (
                        <div key={key} className="flex items-center gap-3">
                          <Checkbox
                            id={`channel-${key}`}
                            checked={isChecked}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                field.onChange([...(field.value || []), channel])
                              } else {
                                field.onChange((field.value || []).filter((c) => c !== channel))
                              }
                            }}
                            disabled={isPending}
                          />
                          <label
                            htmlFor={`channel-${key}`}
                            className="text-sm font-medium cursor-pointer select-none flex-1"
                          >
                            {label}
                          </label>
                        </div>
                      )
                    })}
                  </>
                )}
              />
            </div>
          </Field>
        )}

        {/* Submit Button */}
        <div className="pt-2">
          <Button
            type="submit"
            disabled={isPending || !form.formState.isDirty}
            className="h-8 text-sm flex items-center justify-center gap-1.5"
          >
            {isPending && <Loader2 className="w-3 h-3 animate-spin" />}
            {isPending ? 'Saving...' : 'Save Preferences'}
          </Button>
        </div>
      </form>
    </div>
  )
}

