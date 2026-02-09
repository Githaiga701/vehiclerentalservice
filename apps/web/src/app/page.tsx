"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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
  Play,
  Car
} from "lucide-react";
import { VehicleCard } from "@/components/VehicleCard";
import { cn } from "@/lib/utils";
import { MOCK_VEHICLES, TESTIMONIALS } from "@/lib/constants";
import { trackBusinessEvents, trackUserJourney } from "@/lib/analytics";
import Link from "next/link";

// Featured vehicles (first 6)
const featuredVehicles = MOCK_VEHICLES.slice(0, 6);

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    // Track landing page view
    trackUserJourney.landingPageView();
  }, []);

  return (
    <div className="flex flex-col overflow-hidden">
      {/* Hero Section with Enhanced Gradients, Animations and Vehicle Background */}
      <section
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
      >
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          {/* Hero Background Image */}
          <div className="absolute inset-0">
            <img 
              src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=2000"
              alt="Modern vehicles on Kenyan highway"
              className="w-full h-full object-cover"
              loading="eager"
            />
          </div>
          {/* Dark overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 via-blue-900/85 to-indigo-900/90"></div>
          
          {/* Additional gradient overlays for depth */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-600/20 via-transparent to-transparent"></div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-purple-600/20 via-transparent to-transparent"></div>
        </div>
        
        {/* Vehicle Background Image with Motion - Now more subtle overlay */}
        <div className="absolute inset-0 overflow-hidden opacity-30">
          <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-full h-full">
            <div className="relative w-full h-full">
              {/* Animated Car Silhouette */}
              <div className="absolute right-[-20%] top-1/2 transform -translate-y-1/2 w-[120%] h-[80%] animate-float">
                <svg viewBox="0 0 800 400" className="w-full h-full">
                  <defs>
                    <linearGradient id="carGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="rgba(59, 130, 246, 0.4)" />
                      <stop offset="50%" stopColor="rgba(147, 51, 234, 0.4)" />
                      <stop offset="100%" stopColor="rgba(6, 182, 212, 0.4)" />
                    </linearGradient>
                  </defs>
                  {/* Modern SUV Silhouette */}
                  <path
                    d="M100 250 L150 200 L200 180 L300 170 L500 170 L600 180 L650 200 L700 250 L680 280 L650 290 L600 295 L580 300 L220 300 L200 295 L150 290 L120 280 Z"
                    fill="url(#carGradient)"
                    className="animate-pulse"
                  />
                  {/* Wheels */}
                  <circle cx="220" cy="300" r="35" fill="rgba(255, 255, 255, 0.3)" className="animate-spin-slow" />
                  <circle cx="580" cy="300" r="35" fill="rgba(255, 255, 255, 0.3)" className="animate-spin-slow" />
                  {/* Windows */}
                  <path
                    d="M200 200 L250 180 L450 180 L500 200 L480 220 L220 220 Z"
                    fill="rgba(255, 255, 255, 0.15)"
                  />
                  {/* Headlights */}
                  <ellipse cx="680" cy="230" rx="15" ry="8" fill="rgba(255, 255, 255, 0.5)" className="animate-pulse" />
                  <ellipse cx="680" cy="250" rx="15" ry="8" fill="rgba(255, 255, 255, 0.5)" className="animate-pulse delay-500" />
                </svg>
              </div>
              
              {/* Motion Lines */}
              <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-full h-full">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute right-0 w-32 h-0.5 bg-gradient-to-l from-transparent to-white/30 animate-motion-line"
                    style={{
                      top: `${45 + i * 2}%`,
                      animationDelay: `${i * 0.2}s`,
                      animationDuration: '2s'
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
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
        
        <div className="container mx-auto px-4 py-24 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Main Content */}
            <div className="text-left">
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
                <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-8 text-white leading-tight">
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
                <p className="text-xl md:text-2xl text-blue-100 max-w-2xl mb-12 leading-relaxed">
                  Discover freedom with our premium fleet of vehicles. From luxury sedans to rugged SUVs, 
                  find your perfect ride for any adventure across Kenya.
                </p>
              </div>

              {/* Action Buttons */}
              <div className={cn(
                "flex flex-col sm:flex-row gap-4 mb-12 transition-all duration-1000 delay-600 transform",
                isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
              )}>
                <Button size="lg" asChild className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-4 rounded-2xl font-semibold group">
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

              {/* Enhanced Stats with Animation */}
              <div className={cn(
                "flex flex-wrap gap-8 transition-all duration-1000 delay-800 transform",
                isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
              )}>
                <div className="text-center group">
                  <div className="text-3xl md:text-4xl font-black text-white mb-2 group-hover:scale-110 transition-transform">
                    500<span className="text-blue-400">+</span>
                  </div>
                  <div className="text-blue-200 font-medium text-sm">Premium Vehicles</div>
                </div>
                <div className="text-center group">
                  <div className="text-3xl md:text-4xl font-black text-white mb-2 group-hover:scale-110 transition-transform">
                    15K<span className="text-purple-400">+</span>
                  </div>
                  <div className="text-blue-200 font-medium text-sm">Happy Customers</div>
                </div>
                <div className="text-center group">
                  <div className="text-3xl md:text-4xl font-black text-white mb-2 group-hover:scale-110 transition-transform">
                    4.9<span className="text-yellow-400">★</span>
                  </div>
                  <div className="text-blue-200 font-medium text-sm">Customer Rating</div>
                </div>
                <div className="text-center group">
                  <div className="text-3xl md:text-4xl font-black text-white mb-2 group-hover:scale-110 transition-transform">
                    24<span className="text-green-400">/7</span>
                  </div>
                  <div className="text-blue-200 font-medium text-sm">Support Available</div>
                </div>
              </div>
            </div>

            {/* Right Column - Services Preview */}
            <div className={cn(
              "transition-all duration-1000 delay-1000 transform",
              isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
            )}>
              <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20">
                <h3 className="text-2xl font-bold text-white mb-6 text-center">
                  <Heart className="inline w-6 h-6 mr-2" />
                  What We Offer
                </h3>
                
                <div className="space-y-4">
                  {[
                    {
                      icon: Car,
                      title: "Vehicle Rentals",
                      description: "Hours, days, or weeks",
                      color: "text-blue-300"
                    },
                    {
                      icon: DollarSign,
                      title: "List & Earn",
                      description: "Make money from your car",
                      color: "text-green-300"
                    },
                    {
                      icon: CalendarIcon,
                      title: "Long-term Leasing",
                      description: "6+ months at great rates",
                      color: "text-purple-300"
                    },
                    {
                      icon: Users,
                      title: "Group Transport",
                      description: "Matatus & Nganyas available",
                      color: "text-orange-300"
                    },
                    {
                      icon: Star,
                      title: "Special Occasions",
                      description: "Weddings, events & more",
                      color: "text-pink-300"
                    },
                    {
                      icon: Shield,
                      title: "Fully Protected",
                      description: "Insurance & 24/7 support",
                      color: "text-cyan-300"
                    }
                  ].map((service, idx) => (
                    <div 
                      key={idx}
                      className="flex items-center space-x-4 p-3 rounded-xl hover:bg-white/5 transition-all duration-300 group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <service.icon className={cn("w-5 h-5", service.color)} />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-white font-semibold text-sm">{service.title}</h4>
                        <p className="text-blue-200 text-xs">{service.description}</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-white/60 group-hover:translate-x-1 transition-transform" />
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-6 border-t border-white/20">
                  <Button className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-semibold rounded-xl group" asChild>
                    <Link href="/list-car">
                      <DollarSign className="mr-2 h-4 w-4" />
                      Start Earning Today
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Search Bar - Now below the main content */}
          <div className={cn(
            "max-w-6xl mx-auto mt-16 transition-all duration-1000 delay-1200 transform",
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          )}>
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20">
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-white mb-2">Find Your Perfect Vehicle</h3>
                <p className="text-blue-200 text-sm">Search from our premium collection</p>
              </div>
              
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

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-white/90">
                    <CalendarIcon className="inline w-4 h-4 mr-2" />
                    Pickup Date
                  </label>
                  <Input
                    type="date"
                    className="h-14 bg-white/10 border-white/20 text-white placeholder:text-white/60 backdrop-blur-sm [&::-webkit-calendar-picker-indicator]:invert"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-white/90">
                    <CalendarIcon className="inline w-4 h-4 mr-2" />
                    Return Date
                  </label>
                  <Input
                    type="date"
                    className="h-14 bg-white/10 border-white/20 text-white placeholder:text-white/60 backdrop-blur-sm [&::-webkit-calendar-picker-indicator]:invert"
                  />
                </div>
              </div>

              <Button 
                asChild
                className="w-full h-16 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white text-lg font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                <Link 
                  href="/explore"
                  onClick={() => trackBusinessEvents.ctaClick('Find Vehicle', 'Hero Search')}
                >
                  <Search className="mr-3 h-6 w-6" /> 
                  Search Vehicles
                  <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Enhanced Benefits Section with Service Offerings */}
      <section className="py-24 bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-100/20 via-transparent to-transparent"></div>
        
        <div className="container mx-auto px-4 relative">
          <div className="text-center mb-16">
            <Badge className="mb-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-blue-700 border-blue-200">
              <Heart className="w-4 h-4 mr-2" />
              Our Complete Services
            </Badge>
            <h2 className="text-5xl md:text-6xl font-black mb-6 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              Everything You Need
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              From quick rentals to long-term leasing, we've got every transportation need covered
            </p>
          </div>

          {/* Service Offerings Checkboxes */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {[
              {
                icon: CheckCircle,
                title: "Vehicle Booking",
                description: "Rent cars for hours, days, or weeks with flexible pricing",
                gradient: "from-blue-500 to-cyan-500",
                bgGradient: "from-blue-50 to-cyan-50"
              },
              {
                icon: CheckCircle,
                title: "Vehicle Listing",
                description: "List your car and earn money from other users",
                gradient: "from-green-500 to-emerald-500",
                bgGradient: "from-green-50 to-emerald-50"
              },
              {
                icon: CheckCircle,
                title: "Long-term Leasing",
                description: "Lease vehicles for 6 months to 1+ years at discounted rates",
                gradient: "from-purple-500 to-pink-500",
                bgGradient: "from-purple-50 to-pink-50"
              },
              {
                icon: CheckCircle,
                title: "Matatus Available",
                description: "Public service vehicles for group transportation needs",
                gradient: "from-orange-500 to-red-500",
                bgGradient: "from-orange-50 to-red-50"
              },
              {
                icon: CheckCircle,
                title: "Nganyas (30-seater buses)",
                description: "Large capacity buses perfect for group events and long-distance travel",
                gradient: "from-yellow-500 to-orange-500",
                bgGradient: "from-yellow-50 to-orange-50"
              },
              {
                icon: CheckCircle,
                title: "Special Occasions",
                description: "Curated vehicles for weddings, funerals, graduations & more",
                gradient: "from-indigo-500 to-purple-500",
                bgGradient: "from-indigo-50 to-purple-50"
              }
            ].map((service, idx) => (
              <Card key={idx} className="group border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-white/80 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className={cn(
                      "w-12 h-12 rounded-2xl bg-gradient-to-br flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300",
                      service.bgGradient
                    )}>
                      <service.icon className={cn("w-6 h-6 bg-gradient-to-r bg-clip-text text-transparent", service.gradient)} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold mb-2 text-slate-800">{service.title}</h3>
                      <p className="text-slate-600 text-sm leading-relaxed">{service.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Traditional Benefits */}
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

      {/* Enhanced Testimonials Section */}
      <section className="py-24 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-blue-600/20 via-transparent to-transparent"></div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-purple-600/20 via-transparent to-transparent"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <Badge className="mb-6 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-300 border-yellow-400/20">
              <Star className="w-4 h-4 mr-2" />
              Customer Stories
            </Badge>
            <h2 className="text-5xl md:text-6xl font-black mb-6">
              What Our
              <br />
              <span className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
                Customers Say
              </span>
            </h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Join thousands of satisfied customers who trust us for their transportation needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {TESTIMONIALS.slice(0, 6).map((testimonial, idx) => (
              <Card key={idx} className="bg-white/10 backdrop-blur-xl border-white/20 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-blue-100 mb-6 leading-relaxed">"{testimonial.content}"</p>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback className="bg-white/20 text-white">
                        {testimonial.name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-blue-200">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="py-24 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(59,130,246,0.05)_50%,transparent_75%)] bg-[length:60px_60px]"></div>
        
        <div className="container mx-auto px-4 text-center relative">
          <Badge className="mb-8 bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-blue-700 border-blue-200">
            <Zap className="w-4 h-4 mr-2" />
            Get Started Today
          </Badge>
          
          <h2 className="text-5xl md:text-6xl font-black mb-6 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
            Ready to Hit the Road?
          </h2>
          
          <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-12">
            Join thousands of satisfied customers and experience the freedom of premium vehicle rentals
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 px-8 py-4 rounded-2xl font-semibold group" asChild>
              <Link href="/explore">
                <Search className="mr-2 h-5 w-5" />
                Browse Vehicles
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-2 border-blue-200 hover:bg-blue-50 px-8 py-4 rounded-2xl font-semibold group" asChild>
              <Link href="/list-car">
                <DollarSign className="mr-2 h-5 w-5" />
                List Your Car
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>

          {/* Final Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-black text-slate-800 mb-2">500+</div>
              <div className="text-slate-600 font-medium">Vehicles Available</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-black text-slate-800 mb-2">15K+</div>
              <div className="text-slate-600 font-medium">Happy Customers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-black text-slate-800 mb-2">47</div>
              <div className="text-slate-600 font-medium">Counties Covered</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-black text-slate-800 mb-2">24/7</div>
              <div className="text-slate-600 font-medium">Customer Support</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
