import {ApiError} from '@/lib/api';
import {AppError} from "@/lib/api/core/AppError";

/**
 * Configuration object for API-related settings.
 *
 * This type defines the structure of the configuration used for API interactions,
 * including settings for the base URL, default headers, and retry logic.
 */
export interface ApiConfig {
    baseUrl: string;
    defaultHeaders?: Record<string, string>;
    retryAttempts?: number;
    retryDelay?: number;
    errorTransformer?: ErrorTransformer;
    paramsSerializer?: (params: ApiQueryParams) => string;
}

/**
 * Represents the configuration options for authentication.
 *
 * This type is typically used to specify how authentication tokens are
 * provided and formatted when making authenticated requests.
 */
export interface AuthConfig {
    tokenProvider: () => Promise<string | null> | string | null;
    tokenHeader?: string;
    tokenPrefix?: string;
}

export type ApiQueryParams = Record<string, string | number | boolean | null | undefined>;

export interface ApiRequestOptions extends RequestInit {
    params?: ApiQueryParams;
}

/**
 * Represents the structure of a typical API response.
 *
 * @template T - The type of the payload field in the response. Defaults to 'unknown'.
 */
export interface HttpEnvelope<T = unknown> {
    payload: T;
    status: number;
    headers: Headers;
};

/** Represents the configuration passed through request interceptors */
export type ApiRequestConfig = {
    url: string;
    options: RequestInit;
};

/** Interceptor for request transformation */
export type RequestInterceptor = (config: ApiRequestConfig) => ApiRequestConfig | Promise<ApiRequestConfig>;

/** Interceptor for response transformation */
export type ResponseInterceptor<T = unknown> = (response: HttpEnvelope<T>) => HttpEnvelope<T> | Promise<HttpEnvelope<T>>;

/** Interceptor for error handling */
export type ErrorInterceptor = (
    error: ApiError | AppError
) => (ApiError | AppError) | Promise<ApiError | AppError>;

/**
 * Handler for attempting to recover from an error (e.g., Token Rotation).
 * If it successfully recovers, it must return an ApiResponse.
 * If it cannot handle the error, it should return null or undefined.
 */
export type ErrorRecoveryHandler = (
    error: ApiError,
    retryRequest: () => Promise<HttpEnvelope>
) => Promise<HttpEnvelope | null | undefined> | HttpEnvelope | null | undefined;

export type ErrorTransformer = (response: Response) => Promise<ApiError>;