"use client"

import { zodResolver } from '@hookform/resolvers/zod'
import {useForm, Controller, useFieldArray} from 'react-hook-form'
import {AlertCircle, ImageIcon, Loader2, Plus, Trash2} from 'lucide-react'
import { toast } from "sonner"
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {ClubCreateRequest, ClubCreateRequestSchema} from '@/lib/api/schema/club.schema'
import { createClubAction } from '@/features/clubs/actions/club.actions'
import { useServerAction } from '@/hooks/useServerAction'
import { handleFormServerErrors } from '@/features/common/utils/form-errors'
import {Textarea} from "@/components/ui/textarea"
import {Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

const TIME_ZONES = ['America/New_York', 'America/Chicago', 'Europe/London', 'Europe/Paris', 'Asia/Tokyo']
const LOCATION_PROVIDERS = ['GOOGLE_MAPS', 'MAPBOX', 'LOCATION_IQ', 'OSM', 'OTHER']

export function CreateClubForm() {
    const router = useRouter()
    const form = useForm<ClubCreateRequest>({
        resolver: zodResolver(ClubCreateRequestSchema),
        mode: 'onBlur',
        defaultValues: {
            name: '',
            slug: undefined,
            address: { provider: 'LOCATION_IQ' },
            timeZone: '',
            description: undefined,
            photoUrls: [],
            scoreMultiplier: 1.0,
        },
    })

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "photoUrls" as never
    })

    const { execute, isPending } = useServerAction(createClubAction, {
        onSuccess: () => {
            toast.success('Club created successfully!')
            router.push('/dashboard/clubs')
        },
        onError: (error) => handleFormServerErrors(error, form.setError),
    })

    const onSubmit = form.handleSubmit((data) => {
        execute(data)
    })

    const rootError = form.formState.errors.root?.message

    return (
        <Card>
            <CardHeader>
                <CardTitle>Create New Club</CardTitle>
                <CardDescription>
                    Add a new gym club location to the system.
                </CardDescription>
            </CardHeader>
            <CardContent>
                {rootError && (
                    <div className="mb-4 rounded-md bg-destructive/10 border border-destructive/20 p-3 flex gap-2">
                        <AlertCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                        <p className="text-xs text-destructive font-medium">{rootError}</p>
                    </div>
                )}

            <form id="create-club-form" onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Controller
                        name="name"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field>
                                <FieldLabel htmlFor="name">Club Name</FieldLabel>
                                <Input {...field} id="name" placeholder="Downtown Gym" disabled={isPending} />
                                {fieldState.error && <FieldError errors={[fieldState.error]} />}
                            </Field>
                        )}
                    />

                <Controller
                    name="slug"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field>
                            <FieldLabel htmlFor="slug">
                                Slug <span className="text-muted-foreground font-normal">(optional)</span>
                            </FieldLabel>
                            <Input {...field} id="slug" placeholder="downtown-gym" value={field.value ?? ''} disabled={isPending} />
                            {fieldState.error && <FieldError errors={[fieldState.error]} />}
                        </Field>
                    )}
                />

                <div className="md:col-span-2">
                    <Controller
                        name="description"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field>
                                <FieldLabel htmlFor="description">
                                    Description <span className="text-muted-foreground font-normal">(optional)</span>
                                </FieldLabel>
                                <Textarea
                                    {...field}
                                    id="description"
                                    placeholder="Tell us about the facilities..."
                                    className="min-h-25 resize-none"
                                    value={field.value ?? ''}
                                    disabled={isPending}
                                />
                                {fieldState.error && <FieldError errors={[fieldState.error]} />}
                            </Field>
                        )}
                    />
                </div>

                <div className="grid gap-3 md:col-span-2">
                        <div className="flex items-center justify-between">
                            <FieldLabel className="font-semibold flex items-center gap-2">
                                <ImageIcon className="w-4 h-4" /> Club Photos
                            </FieldLabel>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="h-7 px-2 text-xs"
                                onClick={() => append("")}
                                disabled={fields.length >= 10 || isPending}
                            >
                                <Plus className="w-3 h-3 mr-1" /> Add URL
                            </Button>
                        </div>

                        <div className="grid gap-2 max-h-56 overflow-y-auto overflow-x-hidden pr-2 custom-scrollbar">
                            {fields.map((item, index) => (
                                <div key={item.id} className="flex gap-2">
                                    <div className="flex-1">
                                        <Controller
                                            name={`photoUrls.${index}`}
                                            control={form.control}
                                            render={({ field: inputField, fieldState }) => (
                                                <Field>
                                                    <Input
                                                        {...inputField}
                                                        placeholder="https://image-url.com/photo.jpg"
                                                        disabled={isPending}
                                                        className="h-8 text-sm"
                                                    />
                                                    {fieldState.error && <FieldError errors={[fieldState.error]} />}
                                                </Field>
                                            )}
                                        />
                                    </div>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-muted-foreground hover:text-destructive shrink-0"
                                        onClick={() => remove(index)}
                                        disabled={isPending}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            ))}
                            {fields.length === 0 && (
                                <p className="text-xs text-muted-foreground italic bg-muted/30 p-3 rounded-md text-center border border-dashed">
                                    No photos added yet.
                                </p>
                            )}
                        </div>
                    </div>

                <Controller
                    name="address.provider"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field>
                            <FieldLabel htmlFor="provider">Provider</FieldLabel>
                            <Select disabled={isPending} value={field.value} onValueChange={field.onChange}>
                                <SelectTrigger id="provider">
                                    <SelectValue placeholder="Select a provider" />
                                </SelectTrigger>
                                <SelectContent>
                                    {LOCATION_PROVIDERS.map(p => <SelectItem key={p} value={p}>{p.replace('_', ' ')}</SelectItem>)}
                                </SelectContent>
                            </Select>
                            {fieldState.error && <FieldError errors={[fieldState.error]} />}
                        </Field>
                    )}
                />

                <Controller
                    name="address.externalLocationId"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field>
                            <FieldLabel htmlFor="locationId">External Location ID</FieldLabel>
                            <Input {...field} id="locationId" placeholder="abc-123" disabled={isPending} />
                            {fieldState.error && <FieldError errors={[fieldState.error]} />}
                        </Field>
                    )}
                />

                <Controller
                    name="timeZone"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field>
                            <FieldLabel htmlFor="timezone">Timezone</FieldLabel>
                            <Select disabled={isPending} value={field.value} onValueChange={field.onChange}>
                                <SelectTrigger id="timezone">
                                    <SelectValue placeholder="Select timezone" />
                                </SelectTrigger>
                                <SelectContent>
                                    {TIME_ZONES.map(tz => <SelectItem key={tz} value={tz}>{tz}</SelectItem>)}
                                </SelectContent>
                            </Select>
                            {fieldState.error && <FieldError errors={[fieldState.error]} />}
                        </Field>
                    )}
                />

                <Controller
                    name="scoreMultiplier"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field>
                            <FieldLabel htmlFor="multiplier">Multiplier</FieldLabel>
                            <Input
                                {...field}
                                type="number"
                                step="0.1"
                                id="multiplier"
                                disabled={isPending}
                                onChange={(e) => field.onChange(parseFloat(e.target.value) || 1)}
                            />
                            {fieldState.error && <FieldError errors={[fieldState.error]} />}
                        </Field>
                    )}
                />
                </form>
            </CardContent>
            <CardFooter className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => router.push('/dashboard/clubs')} disabled={isPending}>
                    Cancel
                </Button>
                <Button type="submit" form="create-club-form" disabled={isPending}>
                    {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Create Club
                </Button>
            </CardFooter>
        </Card>
    )
}