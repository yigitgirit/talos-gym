import { ApiError } from '@/lib/api/core/ApiError';
import { AppError } from '@/lib/api/core/AppError';
import { ZodValidationError, mapZodError } from './validation';
import { ActionState, Err } from '@/types/actionState';

export function handleError<TData = void>(error: unknown): ActionState<TData> {
    if (error instanceof ApiError) {
        return Err<TData>(error.status, error.code, error.message, error.validationErrors);
    }

    if (error instanceof AppError) {
        return Err<TData>(null, "SERVICE_UNAVAILABLE", "The service is temporarily unavailable. Please try again later.");
    }

    if (error instanceof ZodValidationError) {
        return Err<TData>(400, "VALIDATION_ERROR", "Invalid input data", mapZodError(error.zodError));
    }

    console.error('[ActionClient Fatal Error]:', error);
    return Err<TData>(500, "UNKNOWN_ERROR", "An unexpected server error occurred");
}