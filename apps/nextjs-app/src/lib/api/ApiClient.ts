import {CoreApiClient} from './core/CoreApiClient';
import type {EndpointsWithMethod, ExtractPathParams, OperationBody, OperationData} from './core/route-types';
import type {ApiRequestOptions, HttpEnvelope} from "@/lib/api/core/types";

/**
 * Represents a strongly-typed options object for API requests, combining generic request options
 * with specific requirements for HTTP envelope toggle and path parameters.
 *
 * @template T A string type parameter that determines the structure of the path parameters.
 *
 */
export type TypedOptions<T extends string> = ApiRequestOptions & {
    /**
     * Optional flag to indicate whether to return the full HTTP envelope.
     * If true, returns `HttpEnvelope<T>`. If false or undefined, returns the inner payload.
     */
    raw?: boolean;
} & (
    keyof ExtractPathParams<T> extends never
        ? { 
            /** No path parameters are required or allowed for this endpoint. */ 
            pathParams?: never 
          }
        : { 
            /** The required path parameters mapped dynamically from the endpoint string. */ 
            pathParams: ExtractPathParams<T> 
          }
    );

/**
 * A reusable type that dynamically generates the correct arguments array.
 * Makes `options` mandatory if `pathParams` are required, otherwise optional.
 */
export type TypedArgs<T extends string> = keyof ExtractPathParams<T> extends never
    ? [options?: TypedOptions<T>]
    : [options: TypedOptions<T>];

/**
 * Type-safe API client with unified request handling.
 * Exposes typed convenience methods that prevent misuse at compile time.
 */
export class ApiClient extends CoreApiClient {

    /**
     * Performs a strongly-typed HTTP GET request, returning the full HTTP envelope.
     *
     * @param endpoint - The mapped API endpoint.
     * @param options - Request options. Must include `raw: true` and any required path parameters.
     * @returns A promise resolving to the full HTTP envelope containing status, headers, and payload.
     */
    async get<T extends EndpointsWithMethod<'GET'>>(
        endpoint: T,
        options: TypedOptions<T> & { raw: true }
    ): Promise<HttpEnvelope<OperationData<T, 'GET'>>>;

    // ==========================================
    // GET
    // ==========================================

    /**
     * Performs a strongly-typed HTTP GET request, returning the unwrapped data payload.
     *
     * @param endpoint - The mapped API endpoint.
     * @param args - Request options, including mapped path parameters if required by the endpoint.
     * @returns A promise resolving directly to the backend data payload.
     */
    async get<T extends EndpointsWithMethod<'GET'>>(
        endpoint: T,
        ...args: TypedArgs<T>
    ): Promise<OperationData<T, 'GET'>>;

    async get(endpoint: string, ...args: any[]): Promise<any> {
        const options = args[0];
        const url = this.resolvePath(endpoint, options?.pathParams);
        const envelope = await this.executeGet(url, options);
        return options?.raw ? envelope : envelope.payload;
    }

    /**
     * Performs a strongly-typed HTTP POST request, returning the full HTTP envelope.
     *
     * @param endpoint - The mapped API endpoint.
     * @param data - The request body payload.
     * @param options - Request options. Must include `raw: true` and any required path parameters.
     * @returns A promise resolving to the full HTTP envelope containing status, headers, and payload.
     */
    async post<T extends EndpointsWithMethod<'POST'>>(
        endpoint: T,
        data: OperationBody<T, 'POST'>,
        options: TypedOptions<T> & { raw: true }
    ): Promise<HttpEnvelope<OperationData<T, 'POST'>>>;

    // ==========================================
    // POST
    // ==========================================

    /**
     * Performs a strongly-typed HTTP POST request, returning the unwrapped data payload.
     *
     * @param endpoint - The mapped API endpoint.
     * @param data - The request body payload.
     * @param args - Request options, including mapped path parameters if required by the endpoint.
     * @returns A promise resolving directly to the backend data payload.
     */
    async post<T extends EndpointsWithMethod<'POST'>>(
        endpoint: T,
        data: OperationBody<T, 'POST'>,
        ...args: TypedArgs<T>
    ): Promise<OperationData<T, 'POST'>>;

    async post(endpoint: string, data: any, ...args: any[]): Promise<any> {
        const options = args[0];
        const url = this.resolvePath(endpoint, options?.pathParams);
        const envelope = await this.executePost(url, data, options);
        return options?.raw ? envelope : envelope.payload;
    }

    /**
     * Performs a strongly-typed HTTP PUT request, returning the full HTTP envelope.
     *
     * @param endpoint - The mapped API endpoint.
     * @param data - The request body payload.
     * @param options - Request options. Must include `raw: true` and any required path parameters.
     * @returns A promise resolving to the full HTTP envelope containing status, headers, and payload.
     */
    async put<T extends EndpointsWithMethod<'PUT'>>(
        endpoint: T,
        data: OperationBody<T, 'PUT'>,
        options: TypedOptions<T> & { raw: true }
    ): Promise<HttpEnvelope<OperationData<T, 'PUT'>>>;

    // ==========================================
    // PUT
    // ==========================================

    /**
     * Performs a strongly-typed HTTP PUT request, returning the unwrapped data payload.
     *
     * @param endpoint - The mapped API endpoint.
     * @param data - The request body payload.
     * @param args - Request options, including mapped path parameters if required by the endpoint.
     * @returns A promise resolving directly to the backend data payload.
     */
    async put<T extends EndpointsWithMethod<'PUT'>>(
        endpoint: T,
        data: OperationBody<T, 'PUT'>,
        ...args: TypedArgs<T>
    ): Promise<OperationData<T, 'PUT'>>;

    async put(endpoint: string, data: any, ...args: any[]): Promise<any> {
        const options = args[0];
        const url = this.resolvePath(endpoint, options?.pathParams);
        const envelope = await this.executePut(url, data, options);
        return options?.raw ? envelope : envelope.payload;
    }

    /**
     * Performs a strongly-typed HTTP PATCH request, returning the full HTTP envelope.
     *
     * @param endpoint - The mapped API endpoint.
     * @param data - The request body payload.
     * @param options - Request options. Must include `raw: true` and any required path parameters.
     * @returns A promise resolving to the full HTTP envelope containing status, headers, and payload.
     */
    async patch<T extends EndpointsWithMethod<'PATCH'>>(
        endpoint: T,
        data: OperationBody<T, 'PATCH'>,
        options: TypedOptions<T> & { raw: true }
    ): Promise<HttpEnvelope<OperationData<T, 'PATCH'>>>;

    // ==========================================
    // PATCH
    // ==========================================

    /**
     * Performs a strongly-typed HTTP PATCH request, returning the unwrapped data payload.
     *
     * @param endpoint - The mapped API endpoint.
     * @param data - The request body payload.
     * @param args - Request options, including mapped path parameters if required by the endpoint.
     * @returns A promise resolving directly to the backend data payload.
     */
    async patch<T extends EndpointsWithMethod<'PATCH'>>(
        endpoint: T,
        data: OperationBody<T, 'PATCH'>,
        ...args: TypedArgs<T>
    ): Promise<OperationData<T, 'PATCH'>>;

    async patch(endpoint: string, data: any, ...args: any[]): Promise<any> {
        const options = args[0];
        const url = this.resolvePath(endpoint, options?.pathParams);
        const envelope = await this.executePatch(url, data, options);
        return options?.raw ? envelope : envelope.payload;
    }

    /**
     * Performs a strongly-typed HTTP DELETE request, returning the full HTTP envelope.
     *
     * @param endpoint - The mapped API endpoint.
     * @param options - Request options. Must include `raw: true` and any required path parameters.
     * @returns A promise resolving to the full HTTP envelope containing status, headers, and payload.
     */
    async delete<T extends EndpointsWithMethod<'DELETE'>>(
        endpoint: T,
        options: TypedOptions<T> & { raw: true }
    ): Promise<HttpEnvelope<OperationData<T, 'DELETE'>>>;

    // ==========================================
    // DELETE
    // ==========================================

    /**
     * Performs a strongly-typed HTTP DELETE request, returning the unwrapped data payload.
     *
     * @param endpoint - The mapped API endpoint.
     * @param args - Request options, including mapped path parameters if required by the endpoint.
     * @returns A promise resolving directly to the backend data payload.
     */
    async delete<T extends EndpointsWithMethod<'DELETE'>>(
        endpoint: T,
        ...args: TypedArgs<T>
    ): Promise<OperationData<T, 'DELETE'>>;

    async delete(endpoint: string, ...args: any[]): Promise<any> {
        const options = args[0];
        const url = this.resolvePath(endpoint, options?.pathParams);
        const envelope = await this.executeDelete(url, options);
        return options?.raw ? envelope : envelope.payload;
    }

    /**
     * Swaps path parameters in the URL string before passing it to the base ApiClient.
     * e.g., resolvePath('/clubs/:id', { id: '123' }) -> '/clubs/123'
     */
    private resolvePath(endpoint: string, pathParams?: Record<string, string | number>): string {
        if (!pathParams) return endpoint;

        let resolved = endpoint;
        for (const [key, value] of Object.entries(pathParams)) {
            resolved = resolved.replace(`:${key}`, String(value));
        }
        return resolved;
    }
}