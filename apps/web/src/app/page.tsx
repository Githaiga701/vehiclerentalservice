"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { 
  CalendarIcon, 
  Search, 
  Shield, 
  Clock, 
  DollarSign, 
  CheckCircle,
  Star,
  ArrowRight,
  MapPin,
  Users,
  Zap,
  Award,
  TrendingUp
} from "lucide-react";
import { VehicleCard } from "@/components/VehicleCard";
import { cn } from "@/lib/utils";
import { MOCK_VEHICLES, TESTIMONIALS } from "@/lib/constants";

// Featured vehicles (first 6)
const featuredVehicles = MOCK_VEHICLES.slice(0, 6);

export default function Home() {
  const [pickupDate, setPickupDate] = useState<Date | undefined>(undefined);
  const [returnDate, setReturnDate] = useState<Date | undefined>(undefined);

  return (
    <div className="flex flex-col">
      {/* Hero Section with Mesh Background */}
      <section
        className="relative bg-mesh overflow-hidden"
        suppressHydrationWarning
      >
        {/* Decorative elements */}
        <div className="absolute inset-0 bg-dots opacity-40" />
        <div className="absolute top-20 right-10 w-72 h-72 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 py-24 md:py-32 text-center relative z-10">
          {/* Badge */}
          <Badge className="mb-6 bg-accent/10 text-accent hover:bg-accent/20 border-accent/20">
            <Zap className="w-3 h-3 mr-1" />
            Kenya's #1 Car Rental Platform
          </Badge>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 animate-fade-in">
            Rent Your Perfect Ride
            <br />
            <span className="text-gradient-accent">Anywhere in Kenya</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12 animate-slide-up">
            Choose from <span className="font-semibold text-accent">hundreds of vehicles</span>. 
            No hidden fees. Flexible pickup and drop-off. 
            <span className="font-semibold text-primary"> 24/7 support</span>.
          </p>

          {/* Quick Stats */}
          <div className="flex flex-wrap justify-center gap-8 mb-12 animate-slide-up">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary">500+</div>
              <div className="text-sm text-muted-foreground">Vehicles</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-accent">10K+</div>
              <div className="text-sm text-muted-foreground">Happy Customers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-secondary">4.9★</div>
              <div className="text-sm text-muted-foreground">Average Rating</div>
            </div>
          </div>

          {/* Search Bar with Glass Effect */}
          <div className="max-w-5xl mx-auto glass rounded-2xl shadow-2xl p-8 animate-scale-in">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label
                  htmlFor="pickup-location"
                  className="block text-sm font-semibold mb-2 text-left"
                >
                  <MapPin className="inline w-4 h-4 mr-1" />
                  Pickup Location
                </label>
                <Input
                  id="pickup-location"
                  placeholder="Nairobi, JKIA, Westlands..."
                  className="h-12"
                />
              </div>

              <div suppressHydrationWarning>
                <label
                  htmlFor="pickup-date"
                  className="block text-sm font-semibold mb-2 text-left"
                >
                  <CalendarIcon className="inline w-4 h-4 mr-1" />
                  Pickup Date
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="pickup-date"
                      variant="outline"
                      className={cn(
                        "w-full h-12 justify-start text-left font-normal",
                        !pickupDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {pickupDate ? format(pickupDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={pickupDate}
                      onSelect={setPickupDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div suppressHydrationWarning>
                <label
                  htmlFor="return-date"
                  className="block text-sm font-semibold mb-2 text-left"
                >
                  <CalendarIcon className="inline w-4 h-4 mr-1" />
                  Return Date
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="return-date"
                      variant="outline"
                      className={cn(
                        "w-full h-12 justify-start text-left font-normal",
                        !returnDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {returnDate ? format(returnDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={returnDate}
                      onSelect={setReturnDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <Button className="w-full mt-8 bg-gradient-accent hover:opacity-90 text-white text-lg py-7 rounded-xl shadow-lg hover:shadow-xl transition-all">
              <Search className="mr-2 h-5 w-5" /> Search Available Vehicles
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="border-none shadow-lg hover-lift">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-lg font-bold mb-2">Fully Insured</h3>
                <p className="text-sm text-muted-foreground">
                  Comprehensive insurance coverage on all vehicles
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg hover-lift">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-accent" />
                </div>
                <h3 className="text-lg font-bold mb-2">24/7 Support</h3>
                <p className="text-sm text-muted-foreground">
                  Round-the-clock customer service and roadside assistance
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg hover-lift">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 rounded-2xl bg-secondary/10 flex items-center justify-center mx-auto mb-4">
                  <DollarSign className="w-8 h-8 text-secondary" />
                </div>
                <h3 className="text-lg font-bold mb-2">Best Prices</h3>
                <p className="text-sm text-muted-foreground">
                  Competitive rates with no hidden fees or charges
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg hover-lift">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 rounded-2xl bg-success/10 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-success" />
                </div>
                <h3 className="text-lg font-bold mb-2">Quality Assured</h3>
                <p className="text-sm text-muted-foreground">
                  Regular maintenance and safety checks on all vehicles
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Vehicles */}
      <section className="py-20 bg-gradient-to-br from-neutral-50 to-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
            <div>
              <Badge className="mb-3 bg-primary/10 text-primary hover:bg-primary/20">
                <TrendingUp className="w-3 h-3 mr-1" />
                Most Popular
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-3">Featured Vehicles</h2>
              <p className="text-lg text-muted-foreground">
                Handpicked selection of our most popular rentals
              </p>
            </div>
            <Button variant="outline" size="lg" className="group" asChild>
              <a href="/vehicles">
                View All Vehicles
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredVehicles.map((vehicle, idx) => (
              <VehicleCard key={vehicle.id} {...vehicle} priority={idx === 0} />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          <Badge className="mb-6 bg-accent/10 text-accent hover:bg-accent/20">
            Simple Process
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">How It Works</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-16">
            Get on the road in three simple steps
          </p>
          
          <div className="grid md:grid-cols-3 gap-12 relative">
            {/* Connection lines for desktop */}
            <div className="hidden md:block absolute top-16 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-primary via-accent to-secondary" />
            
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl bg-gradient-primary flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-3xl font-bold text-white">1</span>
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-lg hover-lift">
                <Search className="w-10 h-10 text-primary mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-3">Browse & Select</h3>
                <p className="text-muted-foreground">
                  Find the perfect car from our wide selection of vehicles across Kenya
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="w-20 h-20 rounded-2xl bg-gradient-accent flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-3xl font-bold text-white">2</span>
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-lg hover-lift">
                <CheckCircle className="w-10 h-10 text-accent mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-3">Book Securely</h3>
                <p className="text-muted-foreground">
                  Choose your dates and complete your booking in just a few minutes
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-secondary to-success flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-3xl font-bold text-white">3</span>
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-lg hover-lift">
                <Zap className="w-10 h-10 text-secondary mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-3">Drive Away</h3>
                <p className="text-muted-foreground">
                  Pick up your vehicle and enjoy the ride with full insurance coverage
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-6 bg-primary/10 text-primary hover:bg-primary/20">
              <Award className="w-3 h-3 mr-1" />
              Customer Reviews
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">What Our Customers Say</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Join thousands of satisfied customers who trust us for their car rental needs
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((testimonial, idx) => (
              <Card key={idx} className="border-none shadow-lg hover-lift">
                <CardContent className="p-8">
                  <div className="flex text-yellow-500 mb-4">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-current" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-6 italic">
                    "{testimonial.content}"
                  </p>
                  <div className="flex items-center gap-3">
                    <Avatar className="w-12 h-12 bg-gradient-primary">
                      <AvatarFallback className="text-white font-semibold">
                        {testimonial.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-primary text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-dots opacity-20" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Hit the Road?
          </h2>
          <p className="text-xl mb-10 opacity-90 max-w-2xl mx-auto">
            Book your perfect vehicle today and experience the freedom of the open road
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
                Contact Us
              </a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
