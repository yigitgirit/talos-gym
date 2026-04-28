import { z } from 'zod';

export const NotificationCategorySchema = z.enum([
    'EMAIL_VERIFICATION',
    'LINK_VERIFICATION',
    'CODE_VERIFICATION',
    'SUBSCRIPTION',
    'GENERAL_ANNOUNCEMENT',
    'REMINDER',
    'SECURITY_ALERT',
    'PASSWORD_RESET',
]);
export type NotificationCategory = z.infer<typeof NotificationCategorySchema>;

export const NotificationChannelSchema = z.enum(['EMAIL', 'SMS', 'PUSH_NOTIFICATION']);
export type NotificationChannel = z.infer<typeof NotificationChannelSchema>;

export const UserNotificationPreferenceDtoSchema = z.object({
    category: NotificationCategorySchema,
    channels: z.array(NotificationChannelSchema),
});
export type UserNotificationPreferenceDto = z.infer<typeof UserNotificationPreferenceDtoSchema>;

export const UpdateNotificationPreferenceRequestSchema = UserNotificationPreferenceDtoSchema;
export type UpdateNotificationPreferenceRequest = z.infer<typeof UpdateNotificationPreferenceRequestSchema>;