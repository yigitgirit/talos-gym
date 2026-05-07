import { HelpCircle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function ClubFaq() {
  return (
    <section className="w-full py-12 md:py-24">
      <div className="container max-w-3xl mx-auto px-4">
        <div className="flex items-center justify-center gap-3 mb-8 md:mb-10">
          <HelpCircle className="w-6 md:w-8 h-6 md:h-8 text-primary" />
          <h2 className="font-heading text-2xl md:text-4xl font-bold text-center">Frequently Asked Questions</h2>
        </div>
        
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-left font-semibold text-base md:text-lg">Do I need to bring my own towel and padlock?</AccordionTrigger>
            <AccordionContent className="text-muted-foreground text-sm md:text-base">
              While some of our premium clubs provide towels, we generally recommend bringing your own workout towel. Padlocks are required for all lockers; you can bring your own or purchase one at the front desk.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-2">
            <AccordionTrigger className="text-left font-semibold text-base md:text-lg">Are group fitness classes included in my membership?</AccordionTrigger>
            <AccordionContent className="text-muted-foreground text-sm md:text-base">
              Most basic group fitness classes are included with standard memberships. Premium classes (like specialized Pilates or advanced Cross-training) might require a Pro or Elite membership tier. Please check the specific club's schedule.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-3">
            <AccordionTrigger className="text-left font-semibold text-base md:text-lg">Can I bring a guest with me?</AccordionTrigger>
            <AccordionContent className="text-muted-foreground text-sm md:text-base">
              Pro and Elite members receive two free guest passes per month. Starter members can bring guests for a nominal day-pass fee. All guests must sign a waiver and provide a valid ID at the front desk.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-4">
            <AccordionTrigger className="text-left font-semibold text-base md:text-lg">Is there parking available at this location?</AccordionTrigger>
            <AccordionContent className="text-muted-foreground text-sm md:text-base">
              Parking availability varies by location. You can check the specific parking details by calling the club directly or checking the location details on Google Maps using the link above.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-5">
            <AccordionTrigger className="text-left font-semibold text-base md:text-lg">How do I cancel or freeze my membership?</AccordionTrigger>
            <AccordionContent className="text-muted-foreground text-sm md:text-base">
              You can request a membership freeze (up to 3 months) or cancellation directly through your TalosGym app profile settings, or by speaking with the club manager. Please note that a 30-day notice is typically required for cancellations.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </section>
  );
}