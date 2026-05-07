import { z } from "zod";
import { PageRequestSchema } from "@/lib/api/schema/common.schema";

export const ClubSearchFiltersSchema = z.object({
    search: z.string().optional(),
    city: z.string().optional(),
    district: z.string().optional(),
    active: z.boolean().optional(),
});
export type ClubSearchFilters = z.infer<typeof ClubSearchFiltersSchema>;

export const ClubSearchUrlSchema = z.object({
    ...ClubSearchFiltersSchema.shape,
    ...PageRequestSchema.shape,
    active: z.preprocess((val) => {
        if (val === 'true' || val === true) return true;
        if (val === 'false' || val === false) return false;
        return val;
    }, z.boolean().optional()),
});
export type ClubSearchUrl = z.infer<typeof ClubSearchUrlSchema>;
