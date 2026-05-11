"use client";

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { Loader2, AlertCircle } from 'lucide-react';
import { toast } from "sonner";

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CreateOfferRequest, CreateOfferRequestSchema } from '@/lib/api/schema';
import { createOfferAction } from '@/features/memberships/actions/membership.action';
import { useServerAction } from '@/hooks/useServerAction';
import { handleFormServerErrors } from '@/features/common/utils/form-errors';
import { Field, FieldError, FieldLabel } from "@/components/ui/field";

export function CreateOfferForm() {
    const router = useRouter();
    const form = useForm<CreateOfferRequest>({
        resolver: zodResolver(CreateOfferRequestSchema),
        defaultValues: { planId: undefined, clubId: undefined, price: undefined },
    });

    const { execute, isPending } = useServerAction(createOfferAction, {
        onSuccess: () => {
            toast.success('Offer created successfully!');
            form.reset();
            router.refresh();
        },
        onError: (error) => handleFormServerErrors(error, form.setError),
    });

    const rootError = form.formState.errors.root?.message;

    return (
        <form id="create-offer-form" onSubmit={form.handleSubmit(execute)} className="space-y-4 pt-4">
            {rootError && (
                <div className="mb-4 rounded-md bg-destructive/10 border border-destructive/20 p-3 flex gap-2">
                    <AlertCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                    <p className="text-xs text-destructive font-medium">{rootError}</p>
                </div>
            )}
            <Controller
                name="planId"
                control={form.control}
                render={({ field, fieldState }) => (
                    <Field>
                        <FieldLabel htmlFor="planId">Plan ID</FieldLabel>
                        <Input
                            {...field}
                            id="planId"
                            type="number"
                            value={field.value ?? ''}
                            onChange={e => {
                                const value = parseInt(e.target.value, 10);
                                field.onChange(isNaN(value) ? undefined : value);
                            }}
                            placeholder="e.g. 1"
                            disabled={isPending}
                        />
                        {fieldState.error && <FieldError errors={[fieldState.error]} />}
                    </Field>
                )}
            />
            <Controller
                name="clubId"
                control={form.control}
                render={({ field, fieldState }) => (
                    <Field>
                        <FieldLabel htmlFor="clubId">Club ID (Optional)</FieldLabel>
                        <Input
                            {...field}
                            id="clubId"
                            type="number"
                            value={field.value ?? ''}
                            onChange={e => {
                                const value = parseInt(e.target.value, 10);
                                field.onChange(isNaN(value) ? undefined : value);
                            }}
                            placeholder="e.g. 123"
                            disabled={isPending}
                        />
                        {fieldState.error && <FieldError errors={[fieldState.error]} />}
                    </Field>
                )}
            />
            <Controller
                name="price"
                control={form.control}
                render={({ field, fieldState }) => (
                    <Field>
                        <FieldLabel htmlFor="price">Price</FieldLabel>
                        <Input
                            {...field}
                            id="price"
                            type="number"
                            step="0.01"
                            value={field.value ?? ''}
                            onChange={e => {
                                const value = parseFloat(e.target.value);
                                field.onChange(isNaN(value) ? undefined : value);
                            }}
                            placeholder="e.g. 49.99"
                            disabled={isPending}
                        />
                        {fieldState.error && <FieldError errors={[fieldState.error]} />}
                    </Field>
                )}
            />
            <div className="flex justify-end pt-4">
                <Button type="submit" disabled={isPending} className="w-full sm:w-auto">
                    {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Create Offer
                </Button>
            </div>
        </form>
    );
}
