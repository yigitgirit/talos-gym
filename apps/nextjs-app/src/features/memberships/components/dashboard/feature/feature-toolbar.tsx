"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";

import { ToolbarLayout } from "@/components/layout/dashboard/toolbar-layout";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { CreateFeatureForm } from "./create-feature-form";

export function FeatureToolbar() {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <ToolbarLayout
            filters={null} // Add search/filters here later if needed
            actions={
                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogTrigger asChild>
                        <Button className="h-9">
                            <Plus className="mr-2 h-4 w-4" /> Add Feature
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Create New Feature</DialogTitle>
                            <DialogDescription>
                                Add a new perk or amenity to your Talos Gym library.
                            </DialogDescription>
                        </DialogHeader>

                        <CreateFeatureForm setOpen={setIsOpen} />
                    </DialogContent>
                </Dialog>
            }
        />
    );
}