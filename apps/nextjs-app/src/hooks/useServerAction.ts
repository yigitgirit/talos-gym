'use client'

import type { ActionState, ActionError } from '@/types/actionState';
import {useCallback, useEffect, useRef, useState, useTransition} from "react";
import { toast } from "sonner";

/**
 * Options for configuring the behavior of the {@link useServerAction} hook.
 *
 * @template TData - The expected data type returned by the server action on success.
 * @template TArgs - A tuple representing the arguments passed to the server action.
 */
interface UseServerActionOptions<TData, TArgs extends unknown[]> {
    /**
     * Callback executed when the server action completes successfully.
     * @param data - The data returned from the server.
     * @param args - The original arguments used to trigger the action.
     */
    onSuccess?: (data: TData | undefined, ...args: TArgs) => void;

    /**
     * Callback executed when the server action fails or returns an error state.
     * @param error - The {@link ActionError} object containing status and message.
     * @param args - The original arguments used to trigger the action.
     */
    onError?: (error: ActionError, ...args: TArgs) => void;

    /**
     * Whether to show a global toast notification for 500+ server errors.
     * @defaultValue `true`
     */
    showGlobalError?: boolean;
}

export interface UseServerActionReturn<TData, TArgs extends unknown[]> {
    execute: (...args: TArgs) => void;
    isPending: boolean;
    state: ActionState<TData> | null;
    data: TData | undefined | null;
    error: ActionError | null;
    reset: () => void;
}

/**
 * A custom hook to manage React Server Actions with built-in transition handling,
 * state management, and toast notifications.
 *
 * @template TData - The shape of the successful response data.
 * @template TArgs - The argument types for the server action function.
 *
 * @param actionFn - An async function (Server Action) that returns a {@link ActionState}.
 * @param options - Optional callbacks and configuration (onSuccess, onError, etc.).
 *
 * @returns An object containing:
 * - `execute`: Function to trigger the action with full type safety for arguments.
 * - `isPending`: Boolean state from React's `useTransition`.
 * - `state`: The full {@link ActionState} object.
 * - `data`: Extracted success data (null if failed).
 * - `error`: Extracted {@link ActionError} (null if successful).
 * - `reset`: Function to clear the state back to initial.
 *
 * @example
 * ```typescript
 * const { execute, isPending } = useServerAction(updateUser, {
 * onSuccess: (data) => toast.success(`Updated ${data.name}`),
 * onError: (err) => console.error(err.code)
 * });
 *
 * // execute is fully typed based on updateUser signature
 * <button onClick={() => execute({ id: 1, name: 'John' })} />
 * ```
 *
 * @remarks
 * **Automatic Error Handling:**
 * If `showGlobalError` is enabled (default), any error with `httpStatus >= 500`
 * will automatically trigger a `sonner` toast notification.
 *
 */
export function useServerAction<TData, TArgs extends unknown[]>(
    actionFn: (...args: TArgs) => Promise<ActionState<TData>>,
    options?: UseServerActionOptions<TData, TArgs>
): UseServerActionReturn<TData, TArgs> {
    const [isPending, startTransition] = useTransition();
    const [state, setState] = useState<ActionState<TData> | null>(null);

    const optionsRef = useRef(options);
        
    useEffect(() => {
        optionsRef.current = options;
    }, [options]);

    const execute = useCallback((...args: TArgs) => {
        startTransition(async () => {
            try {
                const result = await actionFn(...args);

                setState(result);

                const currentOptions = optionsRef.current;

                if (result.success) {
                    currentOptions?.onSuccess?.(result.data, ...args);
                } else {
                    currentOptions?.onError?.(result.error, ...args);

                    // Fallback for global 500s and network errors!
                    if (currentOptions?.showGlobalError !== false && result.error.httpStatus !== null && result.error.httpStatus >= 500) {
                        toast.error("Error", { description: result.error.message || "An unexpected error occurred" });
                    }
                }
            } catch (error) {
                // Catch raw network failures (e.g., browser loses internet connection)
                const fallbackError: ActionError = {
                    httpStatus: null,
                    code: "NETWORK_ERROR",
                    message: error instanceof Error ? error.message : "A network error occurred while connecting to the server.",
                };
                
                setState({ success: false, error: fallbackError });
                const currentOptions = optionsRef.current;
                currentOptions?.onError?.(fallbackError, ...args);
                
                if (currentOptions?.showGlobalError !== false) {
                    toast.error("Network Error", { description: fallbackError.message });
                }
            }
        });
    }, [actionFn]);

    return {
        execute,
        isPending,
        state,
        data: state?.success ? state.data : null,
        error: state?.success === false ? state.error : null,
        reset: () => setState(null)
    };
}