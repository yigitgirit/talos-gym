import {ValidationErrorDetail} from "@/lib/api/schema";

/**
 * Represents an error encountered during an API operation.
 * Extends the built-in Error class to include additional properties specific to API errors.
 */
export class ApiError<TPayload = unknown> extends Error {
    public readonly status: number;
    public readonly code: string;
    public readonly validationErrors?: ValidationErrorDetail[];
    public readonly isRetryable: boolean;
    public readonly payload?: TPayload;

    constructor(
        message: string,
        status: number,
        code: string,
        validationErrors?: ValidationErrorDetail[],
        payload?: TPayload,
    ) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
        this.code = code;
        this.validationErrors = validationErrors;
        this.payload = payload;
        this.isRetryable = this.isRetryableStatus(status);
    }

    private isRetryableStatus(status: number): boolean {
        return status === 408 || status === 429 || status >= 500;
    }
}
