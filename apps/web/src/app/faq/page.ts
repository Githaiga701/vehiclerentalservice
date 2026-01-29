import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

export default function FaqPage() {
  const faqs = [
    {
      question: "How do I list my vehicle?",
      answer:
        "Sign up or log in → go to your dashboard → click 'Add Vehicle' → fill in details, upload photos, set pricing and availability. Once approved, your vehicle appears in search results.",
    },
    {
      question: "Is KYC mandatory?",
      answer:
        "Yes. Every user (both renters and owners) must complete KYC before they can book or list a vehicle. This includes ID upload, selfie, and address verification for safety and trust.",
    },
    {
      question: "How are payments handled?",
      answer:
        "Payments are made directly between renter and owner/driver (cash, M-Pesa, bank transfer). After payment, the driver confirms receipt through a secure link we send them. No money goes through the platform yet.",
    },
    {
      question: "Can I book without a driver?",
      answer:
        "Yes. Many owners offer self-drive options. Just filter for 'without driver' when searching.",
    },
    {
      question: "What happens if there's a problem during the rental?",
      answer:
        "Contact the owner/driver first. If unresolved, report it through your dashboard. We review all reports and may take action on accounts if needed.",
    },
    {
      question: "How do ratings work?",
      answer:
        "Ratings are only available after a trip is completed and payment confirmed. Both renter and owner can rate each other, and renters can also rate the driver.",
    },
    {
      question: "Can I cancel a booking?",
      answer:
        "Yes. Owners can decline requests. Renters can cancel before the trip starts (policy may vary by owner). Check the booking details for cancellation terms.",
    },
    {
      question: "Is there a fee to use the platform?",
      answer:
        "Currently, the platform is free for both renters and owners. No commission or listing fees in Phase 1.",
    },
  ];

  return (
    <div className="min-h-screen bg-neutral-50 py-12 md:py-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12 md:mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-muted-foreground">
            Find quick answers to common questions
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="border rounded-lg px-6 py-2 bg-white shadow-sm"
            >
              <AccordionTrigger className="text-lg font-medium hover:no-underline">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pt-4 pb-6">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="mt-16 text-center">
          <h3 className="text-2xl font-semibold mb-4">Still have questions?</h3>
          <p className="text-muted-foreground mb-6">
            We're happy to help! Reach out to us anytime.
          </p>
          <Button size="lg" asChild>
            <a href="/contact">Contact Us</a>
          </Button>
        </div>
      </div>
    </div>
  );
}