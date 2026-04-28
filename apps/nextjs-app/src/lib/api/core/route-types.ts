import type { ApiEndpoints } from '../schema/endpoints';

/**
 * Represents the structure of an endpoint operation, encapsulating response data
 * and an optional request body.
 *
 * @template TData - The type of the data expected in the response.
 * @template TBody - The type of the body content for the request.
 */
export type EndpointOperation<TData = unknown, TBody = unknown> = {
    data: TData;
    body?: TBody;
};

// ==========================================
//              THE DARK MAGIC
// ==========================================

/** Extracts keys from `ApiEndpoints` where a specified HTTP method exists. */
export type EndpointsWithMethod<M extends string> = {
    [K in keyof ApiEndpoints]: M extends keyof ApiEndpoints[K] ? K : never;
}[keyof ApiEndpoints];

/** Extracts the response data type for a specific endpoint and method. */
export type OperationData<
    T extends keyof ApiEndpoints,
    M extends keyof ApiEndpoints[T]
> = ApiEndpoints[T][M] extends EndpointOperation<infer D> ? D : never;

/** Extracts the request body type for a specific endpoint and method. */
export type OperationBody<
    T extends keyof ApiEndpoints,
    M extends keyof ApiEndpoints[T]
> = ApiEndpoints[T][M] extends EndpointOperation<any, infer B> ? B : never;

/**
 * Flattens a type to improve readability and intellisense in IDEs.
 * Converts a complex intersection type into a single unified object type.
 */
export type Prettify<T> = { [K in keyof T]: T[K]; } & {};

/**
 * Extracts path parameters from a route string pattern.
 * Handles both intermediate parameters (with slashes) and trailing parameters.
 *
 * @example
 * ExtractPathParams<"/users/:id/posts/:postId">
 * // Result: { id: string | number; postId: string | number }
 */
export type ExtractPathParams<T extends string> = Prettify<
    // Match pattern: "/path:ParamName/...rest" - extract param and continue
    T extends `${string}:${infer Param}/${infer Rest}`
        ? { [K in Param]: string | number } & ExtractPathParams<`/${Rest}`>
    // Match pattern: "/path:ParamName" - final parameter
    : T extends `${string}:${infer Param}`
        ? { [K in Param]: string | number }
    // No parameters found
    : {}
>;