import {ApiError} from '@/lib/api';
import type {
    ApiConfig,
    ApiQueryParams,
    ApiRequestConfig,
    ApiRequestOptions,
    AuthConfig,
    ErrorInterceptor,
    ErrorRecoveryHandler,
    HttpEnvelope,
    RequestInterceptor,
    ResponseInterceptor
} from './types';
import {AppError} from "@/lib/api/core/AppError";

/**
 * CoreApiClient provides a flexible and extensible wrapper for making HTTP requests to an API.
 * It includes support for request, response, and error interceptors, retry mechanisms,
 * token-based authentication, error recovery, and payload serialization.
 */
export class CoreApiClient {
    /** API configuration with required fields normalized */
    private readonly config: Required<ApiConfig>;

    /** Optional authentication configuration for token-based auth */
    private readonly authConfig?: AuthConfig;

    /** List of registered request interceptors */
    private readonly requestInterceptors: RequestInterceptor[] = [];

    /** List of registered response interceptors */
    private readonly responseInterceptors: ResponseInterceptor[] = [];

    /** List of registered error interceptors */
    private readonly errorInterceptors: ErrorInterceptor[] = [];

    /** List of registered error recovery handlers */
    private readonly recoveryHandlers: ErrorRecoveryHandler[] = [];

    /**
     * Initializes a new CoreApiClient instance.
     *
     * @param config - The API configuration containing base URL, headers, retry settings, and transformation functions
     * @param authConfig - Optional authentication configuration for token-based API security
     */
    constructor(config: ApiConfig, authConfig?: AuthConfig) {
        this.config = {
            baseUrl: config.baseUrl ? config.baseUrl.replace(/\/$/, '') : '',
            defaultHeaders: {
                'Content-Type': 'application/json',
                ...config.defaultHeaders,
            },
            retryAttempts: config.retryAttempts ?? 3,
            retryDelay: config.retryDelay ?? 1000,
            errorTransformer: config.errorTransformer || this.defaultErrorTransformer,
            paramsSerializer: config.paramsSerializer || this.defaultParamsSerializer
        };

        if (authConfig) {
            this.authConfig = {
                tokenProvider: authConfig.tokenProvider,
                tokenHeader: authConfig.tokenHeader || 'Authorization',
                tokenPrefix: authConfig.tokenPrefix || 'Bearer',
            };
        }
    }

    /**
     * Add a request interceptor to transform outgoing requests
     * @param interceptor Function to transform request options
     */
    addRequestInterceptor(interceptor: RequestInterceptor): void {
        this.requestInterceptors.push(interceptor);
    }

    /**
     * Add a response interceptor to transform responses
     * @param interceptor Function to transform responses
     */
    addResponseInterceptor(interceptor: ResponseInterceptor): void {
        this.responseInterceptors.push(interceptor);
    }

    /**
     * Add an error interceptor for error handling
     * @param interceptor Function to handle errors
     */
    addErrorInterceptor(interceptor: ErrorInterceptor): void {
        this.errorInterceptors.push(interceptor);
    }

    /**
     * Add a recovery handler to attempt to rescue failed requests (e.g., for token rotation)
     * @param handler Function to attempt error recovery
     */
    addRecoveryHandler(handler: ErrorRecoveryHandler): void {
        this.recoveryHandlers.push(handler);
    }

    /**
     * Perform a GET request.
     *
     * @template T - The expected response payload type
     * @param endpoint - The API endpoint path (relative or absolute URL)
     * @param options - Optional request configuration including query parameters and fetch options
     * @returns A promise that resolves to an HttpEnvelope containing the response data
     * @throws {ApiError} If the request fails and all retries are exhausted
     * @throws {AppError} If network or parsing errors occur
     */
    protected async executeGet<T>(endpoint: string, options?: ApiRequestOptions): Promise<HttpEnvelope<T>> {
        return this.execute<T>(endpoint, {...options, method: 'GET'});
    }

    /**
     * Perform a POST request.
     *
     * @template T - The expected response payload type
     * @param endpoint - The API endpoint path (relative or absolute URL)
     * @param data - The request body payload (JSON object, FormData, or URLSearchParams)
     * @param options - Optional request configuration including query parameters and fetch options
     * @returns A promise that resolves to an HttpEnvelope containing the response data
     * @throws {ApiError} If the request fails and all retries are exhausted
     * @throws {AppError} If network or parsing errors occur
     */
    protected async executePost<T>(endpoint: string, data?: unknown, options?: ApiRequestOptions) {
        const {body, headers} = this.preparePayload(data, options);
        return this.execute<T>(endpoint, {...options, headers, method: 'POST', body});
    }

    /**
     * Perform a PUT request.
     *
     * @template T - The expected response payload type
     * @param endpoint - The API endpoint path (relative or absolute URL)
     * @param data - The request body payload (JSON object, FormData, or URLSearchParams)
     * @param options - Optional request configuration including query parameters and fetch options
     * @returns A promise that resolves to an HttpEnvelope containing the response data
     * @throws {ApiError} If the request fails and all retries are exhausted
     * @throws {AppError} If network or parsing errors occur
     */
    protected async executePut<T>(endpoint: string, data?: unknown, options?: ApiRequestOptions) {
        const {body, headers} = this.preparePayload(data, options);
        return this.execute<T>(endpoint, {...options, headers, method: 'PUT', body});
    }

    /**
     * Perform a DELETE request.
     *
     * @template T - The expected response payload type
     * @param endpoint - The API endpoint path (relative or absolute URL)
     * @param options - Optional request configuration including query parameters and fetch options
     * @returns A promise that resolves to an HttpEnvelope containing the response data
     * @throws {ApiError} If the request fails and all retries are exhausted
     * @throws {AppError} If network or parsing errors occur
     */
    protected async executeDelete<T>(endpoint: string, options?: ApiRequestOptions): Promise<HttpEnvelope<T>> {
        return this.execute<T>(endpoint, {...options, method: 'DELETE'});
    }

    /**
     * Perform a PATCH request.
     *
     * @template T - The expected response payload type
     * @param endpoint - The API endpoint path (relative or absolute URL)
     * @param data - The request body payload (JSON object, FormData, or URLSearchParams)
     * @param options - Optional request configuration including query parameters and fetch options
     * @returns A promise that resolves to an HttpEnvelope containing the response data
     * @throws {ApiError} If the request fails and all retries are exhausted
     * @throws {AppError} If network or parsing errors occur
     */
    protected async executePatch<T>(endpoint: string, data?: unknown, options?: ApiRequestOptions) {
        const {body, headers} = this.preparePayload(data, options);
        return this.execute<T>(endpoint, {...options, headers, method: 'PATCH', body});
    }

    /**
     * Default query parameters serializer that converts an object to URLSearchParams.
     * Filters out undefined and null values.
     *
     * @param params - The query parameters object to serialize
     * @returns A URL query string (without the leading '?')
     */
    private readonly defaultParamsSerializer = (params: ApiQueryParams): string => {
        const searchParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                searchParams.append(key, String(value));
            }
        });
        return searchParams.toString();
    }

    /**
     * Default error transformer that converts HTTP error responses to ApiError instances.
     * Attempts to parse JSON error details from the response body.
     * Falls back to using response status text if JSON parsing fails.
     *
     * @param response - The failed HTTP response to transform
     * @returns An ApiError instance with parsed error details
     */
    private readonly defaultErrorTransformer = async (response: Response) => {
        let payload;
        try {
            payload = await response.json();
        } catch {
            payload = {message: response.statusText};
        }
        return new ApiError(`Default Error Transformer: ${response.status}`, response.status, payload.code, payload.details, payload);
    }

    /**
     * Applies all registered request interceptors sequentially to transform request configuration.
     *
     * @param config - Initial API request configuration
     * @returns The transformed request configuration after all interceptors have been applied
     */
    private async applyRequestInterceptors(config: ApiRequestConfig): Promise<ApiRequestConfig> {
        let result = config;
        for (const interceptor of this.requestInterceptors) {
            result = await interceptor(result);
        }
        return result;
    }

    /**
     * Applies all registered response interceptors sequentially to transform the response.
     *
     * @template T - The response payload type
     * @param response - Initial HTTP envelope response
     * @returns The transformed HTTP envelope response after all interceptors have been applied
     */
    private async applyResponseInterceptors<T>(response: HttpEnvelope<T>): Promise<HttpEnvelope<T>> {
        let result: HttpEnvelope<T> = response;
        for (const interceptor of this.responseInterceptors as ResponseInterceptor<T>[]) {
            result = await interceptor(result);
        }
        return result;
    }

    /**
     * Attempts error recovery by executing registered recovery handlers.
     * Handlers are called sequentially until one returns a valid response.
     *
     * @template T - The response payload type
     * @param error - The API error that triggered recovery attempt
     * @param retryRequest - Function to retry the original request if recovery succeeds
     * @returns The recovered response if any handler succeeds, otherwise null
     */
    private async attemptRecovery<T>(
        error: ApiError,
        retryRequest: () => Promise<HttpEnvelope<T>>
    ): Promise<HttpEnvelope<T> | null> {
        for (const handler of this.recoveryHandlers) {
            const recoveredResponse = await handler(error, retryRequest);
            // If a handler returns a valid response, the error is considered recovered.
            if (recoveredResponse) {
                return recoveredResponse as HttpEnvelope<T>;
            }
        }
        return null;
    }

    /**
     * Applies all registered error interceptors sequentially to transform error handling.
     *
     * @param error - Initial error instance (ApiError or AppError)
     * @returns The transformed error after all interceptors have been applied
     */
    private async applyErrorInterceptors(
        error: ApiError | AppError
    ): Promise<ApiError | AppError> {
        let result = error;
        for (const interceptor of this.errorInterceptors) {
            result = await interceptor(result);
        }
        return result;
    }

    /**
     * Calculates exponential backoff delay with jitter for retry attempts.
     * Uses the formula: exponential_delay * (1 + random_jitter)
     *
     * @param attempt - Current retry attempt number (0-based)
     * @returns Delay in milliseconds
     */
    private getRetryDelay(attempt: number): number {
        const exponentialDelay = this.config.retryDelay * Math.pow(2, attempt);
        const jitter = Math.random() * 0.1 * exponentialDelay;
        return exponentialDelay + jitter;
    }

    /**
     * Executes an HTTP request with centralized error handling and retry logic.
     * Acts as the main entry point for all HTTP method operations.
     *
     * @template T - The expected response payload type
     * @param endpoint - The API endpoint path (relative or absolute URL)
     * @param options - Request configuration options
     * @param attempt - Current retry attempt number (0-based, used internally for recursion)
     * @returns A promise that resolves to an HttpEnvelope containing the response data
     */
    private async execute<T>(
        endpoint: string,
        options: ApiRequestOptions,
        attempt: number = 0
    ): Promise<HttpEnvelope<T>> {
        try {
            // The Engine: Just tries to do the job exactly once.
            return await this.makeRequest<T>(endpoint, options);
        } catch (error) {
            // The Mechanic: Analyzes the failure.
            return await this.handleError<T>(error, attempt, endpoint, options);
        }
    }

    /**
     * Makes an HTTP request using the Fetch API with proper error handling and response parsing.
     * Integrates request/response interceptors and applies authentication headers if configured.
     *
     * @template T - The expected response payload type
     * @param endpoint - The API endpoint path (relative or absolute URL)
     * @param options - Optional request configuration including query parameters and fetch options
     * @returns A promise that resolves to an HttpEnvelope containing the parsed response data
     * @throws {ApiError} If the HTTP response status is not ok
     * @throws {AppError} If network or response parsing errors occur
     */
    private async makeRequest<T>(
        endpoint: string,
        options: ApiRequestOptions = {},
    ): Promise<HttpEnvelope<T>> {
        const {params, ...fetchOptions} = options;

        const url = this.buildUrl(endpoint, params);
        const requestOptions = await this.buildRequestOptions(fetchOptions);

        let requestConfig: ApiRequestConfig = {url, options: requestOptions};
        requestConfig = await this.applyRequestInterceptors(requestConfig);

        let response: Response;

        try {
            response = await fetch(requestConfig.url, requestConfig.options);

        } catch (error) {
            throw new AppError('Network error or failed to fetch', error);
        }

        if (!response.ok) {
            throw await this.config.errorTransformer(response);
        }

        let httpEnvelope: HttpEnvelope<T>;

        try {
            const payload = await this.parseResponse<T>(response);
            httpEnvelope = {
                payload: payload,
                status: response.status,
                headers: response.headers,
            };
        } catch (error) {
            throw new AppError('Failed to parse response', error);
        }

        return this.applyResponseInterceptors(httpEnvelope);
    }

    /**
     * Handles errors during an API request, applying retry logic for transient errors,
     * attempting smart recovery strategies, and throwing a formatted error if all retries and recoveries fail.
     *
     * @param error The encountered error; could be an instance of `ApiError`, `AppError`, or another unknown error type.
     * @param attempt The current retry attempt count.
     * @param endpoint The API endpoint URL associated with the request.
     * @param options The request configuration options used during the API call.
     * @return A promise that resolves to a `HttpEnvelope` containing the response payload on success.
     * @throws Throws a formatted error if retries and recoveries are unsuccessful.
     */
    private async handleError<T>(
        error: unknown,
        attempt: number,
        endpoint: string,
        options: ApiRequestOptions
    ): Promise<HttpEnvelope<T>> {
        let finalError: ApiError | AppError;

        if (error instanceof ApiError || error instanceof AppError) {
            finalError = error;
        } else {
            const message = error instanceof Error ? error.message : 'Unknown fatal exception';
            finalError = new AppError(message, error);
        }

        // Attempt retries
        if (finalError.isRetryable && attempt < this.config.retryAttempts) {
            const delay = this.getRetryDelay(attempt);
            await new Promise(resolve => setTimeout(resolve, delay));
            return this.execute<T>(endpoint, options, attempt + 1);
        }

        // Attempt smart recovery strategies
        if (finalError instanceof ApiError) {
            const retryRequest = () => this.execute<T>(endpoint, options, attempt + 1);
            const recoveredResponse = await this.attemptRecovery<T>(finalError, retryRequest);
            if (recoveredResponse) {
                return recoveredResponse;
            }
        }

        throw await this.applyErrorInterceptors(finalError);
    }

    /**
     * Builds the complete URL by combining the base URL with the endpoint and query parameters.
     *
     * @param endpoint - The API endpoint path (relative or absolute URL)
     * @param params - Optional query parameters to append to the URL
     * @returns The complete URL string ready for the fetch request
     * @throws {AppError} If the endpoint starts with a leading slash
     */
    private buildUrl(endpoint: string, params?: ApiQueryParams): string {
        if (endpoint.startsWith('http')) {
            return this.appendParams(endpoint, params);
        }

        if (endpoint.startsWith('/')) {
            throw new AppError(
                `Invalid endpoint: "${endpoint}". Endpoints must not start with a leading slash.`
            );
        }

        const finalUrl = `${this.config.baseUrl}/${endpoint}`;

        return this.appendParams(finalUrl, params);
    }

    /**
     * Appends query parameters to a URL if they are provided.
     *
     * @param url - The base URL string
     * @param params - Optional query parameters to append
     * @returns The URL with appended query string, or the original URL if no params provided
     */
    private appendParams(url: string, params?: ApiQueryParams): string {
        if (!params) return url;

        const queryString = this.config.paramsSerializer(params);
        return queryString ? `${url}?${queryString}` : url;
    }

    /**
     * Builds the complete request options by merging default headers, authentication tokens, and custom headers.
     * Applies security settings to prevent token leakage on redirects.
     *
     * @param options - The base request init options
     * @returns Complete request options ready for fetch with all headers merged and auth applied
     */
    private async buildRequestOptions(options: RequestInit): Promise<RequestInit> {
        console.log("[ApiClient] Building request options")
        const headers = new Headers(this.config.defaultHeaders);

        console.log("[ApiClient] Default headers:", JSON.stringify(Object.fromEntries(headers.entries())))

        if (this.authConfig) {
            const token = await this.authConfig.tokenProvider();
            if (token) {
                headers.set(this.authConfig.tokenHeader!, `${this.authConfig.tokenPrefix} ${token}`);
            }
        }

        if (options.headers) {
            const incomingHeaders = new Headers(options.headers);
            incomingHeaders.forEach((value, key) => {
                headers.set(key, value);
            });
        }

        console.log("[ApiClient] Final headers after building request options:", JSON.stringify(Object.fromEntries(headers.entries())))

        return {
            redirect: 'error', // Prevents token leakage on malicious redirects
            ...options,
            headers
        };
    }

    /**
     * Parses the HTTP response and attempts to deserialize the content based on its content type.
     *
     * @param {Response} response - The HTTP response object to be parsed.
     * @return {Promise<T>} A promise that resolves to the parsed response of type T. For JSON content, it returns the parsed object. For other content types, the response is returned as text cast to the specified type T.
     * @throws {AppError} If the response is expected to be JSON but cannot be parsed due to invalid JSON.
     */
    private async parseResponse<T>(response: Response): Promise<T> {
        if ([204, 205, 304].includes(response.status)) return null as unknown as T;

        const contentType = response.headers.get('content-type');
        if (contentType?.includes('application/json')) {
            try {
                return await response.json(); // Clean, fast, native.
            } catch (error) {
                throw new AppError('Invalid JSON response', error);
            }
        }

        return (await response.text()) as unknown as T;
    }

    /**
     * Prepares the request payload and headers based on the data type.
     * Handles JSON serialization, FormData, and URLSearchParams appropriately.
     *
     * @param data - The request body data (object, FormData, URLSearchParams, or undefined)
     * @param options - Optional request configuration containing custom headers
     * @returns Object containing serialized body and merged headers
     */
    private preparePayload(data?: unknown, options?: ApiRequestOptions): { body?: BodyInit, headers: Headers } {
        let body: BodyInit | undefined = undefined;
        const headers = new Headers(options?.headers);

        if (data !== undefined && data !== null) {
            if (data instanceof FormData || data instanceof URLSearchParams) {
                body = data;
                headers.delete('Content-Type');
            } else {
                body = JSON.stringify(data);
                if (!headers.has('Content-Type')) {
                    headers.set('Content-Type', 'application/json');
                }
            }
        }

        return {body, headers};
    }
}