"use client";

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { Loader2, AlertCircle } from 'lucide-react';
import { toast } from "sonner";

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from "@/components/ui/textarea";
import {
    UpdateFeatureRequest,
    UpdateFeatureRequestSchema,
    FeatureResponse
} from '@/lib/api/schema';
import { updateFeatureAction } from '@/features/memberships/actions/membership.action';
import { useServerAction } from '@/hooks/useServerAction';
import { handleFormServerErrors } from '@/features/common/utils/form-errors';
import { Field, FieldError, FieldLabel } from "@/components/ui/field";

type EditFeatureFormProps = {
    feature: FeatureResponse;
};

export function EditFeatureForm({ feature }: EditFeatureFormProps) {
    const router = useRouter();
    // Initialize the form with the existing feature data
    const form = useForm<UpdateFeatureRequest>({
        resolver: zodResolver(UpdateFeatureRequestSchema),
        defaultValues: {
            name: feature.name,
            description: feature.description || ''
        },
    });

    const { execute, isPending } = useServerAction(updateFeatureAction, {
        onSuccess: () => {
            toast.success('Feature updated successfully!');
            router.refresh();
        },
        onError: (error) => handleFormServerErrors(error, form.setError),
    });

    const onSubmit = form.handleSubmit((values) => {
        execute({
            featureId: feature.id.toString(),
            data: values
        });
    });

    const rootError = form.formState.errors.root?.message;

    return (
        <form id={`edit-feature-form-${feature.id}`} onSubmit={onSubmit} className="space-y-4 pt-4">
            {rootError && (
                <div className="mb-4 rounded-md bg-destructive/10 border border-destructive/20 p-3 flex gap-2">
                    <AlertCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                    <p className="text-xs text-destructive font-medium">{rootError}</p>
                </div>
            )}
            <Controller
                name="name"
                control={form.control}
                render={({ field, fieldState }) => (
                    <Field>
                        <FieldLabel htmlFor={`edit-feature-name-${feature.id}`}>Feature Name</FieldLabel>
                        <Input
                            {...field}
                            id={`edit-feature-name-${feature.id}`}
                            placeholder="e.g. 24/7 Access"
                            disabled={isPending}
                        />
                        {fieldState.error && <FieldError errors={[fieldState.error]} />}
                    </Field>
                )}
            />

            <Controller
                name="description"
                control={form.control}
                render={({ field, fieldState }) => (
                    <Field>
                        <FieldLabel htmlFor={`edit-feature-desc-${feature.id}`}>Description (Optional)</FieldLabel>
                        <Textarea
                            {...field}
                            value={field.value || ''}
                            id={`edit-feature-desc-${feature.id}`}
                            placeholder="Briefly describe this perk..."
                            disabled={isPending}
                            className="resize-none h-20"
                        />
                        {fieldState.error && <FieldError errors={[fieldState.error]} />}
                    </Field>
                )}
            />

            <div className="flex justify-end pt-4">
                <Button type="submit" disabled={isPending} className="w-full sm:w-auto">
                    {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Changes
                </Button>
            </div>
        </form>
    );
}
