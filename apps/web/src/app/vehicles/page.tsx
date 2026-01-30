"use client";

import { useState } from "react";
import { VehicleCard } from "@/components/VehicleCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Search, 
  SlidersHorizontal, 
  Car,
  Filter,
  X
} from "lucide-react";
import { MOCK_VEHICLES, VEHICLE_CATEGORIES } from "@/lib/constants";

export default function VehiclesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("price-low");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [transmissionFilter, setTransmissionFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  // Client-side filtering & sorting
  const filteredVehicles = MOCK_VEHICLES
    .filter((vehicle) => {
      const matchesSearch =
        vehicle.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vehicle.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vehicle.category.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = categoryFilter === "all" || vehicle.category === categoryFilter;
      const matchesTransmission = transmissionFilter === "all" || vehicle.transmission === transmissionFilter;
      
      return matchesSearch && matchesCategory && matchesTransmission;
    })
    .sort((a, b) => {
      if (sortBy === "price-low") return a.pricePerDay - b.pricePerDay;
      if (sortBy === "price-high") return b.pricePerDay - a.pricePerDay;
      if (sortBy === "newest") return b.year - a.year;
      if (sortBy === "rating") return b.rating - a.rating;
      return 0;
    });

  const clearFilters = () => {
    setSearchQuery("");
    setCategoryFilter("all");
    setTransmissionFilter("all");
    setSortBy("price-low");
  };

  const hasActiveFilters = searchQuery || categoryFilter !== "all" || transmissionFilter !== "all";

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-white">
      {/* Hero Header */}
      <div className="bg-gradient-primary text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-dots opacity-20" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <Badge className="mb-4 bg-white/20 text-white hover:bg-white/30 border-white/30">
              <Car className="w-3 h-3 mr-1" />
              {MOCK_VEHICLES.length} Vehicles Available
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Find Your Perfect Vehicle
            </h1>
            <p className="text-xl opacity-90">
              Browse our extensive collection of well-maintained vehicles across Kenya
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Search and Filter Bar */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 -mt-12 relative z-20">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name, location, or category..."
                className="pl-12 h-12 text-base"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Category Filter */}
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full lg:w-[200px] h-12">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {VEHICLE_CATEGORIES.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Transmission Filter */}
            <Select value={transmissionFilter} onValueChange={setTransmissionFilter}>
              <SelectTrigger className="w-full lg:w-[200px] h-12">
                <SelectValue placeholder="Transmission" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Transmission</SelectItem>
                <SelectItem value="Automatic">Automatic</SelectItem>
                <SelectItem value="Manual">Manual</SelectItem>
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full lg:w-[200px] h-12">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
              </SelectContent>
            </Select>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <Button
                variant="outline"
                onClick={clearFilters}
                className="h-12"
              >
                <X className="w-4 h-4 mr-2" />
                Clear
              </Button>
            )}
          </div>
        </div>

        {/* Results Summary */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-bold">
              {filteredVehicles.length} {filteredVehicles.length === 1 ? 'Vehicle' : 'Vehicles'} Found
            </h2>
            {hasActiveFilters && (
              <p className="text-muted-foreground mt-1">
                Showing filtered results
              </p>
            )}
          </div>

          {/* Category Badges */}
          <div className="flex flex-wrap gap-2">
            {categoryFilter !== "all" && (
              <Badge variant="secondary" className="px-3 py-1">
                {VEHICLE_CATEGORIES.find(c => c.value === categoryFilter)?.label}
              </Badge>
            )}
            {transmissionFilter !== "all" && (
              <Badge variant="secondary" className="px-3 py-1">
                {transmissionFilter}
              </Badge>
            )}
          </div>
        </div>

        {/* Vehicles Grid */}
        <div className="w-full">
          {filteredVehicles.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl shadow-sm">
              <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
                <Car className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="text-2xl font-bold mb-3">No vehicles found</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                We couldn't find any vehicles matching your criteria. Try adjusting your filters or search terms.
              </p>
              <Button onClick={clearFilters} variant="outline">
                Clear All Filters
              </Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredVehicles.map((vehicle, idx) => (
                  <VehicleCard key={vehicle.id} {...vehicle} priority={idx < 3} />
                ))}
              </div>

              {/* Load More - Placeholder for pagination */}
              {filteredVehicles.length >= 12 && (
                <div className="mt-12 text-center">
                  <Button variant="outline" size="lg" className="px-8">
                    Load More Vehicles
                  </Button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Info Cards */}
        <div className="grid md:grid-cols-3 gap-6 mt-16">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-border">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <Car className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-bold text-lg mb-2">Wide Selection</h3>
            <p className="text-sm text-muted-foreground">
              From compact cars to luxury SUVs, find the perfect vehicle for any occasion
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-border">
            <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
              <SlidersHorizontal className="w-6 h-6 text-accent" />
            </div>
            <h3 className="font-bold text-lg mb-2">Flexible Options</h3>
            <p className="text-sm text-muted-foreground">
              Choose your pickup location, dates, and additional features to suit your needs
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-border">
            <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center mb-4">
              <Filter className="w-6 h-6 text-secondary" />
            </div>
            <h3 className="font-bold text-lg mb-2">Easy Filtering</h3>
            <p className="text-sm text-muted-foreground">
              Use our advanced filters to quickly find vehicles that match your requirements
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
