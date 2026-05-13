"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useOnboardingStore } from './store';
import { useMockPayment } from '@/hooks/useMockPayment';
import { useServerAction } from '@/hooks/useServerAction';
import { createUserSubscriptionAction } from '@/features/subscriptions/actions/subscription.action';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, CreditCard, Loader2, CheckCircle2, ShieldCheck } from 'lucide-react';
import { Alert } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { getErrorMessage } from '@/constants/error-codes';
import Link from 'next/link';

export function Step3Checkout() {
  const router = useRouter();
  const { offerId, subscriptionTypeId, reset } = useOnboardingStore();
  const { generateMockToken, isProcessing: isPaymentProcessing } = useMockPayment();
  const [success, setSuccess] = useState(false);

  const { execute, isPending, error } = useServerAction(createUserSubscriptionAction, {
    onSuccess: () => {
      setSuccess(true);
      toast.success("Subscription created successfully!");
      reset(); // Clear onboarding state
    },
    onError: (err) => {
      toast.error(getErrorMessage(err.code, err.message));
    }
  });

  const handleCheckout = async () => {
    if (!offerId || !subscriptionTypeId) {
      toast.error("Missing subscription details");
      return;
    }

    try {
      // 1. Get payment token from mock provider
      const token = await generateMockToken();
      
      // 2. Create subscription via API
      execute({
        offerId,
        subscriptionTypeId,
        paymentToken: token,
      });
    } catch (err) {
      console.error(err);
      toast.error("Payment processing failed");
    }
  };

  const handleBack = () => {
    router.push('?step=2');
  };

  if (success) {
    return (
      <Card className="text-center py-8 border-emerald-500/20 bg-emerald-500/5">
        <CardHeader className="text-center">
          <div className="mx-auto bg-emerald-500/20 p-4 rounded-full w-20 h-20 flex items-center justify-center mb-4">
            <CheckCircle2 className="w-10 h-10 text-emerald-600" />
          </div>
          <CardTitle className="text-3xl text-emerald-700">Welcome to TalosGym!</CardTitle>
          <p className="text-muted-foreground mt-2">
            Your membership is now active. We've sent a receipt to your email.
          </p>
        </CardHeader>
        <CardContent>
          <Button asChild size="lg" className="mt-4">
            <Link href="/account">Go to Dashboard</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!offerId || !subscriptionTypeId) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <p className="text-muted-foreground">Please select a plan first.</p>
        <Button variant="outline" onClick={handleBack}>Go Back</Button>
      </div>
    );
  }

  const isWorking = isPaymentProcessing || isPending;

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Complete Your Purchase</CardTitle>
        <p className="text-sm text-muted-foreground">
          Secure payment via MockPay.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {error && (
          <Alert variant="destructive">
            {getErrorMessage(error.code, error.message)}
          </Alert>
        )}

        <div className="bg-muted/30 p-6 rounded-lg border flex flex-col gap-4">
           <div className="flex items-center gap-3">
             <div className="bg-primary/10 p-2 rounded-md">
               <ShieldCheck className="w-6 h-6 text-primary" />
             </div>
             <div>
               <h4 className="font-medium">Secure Checkout</h4>
               <p className="text-xs text-muted-foreground">Your payment details are encrypted.</p>
             </div>
           </div>
           
           <Separator />
           
           <div className="bg-background border rounded-md p-4 flex items-center gap-3">
             <CreditCard className="w-8 h-8 text-muted-foreground" />
             <div className="flex-1">
               <p className="font-medium">Mock Payment Method</p>
               <p className="text-xs text-muted-foreground">Used for demonstration purposes.</p>
             </div>
           </div>
        </div>

      </CardContent>
      <CardFooter className="flex justify-between border-t p-6">
        <Button variant="outline" onClick={handleBack} disabled={isWorking} className="gap-2">
          <ChevronLeft className="w-4 h-4" /> Back
        </Button>
        <Button 
          onClick={handleCheckout} 
          disabled={isWorking}
          size="lg"
          className="gap-2 font-semibold px-8"
        >
          {isWorking ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Processing...
            </>
          ) : (
            <>
              Pay & Subscribe
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
