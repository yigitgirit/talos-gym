"use client";

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { Loader2, AlertCircle } from 'lucide-react';
import { toast } from "sonner";

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from "@/components/ui/textarea";
import { CreateFeatureRequest, CreateFeatureRequestSchema } from '@/lib/api/schema';
import { createFeatureAction } from '@/features/memberships/actions/membership.action';
import { useServerAction } from '@/hooks/useServerAction';
import { handleFormServerErrors } from '@/features/common/utils/form-errors';
import { Field, FieldError, FieldLabel } from "@/components/ui/field";

type CreateFeatureFormProps = {
    setOpen?: (open: boolean) => void;
};

export function CreateFeatureForm({ setOpen }: CreateFeatureFormProps = {}) {
    const router = useRouter();
    const form = useForm<CreateFeatureRequest>({
        resolver: zodResolver(CreateFeatureRequestSchema),
        defaultValues: { name: '', description: '' },
    });

    const { execute, isPending } = useServerAction(createFeatureAction, {
        onSuccess: () => {
            toast.success('Feature created successfully!');
            form.reset();
            router.refresh();
            setOpen?.(false);
        },
        onError: (error) => handleFormServerErrors(error, form.setError),
    });

    const rootError = form.formState.errors.root?.message;

    return (
        <form id="create-feature-form" onSubmit={form.handleSubmit(execute)} className="space-y-4 pt-4">
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
                        <FieldLabel htmlFor="feature-name">Feature Name</FieldLabel>
                        <Input {...field} id="feature-name" placeholder="e.g. 24/7 Access" disabled={isPending} />
                        {fieldState.error && <FieldError errors={[fieldState.error]} />}
                    </Field>
                )}
            />
            <Controller
                name="description"
                control={form.control}
                render={({ field, fieldState }) => (
                    <Field>
                        <FieldLabel htmlFor="feature-desc">Description (Optional)</FieldLabel>
                        <Textarea
                            {...field}
                            value={field.value || ''}
                            id="feature-desc"
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
                    Create Feature
                </Button>
            </div>
        </form>
    );
}
