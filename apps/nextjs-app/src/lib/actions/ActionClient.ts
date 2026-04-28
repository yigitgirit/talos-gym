import type { ActionState } from '@/types/actionState';
import {Ok} from "@/types/actionState";
import {z} from "zod";
import {handleError, validateOrThrow} from "@/lib/validation";

/**
 * A utility class for standardized server action execution.
 * It encapsulates error handling, input validation, and result formatting.
 * @remarks
 * This client provides two main execution paths:
 * 1. Direct execution via {@link execute}
 * 2. Validated execution via {@link withInput}
 */
class ActionClient {

    /**
     * Executes a handler function without any input validation.
     * Use this for actions that don't require parameters or have safe-to-call logic.
     *
     * @template TData - The expected type of the data on success.
     * @param handler - An asynchronous function that performs the action.
     * @returns A promise resolving to an {@link ActionState} containing either the data or an error.
     * @example
     * ```typescript
     * const result = await actionClient.execute(async () => {
     * return await db.posts.findMany();
     * });
     * ```
     */
    async execute<TData>(handler: () => Promise<TData>): Promise<ActionState<TData>> {
        try {
            return Ok(await handler());
        } catch (error) {
            return handleError<TData>(error);
        }
    }

    /**
     * Creates an execution context that validates the provided input against a Zod schema.
     * @template TInput - The type inferred from the Zod schema.
     * @param schema - A Zod schema to validate the input.
     * @param input - The raw input data (usually from a form or API call).
     * @returns An object with an `execute` method that receives the validated data.
     * @example
     * ```typescript
     * const result = await actionClient
     * .withInput(LoginSchema, { email: "test@test.com" })
     * .execute(async (validData) => {
     * // validData is now strictly typed as TInput
     * return await auth.login(validData);
     * });
     * ```
     */
    withInput<TInput>(schema: z.ZodType<TInput>, input: unknown) {
        return {
            execute: async <TData>(handler: (data: TInput) => Promise<TData>): Promise<ActionState<TData>> => {
                try {
                    const validData = validateOrThrow(schema, input);
                    return Ok(await handler(validData));
                } catch (error) {
                    return handleError<TData>(error);
                }
            }
        };
    }
}

export const actionClient = new ActionClient();