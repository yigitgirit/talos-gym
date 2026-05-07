"use server";

import {actionClient} from "@/lib/actions/ActionClient";
import {
    ClubResponse,
    ClubSearchRequest,
    ClubSearchRequestSchema,
    PagedClubResponse
} from "@/lib/api/schema/club.schema";
import {getServerApi} from "@/lib/api/server";
import {ActionState} from "@/types/actionState";
import {z} from "zod";

export const searchClubsAction = async (input: ClubSearchRequest): Promise<ActionState<PagedClubResponse>> => {
    return actionClient
        .withInput(ClubSearchRequestSchema, input)
        .execute(async (validFilters) => {
            return await getServerApi().get('api/clubs', { params: validFilters });
        });
};

const GetClubSchema = z.object({ slug: z.string() });
export const getClubBySlugAction = async (input: z.infer<typeof GetClubSchema>): Promise<ActionState<ClubResponse>> => {
    return actionClient
        .withInput(GetClubSchema, input)
        .execute(async ({ slug }) => {
            return await getServerApi().get('api/clubs/slug/:slug', { pathParams: {slug} });
        });
};