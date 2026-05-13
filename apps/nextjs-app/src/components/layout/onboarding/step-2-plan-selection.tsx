"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useServerAction } from '@/hooks/useServerAction';
import { getClubOffersAction } from '@/features/clubs/actions/club.actions';
import { useOnboardingStore } from './store';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {ChevronLeft, Loader2, CheckCircle2, Check} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { FeatureResponse, OfferCatalogResponse, PaymentOptionDto } from "@/lib/api/schema";
import { ButtonGroup } from '@/components/ui/button-group';
import { cn } from '@/lib/utils';

// --- Types ---

type BillingCycle = 'MONTHLY' | 'YEARLY';
type PaymentMethod = 'INSTALLMENTS' | 'PREPAID';

// --- Sub-components ---

interface BillingTogglesProps {
  billingCycle: BillingCycle;
  setBillingCycle: (cycle: BillingCycle) => void;
  paymentMethod: PaymentMethod;
  setPaymentMethod: (method: PaymentMethod) => void;
  maxSavings: number;
}

function BillingToggles({
                          billingCycle,
                          setBillingCycle,
                          paymentMethod,
                          setPaymentMethod,
                          maxSavings
                        }: BillingTogglesProps) {
  return (
      <div className="flex flex-col items-center gap-4 py-4 animate-in fade-in slide-in-from-top-4">
        {/* 1. Use a standard Tailwind width like max-w-[280px] or max-w-xs.
          2. w-full ensures it scales down on mobile.
      */}
        <ButtonGroup className="w-full max-w-[200px] flex">
          <Button
              variant={billingCycle === 'MONTHLY' ? 'default' : 'outline'}
              onClick={() => setBillingCycle('MONTHLY')}
              className="flex-1 rounded-r-none h-10" // flex-1 makes them identical width
          >
            Monthly
          </Button>
          <Button
              variant={billingCycle === 'YEARLY' ? 'default' : 'outline'}
              onClick={() => setBillingCycle('YEARLY')}
              className="flex-1 rounded-l-none h-10 flex items-center justify-center gap-2"
          >
            Yearly
            {maxSavings > 0 && (
                <span className={cn(
                    "text-[10px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider whitespace-nowrap",
                    billingCycle === 'YEARLY'
                        ? "bg-emerald-500 text-white"
                        : "bg-emerald-100 text-emerald-700"
                )}>
              -{maxSavings}%
            </span>
            )}
          </Button>
        </ButtonGroup>

        {/* Sub-toggle logic */}
        <div className="h-8"> {/* Fixed height prevents layout shift when this appears */}
          {billingCycle === 'YEARLY' && (
              <div className="animate-in fade-in zoom-in-95 duration-200 flex items-center justify-center gap-1">
                <Button
                    variant="link"
                    onClick={() => setPaymentMethod('PREPAID')}
                    className={cn(
                        "h-8 px-2 transition-all text-sm decoration-2",
                        paymentMethod === 'PREPAID'
                            ? "font-bold text-primary underline underline-offset-8"
                            : "text-muted-foreground font-normal no-underline hover:text-foreground"
                    )}
                >
                  Upfront
                </Button>
                <span className="text-muted-foreground/30 select-none">|</span>
                <Button
                    variant="link"
                    onClick={() => setPaymentMethod('INSTALLMENTS')}
                    className={cn(
                        "h-8 px-2 transition-all text-sm decoration-2",
                        paymentMethod === 'INSTALLMENTS'
                            ? "font-bold text-primary underline underline-offset-8"
                            : "text-muted-foreground font-normal no-underline hover:text-foreground"
                    )}
                >
                  Installments
                </Button>
              </div>
          )}
        </div>
      </div>
  );
}

function GlobalPlanBadge() {
  return (
    <div className="absolute top-0 right-0 bg-blue-500 text-white text-[10px] px-2 py-0.5 rounded-bl-lg font-bold uppercase tracking-widest shadow-sm">
      Best Value
    </div>
  );
}

function PlanHeader({ name }: { name: string }) {
  return (
    <div className="text-center pb-2 pt-8 px-4">
      <h3 className="text-xl font-semibold uppercase tracking-wide text-foreground/90">
        {name}
      </h3>
    </div>
  );
}

function PlanPriceArea({ matchedOption, billingCycle }: { matchedOption?: PaymentOptionDto, billingCycle: BillingCycle }) {
  const formatPrice = (price: number | undefined) => {
    if (price === undefined) return { int: "0", dec: "" };
    if (price % 1 === 0) return { int: price.toString(), dec: "" };
    
    const formatted = price.toFixed(2);
    const [int, dec] = formatted.split(".");
    return { int, dec };
  };

  if (!matchedOption) {
    return (
      <div className="min-h-20 flex flex-col items-center justify-center">
        <div className="text-muted-foreground text-xs flex items-center justify-center h-full italic bg-muted/30 w-full rounded-md py-3">
          Not available for this payment cycle
        </div>
      </div>
    );
  }

  const { int: monthlyInt, dec: monthlyDec } = formatPrice(matchedOption.monthlyPrice);

  return (
    <div className="min-h-20 flex flex-col items-center justify-center">
      <div className="flex items-start justify-center gap-1">
        <span className="text-3xl font-extrabold tracking-tight text-foreground">
          {monthlyInt}
        </span>
        {monthlyDec && (
          <div className="flex flex-col items-start justify-end pb-1">
            <span className="text-base font-bold text-muted-foreground">
              .{monthlyDec}
            </span>
          </div>
        )}
        <span className="text-2xl font-semibold text-foreground/80 mt-1 ml-0.2">₺</span>
        <span className="text-sm font-medium text-muted-foreground self-end pb-1.5 ml-1">/month</span>
      </div>
      
      {matchedOption.marketingBadge && (
        <Badge className="mt-2 bg-emerald-500/15 text-emerald-700 hover:bg-emerald-500/25 border-emerald-500/20 text-[10px] px-2 py-0">
          {matchedOption.marketingBadge}
        </Badge>
      )}
      
      {billingCycle === 'YEARLY' && matchedOption.totalPrice && (
        <p className="text-xs font-medium text-muted-foreground mt-2 mb-2 bg-muted/50 py-1 px-2.5 rounded-full">
          Billed {matchedOption.typeName === 'ANNUAL_PREPAID' ? 'upfront' : 'in installments'} as {matchedOption.totalPrice % 1 === 0 ? matchedOption.totalPrice.toString() : matchedOption.totalPrice.toFixed(2)} ₺
        </p>
      )}
    </div>
  );
}

function PlanFeatureList({ features }: { features: FeatureResponse[] }) {
  return (
      <div className="mt-6 flex flex-col gap-2">
        {features.map((f) => (
            <div
                key={f.id}
                className="group flex items-center gap-3 p-2 rounded-lg transition-colors hover:bg-muted/50"
            >
              {/* Enhanced Icon Container */}
              <div className="flex items-center justify-center w-5 h-5 rounded-md bg-primary/10 text-primary shrink-0 transition-transform group-hover:scale-110">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>

              {/* Feature Text */}
              <span className="text-sm text-foreground/80 font-medium leading-tight tracking-tight">
            {f.name}
          </span>
            </div>
        ))}
      </div>
  );
}

interface PlanCardProps {
  offer: OfferCatalogResponse;
  matchedOption?: PaymentOptionDto;
  billingCycle: BillingCycle;
  onChoose: (offerId: number, subscriptionTypeId: number) => void;
}

function PlanCard({ offer, matchedOption, billingCycle, onChoose }: PlanCardProps) {
  return (
    <div className={cn(
      "flex flex-col relative overflow-hidden rounded-xl border bg-card text-card-foreground shadow-xs transition-all",
      offer.isGlobal && "border-blue-500 shadow-sm ring-1 ring-blue-500/20"
    )}>
      {offer.isGlobal && <GlobalPlanBadge />}

      <PlanHeader name={offer.planName} />

      <div className="flex flex-col grow text-center px-4 pb-4">
        <PlanPriceArea matchedOption={matchedOption} billingCycle={billingCycle} />

        <Button 
          className={cn(
            "w-full mb-5 font-semibold text-sm transition-all duration-300",
            offer.isGlobal
              ? "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20 shadow-sm"
              : ""
          )}
          disabled={!matchedOption}
          onClick={() => {
            if (matchedOption?.subscriptionTypeId) {
              onChoose(offer.id, matchedOption.subscriptionTypeId);
            }
          }}
        >
          Choose this plan
        </Button>

        <Separator className="mb-4" />

        <PlanFeatureList features={offer.features} />
      </div>
    </div>
  );
}

// --- Main Export ---

export function Step2PlanSelection() {
  const router = useRouter();
  const { clubSlug, setOfferId, setSubscriptionTypeId } = useOnboardingStore();
  const { execute, data, isPending } = useServerAction(getClubOffersAction);

  const [billingCycle, setBillingCycle] = useState<BillingCycle>('MONTHLY');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('PREPAID');

  useEffect(() => {
    if (clubSlug) {
      execute({ slug: clubSlug });
    }
  }, [clubSlug, execute]);

  const offers: OfferCatalogResponse[] = data || [];

  const handleBack = () => {
    router.push('?step=1');
  };

  const handleChoosePlan = (offerId: number, subscriptionTypeId: number) => {
    setOfferId(offerId);
    setSubscriptionTypeId(subscriptionTypeId);
    router.push('?step=3');
  };

  const getTargetTypeName = () => {
    if (billingCycle === 'MONTHLY') return 'MONTHLY';
    return paymentMethod === 'INSTALLMENTS' ? 'ANNUAL_INSTALLMENT' : 'ANNUAL_PREPAID';
  };

  // Calculate dynamic max savings percentage across all offers
  let maxSavings = 0;
  offers.forEach(offer => {
    const monthlyOpt = offer.paymentOptions.find(p => p.typeName === 'MONTHLY');
    const yearlyOpt = offer.paymentOptions.find(p => p.typeName === 'ANNUAL_PREPAID');
    
    if (monthlyOpt?.monthlyPrice && yearlyOpt?.monthlyPrice && monthlyOpt.monthlyPrice > 0) {
      const savings = Math.round((1 - (yearlyOpt.monthlyPrice / monthlyOpt.monthlyPrice)) * 100);
      if (savings > maxSavings) {
        maxSavings = savings;
      }
    }
  });

  if (!clubSlug) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <p className="text-muted-foreground">Please select a club first.</p>
        <Button variant="outline" onClick={handleBack}>Go Back</Button>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Select Your Plan</CardTitle>
        <p className="text-sm text-muted-foreground">
          Find the right membership for your fitness goals.
        </p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <BillingToggles 
          billingCycle={billingCycle} 
          setBillingCycle={setBillingCycle} 
          paymentMethod={paymentMethod} 
          setPaymentMethod={setPaymentMethod} 
          maxSavings={maxSavings}
        />

        {isPending ? (
          <div className="flex items-center justify-center h-32">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : offers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 gap-4 border rounded-lg bg-muted/20">
            <p className="text-muted-foreground text-center">No offers are currently available for this club.</p>
            <Button variant="outline" onClick={handleBack}>Select another club</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {offers.map((offer) => {
              const matchedOption = offer.paymentOptions.find(po => po.typeName === getTargetTypeName());

              return (
                <PlanCard 
                  key={offer.id} 
                  offer={offer} 
                  matchedOption={matchedOption} 
                  billingCycle={billingCycle} 
                  onChoose={handleChoosePlan}
                />
              );
            })}
          </div>
        )}
      </CardContent>

      <CardFooter className="flex justify-between border-t p-6">
        <Button variant="outline" onClick={handleBack} className="gap-2">
          <ChevronLeft className="w-4 h-4" /> Back
        </Button>
      </CardFooter>
    </Card>
  );
}
