"use client";

import * as React from "react";
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { toast } from "sonner";
import { Input } from '@/components/ui/input';
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CreatePlanRequestSchema, FeatureResponse, MembershipPlanResponse } from '@/lib/api/schema';
import { updatePlanAction, replacePlanFeaturesAction } from '@/features/memberships/actions/membership.action';
import { useServerAction } from '@/hooks/useServerAction';
import { handleFormServerErrors } from '@/features/common/utils/form-errors';
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { cn } from "@/lib/utils";

type EditPlanFormProps = {
    plan: MembershipPlanResponse;
    features: FeatureResponse[];
    setOpen?: (open: boolean) => void;
};

export function EditPlanForm({ plan, features, setOpen }: EditPlanFormProps) {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = React.useState("");

    // We use a ref to temporarily hold the featureIds during the callback chain
    const pendingFeaturesRef = React.useRef<number[]>([]);

    const form = useForm({
        resolver: zodResolver(CreatePlanRequestSchema),
        defaultValues: {
            name: plan.name,
            isGlobal: plan.isGlobal,
            featureIds: plan.features.map(f => f.id),
        },
    });

    // -----------------------------------------------------------------
    // STEP 2: The Feature Replacement Action
    // -----------------------------------------------------------------
    const { execute: executeReplace, isPending: isReplacing } = useServerAction(replacePlanFeaturesAction, {
        onSuccess: () => {
            toast.success('Membership plan updated successfully!');
            router.refresh();
            setOpen?.(false);
        },
        onError: (error) => {
            toast.error(error.message || "Plan saved, but failed to sync features.");
        }
    });

    // -----------------------------------------------------------------
    // STEP 1: The Meta Update Action
    // -----------------------------------------------------------------
    const { execute: executeUpdate, isPending: isUpdating } = useServerAction(updatePlanAction, {
        onSuccess: () => {

            executeReplace({
                planId: plan.id.toString(),
                featureIds: pendingFeaturesRef.current
            });
        },
        onError: (error) => handleFormServerErrors(error, form.setError)
    });

    const isPending = isUpdating || isReplacing;

    const filteredFeatures = React.useMemo(() => {
        return features.filter(f =>
            f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            f.description?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [features, searchTerm]);

    // -----------------------------------------------------------------
    // FORM SUBMISSION
    // -----------------------------------------------------------------
    const onSubmit = form.handleSubmit((values) => {
        // Save the features to the ref so Step 1's onSuccess callback can access them
        pendingFeaturesRef.current = values.featureIds;

        // Kick off the chain
        executeUpdate({
            planId: plan.id.toString(),
            data: {
                name: values.name,
                isGlobal: values.isGlobal
            }
        });
    });

    return (
        <form id="edit-plan-form" onSubmit={onSubmit} className="space-y-6">
            <Controller
                name="name"
                control={form.control}
                render={({ field, fieldState }) => (
                    <Field>
                        <FieldLabel htmlFor="edit-plan-name">Plan Name</FieldLabel>
                        <Input {...field} id="edit-plan-name" disabled={isPending} />
                        {fieldState.error && <FieldError errors={[fieldState.error]} />}
                    </Field>
                )}
            />

            <Controller
                name="featureIds"
                control={form.control}
                render={({ field, fieldState }) => (
                    <Field className="space-y-3">
                        <div className="flex items-center justify-between">
                            <FieldLabel>Included Features</FieldLabel>
                            <span className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded">
                                {field.value.length} Selected
                            </span>
                        </div>

                        <div className="relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search features..."
                                className="pl-9 h-9 text-sm bg-muted/30"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <div className={cn(
                            "rounded-xl border bg-card/50 overflow-hidden transition-all",
                            fieldState.error && "border-destructive/50 ring-1 ring-destructive/20"
                        )}>
                            <ScrollArea className="h-80 px-4">
                                <div className="py-4 space-y-4">
                                    {filteredFeatures.map((feature) => (
                                        <div key={feature.id} className="flex items-start space-x-3 group">
                                            <Checkbox
                                                id={`edit-feature-${feature.id}`}
                                                checked={field.value.includes(feature.id)}
                                                onCheckedChange={(checked) => {
                                                    const current = [...field.value];
                                                    field.onChange(checked
                                                        ? [...current, feature.id]
                                                        : current.filter(id => id !== feature.id)
                                                    );
                                                }}
                                                disabled={isPending}
                                            />
                                            <div className="grid gap-1 leading-none">
                                                <label htmlFor={`edit-feature-${feature.id}`} className="text-sm font-medium cursor-pointer">
                                                    {feature.name}
                                                </label>
                                                <p className="text-xs text-muted-foreground line-clamp-2">{feature.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </ScrollArea>
                        </div>
                        {fieldState.error && <FieldError errors={[fieldState.error]} />}
                    </Field>
                )}
            />

            <Controller
                name="isGlobal"
                control={form.control}
                render={({ field }) => (
                    <div className="flex flex-row items-start space-x-3 rounded-xl border p-4 bg-muted/20">
                        <Checkbox
                            id="edit-isGlobal"
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            disabled={isPending}
                        />
                        <div className="space-y-1 leading-none">
                            <FieldLabel htmlFor="edit-isGlobal" className="cursor-pointer">Global Membership</FieldLabel>
                            <p className="text-xs text-muted-foreground">Available across all club locations.</p>
                        </div>
                    </div>
                )}
            />
        </form>
    );
}