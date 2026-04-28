/**
 * Represents an unexpected client-side or network error where
 * the backend was unreachable or the response could not be parsed.
 */
export class AppError extends Error {
    public readonly isRetryable: boolean;

    constructor(message: string, public originalError?: unknown) {
        super(message);
        this.name = 'AppError';
        this.isRetryable = originalError instanceof TypeError &&
            originalError.message === 'Failed to fetch';
    }
}