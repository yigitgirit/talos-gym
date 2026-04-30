import { UseFormSetError, FieldValues, Path } from "react-hook-form";
import { ActionError } from "@/types/actionState";
import { getErrorMessage } from "@/constants/error-codes";

export interface ParsedActionError {
    rootError: string;
    fieldErrors: Record<string, string>;
}

/**
 * Extracts and maps ActionError details into a generic, library-agnostic object.
 *
 * @param error - The ActionError returned from the server action.
 * @param fieldMapping - Optional mapping if a backend field name differs from the frontend form field name.
 * @returns An object containing the formatted root error and a dictionary of field-specific errors.
 */
export function parseActionError(
    error: ActionError,
    fieldMapping?: Record<string, string>
): ParsedActionError {
    const rootError = getErrorMessage(error.code, error.message);
    const fieldErrors: Record<string, string> = {};

    if (error.details && error.details.length > 0) {
        error.details.forEach((detail) => {
            const fieldName = fieldMapping?.[detail.field] || detail.field;
            // If multiple constraints fail for one field, we only keep the first message.
            if (!fieldErrors[fieldName]) {
                fieldErrors[fieldName] = detail.message;
            }
        });
    }

    return { rootError, fieldErrors };
}

/**
 * Maps backend ActionError details directly to react-hook-form's field errors.
 * Automatically sets a standardized "root" error for global form error banners.
 *
 * @param error - The ActionError returned from the server action.
 * @param setError - The setError function from react-hook-form's useForm hook.
 * @param fieldMapping - Optional mapping if a backend field name differs from the frontend form field name.
 */
export function handleFormServerErrors<TFieldValues extends FieldValues>(
    error: ActionError,
    setError: UseFormSetError<TFieldValues>,
    fieldMapping?: Record<string, Path<TFieldValues>>
) {
    const { rootError, fieldErrors } = parseActionError(error, fieldMapping as Record<string, string>);

    // 1. Map field-level validation errors
    Object.entries(fieldErrors).forEach(([field, message]) => {
        setError(field as Path<TFieldValues>, {
            type: "server",
            message
        });
    });

    // 2. Always set the root error so the form banner can display a generic/fallback message
    setError("root", {
        type: "server",
        message: rootError
    });
}