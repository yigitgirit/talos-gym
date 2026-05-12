"use client";

import { useCallback, useMemo } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { z, ZodObject, ZodRawShape } from "zod";

/**
 * Options passed to the hook
 */
export type UrlFiltersOptions<T extends ZodObject<ZodRawShape>> = {
  /** Zod schema that describes the filter shape */
  schema: T;
  /** Determines whether to create a new browser history entry. Default = "push" */
  history?: "push" | "replace";
};

/**
 * Return value of the hook
 */
export type UrlFiltersResult<T extends ZodObject<ZodRawShape>> = {
  /** The **typed** filter object derived from the current URL */
  filters: z.infer<T>;
  /** Update one or many filter fields */
  updateFilters: (updates: Partial<z.infer<T>>, resetPage?: boolean) => void;
  /** Reset the whole search (keeps non‑filter params like `utm_source`) */
  clearFilters: () => void;
  /** Raw Next.js SearchParams object (rarely needed) */
  rawSearchParams: URLSearchParams;
  /** Indicates whether any filters are currently applied */
  hasAnyFilter: boolean;
};

/**
 * Main hook – use it in any client component that needs to mutate URL filters.
 *
 * Example:
 * ```tsx
 * const { filters, updateFilters } = useUrlFilters({
 *   schema: ClubSearchParamsCoercedSchema,
 * });
 * ```
 */
export function useUrlFilters<T extends ZodObject<ZodRawShape>>(
  options: UrlFiltersOptions<T>
): UrlFiltersResult<T> {
  const { schema, history = "push" } = options;

  const router = useRouter();
  const pathname = usePathname();
  const rawSearchParams = useSearchParams();

  // -------------------------------------------------------------------------
  // 1️⃣ Parse the current query string **once** per render and memoise it.
  // -------------------------------------------------------------------------
  const filters = useMemo(() => {
    const rawObj: { [key: string]: string | string[] | undefined } = {};

    // `rawSearchParams` implements the URLSearchParams interface.
    rawSearchParams.forEach((value, key) => {
      // Keep repeatable keys as an array (e.g. ?status=PAID&status=UNPAID)
      const existing = rawObj[key];
      if (existing === undefined) {
        rawObj[key] = value;
      } else if (Array.isArray(existing)) {
        existing.push(value);
      } else {
        rawObj[key] = [existing, value];
      }
    });

    // Zod will coerce/parse according to the schema (e.g. strings → numbers/booleans)
    const result = schema.safeParse(rawObj);
    if (result.success) return result.data;

    // Fallback: If URL has invalid data, try returning the schema's defaults safely
    const fallback = schema.safeParse({});
    if (fallback.success) return fallback.data;

    // Last resort: Return empty to prevent a fatal render crash if schema lacks defaults
    return {} as z.infer<T>;
  }, [rawSearchParams, schema]);

  // -------------------------------------------------------------------------
  // 2️⃣ Helper that builds the new URLSearchParams object
  // -------------------------------------------------------------------------
  const buildParams = (updates: Partial<z.infer<T>>, resetPage: boolean) => {
    const params = new URLSearchParams(rawSearchParams.toString());

    // Apply each update – the logic mirrors `useUrlFilters` but is typed
    (Object.entries(updates) as [keyof z.infer<T>, unknown][])
      .forEach(([key, value]) => {
        // Remove previous occurrences first (important for arrays)
        params.delete(key as string);

        // If the value is "empty" (clearing a filter), leave it deleted and skip appending
        if (value === undefined || value === null || value === "") return;

        if (Array.isArray(value)) {
          value.forEach((v: unknown) => {
            if (v !== undefined && v !== null && v !== "") {
              params.append(key as string, String(v));
            }
          });
        } else {
          params.set(key as string, String(value));
        }
      });

    // Common pattern: resetting pagination when any filter changes
    if (resetPage && !("page" in updates)) {
      params.delete("page");
    }

    return params;
  };

  // -------------------------------------------------------------------------
  // 3️⃣ `updateFilters`
  // -------------------------------------------------------------------------
  const updateFilters = useCallback(
    (updates: Partial<z.infer<T>>, resetPage = true) => {
      const newParams = buildParams(updates, resetPage);
      const method = history === "replace" ? "replace" : "push";
      // @ts-ignore – Next.js router typings allow both signatures
      router[method](`${pathname}?${newParams.toString()}`, { scroll: false });
    },
    [router, pathname, rawSearchParams, history]
  );

  // -------------------------------------------------------------------------
  // 4️⃣ `clearFilters`
  // -------------------------------------------------------------------------
  const clearFilters = useCallback(() => {
    // Keep non‑filter params (e.g. utm_*) by just removing known filter keys
    const keep = new URLSearchParams();
    rawSearchParams.forEach((value, key) => {
      if (!Object.hasOwn(schema.shape, key)) {
        keep.append(key, value);
      }
    });
    const method = history === "replace" ? "replace" : "push";
    // @ts-ignore
    router[method](`${pathname}?${keep.toString()}`, { scroll: false });
  }, [router, pathname, rawSearchParams, history, schema]);

  const hasAnyFilter = useMemo(() => {
    const keys = Array.from(rawSearchParams.keys());

    const ignoredKeys = ["page", "size", "sort"]; 
    
    return keys.some(
        (key) => !ignoredKeys.includes(key) && Object.hasOwn(schema.shape, key)
    );
  }, [rawSearchParams, schema]);

  return {
    filters,
    updateFilters,
    clearFilters,
    hasAnyFilter,
    rawSearchParams,
  };
}