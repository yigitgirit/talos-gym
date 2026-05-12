import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ChevronRight } from "lucide-react";
import { PlanFeatureMatrixPublic } from "@/features/memberships/components/marketing/plan-feature-matrix-public";
import { PlanCardsOverview } from "@/features/memberships/components/marketing/plan-cards-overview";
import { MembershipPlanResponse, FeatureResponse } from "@/lib/api/schema";
import { getServerApi } from "@/lib/api/server";

interface MembershipPlansPageProps {
  plans: MembershipPlanResponse[];
  features: FeatureResponse[];
}

function MembershipPlansPageContent({ plans, features }: MembershipPlansPageProps) {
  return (
    <>
      {/* Header Section */}
      <section className="w-full py-12 md:py-20 bg-gradient-to-b from-primary/10 to-background">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="flex flex-col gap-4 text-center">
            <h1 className="font-heading text-4xl md:text-5xl font-bold">
              Plans for Every Fitness Level
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Choose the perfect plan to match your fitness goals. Upgrade or downgrade anytime with no commitment.
            </p>
          </div>
        </div>
      </section>

      {/* Plans Quick Overview Cards */}
      <PlanCardsOverview plans={plans} />

      {/* Feature Comparison Matrix */}
      <section className="w-full py-16 md:py-24 bg-muted/30">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
              Complete Feature Comparison
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              See exactly what features are included in each plan. All plans include access to all TalosGym clubs.
            </p>
          </div>

          {plans.length > 0 && features.length > 0 ? (
            <PlanFeatureMatrixPublic plans={plans} features={features} />
          ) : (
            <div className="flex items-center justify-center py-12">
              <p className="text-muted-foreground">No plans available</p>
            </div>
          )}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="w-full py-16 md:py-24">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
              Frequently Asked Questions
            </h2>
          </div>

          <Accordion type="single" collapsible className="w-full max-w-2xl mx-auto">
            {[
              {
                q: "Can I change plans anytime?",
                a: "Yes! You can upgrade or downgrade your plan at any time. Changes take effect on your next billing cycle.",
              },
              {
                q: "Do you offer refunds?",
                a: "We offer a 14-day money-back guarantee if you're not satisfied with your subscription.",
              },
              {
                q: "Is there a contract?",
                a: "No contracts! Cancel anytime. All plans are month-to-month with no long-term commitment.",
              },
              {
                q: "What payment methods do you accept?",
                a: "We accept all major credit cards, PayPal, and Apple Pay.",
              },
              {
                q: "Do all plans give access to all clubs?",
                a: "Yes! All our paid plans include access to all TalosGym gyms worldwide.",
              },
              {
                q: "Can I get a refund if I'm not satisfied?",
                a: "Absolutely. We offer a 14-day money-back guarantee, no questions asked.",
              },
            ].map((item, i) => (
              <AccordionItem key={i} value={`item-${i}`}>
                <AccordionTrigger>{item.q}</AccordionTrigger>
                <AccordionContent>
                  <p className="text-muted-foreground">{item.a}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-16 md:py-24 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
        <div className="container max-w-7xl mx-auto px-4 text-center">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
            Ready to Transform Your Fitness?
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
            Choose your plan and start your fitness journey today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="gap-2 bg-primary-foreground text-primary hover:bg-primary-foreground/90"
            >
              Get Started <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}

export default async function MembershipPlansPage() {
  let plansData: MembershipPlanResponse[] = [];
  let featuresData: FeatureResponse[] = [];

  try {
    const api = getServerApi();
    plansData = await api.get('api/plans');
    
    if (plansData && plansData.length > 0) {
        // Extract unique features directly from the plans
        const uniqueFeaturesMap = new Map();
        plansData.forEach(plan => {
            plan.features.forEach(f => {
                if (!uniqueFeaturesMap.has(f.id)) {
                    uniqueFeaturesMap.set(f.id, f);
                }
            });
        });
        featuresData = Array.from(uniqueFeaturesMap.values());
    }
  } catch (error) {
    console.error('Failed to fetch plans:', error);
  }

  return <MembershipPlansPageContent plans={plansData || []} features={featuresData || []} />;
}
