"use client"

import * as React from "react"
import { useForm, Controller, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { PencilIcon, Loader2, AlertCircle } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

import {
    ClubResponse,
    UpdateOperatingHoursRequest,
    UpdateOperatingHoursRequestSchema,
    OperatingHourDto
} from "@/lib/api/schema/club.schema"
import { updateClubOperatingHoursAction } from "@/features/clubs/actions/club.actions"
import { useServerAction } from "@/hooks/useServerAction"
import { handleFormServerErrors } from "@/features/common/utils/form-errors"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Field, FieldError } from "@/components/ui/field"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

interface EditOperatingHoursModalProps {
    club: ClubResponse
    sortedHours: OperatingHourDto[]
}

export function EditOperatingHoursModal({ club, sortedHours }: EditOperatingHoursModalProps) {
    const [isOpen, setIsOpen] = React.useState(false)
    const router = useRouter()

    const form = useForm<UpdateOperatingHoursRequest>({
        resolver: zodResolver(UpdateOperatingHoursRequestSchema),
        defaultValues: {
            operatingHours: sortedHours.map(h => ({
                id: h.id || null,
                dayOfWeek: h.dayOfWeek,
                openingTime: h.openingTime || "06:00",
                closingTime: h.closingTime || "23:00",
                closed: h.closed
            }))
        }
    })

    const { fields } = useFieldArray({
        control: form.control,
        name: "operatingHours"
    })

    const { execute, isPending } = useServerAction(updateClubOperatingHoursAction, {
        onSuccess: () => {
            toast.success("Operating hours updated successfully!")
            setIsOpen(false)
            router.refresh()
        },
        onError: (error) => handleFormServerErrors(error, form.setError)
    })

    const onSubmit = form.handleSubmit((data) => {
        // Clean up empty strings to null for the API if closed
        const cleanedData = {
            operatingHours: data.operatingHours.map(h => ({
                ...h,
                openingTime: h.closed ? null : (h.openingTime || null),
                closingTime: h.closed ? null : (h.closingTime || null)
            }))
        }
        execute({ clubId: club.id.toString(), data: cleanedData })
    })

    const rootError = form.formState.errors.root?.message

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button size="sm" variant="outline">
                    <PencilIcon className="w-4 h-4 mr-2" /> Edit Hours
                </Button>
            </DialogTrigger>
            
            {/* Extended to max-w-2xl */}
            <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col p-0 overflow-hidden">
                <div className="px-6 pt-6 pb-4 shrink-0">
                    <DialogHeader>
                        <DialogTitle>Edit Weekly Operating Hours</DialogTitle>
                        <DialogDescription>Set the recurring weekly schedule for {club.name}.</DialogDescription>
                    </DialogHeader>

                    {rootError && (
                        <div className="rounded-md bg-destructive/10 border border-destructive/20 p-3 flex gap-2 mt-4">
                            <AlertCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                            <p className="text-xs text-destructive font-medium">{rootError}</p>
                        </div>
                    )}
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar min-h-0 px-6">
                    <form id="edit-hours-form" onSubmit={onSubmit} className="pb-2">
                        {/* Table Header */}
                        <div className="grid grid-cols-[100px_1fr_1fr_60px] sm:grid-cols-[120px_1fr_1fr_80px] gap-2 sm:gap-4 pb-2 text-xs sm:text-sm font-medium text-muted-foreground border-b sticky top-0 bg-popover z-10">
                            <div>Day</div>
                            <div>Opening Time</div>
                            <div>Closing Time</div>
                            <div className="text-center">Closed</div>
                        </div>

                        {/* Table Body */}
                        <div className="space-y-3 mt-4">
                            {fields.map((field, index) => {
                                const isClosed = form.watch(`operatingHours.${index}.closed`)
                                return (
                                    <div key={field.id} className="grid grid-cols-[100px_1fr_1fr_60px] sm:grid-cols-[120px_1fr_1fr_80px] gap-2 sm:gap-4 items-start">
                                        <div className="text-sm font-medium capitalize mt-2.5 break-words">
                                            {field.dayOfWeek.toLowerCase()}
                                        </div>

                                        <Controller
                                            name={`operatingHours.${index}.openingTime`}
                                            control={form.control}
                                            render={({ field: inputField, fieldState }) => (
                                                <Field>
                                                    <Input
                                                        type="time"
                                                        {...inputField}
                                                        value={inputField.value || ""}
                                                        disabled={isClosed || isPending}
                                                        aria-invalid={fieldState.invalid}
                                                        className="px-2"
                                                    />
                                                    {fieldState.invalid && fieldState.error && (
                                                        <FieldError errors={[fieldState.error]} />
                                                    )}
                                                </Field>
                                            )}
                                        />

                                        <Controller
                                            name={`operatingHours.${index}.closingTime`}
                                            control={form.control}
                                            render={({ field: inputField, fieldState }) => (
                                                <Field>
                                                    <Input
                                                        type="time"
                                                        {...inputField}
                                                        value={inputField.value || ""}
                                                        disabled={isClosed || isPending}
                                                        aria-invalid={fieldState.invalid}
                                                        className="px-2"
                                                    />
                                                    {fieldState.invalid && fieldState.error && (
                                                        <FieldError errors={[fieldState.error]} />
                                                    )}
                                                </Field>
                                            )}
                                        />

                                        <Controller
                                            name={`operatingHours.${index}.closed`}
                                            control={form.control}
                                            render={({ field: { value, onChange, name, onBlur, ref }, fieldState }) => (
                                                <Field>
                                                    <div className="flex justify-center mt-2.5">
                                                        <Checkbox
                                                            name={name}
                                                            onBlur={onBlur}
                                                            ref={ref}
                                                            checked={value}
                                                            onCheckedChange={onChange}
                                                            disabled={isPending}
                                                            aria-invalid={fieldState.invalid}
                                                        />
                                                    </div>
                                                    {fieldState.invalid && fieldState.error && (
                                                        <FieldError errors={[fieldState.error]} />
                                                    )}
                                                </Field>
                                            )}
                                        />
                                    </div>
                                )
                            })}
                        </div>
                    </form>
                </div>

                <div className="px-6 py-4 border-t bg-muted/20 shrink-0">
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isPending}>Cancel</Button>
                        <Button type="submit" form="edit-hours-form" disabled={isPending}>
                            {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            Save Changes
                        </Button>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    )
}