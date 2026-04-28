import { ApiError } from '@/lib/api/core/ApiError';
import type { ActionState } from '@/types/actionState';

/**
 * Unwraps a {@link ActionState} promise by fanning out the result.
 * * If the action is successful, it returns the data directly.
 * If the action fails, it throws an {@link ApiError} with the server's error details.
 *
 * @template TData - The type of data contained in the successful action state.
 * @param actionPromise - A promise returning an {@link ActionState}.
 * @returns A promise that resolves to the actual data of type `TData`.
 * @throws {ApiError} When the action state indicates failure (`success: false`).
 *
 * @example
 * ```typescript
 * // Use inside a TanStack Query mutation
 * mutationFn: (vars) => unwrap(loginAsync(vars))
 * ```
 */
export async function unwrap<TData>(actionPromise: Promise<ActionState<TData>>): Promise<TData> {
    const result = await actionPromise;
    if (!result.success) {
        throw new ApiError(
            result.error.message,
            result.error.httpStatus ?? 0,
            result.error.code,
            result.error.details
        );
    }
    return result.data as TData;
}

/**
 * A Higher-Order Function that wraps a server action to throw an {@link ApiError} on failure.
 * * Useful for integrating functional server actions with libraries that expect
 * promise-based error throwing, such as **TanStack Query**.
 *
 * @template TVars - The type of arguments the action function accepts.
 * @template TData - The type of data the action function returns on success.
 * * @param actionFn - The original server action returning {@link ActionState}.
 * @returns A new async function that returns `TData` or throws an `ApiError`.
 *
 * @example
 * ```typescript
 * // Define once
 * const throwingLogin = withThrowing(loginAsync);
 * * // Use in TanStack Query without extra wrapper logic
 * const { mutate } = useMutation({
 * mutationFn: withThrowing(loginAsync)
 * });
 * ```
 * * @remarks
 * This utility eliminates the need for manual error checking inside `mutationFn`.
 * It maps the custom `ActionError` fields directly to a throwable `ApiError`.
 */
export function withThrowing<TVars, TData>(
    actionFn: (vars: TVars) => Promise<ActionState<TData>>
) {
    return async (vars: TVars): Promise<TData> => {
        const result = await actionFn(vars);
        if (!result.success) {
            throw new ApiError(
                result.error.message,
                result.error.httpStatus ?? 0,
                result.error.code,
                result.error.details
            );
        }
        return result.data as TData;
    };
}