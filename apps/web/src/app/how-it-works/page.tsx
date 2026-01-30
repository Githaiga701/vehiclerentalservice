"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Search,
  CheckCircle,
  Zap,
  FileText,
  CreditCard,
  Key,
  Shield,
  Clock,
  MapPin,
  Phone,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Info
} from "lucide-react";

export default function HowItWorksPage() {
  const steps = [
    {
      number: 1,
      icon: Search,
      title: "Browse & Select Your Vehicle",
      description: "Find the perfect car from our extensive collection",
      details: [
        "Use our advanced search filters to narrow down options",
        "Filter by vehicle type, price range, location, and features",
        "View detailed specifications, photos, and customer reviews",
        "Compare multiple vehicles side by side",
        "Check real-time availability for your desired dates"
      ],
      tips: [
        "Book in advance for better availability and rates",
        "Consider your trip type: city driving vs. long distance",
        "Check included mileage and fuel policy"
      ]
    },
    {
      number: 2,
      icon: FileText,
      title: "Complete Your Booking",
      description: "Secure your reservation in just a few minutes",
      details: [
        "Select your pickup and drop-off dates and locations",
        "Choose additional options (GPS, child seats, extra driver)",
        "Review the total cost with transparent pricing breakdown",
        "Enter your personal and contact information",
        "Upload required documents (ID, driver's license)"
      ],
      tips: [
        "Have your documents ready for faster processing",
        "Double-check dates and times before confirming",
        "Add insurance coverage for peace of mind"
      ]
    },
    {
      number: 3,
      icon: CreditCard,
      title: "Make Secure Payment",
      description: "Pay safely with multiple payment options",
      details: [
        "Choose from M-Pesa, credit/debit card, or bank transfer",
        "All transactions are encrypted and secure",
        "Receive instant booking confirmation via email and SMS",
        "Get detailed receipt and rental agreement",
        "Option to pay deposit now and balance at pickup"
      ],
      tips: [
        "Save your payment method for faster future bookings",
        "Check for available discounts and promo codes",
        "Review cancellation policy before payment"
      ]
    },
    {
      number: 4,
      icon: Key,
      title: "Pick Up Your Vehicle",
      description: "Collect your car and hit the road",
      details: [
        "Arrive at the designated pickup location",
        "Present your ID, driver's license, and booking confirmation",
        "Complete a quick vehicle inspection with our staff",
        "Sign the rental agreement and receive the keys",
        "Get a brief orientation on vehicle features and controls"
      ],
      tips: [
        "Arrive 15 minutes early for a smooth pickup",
        "Take photos of the vehicle condition",
        "Ask questions about any features you're unsure about"
      ]
    },
    {
      number: 5,
      icon: Zap,
      title: "Enjoy Your Journey",
      description: "Drive with confidence and peace of mind",
      details: [
        "24/7 roadside assistance available",
        "Comprehensive insurance coverage included",
        "GPS navigation to help you find your way",
        "Emergency contact numbers provided",
        "Flexible extension options if you need more time"
      ],
      tips: [
        "Keep emergency contact numbers handy",
        "Follow traffic rules and speed limits",
        "Report any issues immediately for quick resolution"
      ]
    },
    {
      number: 6,
      icon: CheckCircle,
      title: "Return the Vehicle",
      description: "Simple and hassle-free return process",
      details: [
        "Return to the agreed location at the scheduled time",
        "Refuel the vehicle as per the fuel policy",
        "Quick inspection to check for any damages",
        "Settle any additional charges if applicable",
        "Receive your deposit refund (if paid separately)"
      ],
      tips: [
        "Return with a full tank to avoid refueling charges",
        "Clean the interior to avoid cleaning fees",
        "Allow extra time for the return process"
      ]
    }
  ];

  const requirements = [
    {
      icon: FileText,
      title: "Valid Driver's License",
      description: "Must be held for at least 2 years. International visitors need an IDP."
    },
    {
      icon: CreditCard,
      title: "Payment Method",
      description: "Credit/debit card, M-Pesa, or bank transfer accepted."
    },
    {
      icon: Shield,
      title: "Identification",
      description: "National ID or passport for verification purposes."
    },
    {
      icon: Clock,
      title: "Minimum Age",
      description: "23 years for standard vehicles, 25 for luxury cars."
    }
  ];

  const faqs = [
    {
      question: "Can I modify my booking after confirmation?",
      answer: "Yes, you can modify your booking up to 24 hours before pickup. Changes may be subject to availability and price adjustments."
    },
    {
      question: "What happens if I return the car late?",
      answer: "We offer a 1-hour grace period. After that, late returns are charged hourly. If you're more than 6 hours late, a full additional day will be charged."
    },
    {
      question: "Is insurance included in the rental price?",
      answer: "Yes, basic insurance is included. Additional coverage options are available for purchase during booking."
    },
    {
      question: "Can I pick up in one city and drop off in another?",
      answer: "Yes, we offer one-way rentals between major cities. Additional fees may apply depending on the distance."
    }
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
              <Info className="w-3 h-3 mr-1" />
              Complete Guide
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              How It Works
            </h1>
            <p className="text-xl opacity-90 leading-relaxed">
              Renting a car has never been easier. Follow our simple 6-step process 
              to get on the road in no time.
            </p>
          </div>
        </div>
      </section>

      {/* Quick Overview */}
      <section className="py-16 bg-white -mt-12 relative z-10">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="border-none shadow-lg hover-lift text-center">
                <CardContent className="p-6">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Clock className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">Quick Process</h3>
                  <p className="text-sm text-muted-foreground">
                    Book your vehicle in under 5 minutes
                  </p>
                </CardContent>
              </Card>

              <Card className="border-none shadow-lg hover-lift text-center">
                <CardContent className="p-6">
                  <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-7 h-7 text-accent" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">Fully Insured</h3>
                  <p className="text-sm text-muted-foreground">
                    All vehicles come with comprehensive coverage
                  </p>
                </CardContent>
              </Card>

              <Card className="border-none shadow-lg hover-lift text-center">
                <CardContent className="p-6">
                  <div className="w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center mx-auto mb-4">
                    <Phone className="w-7 h-7 text-secondary" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">24/7 Support</h3>
                  <p className="text-sm text-muted-foreground">
                    Round-the-clock assistance whenever you need
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Steps */}
      <section className="py-20 bg-gradient-to-br from-neutral-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20">
                Step by Step
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Your Rental Journey
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Follow these simple steps for a seamless car rental experience
              </p>
            </div>

            <div className="space-y-12">
              {steps.map((step, idx) => (
                <Card key={idx} className="border-none shadow-xl hover-lift">
                  <CardContent className="p-8 md:p-10">
                    <div className="flex flex-col md:flex-row gap-6">
                      {/* Step Number & Icon */}
                      <div className="flex-shrink-0">
                        <div className="w-20 h-20 rounded-2xl bg-gradient-accent flex items-center justify-center text-white font-bold text-2xl shadow-lg mb-4 md:mb-0">
                          {step.number}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <div className="flex items-start gap-4 mb-4">
                          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <step.icon className="w-6 h-6 text-primary" />
                          </div>
                          <div>
                            <h3 className="text-2xl font-bold mb-2">{step.title}</h3>
                            <p className="text-muted-foreground text-lg">{step.description}</p>
                          </div>
                        </div>

                        {/* Details */}
                        <div className="space-y-6 mt-6">
                          <div>
                            <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                              <CheckCircle2 className="w-5 h-5 text-success" />
                              What to Expect
                            </h4>
                            <ul className="space-y-2 ml-7">
                              {step.details.map((detail, detailIdx) => (
                                <li key={detailIdx} className="flex items-start gap-2 text-muted-foreground">
                                  <span className="text-primary mt-1">•</span>
                                  <span>{detail}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Tips */}
                          <div className="bg-accent/5 rounded-xl p-4 border border-accent/20">
                            <h4 className="font-semibold mb-2 flex items-center gap-2 text-accent">
                              <AlertCircle className="w-5 h-5" />
                              Pro Tips
                            </h4>
                            <ul className="space-y-1.5 ml-7">
                              {step.tips.map((tip, tipIdx) => (
                                <li key={tipIdx} className="flex items-start gap-2 text-sm text-muted-foreground">
                                  <span className="text-accent mt-0.5">→</span>
                                  <span>{tip}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Requirements */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-secondary/10 text-secondary hover:bg-secondary/20">
                <FileText className="w-3 h-3 mr-1" />
                Requirements
              </Badge>
              <h2 className="text-4xl font-bold mb-4">
                What You'll Need
              </h2>
              <p className="text-lg text-muted-foreground">
                Make sure you have these ready before booking
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {requirements.map((req, idx) => (
                <Card key={idx} className="border-none shadow-lg hover-lift">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center flex-shrink-0">
                        <req.icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg mb-2">{req.title}</h3>
                        <p className="text-muted-foreground">{req.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Quick FAQs */}
      <section className="py-20 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-accent/10 text-accent hover:bg-accent/20">
                Common Questions
              </Badge>
              <h2 className="text-4xl font-bold mb-4">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, idx) => (
                <Card key={idx} className="border-none shadow-lg hover-lift">
                  <CardContent className="p-6">
                    <h3 className="font-bold text-lg mb-2">{faq.question}</h3>
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center mt-10">
              <Button variant="outline" size="lg" asChild>
                <a href="/faq">
                  View All FAQs
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-primary text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-dots opacity-20" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl mb-10 opacity-90 max-w-2xl mx-auto">
            Browse our collection and book your perfect vehicle today
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-6" asChild>
              <a href="/vehicles">
                Browse Vehicles
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 text-lg px-8 py-6" asChild>
              <a href="/contact">
                Contact Support
              </a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
