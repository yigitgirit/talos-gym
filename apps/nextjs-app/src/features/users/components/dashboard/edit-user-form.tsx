"use client";

import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { UserResponse, UpdateUserRequestSchema, type UpdateUserRequest } from "@/lib/api/schema";
import { updateUserAsync } from "@/features/users/actions/users.actions";
import { useServerAction } from "@/hooks/useServerAction";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface EditUserFormProps {
    user: UserResponse;
    onSuccess?: () => void;
    onCancel?: () => void;
}

export function EditUserForm({ user, onSuccess, onCancel }: EditUserFormProps) {
    const router = useRouter();

    const form = useForm<UpdateUserRequest>({
        resolver: zodResolver(UpdateUserRequestSchema),
        defaultValues: {
            firstName: user.firstName,
            lastName: user.lastName,
            gender: user.gender,
        },
    });

    const { execute, isPending } = useServerAction(updateUserAsync, {
        onSuccess: () => {
            toast.success("User profile updated successfully");
            router.refresh();
            onSuccess?.();
        }
    });

    const onSubmit = form.handleSubmit((data) => {
        execute({ id: user.id.toString(), data });
    });

    return (
        <form onSubmit={onSubmit} className="flex flex-col gap-4 h-full">
            <div className="grid gap-4">
                <Controller
                    name="firstName"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <div className="grid gap-2">
                            <Label htmlFor="firstName">First Name</Label>
                            <Input {...field} id="firstName" disabled={isPending} className="bg-background" />
                            {fieldState.error && <p className="text-[0.8rem] text-destructive">{fieldState.error.message}</p>}
                        </div>
                    )}
                />

                <Controller
                    name="lastName"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <div className="grid gap-2">
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input {...field} id="lastName" disabled={isPending} className="bg-background" />
                            {fieldState.error && <p className="text-[0.8rem] text-destructive">{fieldState.error.message}</p>}
                        </div>
                    )}
                />

                <Controller
                    name="gender"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <div className="grid gap-2">
                            <Label htmlFor="gender">Gender</Label>
                            <Select disabled={isPending} value={field.value} onValueChange={field.onChange}>
                                <SelectTrigger id="gender" className="bg-background">
                                    <SelectValue placeholder="Select gender" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="NOT_SPECIFIED">Not Specified</SelectItem>
                                    <SelectItem value="MALE">Male</SelectItem>
                                    <SelectItem value="FEMALE">Female</SelectItem>
                                    <SelectItem value="EITHER">Either</SelectItem>
                                </SelectContent>
                            </Select>
                            {fieldState.error && <p className="text-[0.8rem] text-destructive">{fieldState.error.message}</p>}
                        </div>
                    )}
                />
            </div>

            {/* Form Actions */}
            <div className="flex gap-2 pt-4 mt-auto border-t">
                {onCancel && (
                    <Button type="button" variant="outline" className="flex-1" onClick={onCancel} disabled={isPending}>
                        Cancel
                    </Button>
                )}
                <Button type="submit" className="flex-1" disabled={isPending}>
                    {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Changes
                </Button>
            </div>
        </form>
    );
}