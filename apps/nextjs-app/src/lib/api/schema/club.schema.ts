import { z } from 'zod';
import { NonBlankStringSchema, createPagedDataSchema, PageRequestSchema } from './common.schema';

export const LocationProviderSchema = z.enum(['GOOGLE_PLACES', 'MAPBOX', 'LOCATION_IQ', 'MANUAL', 'OTHER']);
export type LocationProvider = z.infer<typeof LocationProviderSchema>;

export const AddressDtoSchema = z.object({
    provider: LocationProviderSchema,
    externalLocationId: z.string(),
});
export type AddressDto = z.infer<typeof AddressDtoSchema>;

export const AddressSchema = z.object({
    city: z.string(),
    district: z.string(),
    fullAddress: z.string(),
    latitude: z.number().nullable().optional(),
    longitude: z.number().nullable().optional(),
    provider: LocationProviderSchema.nullable().optional(),
    externalLocationId: z.string().nullable().optional(),
});
export type Address = z.infer<typeof AddressSchema>;

export const OperatingHourDtoSchema = z.object({
    id: z.number().int().nonnegative().nullable().optional(),
    dayOfWeek: z.enum(['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY']),
    openingTime: z.string().nullable().optional(), // Expected format: HH:mm:ss or HH:mm
    closingTime: z.string().nullable().optional(), // Expected format: HH:mm:ss or HH:mm
    closed: z.boolean(),
});
export type OperatingHourDto = z.infer<typeof OperatingHourDtoSchema>;

export const ScheduleOverrideDtoSchema = z.object({
    id: z.number().int().nonnegative(),
    overrideDate: z.string(), // YYYY-MM-DD
    openingTime: z.string().nullable().optional(),
    closingTime: z.string().nullable().optional(),
    closed: z.boolean(),
    reason: z.string().nullable().optional(),
});
export type ScheduleOverrideDto = z.infer<typeof ScheduleOverrideDtoSchema>;

export const ScheduleOverrideRequestSchema = z.object({
    targetDate: z.string(), // YYYY-MM-DD
    isClosed: z.boolean(),
    openTime: z.string().nullable().optional(),
    closeTime: z.string().nullable().optional(),
    reason: z.string().nullable().optional(),
});
export type ScheduleOverrideRequest = z.infer<typeof ScheduleOverrideRequestSchema>;

export const ScheduleOverrideResponseSchema = z.object({
    id: z.number().int().nonnegative(),
    targetDate: z.string(),
    isClosed: z.boolean(),
    openTime: z.string().nullable().optional(),
    closeTime: z.string().nullable().optional(),
    reason: z.string().nullable().optional(),
});
export type ScheduleOverrideResponse = z.infer<typeof ScheduleOverrideResponseSchema>;

export const UpdateOperatingHoursRequestSchema = z.object({
    operatingHours: z.array(OperatingHourDtoSchema).length(7),
});
export type UpdateOperatingHoursRequest = z.infer<typeof UpdateOperatingHoursRequestSchema>;

export const ClubResponseSchema = z.object({
    id: z.number().int().nonnegative(),
    name: z.string(),
    slug: z.string(),
    address: AddressSchema,
    timeZone: z.string(),
    description: z.string().nullable().optional(),
    active: z.boolean(),
    scoreMultiplier: z.number(),
    photoUrls: z.array(z.string()),
    operatingHours: z.array(OperatingHourDtoSchema).nullable().optional(),
    scheduleOverrides: z.array(ScheduleOverrideDtoSchema).nullable().optional(),
});
export type ClubResponse = z.infer<typeof ClubResponseSchema>;

export const ClubCreateRequestSchema = z.object({
    name: NonBlankStringSchema.max(100),
    slug: z.string().regex(/^[a-z0-9-]+$/).max(100).optional(),
    address: AddressDtoSchema,
    timeZone: NonBlankStringSchema,
    description: z.string().nullable().optional(),
    photoUrls: z.array(z.string().max(500)).max(10).optional(),
    scoreMultiplier: z.number(),
});
export type ClubCreateRequest = z.infer<typeof ClubCreateRequestSchema>;

export const ClubUpdateRequestSchema = z.object({
    name: z.string().max(100).optional(),
    slug: z.string().regex(/^[a-z0-9-]+$/).max(100).optional(),
    address: AddressDtoSchema.optional(),
    timeZone: z.string().optional(),
    description: z.string().nullable().optional(),
    scoreMultiplier: z.number().optional(),
    active: z.boolean().optional(),
    photoUrls: z.array(z.url().max(500)).max(10).optional(),
});
export type ClubUpdateRequest = z.infer<typeof ClubUpdateRequestSchema>;

// Full API request (Filters + Pagination & Sort)
export const ClubSearchRequestSchema = z.object({
    search: z.string().optional(),
    city: z.string().optional(),
    district: z.string().optional(),
    active: z.boolean().optional(),
    ...PageRequestSchema.shape,
});
export type ClubSearchRequest = z.infer<typeof ClubSearchRequestSchema>;

export const PagedClubResponseSchema = createPagedDataSchema(ClubResponseSchema);
export type PagedClubResponse = z.infer<typeof PagedClubResponseSchema>;
