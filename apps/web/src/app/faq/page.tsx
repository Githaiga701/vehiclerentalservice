"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { 
  HelpCircle, 
  MessageCircle, 
  Phone, 
  Mail,
  Search,
  FileText,
  Shield,
  CreditCard
} from "lucide-react";
import { FAQ_DATA } from "@/lib/constants";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFAQs = FAQ_DATA.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const categories = [
    {
      icon: FileText,
      title: "Booking & Reservations",
      description: "Learn about our booking process and policies",
    },
    {
      icon: Shield,
      title: "Insurance & Safety",
      description: "Understand our insurance coverage and safety measures",
    },
    {
      icon: CreditCard,
      title: "Payments & Pricing",
      description: "Information about pricing, payments, and fees",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-primary text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-dots opacity-20" />
        <div className="absolute top-20 right-10 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <Badge className="mb-6 bg-white/20 text-white hover:bg-white/30 border-white/30">
              <HelpCircle className="w-3 h-3 mr-1" />
              Help Center
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Frequently Asked Questions
            </h1>
            <p className="text-xl opacity-90 leading-relaxed mb-8">
              Find answers to common questions about our car rental services
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Search for answers..."
                  className="pl-12 h-14 text-base bg-white/95 backdrop-blur-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Categories */}
      <section className="py-16 bg-white -mt-12 relative z-10">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {categories.map((category, idx) => (
              <Card key={idx} className="border-none shadow-lg hover-lift cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-accent flex items-center justify-center mx-auto mb-4">
                    <category.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">{category.title}</h3>
                  <p className="text-sm text-muted-foreground">{category.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="py-20 bg-gradient-to-br from-neutral-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {searchQuery && (
              <div className="mb-8">
                <p className="text-muted-foreground">
                  Found <span className="font-semibold text-foreground">{filteredFAQs.length}</span> result
                  {filteredFAQs.length !== 1 ? 's' : ''} for "{searchQuery}"
                </p>
              </div>
            )}

            {filteredFAQs.length === 0 ? (
              <Card className="border-none shadow-lg">
                <CardContent className="p-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">No results found</h3>
                  <p className="text-muted-foreground mb-6">
                    We couldn't find any FAQs matching your search. Try different keywords or contact us directly.
                  </p>
                  <Button onClick={() => setSearchQuery("")} variant="outline">
                    Clear Search
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-none shadow-lg">
                <CardContent className="p-8">
                  <Accordion type="single" collapsible className="w-full">
                    {filteredFAQs.map((faq, idx) => (
                      <AccordionItem key={idx} value={`item-${idx}`}>
                        <AccordionTrigger className="text-left hover:text-primary">
                          <span className="font-semibold text-lg">{faq.question}</span>
                        </AccordionTrigger>
                        <AccordionContent>
                          <p className="text-muted-foreground leading-relaxed pt-2">
                            {faq.answer}
                          </p>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </section>

      {/* Additional Help Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">Still Have Questions?</h2>
              <p className="text-lg text-muted-foreground">
                Our support team is here to help you 24/7
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <Card className="border-none shadow-lg hover-lift">
                <CardContent className="p-6 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Phone className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="font-bold mb-2">Call Us</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Speak with our team
                  </p>
                  <Button variant="outline" className="w-full" asChild>
                    <a href="tel:+254700000000">+254 700 000 000</a>
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-none shadow-lg hover-lift">
                <CardContent className="p-6 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
                    <Mail className="w-7 h-7 text-accent" />
                  </div>
                  <h3 className="font-bold mb-2">Email Us</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Get a response within 24h
                  </p>
                  <Button variant="outline" className="w-full" asChild>
                    <a href="mailto:support@carrental.ke">Send Email</a>
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-none shadow-lg hover-lift">
                <CardContent className="p-6 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center mx-auto mb-4">
                    <MessageCircle className="w-7 h-7 text-secondary" />
                  </div>
                  <h3 className="font-bold mb-2">Live Chat</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Chat with us now
                  </p>
                  <Button variant="outline" className="w-full">
                    Start Chat
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Topics */}
      <section className="py-20 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20">
                Popular Topics
              </Badge>
              <h2 className="text-4xl font-bold mb-4">Quick Links</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {[
                "How to book a vehicle",
                "Payment methods accepted",
                "Cancellation policy",
                "Insurance coverage details",
                "Age requirements",
                "Fuel policy",
                "Additional driver fees",
                "Mileage limits",
              ].map((topic, idx) => (
                <Button
                  key={idx}
                  variant="outline"
                  className="justify-start h-auto py-4 px-6 text-left hover:bg-white hover:shadow-md transition-all"
                >
                  <HelpCircle className="w-4 h-4 mr-3 flex-shrink-0" />
                  <span>{topic}</span>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
