import { z } from 'zod';
import {ValidationErrorDetail} from "@/lib/api/schema";

export class ZodValidationError extends Error {
    constructor(public zodError: z.ZodError) {
        super("Validation failed");
        this.name = 'ZodValidationError';
        Object.setPrototypeOf(this, ZodValidationError.prototype);
    }
}

/**
 * Maps a ZodError object to the backend's standardized ValidationErrorDetail array.
 * This ensures Next.js validation errors and Spring Boot validation errors are indistinguishable to the UI.
 *
 * @param {z.ZodError} zodError - The ZodError object containing validation issues.
 * @return {ValidationErrorDetail[]} An array of standardized validation details.
 */
export function mapZodError(zodError: z.ZodError): ValidationErrorDetail[] {
    // Reduce to get only the first error per field, matching typical backend behavior
    const firstErrors = new Map<string, string>();
    for (const issue of zodError.issues) {
        const path = issue.path.join('.');
        if (!firstErrors.has(path)) firstErrors.set(path, issue.message);
    }
    
    return Array.from(firstErrors.entries()).map(([field, message]) => ({
        field,
        message,
        rejectedValue: undefined
    }));
}

/**
 * Validates the given input against the provided Zod schema. If validation fails, an error is thrown.
 *
 * @param {z.ZodType<T>} schema - The Zod schema to validate the input against.
 * @param {unknown} input - The input data to validate.
 * @return {T} - The parsed and validated data if the input passes validation.
 */
export function validateOrThrow<T>(schema: z.ZodType<T>, input: unknown): T {
    const parsed = schema.safeParse(input);
    if (!parsed.success) {
        throw new ZodValidationError(parsed.error);
    }
    return parsed.data;
}