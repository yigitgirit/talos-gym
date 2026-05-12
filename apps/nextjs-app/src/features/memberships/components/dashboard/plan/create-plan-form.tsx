"use client";

import * as React from "react";
import {zodResolver} from '@hookform/resolvers/zod';
import {Controller, useForm} from 'react-hook-form';
import { useRouter } from 'next/navigation';
import {AlertCircle, Info, Search} from 'lucide-react';
import {toast} from "sonner";
import {Input} from '@/components/ui/input';
import {Checkbox} from "@/components/ui/checkbox";
import {ScrollArea} from "@/components/ui/scroll-area";
import {CreatePlanRequest, CreatePlanRequestSchema, FeatureResponse} from '@/lib/api/schema';
import {createPlanAction} from '@/features/memberships/actions/membership.action';
import {useServerAction} from '@/hooks/useServerAction';
import {handleFormServerErrors} from '@/features/common/utils/form-errors';
import {Field, FieldError, FieldLabel} from "@/components/ui/field";
import {cn} from "@/lib/utils";

type CreatePlanFormProps = {
    features: FeatureResponse[];
};

export function CreatePlanForm({features}: CreatePlanFormProps) {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = React.useState("");

    const form = useForm<CreatePlanRequest>({
        resolver: zodResolver(CreatePlanRequestSchema),
        defaultValues: {
            name: '',
            isGlobal: false,
            featureIds: [],
        },
    });

    const {execute, isPending} = useServerAction(createPlanAction, {
        onSuccess: () => {
            toast.success('Membership plan created successfully!');
            form.reset();
            router.refresh();
        },
        onError: (error) => handleFormServerErrors(error, form.setError),
    });

    // Filter features based on search input
    const filteredFeatures = React.useMemo(() => {
        return features.filter(f =>
            f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            f.description?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [features, searchTerm]);

    const onSubmit = form.handleSubmit((data) => {
        execute(data);
    });

    const rootError = form.formState.errors.root?.message;

    return (
        <form id="create-plan-form" onSubmit={onSubmit} className="space-y-6">
            {rootError && (
                <div className="rounded-md bg-destructive/10 border border-destructive/20 p-3 flex gap-2">
                    <AlertCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5"/>
                    <p className="text-xs text-destructive font-medium">
                        {rootError}
                    </p>
                </div>
            )}

            {/* Plan Name Section */}
            <Controller
                name="name"
                control={form.control}
                render={({field, fieldState}) => (
                    <Field>
                        <FieldLabel htmlFor="plan-name">Plan Name</FieldLabel>
                        <Input
                            {...field}
                            id="plan-name"
                            placeholder="e.g. Premium Annual"
                            disabled={isPending}
                        />
                        {fieldState.error && <FieldError errors={[fieldState.error]}/>}
                    </Field>
                )}
            />

            {/* Inline Feature List Section */}
            <Controller
                name="featureIds"
                control={form.control}
                render={({field, fieldState}) => (
                    <Field className="space-y-3">
                        <div className="flex items-center justify-between">
                            <FieldLabel>Included Features</FieldLabel>
                            <span
                                className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded">
                                {field.value.length} Selected
                            </span>
                        </div>

                        {/* Search Bar for Features */}
                        <div className="relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"/>
                            <Input
                                placeholder="Search features..."
                                className="pl-9 h-9 text-sm bg-muted/30"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        {/* The Inline List Container */}
                        <div className={cn(
                            "rounded-xl border bg-card/50 overflow-hidden transition-all",
                            fieldState.error && "border-destructive/50 ring-1 ring-destructive/20"
                        )}>
                            <ScrollArea className="h-80 px-4">
                                <div className="py-4 space-y-4">
                                    {filteredFeatures.length > 0 ? (
                                        filteredFeatures.map((feature) => (
                                            <div
                                                key={feature.id}
                                                className="flex items-start space-x-3 group"
                                            >
                                                <Checkbox
                                                    id={`feature-${feature.id}`}
                                                    checked={field.value.includes(feature.id)}
                                                    onCheckedChange={(checked) => {
                                                        const current = [...field.value];
                                                        if (checked) {
                                                            field.onChange([...current, feature.id]);
                                                        } else {
                                                            field.onChange(current.filter(id => id !== feature.id));
                                                        }
                                                    }}
                                                    disabled={isPending}
                                                    className="mt-0.5"
                                                />
                                                <div className="grid gap-1 leading-none">
                                                    <label
                                                        htmlFor={`feature-${feature.id}`}
                                                        className="text-sm font-medium cursor-pointer group-hover:text-primary transition-colors"
                                                    >
                                                        {feature.name}
                                                    </label>
                                                    {feature.description && (
                                                        <p className="text-xs text-muted-foreground line-clamp-2">
                                                            {feature.description}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div
                                            className="h-full flex flex-col items-center justify-center py-10 text-center">
                                            <p className="text-sm text-muted-foreground">No features found matching
                                                "{searchTerm}"</p>
                                        </div>
                                    )}
                                </div>
                            </ScrollArea>
                        </div>

                        <p className="text-[0.75rem] text-muted-foreground flex items-center gap-1.5 px-1">
                            <Info className="w-3.5 h-3.5"/>
                            Checked features will be included in this membership tier.
                        </p>
                        {fieldState.error && <FieldError errors={[fieldState.error]}/>}
                    </Field>
                )}
            />

            {/* Global Checkbox Section */}
            <Controller
                name="isGlobal"
                control={form.control}
                render={({field}) => (
                    <div className="flex flex-row items-start space-x-3 space-y-0 rounded-xl border p-4 bg-muted/20">
                        <Checkbox
                            id="isGlobal"
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            disabled={isPending}
                        />
                        <div className="space-y-1 leading-none">
                            <FieldLabel htmlFor="isGlobal" className="text-sm font-medium cursor-pointer">
                                Global Membership
                            </FieldLabel>
                            <p className="text-xs text-muted-foreground">
                                This plan will be available across all club locations.
                            </p>
                        </div>
                    </div>
                )}
            />
        </form>
    );
}
