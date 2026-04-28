import 'server-only';
import {cookies} from 'next/headers';
import {ApiClient} from './ApiClient';
import {AUTH_COOKIES} from "@/config/auth.config";
import {ApiConfig, AuthConfig, ErrorRecoveryHandler, RequestInterceptor} from "@/lib/api/core/types";
import {ApiError} from "@/lib/api/core/ApiError";
import {ApiErrorResponseSchema, ApiErrorResponse} from "@/lib/api/schema";
import {API_CONFIG} from "@/config/api.config";

const logger: RequestInterceptor = (config) => {
    console.log(`[Server API] Logging Interceptor: ${config.options.method} ${config.url}`);
    return config;
}

const customHeaderAttacher: RequestInterceptor = (config) => {
    console.log(`[Server API] Header Attacher Interceptor: ${config.options.method} ${config.url}`);

    // Safely wrap existing headers into a Headers instance and append
    const headers = new Headers(config.options.headers);
    headers.set('X-Request-Source', 'nextjs-app');
    headers.set('X-Timestamp', new Date().toISOString());

    console.log(`[Server API] Headers after attachment: ${JSON.stringify(Object.fromEntries(headers.entries()))}`);
    config.options.headers = Object.fromEntries(headers.entries());
    console.log(`[Server API] Final Request Config: ${JSON.stringify(config)}`);
    return config;
}

const recoverUnauthorized: ErrorRecoveryHandler = async (error) => {
    if (error.status === 401) {
        console.log("[Server API] Recover Unauthorized Recovery Handler: Attempting token rotation")
        console.log("You know what, currently there is no implementation.")
        // Try to rotate the token here
        // const rotated = await rotateServerToken();
        // if (rotated) {
        //    return retryRequest(); // Seamlessly retries with the new token
        // }
        return null; // Return null if the error cannot be recovered
    }
}

const typedApiConfig: ApiConfig = {
    baseUrl: API_CONFIG.BASE_URL,
    errorTransformer: async (response: Response) => {
        let payload: unknown;

        try {
            payload = await response.json();
        } catch {
            // Fallback if API returned HTML or empty body
            return new ApiError(
                `HTTP ${response.status}: Unexpected server response format`,
                response.status,
                'UNKNOWN_ERROR'
            );
        }

        const parsed = ApiErrorResponseSchema.safeParse(payload);

        if (parsed.success) {
            const apiErrorData: ApiErrorResponse = parsed.data;
            return new ApiError(
                apiErrorData.message,
                response.status,
                apiErrorData.code,
                apiErrorData.details,
                apiErrorData
            );
        }

        return new ApiError(
            `HTTP ${response.status}: ${response.statusText || 'Unknown Error - Parse Error'}`,
            response.status,
            'UNKNOWN_ERROR',
            undefined,
            payload
        );
    }
}

const typedAuthConfig: AuthConfig = {
    tokenProvider: async () => {
        const cookieStore = await cookies();
        return cookieStore.get(AUTH_COOKIES.ACCESS_TOKEN)?.value || null;
    }
}

/**
 * Retrieves and configures an instance of `ApiClient` for server-side API communication.
 *
 * The function initializes a `ApiClient` instance with a base URL and token provider.
 * It also sets up request interceptors, error recovery handlers, and error interceptors to
 * enhance request handling, error management, and recovery mechanisms.
 *
 * - Base URL: Configured using the environment variables `API_URL`, `NEXT_PUBLIC_API_URL`, or a default to `http://localhost:3000/api`.
 * - Token Provider: Supplies the authorization token by retrieving it from the cookie store.
 *
 * Features:
 * - **Request Interceptor**: Allows customization of outgoing requests, e.g., adding custom headers or logging requests.
 * - **Error Recovery Handler**: Handles error scenarios, e.g., attempts token rotation upon receiving a 401 Unauthorized error.
 * - **Error Interceptor**: Logs or reports errors for further debugging or monitoring purposes.
 *
 * @returns {ApiClient} An instance of `ApiClient` with pre-configured settings and middleware.
 */
export const getServerApi = (): ApiClient => {
    const api = new ApiClient(typedApiConfig, typedAuthConfig);

    api.addRequestInterceptor(logger);
    api.addRequestInterceptor(customHeaderAttacher)
    api.addRecoveryHandler(recoverUnauthorized);

    // (Error logging, Sentry/Datadog reporting)
    api.addErrorInterceptor((error) => {
        // Example: Sentry.captureException(error);
        return error;
    });

    return api;
};