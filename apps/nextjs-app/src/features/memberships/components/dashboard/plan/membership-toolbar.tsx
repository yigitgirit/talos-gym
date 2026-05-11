"use client";

import { useState } from "react";
import { ToolbarLayout } from "@/components/layout/dashboard/toolbar-layout";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
    Sheet,
    SheetContent,
    SheetDescription, SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"; // Changed from dialog to sheet
import { CreatePlanForm } from "./create-plan-form";
import { FeatureResponse } from "@/lib/api/schema";
import {useRouter} from "next/navigation";

type MembershipToolbarProps = {
    features: FeatureResponse[];
};

/**
 * Toolbar used on the Membership Management page.
 * Triggers a Side Sheet to create a new membership plan.
 */
export function MembershipToolbar({ features }: MembershipToolbarProps) {
    const [isSheetOpen, setIsSheetOpen] = useState(false);

    return (
        <ToolbarLayout
            filters={null}
            actions={
                <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                    <SheetTrigger asChild>
                        <Button className="h-9">
                            <Plus className="mr-2 h-4 w-4" /> Create Plan
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="w-full sm:max-w-md flex flex-col p-0">
                        <SheetHeader className="p-6 border-b">
                            <SheetTitle>Create Membership Plan</SheetTitle>
                            <SheetDescription>
                                Define a new membership tier and assign features to it.
                            </SheetDescription>
                        </SheetHeader>

                        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                            <CreatePlanForm features={features} />
                        </div>

                        <SheetFooter className="p-6 border-t">
                            <Button
                                type="submit"
                                form="create-plan-form"
                            >
                                Create Membership Plan
                            </Button>
                        </SheetFooter>
                    </SheetContent>
                </Sheet>
            }
        />
    );
}