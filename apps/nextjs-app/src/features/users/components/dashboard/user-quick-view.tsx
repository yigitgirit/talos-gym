"use client";

import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import Link from "next/link";

import {
    UserResponse,
    UpdateUserRequestSchema,
    type UpdateUserRequest
} from "@/lib/api/schema";
import {
    updateUserAsync,
    banUserAsync,
    unbanUserAsync,
    changeUserStatusAsync
} from "@/features/users/actions/users.actions";
import { useServerAction } from "@/hooks/useServerAction";

import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger
} from "@/components/ui/drawer";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, Shield, MoreVertical, Ban, CheckCircle, Loader2, TrendingUpIcon } from "lucide-react";
import {useRouter} from "next/navigation";

interface UserQuickViewProps {
    user: UserResponse;
    children: React.ReactNode;
}

export function UserQuickView({ user, children }: UserQuickViewProps) {
    const router = useRouter();
    const isMobile = useIsMobile();
    const [isOpen, setIsOpen] = React.useState(false);

    // --- Form Setup ---
    const form = useForm<UpdateUserRequest>({
        resolver: zodResolver(UpdateUserRequestSchema),
        defaultValues: {
            firstName: user.firstName,
            lastName: user.lastName,
            gender: user.gender,
        },
    });

    React.useEffect(() => {
        if (isOpen) form.reset({
            firstName: user.firstName,
            lastName: user.lastName,
            gender: user.gender,
        });
    }, [isOpen, user, form]);

    // --- Server Actions ---
    const { execute: executeUpdate, isPending: isUpdating } = useServerAction(updateUserAsync, {
        onSuccess: () => {
            toast.success("User profile updated successfully");
            setIsOpen(false);
            router.refresh()
        }
    });

    const { execute: executeBan, isPending: isBanning } = useServerAction(banUserAsync, {
        onSuccess: () => toast.success("User banned successfully")
    });

    const { execute: executeUnban, isPending: isUnbanning } = useServerAction(unbanUserAsync, {
        onSuccess: () => toast.success("User unbanned successfully")
    });

    const { execute: executeStatus, isPending: isStatusChanging } = useServerAction(changeUserStatusAsync, {
        onSuccess: () => toast.success("User status updated")
    });

    const isAnyActionPending = isUpdating || isBanning || isUnbanning || isStatusChanging;

    // --- Submit Handler ---
    const onSubmit = form.handleSubmit((data) => {
        executeUpdate({
            id: user.id.toString(),
            data,
        });
    });

    const getStatusVariant = (status: string) => {
        if (status === 'ACTIVE') return 'default';
        if (status === 'BANNED') return 'destructive';
        if (status === 'PENDING') return 'outline';
        return 'secondary';
    };

    return (
        <Drawer open={isOpen} onOpenChange={setIsOpen} direction={isMobile ? "bottom" : "right"}>
            <DrawerTrigger asChild>
                {children}
            </DrawerTrigger>

            <DrawerContent className={isMobile ? "" : "w-full sm:max-w-md h-full max-h-screen rounded-l-xl rounded-r-none m-0"}>

                {/* Header matches ClubQuickView style */}
                <DrawerHeader className="gap-1">
                    <DrawerTitle className="flex items-center justify-between">
                        <Link
                            href={`/dashboard/users/${user.id}`}
                            className="hover:underline underline-offset-4 decoration-primary"
                        >
                            {user.firstName} {user.lastName}
                        </Link>
                        <div className="flex items-center gap-2">
                            <Badge variant={getStatusVariant(user.status)}>
                                {user.status}
                            </Badge>

                            {/* Quick Actions Dropdown */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-6 w-6" disabled={isAnyActionPending}>
                                        <MoreVertical className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-48">
                                    {user.status === 'BANNED' ? (
                                        <DropdownMenuItem onClick={() => executeUnban({ id: user.id.toString() })}>
                                            <CheckCircle className="h-4 w-4 mr-2 text-green-500" /> Unban User
                                        </DropdownMenuItem>
                                    ) : (
                                        <DropdownMenuItem
                                            className="text-destructive focus:text-destructive"
                                            onClick={() => executeBan({ id: user.id.toString(), data: { reason: "Admin quick ban" } })}
                                        >
                                            <Ban className="h-4 w-4 mr-2" /> Ban User
                                        </DropdownMenuItem>
                                    )}
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => executeStatus({ id: user.id.toString(), status: user.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' })}>
                                        Toggle Active/Inactive
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </DrawerTitle>
                    <DrawerDescription>
                        {user.email} • ID: {user.id}
                    </DrawerDescription>
                </DrawerHeader>

                <div className="flex flex-col gap-6 overflow-y-auto px-4 py-4 text-sm flex-1 custom-scrollbar">

                    {/* Read-Only Info Panel matching ClubQuickView style */}
                    <div className="grid gap-4">
                        <div className="flex items-start gap-3">
                            <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                            <div>
                                <p className="font-medium">Email Address</p>
                                <p className="text-muted-foreground">{user.email}</p>
                            </div>
                        </div>

                        <Separator/>

                        <div className="flex items-start gap-3">
                            <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                            <div>
                                <p className="font-medium">Phone Number</p>
                                <p className="text-muted-foreground">{user.phoneNumber || "Not provided"}</p>
                            </div>
                        </div>

                        <Separator/>

                        <div className="flex items-start gap-3">
                            <Shield className="h-5 w-5 text-muted-foreground mt-0.5" />
                            <div>
                                <p className="font-medium">Assigned Roles</p>
                                <div className="flex flex-wrap gap-1 mt-1">
                                    {user.roles.map(role => (
                                        <Badge key={role} variant="secondary" className="text-[10px] uppercase h-5">
                                            {role}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Edit Form contained within a styled block */}
                    <div className="bg-muted/50 rounded-lg p-4">
                        <h4 className="font-medium mb-4">Edit Profile</h4>
                        <form id={`edit-user-${user.id}`} onSubmit={onSubmit} className="grid gap-4">
                            <div className="grid grid-cols-2 gap-4">
                                <Controller
                                    name="firstName"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <div className="grid gap-2">
                                            <Label htmlFor="firstName">First Name</Label>
                                            <Input {...field} id="firstName" disabled={isAnyActionPending} className="bg-background" />
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
                                            <Input {...field} id="lastName" disabled={isAnyActionPending} className="bg-background" />
                                            {fieldState.error && <p className="text-[0.8rem] text-destructive">{fieldState.error.message}</p>}
                                        </div>
                                    )}
                                />
                            </div>

                            <Controller
                                name="gender"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <div className="grid gap-2">
                                        <Label htmlFor="gender">Gender</Label>
                                        <Select
                                            disabled={isAnyActionPending}
                                            value={field.value}
                                            onValueChange={field.onChange}
                                        >
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
                        </form>
                    </div>

                </div>

                {/* Footer matching ClubQuickView (Stacked) */}
                <DrawerFooter className="flex-col justify-between gap-2">
                    <Button
                        type="submit"
                        form={`edit-user-${user.id}`}
                        disabled={isAnyActionPending}
                    >
                        {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save Changes
                    </Button>
                    <DrawerClose asChild>
                        <Button variant="outline" disabled={isAnyActionPending}>
                            Close
                        </Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
}