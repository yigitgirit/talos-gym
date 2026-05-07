import { z } from "zod"
import { NextPageSearchParams } from "@/features/common/types/search-params"

/**
 * Utility function to parse and validate Next.js page search params using a Zod schema.
 *
 * @param paramsPromise - The promise that resolves to the raw search params object from Next.js.
 * @param schema - A Zod schema that describes the expected shape of the search params.
 * @returns A promise that resolves to the parsed and validated search params, or defaults if validation fails.
 */
export async function parseSearchParams<T extends z.ZodType>(
  paramsPromise: Promise<NextPageSearchParams>,
  schema: T
): Promise<z.infer<T>> {
  const rawParams = await paramsPromise
  const result = schema.safeParse(rawParams)

  if (result.success) {
    return result.data
  }

  return schema.parse({})
}
