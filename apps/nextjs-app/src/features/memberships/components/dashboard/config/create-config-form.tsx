"use client";

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { Loader2, AlertCircle } from 'lucide-react';
import { toast } from "sonner";

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CreatePlanSubscriptionConfigRequest, CreatePlanSubscriptionConfigRequestSchema } from '@/lib/api/schema';
import { createPlanSubscriptionConfigAction } from '@/features/memberships/actions/membership.action';
import { useServerAction } from '@/hooks/useServerAction';
import { handleFormServerErrors } from '@/features/common/utils/form-errors';
import { Field, FieldError, FieldLabel } from "@/components/ui/field";

type CreateConfigFormProps = {
  planId: string;
  setOpen?: (open: boolean) => void;
};

export function CreateConfigForm({ planId, setOpen }: CreateConfigFormProps) {
    const router = useRouter();
    const form = useForm<CreatePlanSubscriptionConfigRequest>({
        resolver: zodResolver(CreatePlanSubscriptionConfigRequestSchema),
        defaultValues: { subscriptionTypeId: undefined, multiplier: undefined, discountRate: undefined, installments: undefined },
    });

    const { execute, isPending } = useServerAction(createPlanSubscriptionConfigAction, {
        onSuccess: () => {
            toast.success('Config created successfully!');
            form.reset();
            router.refresh();
            setOpen?.(false);
        },
        onError: (error) => handleFormServerErrors(error, form.setError),
    });

    const rootError = form.formState.errors.root?.message;

    return (
        <form id="create-config-form" onSubmit={form.handleSubmit((data) => execute({ planId, data }))} className="space-y-4 pt-4">
            {rootError && (
                <div className="mb-4 rounded-md bg-destructive/10 border border-destructive/20 p-3 flex gap-2">
                    <AlertCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                    <p className="text-xs text-destructive font-medium">{rootError}</p>
                </div>
            )}
            <Controller
                name="subscriptionTypeId"
                control={form.control}
                render={({ field, fieldState }) => (
                    <Field>
                        <FieldLabel htmlFor="subscriptionTypeId">Subscription Type ID</FieldLabel>
                        <Input
                            {...field}
                            id="subscriptionTypeId"
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
                name="multiplier"
                control={form.control}
                render={({ field, fieldState }) => (
                    <Field>
                        <FieldLabel htmlFor="multiplier">Multiplier</FieldLabel>
                        <Input
                            {...field}
                            id="multiplier"
                            type="number"
                            step="0.01"
                            value={field.value ?? ''}
                            onChange={e => {
                                const value = parseFloat(e.target.value);
                                field.onChange(isNaN(value) ? undefined : value);
                            }}
                            placeholder="e.g. 1.0"
                            disabled={isPending}
                        />
                        {fieldState.error && <FieldError errors={[fieldState.error]} />}
                    </Field>
                )}
            />
            <Controller
                name="discountRate"
                control={form.control}
                render={({ field, fieldState }) => (
                    <Field>
                        <FieldLabel htmlFor="discountRate">Discount Rate</FieldLabel>
                        <Input
                            {...field}
                            id="discountRate"
                            type="number"
                            step="0.01"
                            value={field.value ?? ''}
                            onChange={e => {
                                const value = parseFloat(e.target.value);
                                field.onChange(isNaN(value) ? undefined : value);
                            }}
                            placeholder="e.g. 0.1 for 10%"
                            disabled={isPending}
                        />
                        {fieldState.error && <FieldError errors={[fieldState.error]} />}
                    </Field>
                )}
            />
            <Controller
                name="installments"
                control={form.control}
                render={({ field, fieldState }) => (
                    <Field>
                        <FieldLabel htmlFor="installments">Installments</FieldLabel>
                        <Input
                            {...field}
                            id="installments"
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
            <div className="flex justify-end pt-4">
                <Button type="submit" disabled={isPending} className="w-full sm:w-auto">
                    {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Create Config
                </Button>
            </div>
        </form>
    );
}
