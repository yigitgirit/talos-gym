"use client";

import {useState} from "react";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Badge} from "@/components/ui/badge";
import {Label} from "@/components/ui/label";
import {Separator} from "@/components/ui/separator";
import {ToggleGroup, ToggleGroupItem} from "@/components/ui/toggle-group";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import {CheckCircle2, ChevronLeft, ChevronRight} from "lucide-react";

// Mock data
const CITIES = ["Toronto", "Vancouver", "Montreal", "Calgary", "Edmonton"];

const CLUBS = [
    {id: 1, name: "FitHub Downtown", city: "Toronto", province: "Ontario", price: 49.99},
    {id: 2, name: "Elite Gym Studios", city: "Vancouver", province: "British Columbia", price: 54.99},
    {id: 3, name: "Wellness Spa & Fitness", city: "Montreal", province: "Quebec", price: 59.99},
    {id: 4, name: "CrossFit Arena", city: "Calgary", province: "Alberta", price: 44.99},
    {id: 5, name: "YogaFlow Studio", city: "Toronto", province: "Ontario", price: 39.99},
];

const MEMBERSHIP_PACKAGES = [
    {
        id: 1,
        name: "Starter",
        description: "Perfect for beginners",
        basePrice: 29.99,
        features: ["Basic workout tracking", "Access to 1 club", "Community features"],
    },
    {
        id: 2,
        name: "Pro",
        description: "For serious enthusiasts",
        basePrice: 59.99,
        features: ["Advanced tracking", "Unlimited club access", "Detailed analytics", "Priority support"],
        highlighted: true,
    },
    {
        id: 3,
        name: "Elite",
        description: "Premium experience",
        basePrice: 99.99,
        features: ["All Pro features", "Personal coach", "1-on-1 sessions", "VIP events"],
    },
];

const STEPS = [
    {id: 1, name: "Club Selection"},
    {id: 2, name: "Plan & Payment"},
    {id: 3, name: "Verification"},
];

type Step = 1 | 2 | 3;

interface StepOneData {
    city: string;
    club: (typeof CLUBS)[0] | null;
}

interface StepTwoData {
    membership: (typeof MEMBERSHIP_PACKAGES)[0] | null;
    billingType: "monthly" | "yearly";
    paymentOption: "advance" | "installment";
    promoCode: string;
}

// ============ Reusable Components ============

interface StepIndicatorProps {
    currentStep: Step;
    steps: typeof STEPS;
}

function StepIndicator({currentStep, steps}: StepIndicatorProps) {
    return (
        <div className="mb-12 flex justify-center">
            <div className="flex items-center justify-center gap-2 sm:gap-4">
                {steps.map((step, idx) => (
                    <div key={step.id} className="flex items-center gap-2 sm:gap-4">
                        {/* Step Circle */}
                        <div className="flex flex-col items-center gap-2 sm:gap-3">
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
                        {idx < steps.length - 1 && (
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
                ))}
            </div>
        </div>
    );
}

interface ClubSelectionStepProps {
    data: StepOneData;
    onDataChange: (data: StepOneData) => void;
    onNext: () => void;
}

function ClubSelectionStep({data, onDataChange, onNext}: ClubSelectionStepProps) {
    const filteredClubs = data.city
        ? CLUBS.filter((club) => club.city === data.city)
        : [];

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-2xl">Select Your Club</CardTitle>
                <p className="text-sm text-muted-foreground mt-2">
                    Choose your preferred city and gym location
                </p>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* City Selection */}
                <div className="space-y-3">
                    <Label className="text-base font-semibold">City</Label>
                    <Combobox
                        value={data.city || ""}
                        onValueChange={(value) => {
                            onDataChange({...data, city: value || "", club: null});
                        }}
                    >
                        <ComboboxInput
                            placeholder="Search and select city..."
                            disabled={false}
                            showTrigger={true}
                        />
                        <ComboboxContent>
                            <ComboboxList>
                                {CITIES.map((city) => (
                                    <ComboboxItem key={city} value={city}>
                                        {city}
                                    </ComboboxItem>
                                ))}
                            </ComboboxList>
                            <ComboboxEmpty>No cities found</ComboboxEmpty>
                        </ComboboxContent>
                    </Combobox>
                </div>

                {/* Club Selection */}
                {data.city && (
                    <div className="space-y-3">
                        <Label className="text-base font-semibold">
                            Available Clubs in {data.city}
                        </Label>
                        <Combobox
                            value={data.club?.name || ""}
                            onValueChange={(value) => {
                                const selected = filteredClubs.find((c) => c.name === value);
                                if (selected) {
                                    onDataChange({...data, club: selected});
                                }
                            }}
                        >
                            <ComboboxInput
                                placeholder="Search and select club..."
                                disabled={false}
                                showTrigger={true}
                            />
                            <ComboboxContent>
                                <ComboboxList>
                                    {filteredClubs.map((club) => (
                                        <ComboboxItem key={club.id} value={club.name}>
                                            <div>
                                                <p className="font-medium">{club.name}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    ${club.price}/month
                                                </p>
                                            </div>
                                        </ComboboxItem>
                                    ))}
                                </ComboboxList>
                                <ComboboxEmpty>No clubs available</ComboboxEmpty>
                            </ComboboxContent>
                        </Combobox>
                    </div>
                )}

                {/* Club Summary */}
                {data.club && (
                    <>
                        <Separator/>
                        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 space-y-2">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h3 className="font-semibold text-foreground">
                                        {data.club.name}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        {data.club.city}, {data.club.province}
                                    </p>
                                </div>
                                <Badge>Selected</Badge>
                            </div>
                            <div className="pt-2 border-t border-primary/20">
                                <p className="text-sm">
                                    <span className="text-muted-foreground">Club Fee: </span>
                                    <span className="font-semibold text-primary">
                    ${data.club.price}/month
                  </span>
                                </p>
                            </div>
                        </div>
                    </>
                )}

                {/* Navigation */}
                <div className="flex justify-end gap-3 pt-4">
                    <Button onClick={onNext} disabled={!data.club} className="gap-2">
                        Next <ChevronRight className="w-4 h-4"/>
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}

interface MembershipSelectionStepProps {
    clubPrice: number;
    stepTwoData: StepTwoData;
    onDataChange: (data: StepTwoData) => void;
    onNext: () => void;
    onBack: () => void;
}

function MembershipSelectionStep({
                                     clubPrice,
                                     stepTwoData,
                                     onDataChange,
                                     onNext,
                                     onBack,
                                 }: MembershipSelectionStepProps) {
    const calculatePrice = (basePrice: number) => {
        let price = basePrice + clubPrice;

        if (stepTwoData.billingType === "yearly") {
            price = (price * 12 * 0.9) / 12; // Show monthly equivalent
        }

        if (stepTwoData.billingType === "yearly" && stepTwoData.paymentOption === "installment") {
            price = price * 1.05;
        }

        return price.toFixed(2);
    };

    const calculateTotalPrice = () => {
        if (!stepTwoData.membership) return 0;

        let price = stepTwoData.membership.basePrice + clubPrice;

        if (stepTwoData.billingType === "yearly") {
            price = price * 12 * 0.9;
        }

        if (stepTwoData.billingType === "yearly" && stepTwoData.paymentOption === "installment") {
            price = price * 1.05;
        }

        return price.toFixed(2);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-2xl">Select Your Plan</CardTitle>
                <p className="text-sm text-muted-foreground mt-2">
                    Choose your membership package and billing preferences
                </p>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Billing Options at Top */}
                <div className="space-y-4">
                    <div>
                        <Label className="text-base font-semibold mb-3 block">
                            Billing Frequency
                        </Label>
                        <ToggleGroup
                            type="single"
                            value={stepTwoData.billingType}
                            onValueChange={(value) => {
                                if (value) {
                                    onDataChange({
                                        ...stepTwoData,
                                        billingType: value as "monthly" | "yearly",
                                    });
                                }
                            }}
                            className="justify-start gap-2"
                        >
                            <ToggleGroupItem
                                value="monthly"
                                aria-label="Monthly"
                                className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
                            >
                                <span>Monthly</span>
                            </ToggleGroupItem>
                            <ToggleGroupItem
                                value="yearly"
                                aria-label="Yearly"
                                className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
                            >
                                <span>Yearly</span>
                                <Badge variant="secondary" className="ml-2">
                                    Save 10%
                                </Badge>
                            </ToggleGroupItem>
                        </ToggleGroup>
                    </div>

                    {/* Payment Options - Only for Yearly */}
                    {stepTwoData.billingType === "yearly" && (
                        <div>
                            <Label className="text-base font-semibold mb-3 block">
                                Payment Method
                            </Label>
                            <ToggleGroup
                                type="single"
                                value={stepTwoData.paymentOption}
                                onValueChange={(value) => {
                                    if (value) {
                                        onDataChange({
                                            ...stepTwoData,
                                            paymentOption: value as "advance" | "installment",
                                        });
                                    }
                                }}
                                className="justify-start gap-2"
                            >
                                <ToggleGroupItem
                                    value="advance"
                                    aria-label="Pay Upfront"
                                    className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
                                >
                                    <span>Pay Upfront</span>
                                </ToggleGroupItem>
                                <ToggleGroupItem
                                    value="installment"
                                    aria-label="Installments"
                                    className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
                                >
                                    <span>Installments</span>
                                    <Badge variant="secondary" className="ml-2">
                                        +5% fee
                                    </Badge>
                                </ToggleGroupItem>
                            </ToggleGroup>
                        </div>
                    )}
                </div>

                <Separator/>

                {/* Membership Packages */}
                <div className="space-y-3">
                    <Label className="text-base font-semibold">Membership Package</Label>
                    <div className="grid md:grid-cols-3 gap-4">
                        {MEMBERSHIP_PACKAGES.map((pkg) => (
                            <Card
                                key={pkg.id}
                                className={`cursor-pointer transition-all duration-300 hover:shadow-md ${
                                    stepTwoData.membership?.id === pkg.id
                                        ? "ring-2 ring-primary border-primary"
                                        : "hover:border-primary/50"
                                } ${pkg.highlighted ? "md:scale-105" : ""}`}
                                onClick={() =>
                                    onDataChange({...stepTwoData, membership: pkg})
                                }
                            >
                                <CardHeader>
                                    {pkg.highlighted && (
                                        <Badge className="w-fit mb-2">Most Popular</Badge>
                                    )}
                                    <CardTitle className="text-lg">{pkg.name}</CardTitle>
                                    <p className="text-xs text-muted-foreground">
                                        {pkg.description}
                                    </p>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="transition-all duration-300">
                                        <p className="text-2xl font-bold text-primary">
                                            ${calculatePrice(pkg.basePrice)}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {stepTwoData.billingType === "monthly" ? "per month" : "per month (yearly equivalent)"}
                                        </p>
                                    </div>
                                    <ul className="space-y-2">
                                        {pkg.features.map((feature, idx) => (
                                            <li
                                                key={idx}
                                                className="text-xs text-muted-foreground flex gap-2"
                                            >
                                                <span className="text-primary">✓</span>
                                                <span>{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                <Separator/>

                {/* Promo Code */}
                <div className="space-y-3">
                    <Label htmlFor="promo" className="text-base font-semibold">
                        Promo Code (Optional)
                    </Label>
                    <div className="flex gap-2">
                        <Input
                            id="promo"
                            placeholder="Enter promo code"
                            value={stepTwoData.promoCode}
                            onChange={(e) =>
                                onDataChange({...stepTwoData, promoCode: e.target.value})
                            }
                        />
                        <Button variant="outline">Apply</Button>
                    </div>
                </div>

                {/* Price Summary */}
                <div
                    className="bg-primary/5 border border-primary/20 rounded-lg p-4 space-y-3 transition-all duration-300">
                    <h3 className="font-semibold">Price Summary</h3>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Membership:</span>
                            <span>${stepTwoData.membership?.basePrice || 0}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Club Fee:</span>
                            <span>${clubPrice}/month</span>
                        </div>
                        {stepTwoData.billingType === "yearly" && (
                            <div className="flex justify-between text-primary">
                                <span>Yearly Discount (10%):</span>
                                <span>-{((stepTwoData.membership?.basePrice || 0 + clubPrice) * 12 * 0.1).toFixed(2)}</span>
                            </div>
                        )}
                        {stepTwoData.billingType === "yearly" && stepTwoData.paymentOption === "installment" && (
                            <div className="flex justify-between text-warning">
                                <span>Installment Fee (5%):</span>
                                <span>+{(((stepTwoData.membership?.basePrice || 0 + clubPrice) * 12 * 0.9) * 0.05).toFixed(2)}</span>
                            </div>
                        )}
                    </div>
                    <Separator/>
                    <div className="flex justify-between font-semibold text-lg transition-all duration-300">
                        <span>Total:</span>
                        <span className="text-primary">${calculateTotalPrice()}</span>
                        <span className="text-sm text-muted-foreground">
              {stepTwoData.billingType === "monthly" ? "/month" : "/year"}
            </span>
                    </div>
                </div>

                {/* Navigation */}
                <div className="flex justify-between gap-3 pt-4">
                    <Button variant="outline" onClick={onBack} className="gap-2">
                        <ChevronLeft className="w-4 h-4"/>
                        Back
                    </Button>
                    <Button
                        onClick={onNext}
                        disabled={!stepTwoData.membership}
                        className="gap-2"
                    >
                        Next <ChevronRight className="w-4 h-4"/>
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}

interface PhoneVerificationStepProps {
    phone: string;
    phoneError: string;
    onPhoneChange: (phone: string) => void;
    onSendCode: () => void;
    onBack: () => void;
}

function PhoneVerificationStep({
                                   phone,
                                   phoneError,
                                   onPhoneChange,
                                   onSendCode,
                                   onBack,
                               }: PhoneVerificationStepProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-2xl">Verify Your Phone</CardTitle>
                <p className="text-sm text-muted-foreground mt-2">
                    We&apos;ll send a verification code to confirm your phone number
                </p>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-3">
                    <Label className="text-base font-semibold">
                        Phone Number with Country Code
                    </Label>
                    <div className="flex gap-2">
                        <select
                            className="w-24 px-3 py-2 rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50">
                            <option>+1</option>
                            <option>+44</option>
                            <option>+91</option>
                            <option>+86</option>
                            <option>+33</option>
                        </select>
                        <Input
                            placeholder="(555) 123-4567"
                            value={phone}
                            onChange={(e) => onPhoneChange(e.target.value)}
                            className="flex-1"
                        />
                    </div>
                    {phoneError && (
                        <p className="text-xs text-destructive flex items-center gap-1">
                            ⚠️ {phoneError}
                        </p>
                    )}
                </div>

                <div className="rounded-lg border border-primary/25 bg-primary/10 p-4">
                    <p className="text-sm text-primary">
                        ℹ️ You&apos;ll receive a 6-digit verification code via SMS. This helps us secure your account.
                    </p>
                </div>

                <Button
                    className="w-full"
                    onClick={onSendCode}
                    disabled={!phone}
                    size="lg"
                >
                    Send Verification Code
                </Button>

                {/* Navigation */}
                <div className="flex justify-between gap-3 pt-4">
                    <Button variant="outline" onClick={onBack} className="gap-2">
                        <ChevronLeft className="w-4 h-4"/>
                        Back
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}

// ============ Main Page Component ============

export default function GetStartedPage() {
    const [step, setStep] = useState<Step>(1);
    const [stepOneData, setStepOneData] = useState<StepOneData>({
        city: "",
        club: null,
    });
    const [stepTwoData, setStepTwoData] = useState<StepTwoData>({
        membership: null,
        billingType: "monthly",
        paymentOption: "advance",
        promoCode: "",
    });
    const [phone, setPhone] = useState("");
    const [phoneError, setPhoneError] = useState("");

    const handleNextStep = () => {
        if (step === 1) {
            if (!stepOneData.city || !stepOneData.club) {
                return;
            }
            setStep(2);
        } else if (step === 2) {
            if (!stepTwoData.membership) {
                return;
            }
            setStep(3);
        }
        // Scroll to top
        window.scrollTo({top: 0, behavior: "smooth"});
    };

    const handleBackStep = () => {
        if (step > 1) {
            setStep((step - 1) as Step);
        }
        // Scroll to top
        window.scrollTo({top: 0, behavior: "smooth"});
    };

    const handlePhoneChange = (value: string) => {
        setPhone(value);
        setPhoneError("");
    };

    const handleSendCode = () => {
        if (!phone) {
            setPhoneError("Phone number is required");
            return;
        }
        console.log("Sending code to:", phone);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background pt-20 pb-12">
            <div className="container max-w-5xl mx-auto px-4">
                {/* Step Indicator */}
                <StepIndicator currentStep={step} steps={STEPS}/>

                {/* Step 1 */}
                {step === 1 && (
                    <div className="animate-in fade-in duration-500">
                        <ClubSelectionStep
                            data={stepOneData}
                            onDataChange={setStepOneData}
                            onNext={handleNextStep}
                        />
                    </div>
                )}

                {/* Step 2 */}
                {step === 2 && (
                    <div className="animate-in fade-in duration-500">
                        <MembershipSelectionStep
                            clubPrice={stepOneData.club?.price || 0}
                            stepTwoData={stepTwoData}
                            onDataChange={setStepTwoData}
                            onNext={handleNextStep}
                            onBack={handleBackStep}
                        />
                    </div>
                )}

                {/* Step 3 */}
                {step === 3 && (
                    <div className="animate-in fade-in duration-500">
                        <PhoneVerificationStep
                            phone={phone}
                            phoneError={phoneError}
                            onPhoneChange={handlePhoneChange}
                            onSendCode={handleSendCode}
                            onBack={handleBackStep}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
