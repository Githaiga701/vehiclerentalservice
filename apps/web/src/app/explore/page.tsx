"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Filter, 
  MapPin, 
  Calendar,
  Users,
  Fuel,
  Settings,
  Star,
  ArrowRight,
  Compass,
  Mountain,
  Waves,
  Building2,
  TreePine,
  Camera,
  Heart,
  Zap,
  Shield,
  Award
} from "lucide-react";
import { VehicleCard } from "@/components/VehicleCard";
import { cn } from "@/lib/utils";
import { MOCK_VEHICLES } from "@/lib/constants";
import Link from "next/link";

const categories = [
  {
    id: "luxury",
    name: "Luxury",
    icon: Award,
    description: "Premium vehicles for special occasions",
    gradient: "from-purple-500 to-pink-500",
    bgGradient: "from-purple-50 to-pink-50",
    vehicles: MOCK_VEHICLES.filter(v => v.category === "Luxury")
  },
  {
    id: "suv",
    name: "SUV",
    icon: Mountain,
    description: "Perfect for adventures and family trips",
    gradient: "from-green-500 to-emerald-500",
    bgGradient: "from-green-50 to-emerald-50",
    vehicles: MOCK_VEHICLES.filter(v => v.category === "SUV")
  },
  {
    id: "sedan",
    name: "Sedan",
    icon: Building2,
    description: "Comfortable and efficient city driving",
    gradient: "from-blue-500 to-cyan-500",
    bgGradient: "from-blue-50 to-cyan-50",
    vehicles: MOCK_VEHICLES.filter(v => v.category === "Sedan")
  },
  {
    id: "compact",
    name: "Compact",
    icon: Zap,
    description: "Economical choice for urban mobility",
    gradient: "from-orange-500 to-red-500",
    bgGradient: "from-orange-50 to-red-50",
    vehicles: MOCK_VEHICLES.filter(v => v.category === "Compact")
  },
  {
    id: "matatu",
    name: "Matatu",
    icon: Users,
    description: "Group transportation for events and tours",
    gradient: "from-yellow-500 to-orange-500",
    bgGradient: "from-yellow-50 to-orange-50",
    vehicles: MOCK_VEHICLES.filter(v => v.category === "Matatu")
  },
  {
    id: "nganya",
    name: "Nganya",
    icon: Users,
    description: "30-seater buses for large group transportation",
    gradient: "from-indigo-500 to-purple-500",
    bgGradient: "from-indigo-50 to-purple-50",
    vehicles: MOCK_VEHICLES.filter(v => v.category === "Nganya")
  }
];

const destinations = [
  {
    name: "Nairobi City",
    image: "https://images.unsplash.com/photo-1611348524140-53c9a25263d6?auto=format&fit=crop&q=80&w=800",
    description: "Urban adventures in Kenya's capital",
    icon: Building2,
    vehicles: 120
  },
  {
    name: "Maasai Mara",
    image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&q=80&w=800",
    description: "Safari experiences in the wild",
    icon: TreePine,
    vehicles: 45
  },
  {
    name: "Mombasa Coast",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80&w=800",
    description: "Coastal drives and beach getaways",
    icon: Waves,
    vehicles: 78
  },
  {
    name: "Mount Kenya",
    image: "https://images.unsplash.com/photo-1605538883669-825200433431?auto=format&fit=crop&q=80&w=800",
    description: "Mountain adventures and scenic routes",
    icon: Mountain,
    vehicles: 32
  }
];

export default function ExplorePage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedOccasion, setSelectedOccasion] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Filter vehicles based on occasion
  const getVehiclesByOccasion = (occasion: string) => {
    const occasionMapping: { [key: string]: string[] } = {
      wedding: ["Luxury", "Sedan"],
      funeral: ["Sedan", "SUV"],
      graduation: ["Luxury", "Sedan"],
      roadtrip: ["SUV"],
      business: ["Luxury", "Sedan"],
      airport: ["Sedan", "SUV", "Luxury"],
      safari: ["SUV"],
      family: ["SUV", "Matatu", "Nganya"]
    };

    if (!occasion) return MOCK_VEHICLES;
    
    const suitableCategories = occasionMapping[occasion] || [];
    return MOCK_VEHICLES.filter(vehicle => 
      suitableCategories.includes(vehicle.category)
    );
  };

  const filteredVehicles = selectedCategory 
    ? categories.find(c => c.id === selectedCategory)?.vehicles || []
    : selectedOccasion 
    ? getVehiclesByOccasion(selectedOccasion)
    : MOCK_VEHICLES;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30">
      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 overflow-hidden">
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
          <div className={cn(
            "transition-all duration-1000 transform",
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          )}>
            <Badge className="mb-8 bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white border-white/20 hover:bg-white/10 backdrop-blur-sm px-6 py-2">
              <Compass className="w-4 h-4 mr-2" />
              Discover Your Perfect Ride
            </Badge>
          </div>

          <div className={cn(
            "transition-all duration-1000 delay-200 transform",
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          )}>
            <h1 className="text-6xl md:text-7xl font-black tracking-tight mb-8 text-white leading-tight">
              Explore Our
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Premium Fleet
              </span>
            </h1>
          </div>

          <div className={cn(
            "transition-all duration-1000 delay-400 transform",
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          )}>
            <p className="text-xl md:text-2xl text-blue-100 max-w-4xl mx-auto mb-12 leading-relaxed">
              From luxury sedans to rugged SUVs, discover the perfect vehicle for every journey across Kenya
            </p>
          </div>

          {/* Search Bar with Occasion Filter */}
          <div className={cn(
            "max-w-4xl mx-auto transition-all duration-1000 delay-600 transform",
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          )}>
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-6 border border-white/20">
              <div className="flex flex-col md:flex-row gap-4 mb-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
                  <Input
                    placeholder="Search by model, brand, or location..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 h-14 bg-white/10 border-white/20 text-white placeholder:text-white/60 backdrop-blur-sm"
                  />
                </div>
                <Button className="h-14 px-8 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-2xl">
                  <Filter className="mr-2 h-5 w-5" />
                  Filter
                </Button>
              </div>
              
              {/* Occasion Filter */}
              <div className="border-t border-white/20 pt-4">
                <label className="block text-sm font-semibold text-white/90 mb-3">
                  <Heart className="inline w-4 h-4 mr-2" />
                  Choose Your Occasion
                </label>
                <select 
                  className="w-full h-12 bg-white/10 border border-white/20 text-white rounded-xl px-4 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={selectedOccasion}
                  onChange={(e) => {
                    setSelectedOccasion(e.target.value);
                    setSelectedCategory(null); // Clear category filter when occasion is selected
                  }}
                >
                  <option value="" className="bg-slate-800 text-white">All Occasions</option>
                  <option value="wedding" className="bg-slate-800 text-white">Weddings</option>
                  <option value="funeral" className="bg-slate-800 text-white">Funerals</option>
                  <option value="graduation" className="bg-slate-800 text-white">Graduations</option>
                  <option value="roadtrip" className="bg-slate-800 text-white">Road Trips</option>
                  <option value="business" className="bg-slate-800 text-white">Business Events</option>
                  <option value="airport" className="bg-slate-800 text-white">Airport Transfers</option>
                  <option value="safari" className="bg-slate-800 text-white">Safari Adventures</option>
                  <option value="family" className="bg-slate-800 text-white">Family Outings</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vehicle Categories */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-blue-700 border-blue-200">
              <Heart className="w-4 h-4 mr-2" />
              Vehicle Categories
            </Badge>
            <h2 className="text-5xl md:text-6xl font-black mb-6 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              Choose Your Style
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Every journey deserves the perfect vehicle. Explore our curated categories designed for every adventure.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {categories.map((category, idx) => (
              <Card 
                key={category.id}
                className={cn(
                  "group cursor-pointer border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-white/80 backdrop-blur-sm",
                  selectedCategory === category.id && "ring-2 ring-blue-500 shadow-2xl -translate-y-2",
                  "transition-all duration-700 transform",
                  isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
                )}
                style={{ transitionDelay: `${idx * 100}ms` }}
                onClick={() => setSelectedCategory(selectedCategory === category.id ? null : category.id)}
              >
                <CardContent className="p-8 text-center">
                  <div className={cn(
                    "w-20 h-20 rounded-3xl bg-gradient-to-br flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300",
                    category.bgGradient
                  )}>
                    <category.icon className={cn("w-10 h-10 bg-gradient-to-r bg-clip-text text-transparent", category.gradient)} />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-slate-800">{category.name}</h3>
                  <p className="text-slate-600 mb-4 leading-relaxed">{category.description}</p>
                  <Badge variant="secondary" className="bg-slate-100 text-slate-700">
                    {category.vehicles.length} vehicles
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Vehicle Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredVehicles.slice(0, 9).map((vehicle, idx) => (
              <div
                key={vehicle.id}
                className={cn(
                  "transition-all duration-700 transform",
                  isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
                )}
                style={{ transitionDelay: `${(idx + 4) * 100}ms` }}
              >
                <VehicleCard {...vehicle} />
              </div>
            ))}
          </div>

          {selectedCategory && (
            <div className="text-center mt-12">
              <Button size="lg" variant="outline" className="group border-2 border-blue-200 hover:bg-blue-50 px-8 py-4 rounded-2xl" asChild>
                <Link href={`/vehicles?category=${selectedCategory}`}>
                  View All {categories.find(c => c.id === selectedCategory)?.name} Vehicles
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="py-24 bg-gradient-to-br from-white to-blue-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(59,130,246,0.05)_50%,transparent_75%)] bg-[length:60px_60px]"></div>
        
        <div className="container mx-auto px-4 relative">
          <div className="text-center mb-16">
            <Badge className="mb-6 bg-gradient-to-r from-green-500/10 to-blue-500/10 text-green-700 border-green-200">
              <MapPin className="w-4 h-4 mr-2" />
              Popular Destinations
            </Badge>
            <h2 className="text-5xl md:text-6xl font-black mb-6 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              Where Will You Go?
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Discover Kenya's most breathtaking destinations with the perfect vehicle for every terrain
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {destinations.map((destination, idx) => (
              <Card 
                key={destination.name}
                className={cn(
                  "group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-white",
                  "transition-all duration-700 transform",
                  isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
                )}
                style={{ transitionDelay: `${idx * 150}ms` }}
              >
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={destination.image} 
                    alt={destination.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <destination.icon className="w-6 h-6 mb-2" />
                    <h3 className="text-lg font-bold">{destination.name}</h3>
                  </div>
                </div>
                <CardContent className="p-6">
                  <p className="text-slate-600 mb-4">{destination.description}</p>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="bg-blue-50 text-blue-700">
                      {destination.vehicles} vehicles
                    </Badge>
                    <Button size="sm" variant="ghost" className="group">
                      Explore
                      <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-dots opacity-20" />
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <Badge className="mb-8 bg-white/10 text-white border-white/20 hover:bg-white/20 backdrop-blur-sm px-6 py-2">
            <Shield className="w-4 h-4 mr-2" />
            Premium Features
          </Badge>
          
          <h2 className="text-5xl md:text-6xl font-black mb-6">
            Why Choose Our Fleet?
          </h2>
          
          <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-16">
            Every vehicle in our collection meets the highest standards of quality, safety, and performance
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: "Fully Insured",
                description: "Comprehensive coverage and 24/7 roadside assistance"
              },
              {
                icon: Award,
                title: "Premium Quality",
                description: "Regular maintenance and safety inspections"
              },
              {
                icon: Zap,
                title: "Instant Booking",
                description: "Book in minutes with our streamlined process"
              }
            ].map((feature, idx) => (
              <div 
                key={feature.title}
                className={cn(
                  "text-center transition-all duration-700 transform",
                  isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
                )}
                style={{ transitionDelay: `${idx * 200}ms` }}
              >
                <div className="w-20 h-20 rounded-3xl bg-white/10 backdrop-blur-sm flex items-center justify-center mx-auto mb-6">
                  <feature.icon className="w-10 h-10 text-blue-300" />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-blue-100">{feature.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-16">
            <Button size="lg" className="bg-white text-slate-900 hover:bg-white/90 px-8 py-4 rounded-2xl font-semibold group" asChild>
              <Link href="/vehicles">
                Browse All Vehicles
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}