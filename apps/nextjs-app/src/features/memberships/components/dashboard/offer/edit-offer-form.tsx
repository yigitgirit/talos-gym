"use client";

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { Loader2, AlertCircle } from 'lucide-react';
import { toast } from "sonner";

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UpdateOfferRequest, UpdateOfferRequestSchema, OfferAdminResponse } from '@/lib/api/schema';
import { updateOfferAction } from '@/features/memberships/actions/membership.action';
import { useServerAction } from '@/hooks/useServerAction';
import { handleFormServerErrors } from '@/features/common/utils/form-errors';
import { Field, FieldError, FieldLabel } from "@/components/ui/field";

type EditOfferFormProps = {
    offer: OfferAdminResponse;
};

export function EditOfferForm({ offer }: EditOfferFormProps) {
    const router = useRouter();
    const form = useForm<UpdateOfferRequest>({
        resolver: zodResolver(UpdateOfferRequestSchema),
        defaultValues: { newPrice: offer.price },
    });

    const { execute, isPending } = useServerAction(updateOfferAction, {
        onSuccess: () => {
            toast.success('Offer updated successfully!');
            router.refresh();
        },
        onError: (error) => handleFormServerErrors(error, form.setError),
    });

    const rootError = form.formState.errors.root?.message;

    return (
        <form id="edit-offer-form" onSubmit={form.handleSubmit(data => execute({ offerId: offer.id.toString(), data }))} className="space-y-4 pt-4">
            {rootError && (
                <div className="mb-4 rounded-md bg-destructive/10 border border-destructive/20 p-3 flex gap-2">
                    <AlertCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                    <p className="text-xs text-destructive font-medium">{rootError}</p>
                </div>
            )}
            <Controller
                name="newPrice"
                control={form.control}
                render={({ field, fieldState }) => (
                    <Field>
                        <FieldLabel htmlFor="newPrice">New Price</FieldLabel>
                        <Input
                            {...field}
                            id="newPrice"
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
                    Save Changes
                </Button>
            </div>
        </form>
    );
}
