"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Search, RotateCcw } from "lucide-react";

import { Input } from "@/components/ui/input";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { ClubSearchFilters, ClubSearchFiltersSchema, ClubSearchUrl, ClubSearchUrlSchema } from "../schemas";
import { useUrlFilters } from "@/features/common/hooks/useUrlFilters";

type ClubFilters = {
    search: string;
    city: string;
    district: string;
    active: "active" | "inactive" | "all";
}

export function ClubFilters() {
    const { filters, updateFilters, clearFilters, hasAnyFilter } = useUrlFilters({
        schema: ClubSearchUrlSchema,
    });

    const getFormValues = (source: Partial<ClubSearchUrl>): ClubSearchFilters => ({
        search: source.search || "",
        city: source.city || "",
        district: source.district || "",
        active: source.active,
    });

    const form = useForm<ClubSearchFilters>({
        resolver: zodResolver(ClubSearchFiltersSchema),
        defaultValues: getFormValues(filters),
    });

    useEffect(() => {
        form.reset(getFormValues(filters));
    }, [filters, form]);

    function onSubmit(data: ClubSearchFilters) {
        updateFilters(data);
    }

    function handleReset() {
        clearFilters();
        form.reset(getFormValues({}));
    }

    return (
        <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="bg-primary/5 border border-primary/10 rounded-xl p-6 backdrop-blur-sm"
        >
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 items-end">
                <Controller
                    name="search"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="search">Search</FieldLabel>
                            <Input
                                {...field}
                                id="search"
                                placeholder="Club name..."
                                aria-invalid={fieldState.invalid}
                            />
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </Field>
                    )}
                />

                <Controller
                    name="city"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="city">City</FieldLabel>
                            <Input
                                {...field}
                                id="city"
                                placeholder="Filter by City..."
                                aria-invalid={fieldState.invalid}
                            />
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </Field>
                    )}
                />

                <Controller
                    name="district"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="district">District</FieldLabel>
                            <Input
                                {...field}
                                id="district"
                                placeholder="Filter by District..."
                                aria-invalid={fieldState.invalid}
                            />
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </Field>
                    )}
                />

                <Controller
                    name="active"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="active">Status</FieldLabel>
                            <NativeSelect
                                id="active"
                                name={field.name}
                                // Standard HTML pattern: undefined maps to "", booleans map to string equivalents
                                value={field.value === undefined ? "" : String(field.value)}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    
                                    if (val === "") {
                                        // Bypass RHF's undefined-fallback behavior by wiping the 
                                        // entire form cache and replacing it with the current state.
                                        form.reset({ ...form.getValues(), active: undefined });
                                    } else {
                                        field.onChange(val === "true");
                                    }
                                }}
                                aria-invalid={fieldState.invalid}
                            >
                                <NativeSelectOption value="">All Statuses</NativeSelectOption>
                                <NativeSelectOption value="true">Active Only</NativeSelectOption>
                                <NativeSelectOption value="false">Inactive Only</NativeSelectOption>
                            </NativeSelect>
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </Field>
                    )}
                />

                <div className={hasAnyFilter ? "md:col-span-1" : "md:col-span-2"}>
                    <Field>
                        <Button type="submit" className="w-full gap-2">
                            <Search className="w-4 h-4" />
                            Search
                        </Button>
                    </Field>
                </div>

                {hasAnyFilter && (
                    <div className="md:col-span-1">
                        <Field>
                        <Button
                            type="button"
                            variant="outline"
                            className="w-full gap-2"
                            onClick={handleReset}
                        >
                            <RotateCcw className="w-4 h-4" />
                            Reset
                        </Button>
                        </Field>
                    </div>
                )}
            </div>
        </form>
    );
}
