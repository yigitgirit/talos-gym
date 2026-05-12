import {z} from 'zod';
import {PageRequestSchema} from '@/lib/api/schema/common.schema';

export const UserSearchUrlSchema = z.object({
    search: z.string().optional(),
    status: z.string().optional(), // Maps to the ACTIVE/INACTIVE/PENDING/BANNED filters
    ...PageRequestSchema.shape,
});

export type UserSearchUrl = z.infer<typeof UserSearchUrlSchema>;