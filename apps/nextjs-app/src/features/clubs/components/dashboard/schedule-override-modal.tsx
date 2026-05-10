"use client"

import * as React from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { PlusIcon, Loader2, AlertCircle } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { format } from "date-fns"

import { 
    ScheduleOverrideDto, 
    ScheduleOverrideRequest, 
    ScheduleOverrideRequestSchema 
} from "@/lib/api/schema/club.schema"
import { createScheduleOverrideAction, updateScheduleOverrideAction } from "@/features/clubs/actions/club.actions"
import { useServerAction } from "@/hooks/useServerAction"
import { handleFormServerErrors } from "@/features/common/utils/form-errors"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Field, FieldLabel, FieldError } from "@/components/ui/field"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

type ScheduleOverrideModalProps = {
    clubId: string;
    override?: ScheduleOverrideDto; // If provided, modal acts as "Edit" instead of "Create"
    trigger?: React.ReactNode;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}

export function ScheduleOverrideModal({ clubId, override, trigger, open, onOpenChange }: ScheduleOverrideModalProps) {
    const [internalOpen, setInternalOpen] = React.useState(false)
    const isControlled = open !== undefined && onOpenChange !== undefined
    const isOpen = isControlled ? open : internalOpen
    const setIsOpen = isControlled ? onOpenChange : setInternalOpen

    const router = useRouter()
    const isEditing = !!override

    const form = useForm<ScheduleOverrideRequest>({
        resolver: zodResolver(ScheduleOverrideRequestSchema),
        defaultValues: {
            targetDate: override?.overrideDate || format(new Date(), 'yyyy-MM-dd'),
            isClosed: override?.closed ?? false,
            openTime: override?.openingTime || "00:00",
            closeTime: override?.closingTime || "00:00",
            reason: override?.reason || "",
        }
    })

    const createAction = useServerAction(createScheduleOverrideAction, {
        onSuccess: () => {
            toast.success("Schedule exception added!")
            setIsOpen(false)
            form.reset()
            router.refresh()
        },
        onError: (error) => handleFormServerErrors(error, form.setError)
    })

    const updateAction = useServerAction(updateScheduleOverrideAction, {
        onSuccess: () => {
            toast.success("Schedule exception updated!")
            setIsOpen(false)
            router.refresh()
        },
        onError: (error) => handleFormServerErrors(error, form.setError)
    })

    const isPending = createAction.isPending || updateAction.isPending
    const rootError = form.formState.errors.root?.message

    const onSubmit = form.handleSubmit((data) => {
        // Clean up data for API
        const payload = {
            ...data,
            openTime: data.isClosed ? null : (data.openTime || null),
            closeTime: data.isClosed ? null : (data.closeTime || null),
        }

        if (isEditing) {
            updateAction.execute({ clubId, overrideId: override.id.toString(), data: payload })
        } else {
            createAction.execute({ clubId, data: payload })
        }
    })

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            {!isControlled && (
                <DialogTrigger asChild>
                    {trigger || (
                        <Button size="sm">
                            <PlusIcon className="w-4 h-4 mr-2" /> Add Exception
                        </Button>
                    )}
                </DialogTrigger>
            )}
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{isEditing ? "Edit Exception" : "Add Schedule Exception"}</DialogTitle>
                    <DialogDescription>Create a one-off change (e.g. Holidays, maintenance).</DialogDescription>
                </DialogHeader>

                {rootError && (
                    <div className="rounded-md bg-destructive/10 border border-destructive/20 p-3 flex gap-2 mt-2">
                        <AlertCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                        <p className="text-xs text-destructive font-medium">{rootError}</p>
                    </div>
                )}

                <form id="override-form" onSubmit={onSubmit} className="space-y-5 py-4">
                    <Controller name="targetDate" control={form.control} render={({ field, fieldState }) => (
                        <Field>
                            <FieldLabel>Date</FieldLabel>
                            <Input type="date" {...field} disabled={isPending || isEditing} aria-invalid={fieldState.invalid} />
                            {fieldState.invalid && fieldState.error && <FieldError errors={[fieldState.error]} />}
                        </Field>
                    )} />

                    <Controller name="reason" control={form.control} render={({ field, fieldState }) => (
                        <Field>
                            <FieldLabel>Reason <span className="text-muted-foreground font-normal">(optional)</span></FieldLabel>
                            <Input placeholder="e.g. National Holiday" {...field} value={field.value || ""} disabled={isPending} aria-invalid={fieldState.invalid} />
                            {fieldState.invalid && fieldState.error && <FieldError errors={[fieldState.error]} />}
                        </Field>
                    )} />

                    <div className="grid grid-cols-2 gap-4">
                        <Controller name="openTime" control={form.control} render={({ field, fieldState }) => (
                            <Field>
                                <FieldLabel>Opening Time</FieldLabel>
                                <Input type="time" {...field} value={field.value || ""} disabled={isPending || form.watch('isClosed')} aria-invalid={fieldState.invalid} />
                                {fieldState.invalid && fieldState.error && <FieldError errors={[fieldState.error]} />}
                            </Field>
                        )} />

                        <Controller name="closeTime" control={form.control} render={({ field, fieldState }) => (
                            <Field>
                                <FieldLabel>Closing Time</FieldLabel>
                                <Input type="time" {...field} value={field.value || ""} disabled={isPending || form.watch('isClosed')} aria-invalid={fieldState.invalid} />
                                {fieldState.invalid && fieldState.error && <FieldError errors={[fieldState.error]} />}
                            </Field>
                        )} />
                    </div>

                    <Controller name="isClosed" control={form.control} render={({ field, fieldState }) => (
                        <Field>
                            <div className="flex items-center gap-2 pt-2">
                                <Checkbox id="isClosed" checked={field.value} onCheckedChange={field.onChange} disabled={isPending} aria-invalid={fieldState.invalid} />
                                <FieldLabel htmlFor="isClosed" className="font-medium cursor-pointer">Mark as entirely closed</FieldLabel>
                            </div>
                            {fieldState.invalid && fieldState.error && <FieldError errors={[fieldState.error]} />}
                        </Field>
                    )} />
                </form>

                <DialogFooter>
                    <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isPending}>Cancel</Button>
                    <Button type="submit" form="override-form" disabled={isPending}>
                        {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        {isEditing ? "Save Changes" : "Add Exception"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}