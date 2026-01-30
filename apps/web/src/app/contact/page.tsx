"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  AlertCircle, 
  Loader2, 
  CheckCircle2, 
  Mail, 
  Phone, 
  MapPin,
  Clock,
  MessageCircle,
  Send
} from "lucide-react";

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
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-primary text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-dots opacity-20" />
        <div className="absolute top-20 right-10 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <Badge className="mb-6 bg-white/20 text-white hover:bg-white/30 border-white/30">
              <MessageCircle className="w-3 h-3 mr-1" />
              We're Here to Help
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Get in Touch
            </h1>
            <p className="text-xl opacity-90 leading-relaxed">
              Have questions about renting, listing your vehicle, or anything else? 
              Our team is ready to assist you 24/7.
            </p>
          </div>
        </div>
      </section>

      {/* Quick Contact Cards */}
      <section className="py-16 bg-white -mt-12 relative z-10">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <Card className="border-none shadow-lg hover-lift">
              <CardContent className="p-6 text-center">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-bold mb-2">Call Us</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Available 24/7
                </p>
                <a href="tel:+254700000000" className="text-primary font-semibold hover:underline">
                  +254 700 000 000
                </a>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg hover-lift">
              <CardContent className="p-6 text-center">
                <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-7 h-7 text-accent" />
                </div>
                <h3 className="font-bold mb-2">Email Us</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Response within 24h
                </p>
                <a href="mailto:support@vehiclerent.co.ke" className="text-accent font-semibold hover:underline">
                  support@vehiclerent.co.ke
                </a>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg hover-lift">
              <CardContent className="p-6 text-center">
                <div className="w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-7 h-7 text-secondary" />
                </div>
                <h3 className="font-bold mb-2">Visit Us</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Westlands, Nairobi
                </p>
                <a href="#" className="text-secondary font-semibold hover:underline">
                  Get Directions
                </a>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 bg-gradient-to-br from-neutral-50 to-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid lg:grid-cols-5 gap-12">
            {/* Contact Form - Takes 3 columns */}
            <div className="lg:col-span-3">
              <Card className="shadow-xl border-none">
                <CardHeader className="pb-6">
                  <CardTitle className="text-3xl">Send us a message</CardTitle>
                  <CardDescription className="text-base">
                    Fill out the form below and we'll get back to you within 24 hours during business days.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {formState === "success" ? (
                    <div className="py-16 text-center space-y-6">
                      <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mx-auto">
                        <CheckCircle2 className="h-10 w-10 text-success" />
                      </div>
                      <div>
                        <h3 className="text-3xl font-bold mb-3">Thank you!</h3>
                        <p className="text-lg text-muted-foreground max-w-md mx-auto">
                          Your message has been sent successfully. We'll get back to you soon.
                        </p>
                      </div>
                      <div className="flex gap-4 justify-center">
                        <Button onClick={() => setFormState("idle")} variant="outline" size="lg">
                          Send Another Message
                        </Button>
                        <Button asChild size="lg">
                          <a href="/">Back to Home</a>
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="name" className="text-base">Full Name *</Label>
                          <Input 
                            id="name" 
                            required 
                            placeholder="John Mwangi"
                            className="h-12"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email" className="text-base">Email *</Label>
                          <Input 
                            id="email" 
                            type="email" 
                            required 
                            placeholder="john@example.com"
                            className="h-12"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-base">Phone Number</Label>
                        <Input 
                          id="phone" 
                          type="tel" 
                          placeholder="+254 7XX XXX XXX"
                          className="h-12"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="subject" className="text-base">Subject *</Label>
                        <Input 
                          id="subject" 
                          required 
                          placeholder="What is this regarding?"
                          className="h-12"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="message" className="text-base">Message *</Label>
                        <Textarea
                          id="message"
                          placeholder="How can we help you today?"
                          className="min-h-[160px] resize-none"
                          required
                        />
                      </div>

                      {formState === "error" && (
                        <div className="bg-destructive/10 text-destructive p-4 rounded-lg flex items-center gap-3">
                          <AlertCircle className="h-5 w-5 flex-shrink-0" />
                          <p>{errorMessage}</p>
                        </div>
                      )}

                      <Button 
                        type="submit" 
                        className="w-full h-12 text-base bg-gradient-accent hover:opacity-90" 
                        disabled={formState === "loading"}
                        size="lg"
                      >
                        {formState === "loading" ? (
                          <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send className="mr-2 h-5 w-5" />
                            Send Message
                          </>
                        )}
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Contact Info Sidebar - Takes 2 columns */}
            <div className="lg:col-span-2 space-y-6">
              {/* Office Hours */}
              <Card className="shadow-lg border-none">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Clock className="w-5 h-5 text-primary" />
                    </div>
                    <CardTitle>Office Hours</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="font-medium">Monday – Friday</span>
                    <span className="text-muted-foreground">8:00 AM – 6:00 PM</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="font-medium">Saturday</span>
                    <span className="text-muted-foreground">9:00 AM – 1:00 PM</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="font-medium">Sunday & Holidays</span>
                    <span className="text-muted-foreground">Closed</span>
                  </div>
                  <div className="mt-4 p-3 bg-success/10 rounded-lg">
                    <p className="text-sm text-success font-medium">
                      24/7 Emergency Support Available
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Location */}
              <Card className="shadow-lg border-none">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-accent" />
                    </div>
                    <CardTitle>Our Location</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Main Office</h4>
                      <p className="text-muted-foreground">
                        Westlands Road, Nairobi<br />
                        P.O. Box 12345-00100<br />
                        Nairobi, Kenya
                      </p>
                    </div>
                    <Button variant="outline" className="w-full" asChild>
                      <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer">
                        <MapPin className="w-4 h-4 mr-2" />
                        View on Map
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Social Media */}
              <Card className="shadow-lg border-none">
                <CardHeader>
                  <CardTitle>Follow Us</CardTitle>
                  <CardDescription>
                    Stay updated with our latest offers and news
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-3">
                    <Button variant="outline" size="icon" className="h-12 w-12">
                      <span className="sr-only">Facebook</span>
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                    </Button>
                    <Button variant="outline" size="icon" className="h-12 w-12">
                      <span className="sr-only">Twitter</span>
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                      </svg>
                    </Button>
                    <Button variant="outline" size="icon" className="h-12 w-12">
                      <span className="sr-only">Instagram</span>
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
