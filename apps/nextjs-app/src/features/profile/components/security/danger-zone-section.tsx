"use client"

import {useState} from "react"
import {toast} from "sonner"
import {deleteProfileAsync} from "@/features/profile/actions/profile.actions"
import {useServerAction} from "@/hooks/useServerAction"

import {Button} from "@/components/ui/button"
import {AlertCircle, Loader2, Trash2Icon} from "lucide-react"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogMedia,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export function DangerZoneSection() {
    const [isOpen, setIsOpen] = useState(false)

    const {execute, isPending, error} = useServerAction(deleteProfileAsync, {
        onSuccess: () => {
            toast.success("Your account has been deleted.")
            // Usually, layout redirection or auth interceptors will take them to login automatically,
            // or you can do window.location.href = '/auth/login'
            globalThis.location.href = '/'
        },
        showGlobalError: false,
    })

    const handleDelete = (e: React.MouseEvent) => {
        e.preventDefault() // Prevent alert dialog from auto-closing immediately
        execute()
    }

    return (
        <div className="w-full space-y-4">
            <div className="mb-6 border-b pb-4">
                <h2 className="font-heading font-semibold text-base text-destructive">
                    Danger Zone
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                    Once you delete your account, there is no going back. Please be certain.
                </p>
            </div>

            {error && (
                <div className="rounded bg-destructive/10 border border-destructive/20 p-2.5 flex gap-2">
                    <AlertCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5"/>
                    <p className="text-xs text-destructive">{error.message}</p>
                </div>
            )}

            <div className="space-y-4">
                <p className="text-xs text-muted-foreground">
                    This will permanently delete your profile, workout history, and personal data from our servers.
                </p>

                <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
                    <AlertDialogTrigger asChild>
                        <Button
                            variant="destructive"
                            className="h-8 text-sm flex items-center justify-center gap-1.5"
                        >
                            Delete Account
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogMedia
                                className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
                                <Trash2Icon/>
                            </AlertDialogMedia>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete your
                                account!
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={handleDelete}
                                variant="destructive"
                                disabled={isPending}
                            >
                                {isPending && <Loader2 className="w-4 h-4 animate-spin mr-2"/>}
                                {isPending ? "Deleting..." : "Yes, delete my account"}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </div>
    )
}