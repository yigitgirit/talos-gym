import { ValidationErrorDetail } from "@/lib/api/schema"

/**
 * Represents the structure of an error returned by a Server Action.
 */
export type ActionError = {
    /** HTTP status code (e.g., 400, 401, 500). Null if a network error occurred before receiving a response. */
    httpStatus: number | null;
    /** Internal application error code for specific logic handling. */
    code: string;
    /** Human-readable error message. */
    message: string;
    /** Optional field-level validation errors, typically from Zod. */
    details?: ValidationErrorDetail[];
};

/**
 * Successful state of an action containing the resulting data.
 * @template TData - The type of the data returned.
 */
export type ActionSuccess<TData = void> = {
    success: true;
    data?: TData;
};

/**
 * Failure state of an action containing the {@link ActionError}.
 */
export type ActionFailure = {
    success: false;
    error: ActionError;
};

/**
 * A discriminated union representing the result of a Server Action.
 * Using the `success` property as a discriminant allows for type narrowing in TypeScript.
 * @template TData - The type of data on success.
 */
export type ActionState<TData = void> = ActionSuccess<TData> | ActionFailure;

/**
 * Factory function to create a successful {@link ActionState}.
 * @param data - The data to return.
 * @returns An {@link ActionSuccess} object.
 */
export function Ok<TData = void>(data?: TData): ActionState<TData> {
    return { success: true, data }
}

/**
 * Factory function to create a failure {@link ActionState}.
 * @param httpStatus - HTTP status code.
 * @param code - Internal error code.
 * @param message - Error message.
 * @param details - Optional validation details.
 * @returns An {@link ActionFailure} object.
 */
export function Err<TData = void>(
    httpStatus: number | null,
    code: string,
    message: string,
    details?: ValidationErrorDetail[]
): ActionState<TData> {
    return {
        success: false,
        error: { httpStatus, code, message, details }
    }
}

/**
 * Type guard that checks if an {@link ActionState} is successful.
 * If true, TypeScript will narrow the type to {@link ActionSuccess}.
 * @example
 * ```typescript
 * if (isSuccess(result)) {
 * console.log(result.data); // result is narrowed to ActionSuccess
 * }
 * ```
 */
export function isSuccess<TData>(result: ActionState<TData>): result is ActionSuccess<TData> {
    return result.success
}

/**
 * Type guard that checks if an {@link ActionState} is an error.
 * If true, TypeScript will narrow the type to {@link ActionFailure}.
 */
export function isError<TData>(result: ActionState<TData>): result is ActionFailure {
    return !result.success
}