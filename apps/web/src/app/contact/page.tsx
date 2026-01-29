"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Loader2, CheckCircle2 } from "lucide-react";

export default function ContactPage() {
  const [formState, setFormState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormState("loading");
    setErrorMessage("");

    // Simulate form submission
    setTimeout(() => {
      // Randomly succeed or fail for demo
      if (Math.random() > 0.2) {
        setFormState("success");
      } else {
        setFormState("error");
        setErrorMessage("Something went wrong. Please try again.");
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-neutral-50 py-12 md:py-20">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-12 md:mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Get in Touch</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Have questions about renting, listing your vehicle, or anything else? We're here to help.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Send us a message</CardTitle>
              <CardDescription>
                We'll get back to you within 24 hours during business days.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {formState === "success" ? (
                <div className="py-12 text-center space-y-4">
                  <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto" />
                  <h3 className="text-2xl font-semibold">Thank you!</h3>
                  <p className="text-muted-foreground">
                    Your message has been sent successfully. We'll get back to you soon.
                  </p>
                  <Button asChild variant="outline">
                    <a href="/">Back to Home</a>
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" required placeholder="John Mwangi" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" required placeholder="john@example.com" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" type="tel" placeholder="+254 7XX XXX XXX" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      placeholder="How can we help you today?"
                      className="min-h-[140px]"
                      required
                    />
                  </div>

                  {formState === "error" && (
                    <div className="bg-destructive/10 text-destructive p-4 rounded-md flex items-center gap-3">
                      <AlertCircle className="h-5 w-5 flex-shrink-0" />
                      <p>{errorMessage}</p>
                    </div>
                  )}

                  <Button type="submit" className="w-full" disabled={formState === "loading"}>
                    {formState === "loading" && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                    Send Message
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>

          {/* Contact Info */}
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-medium mb-2">Email</h3>
                  <p className="text-muted-foreground">support@vehiclerent.co.ke</p>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Phone</h3>
                  <p className="text-muted-foreground">+254 700 000 000</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Mon–Fri: 8:00 AM – 6:00 PM
                  </p>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Location</h3>
                  <p className="text-muted-foreground">
                    Westlands, Nairobi<br />
                    Kenya
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Office Hours</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-muted-foreground">
                  <li>Monday – Friday: 8:00 AM – 6:00 PM</li>
                  <li>Saturday: 9:00 AM – 1:00 PM</li>
                  <li>Sunday & Public Holidays: Closed</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}