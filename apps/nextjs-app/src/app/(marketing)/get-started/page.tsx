"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Suspense, useEffect } from "react";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { useOnboardingStore } from "../../../components/layout/onboarding/store";

import { Step1ClubDiscovery } from "../../../components/layout/onboarding/step-1-club-discovery";
import { Step2PlanSelection } from "../../../components/layout/onboarding/step-2-plan-selection";
import { Step3Checkout } from "../../../components/layout/onboarding/step-3-checkout";

const STEPS = [
    {id: 1, name: "Club Selection"},
    {id: 2, name: "Plan & Billing"},
    {id: 3, name: "Checkout"},
];

interface StepIndicatorProps {
    currentStep: number;
    onStepClick: (stepId: number) => void;
    canAccessStep: (stepId: number) => boolean;
}

function StepIndicator({ currentStep, onStepClick, canAccessStep }: StepIndicatorProps) {
    return (
        <div className="mb-12 flex justify-center">
            <div className="flex items-center justify-center gap-2 sm:gap-4">
                {STEPS.map((step, idx) => {
                    const isClickable = canAccessStep(step.id) && step.id !== currentStep;
                    
                    return (
                        <div key={step.id} className="flex items-center gap-2 sm:gap-4">
                            {/* Step Circle */}
                            <div 
                                className={`flex flex-col items-center gap-2 sm:gap-3 ${isClickable ? 'cursor-pointer hover:opacity-80' : ''}`}
                                onClick={() => isClickable && onStepClick(step.id)}
                            >
                                <div
                                    className={`flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full font-semibold text-sm transition-all duration-500 ${
                                        step.id < currentStep
                                            ? "bg-primary text-primary-foreground scale-110"
                                            : step.id === currentStep
                                                ? "bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2"
                                                : "bg-muted text-muted-foreground ring-2 ring-muted-foreground ring-offset-2"
                                    }`}
                                >
                                    {step.id < currentStep ? (
                                        <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6"/>
                                    ) : (
                                        step.id
                                    )}
                                </div>
                                <p
                                    className={`text-xs sm:text-sm font-semibold text-center transition-all duration-500 ${
                                        step.id <= currentStep
                                            ? "text-foreground"
                                            : "text-muted-foreground"
                                    }`}
                                >
                                    {step.name}
                                </p>
                            </div>

                            {/* Arrow Connector */}
                            {idx < STEPS.length - 1 && (
                                <div className="flex items-center justify-center px-1 sm:px-2">
                                    <div
                                        className={`transition-all duration-500 text-lg sm:text-2xl ${
                                            step.id < currentStep ? "text-primary" : "text-muted-foreground"
                                        }`}
                                    >
                                        →
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

function OnboardingContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { user, isLoading } = useAuth();
    
    // Get store state to determine which steps are accessible
    const { clubId, offerId, subscriptionTypeId } = useOnboardingStore();
    
    const stepParam = searchParams?.get("step");
    const step = stepParam ? parseInt(stepParam, 10) : 1;

    // Authentication Guard
    useEffect(() => {
        if (!isLoading && !user) {
            router.replace('/auth/login?callbackUrl=' + encodeURIComponent('/get-started'));
        }
    }, [user, isLoading, router]);

    const canAccessStep = (stepId: number) => {
        if (stepId === 1) return true;
        if (stepId === 2) return !!clubId;
        if (stepId === 3) return !!clubId && !!offerId && !!subscriptionTypeId;
        return false;
    };

    const handleStepClick = (stepId: number) => {
        router.push(`?step=${stepId}`);
    };

    if (isLoading || !user) {
        return (
            <div className="flex items-center justify-center h-[50vh]">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="container max-w-5xl mx-auto px-4">
            <StepIndicator 
                currentStep={step} 
                onStepClick={handleStepClick}
                canAccessStep={canAccessStep}
            />

            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                {step === 1 && <Step1ClubDiscovery />}
                {step === 2 && <Step2PlanSelection />}
                {step === 3 && <Step3Checkout />}
            </div>
        </div>
    );
}

export default function GetStartedPage() {
    return (
        <div className="min-h-screen bg-linear-to-b from-primary/5 to-background pt-20 pb-12">
            <Suspense fallback={<div className="h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>}>
                <OnboardingContent />
            </Suspense>
        </div>
    );
}
