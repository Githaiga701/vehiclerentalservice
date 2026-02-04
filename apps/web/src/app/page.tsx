"use client";

import { useState, useEffect } from "react";
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
  TrendingUp,
  Sparkles,
  Globe,
  Heart,
  Play
} from "lucide-react";
import { VehicleCard } from "@/components/VehicleCard";
import { cn } from "@/lib/utils";
import { MOCK_VEHICLES, TESTIMONIALS } from "@/lib/constants";
import Link from "next/link";

// Featured vehicles (first 6)
const featuredVehicles = MOCK_VEHICLES.slice(0, 6);

export default function Home() {
  const [pickupDate, setPickupDate] = useState<Date | undefined>(undefined);
  const [returnDate, setReturnDate] = useState<Date | undefined>(undefined);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="flex flex-col overflow-hidden">
      {/* Hero Section with Enhanced Gradients and Animations */}
      <section
        className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 overflow-hidden"
        suppressHydrationWarning
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-600/20 via-transparent to-transparent"></div>
          <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-purple-600/20 via-transparent to-transparent"></div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-32 h-32 bg-blue-500/10 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-purple-500/10 rounded-full blur-xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-indigo-500/10 rounded-full blur-xl animate-pulse delay-2000"></div>
          <div className="absolute bottom-20 right-1/3 w-28 h-28 bg-cyan-500/10 rounded-full blur-xl animate-pulse delay-3000"></div>
        </div>

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
        
        <div className="container mx-auto px-4 py-24 text-center relative z-10">
          {/* Animated Badge */}
          <div className={cn(
            "transition-all duration-1000 transform",
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          )}>
            <Badge className="mb-8 bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white border-white/20 hover:bg-white/10 backdrop-blur-sm px-6 py-2 text-sm">
              <Sparkles className="w-4 h-4 mr-2" />
              Kenya's Premier Car Rental Experience
            </Badge>
          </div>
          
          {/* Main Heading with Staggered Animation */}
          <div className={cn(
            "transition-all duration-1000 delay-200 transform",
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          )}>
            <h1 className="text-6xl md:text-8xl font-black tracking-tight mb-8 text-white leading-tight">
              Drive Your
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Dream Journey
              </span>
            </h1>
          </div>
          
          {/* Subtitle */}
          <div className={cn(
            "transition-all duration-1000 delay-400 transform",
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          )}>
            <p className="text-xl md:text-2xl text-blue-100 max-w-4xl mx-auto mb-12 leading-relaxed">
              Discover freedom with our premium fleet of vehicles. From luxury sedans to rugged SUVs, 
              <br className="hidden md:block" />
              find your perfect ride for any adventure across Kenya.
            </p>
          </div>

          {/* Enhanced Stats with Animation */}
          <div className={cn(
            "flex flex-wrap justify-center gap-12 mb-16 transition-all duration-1000 delay-600 transform",
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          )}>
            <div className="text-center group">
              <div className="text-4xl md:text-5xl font-black text-white mb-2 group-hover:scale-110 transition-transform">
                500<span className="text-blue-400">+</span>
              </div>
              <div className="text-blue-200 font-medium">Premium Vehicles</div>
            </div>
            <div className="text-center group">
              <div className="text-4xl md:text-5xl font-black text-white mb-2 group-hover:scale-110 transition-transform">
                15K<span className="text-purple-400">+</span>
              </div>
              <div className="text-blue-200 font-medium">Happy Customers</div>
            </div>
            <div className="text-center group">
              <div className="text-4xl md:text-5xl font-black text-white mb-2 group-hover:scale-110 transition-transform">
                4.9<span className="text-yellow-400">★</span>
              </div>
              <div className="text-blue-200 font-medium">Customer Rating</div>
            </div>
            <div className="text-center group">
              <div className="text-4xl md:text-5xl font-black text-white mb-2 group-hover:scale-110 transition-transform">
                24<span className="text-green-400">/7</span>
              </div>
              <div className="text-blue-200 font-medium">Support Available</div>
            </div>
          </div>

          {/* Enhanced Search Bar */}
          <div className={cn(
            "max-w-6xl mx-auto transition-all duration-1000 delay-800 transform",
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          )}>
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-white/90">
                    <MapPin className="inline w-4 h-4 mr-2" />
                    Pickup Location
                  </label>
                  <Input
                    placeholder="Nairobi, JKIA, Westlands..."
                    className="h-14 bg-white/10 border-white/20 text-white placeholder:text-white/60 backdrop-blur-sm"
                  />
                </div>

                <div className="space-y-2" suppressHydrationWarning>
                  <label className="block text-sm font-semibold text-white/90">
                    <CalendarIcon className="inline w-4 h-4 mr-2" />
                    Pickup Date
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full h-14 justify-start text-left font-normal bg-white/10 border-white/20 text-white hover:bg-white/20",
                          !pickupDate && "text-white/60"
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

                <div className="space-y-2" suppressHydrationWarning>
                  <label className="block text-sm font-semibold text-white/90">
                    <CalendarIcon className="inline w-4 h-4 mr-2" />
                    Return Date
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full h-14 justify-start text-left font-normal bg-white/10 border-white/20 text-white hover:bg-white/20",
                          !returnDate && "text-white/60"
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

              <Button className="w-full h-16 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white text-lg font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group">
                <Search className="mr-3 h-6 w-6" /> 
                Find Your Perfect Vehicle
                <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className={cn(
            "flex flex-col sm:flex-row gap-4 justify-center mt-12 transition-all duration-1000 delay-1000 transform",
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          )}>
            <Button size="lg" asChild className="bg-white text-slate-900 hover:bg-white/90 px-8 py-4 rounded-2xl font-semibold group">
              <Link href="/explore">
                <Globe className="mr-2 h-5 w-5" />
                Explore Collection
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 px-8 py-4 rounded-2xl font-semibold backdrop-blur-sm group">
              <Play className="mr-2 h-5 w-5" />
              Watch Demo
            </Button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Enhanced Benefits Section */}
      <section className="py-24 bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-100/20 via-transparent to-transparent"></div>
        
        <div className="container mx-auto px-4 relative">
          <div className="text-center mb-16">
            <Badge className="mb-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-blue-700 border-blue-200">
              <Heart className="w-4 h-4 mr-2" />
              Why Choose Us
            </Badge>
            <h2 className="text-5xl md:text-6xl font-black mb-6 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              Premium Experience
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              We don't just rent cars, we deliver exceptional experiences that exceed expectations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Shield,
                title: "Fully Protected",
                description: "Comprehensive insurance and 24/7 roadside assistance included",
                gradient: "from-blue-500 to-cyan-500",
                bgGradient: "from-blue-50 to-cyan-50"
              },
              {
                icon: Clock,
                title: "Instant Booking",
                description: "Book in minutes with our streamlined digital process",
                gradient: "from-purple-500 to-pink-500",
                bgGradient: "from-purple-50 to-pink-50"
              },
              {
                icon: DollarSign,
                title: "Best Value",
                description: "Transparent pricing with no hidden fees or surprises",
                gradient: "from-green-500 to-emerald-500",
                bgGradient: "from-green-50 to-emerald-50"
              },
              {
                icon: Award,
                title: "Premium Fleet",
                description: "Meticulously maintained vehicles from top brands",
                gradient: "from-orange-500 to-red-500",
                bgGradient: "from-orange-50 to-red-50"
              }
            ].map((benefit, idx) => (
              <Card key={idx} className="group border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-white/80 backdrop-blur-sm">
                <CardContent className="p-8 text-center">
                  <div className={cn(
                    "w-20 h-20 rounded-3xl bg-gradient-to-br flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300",
                    benefit.bgGradient
                  )}>
                    <benefit.icon className={cn("w-10 h-10 bg-gradient-to-r bg-clip-text text-transparent", benefit.gradient)} />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-slate-800">{benefit.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* List Your Car Call-to-Action Section */}
      <section className="py-24 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-blue-600/20 via-transparent to-transparent"></div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-purple-600/20 via-transparent to-transparent"></div>
        </div>

        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-32 h-32 bg-blue-500/10 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-purple-500/10 rounded-full blur-xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-indigo-500/10 rounded-full blur-xl animate-pulse delay-2000"></div>
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <Badge className="mb-8 bg-gradient-to-r from-green-500/20 to-blue-500/20 text-white border-white/20 hover:bg-white/10 backdrop-blur-sm px-6 py-2">
            <DollarSign className="w-4 h-4 mr-2" />
            Earn Extra Income
          </Badge>
          
          <h2 className="text-5xl md:text-6xl font-black mb-6">
            Turn Your Car Into
            <br />
            <span className="bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Cash Flow
            </span>
          </h2>
          
          <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-12">
            Join thousands of vehicle owners earning money by sharing their cars. 
            Set your own schedule, rates, and availability.
          </p>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-12 mb-12">
            <div className="text-center group">
              <div className="text-4xl md:text-5xl font-black text-white mb-2 group-hover:scale-110 transition-transform">
                KSh 50K<span className="text-green-400">+</span>
              </div>
              <div className="text-blue-200 font-medium">Average Monthly Earnings</div>
            </div>
            <div className="text-center group">
              <div className="text-4xl md:text-5xl font-black text-white mb-2 group-hover:scale-110 transition-transform">
                2K<span className="text-blue-400">+</span>
              </div>
              <div className="text-blue-200 font-medium">Active Hosts</div>
            </div>
            <div className="text-center group">
              <div className="text-4xl md:text-5xl font-black text-white mb-2 group-hover:scale-110 transition-transform">
                95<span className="text-purple-400">%</span>
              </div>
              <div className="text-blue-200 font-medium">Host Satisfaction</div>
            </div>
          </div>

          {/* Benefits Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {[
              {
                icon: DollarSign,
                title: "Flexible Earnings",
                description: "Set your own rates and availability schedule"
              },
              {
                icon: Shield,
                title: "Full Protection",
                description: "Comprehensive insurance coverage included"
              },
              {
                icon: Clock,
                title: "Easy Management",
                description: "Simple dashboard to manage bookings and payments"
              }
            ].map((benefit, idx) => (
              <div key={idx} className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="w-8 h-8 text-green-300" />
                </div>
                <h3 className="text-xl font-bold mb-3">{benefit.title}</h3>
                <p className="text-blue-100">{benefit.description}</p>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 px-8 py-4 rounded-2xl font-semibold group" asChild>
              <Link href="/list-car">
                <DollarSign className="mr-2 h-5 w-5" />
                List Your Car
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 px-8 py-4 rounded-2xl font-semibold backdrop-blur-sm">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Enhanced Featured Vehicles */}
      <section className="py-24 bg-gradient-to-br from-slate-50 to-blue-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(59,130,246,0.05)_50%,transparent_75%)] bg-[length:60px_60px]"></div>
        
        <div className="container mx-auto px-4 relative">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-16 gap-8">
            <div>
              <Badge className="mb-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-blue-700 border-blue-200">
                <TrendingUp className="w-4 h-4 mr-2" />
                Most Popular
              </Badge>
              <h2 className="text-5xl md:text-6xl font-black mb-4 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                Featured Collection
              </h2>
              <p className="text-xl text-slate-600 max-w-2xl">
                Handpicked premium vehicles that deliver exceptional performance and comfort
              </p>
            </div>
            <Button size="lg" variant="outline" className="group border-2 border-blue-200 hover:bg-blue-50 px-8 py-4 rounded-2xl" asChild>
              <Link href="/vehicles">
                View All Vehicles
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredVehicles.map((vehicle, idx) => (
              <div
                key={vehicle.id}
                className={cn(
                  "transition-all duration-700 transform",
                  isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
                )}
                style={{ transitionDelay: `${idx * 100}ms` }}
              >
                <VehicleCard {...vehicle} priority={idx === 0} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Rest of the sections remain the same but with enhanced styling... */}
      {/* I'll continue with the remaining sections in the next part */}
    </div>
  );
}
