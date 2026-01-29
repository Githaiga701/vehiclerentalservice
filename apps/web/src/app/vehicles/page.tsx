"use client";

import { useState } from "react";
import { VehicleCard } from "@/components/VehicleCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, SlidersHorizontal } from "lucide-react";

// Extended mock data (you can expand this or connect to backend later)
const allVehicles = [
  {
    id: "1",
    name: "Toyota Fortuner 2023",
    image: "https://images.unsplash.com/photo-1742697167580-af91e3ead35e?auto=format&fit=crop&q=80&w=800",
    pricePerDay: 8500,
    seats: 7,
    transmission: "Automatic" as const,
    fuelType: "Diesel",
    year: 2023,
    rating: 4.8,
    location: "Nairobi",
  },
  {
    id: "2",
    name: "Nissan X-Trail 2022",
    image: "https://images.unsplash.com/photo-1551817280-6d59c77ce1b8?auto=format&fit=crop&q=80&w=800",
    pricePerDay: 6500,
    seats: 5,
    transmission: "Automatic" as const,
    fuelType: "Petrol",
    year: 2022,
    rating: 4.6,
    location: "Mombasa",
  },
  {
    id: "3",
    name: "Subaru Forester 2021",
    image: "https://images.unsplash.com/photo-1687048988997-ec57f83ea3bd?auto=format&fit=crop&q=80&w=800",
    pricePerDay: 5500,
    seats: 5,
    transmission: "Manual" as const,
    fuelType: "Petrol",
    year: 2021,
    rating: 4.7,
    location: "Nairobi",
  },
  {
    id: "4",
    name: "Toyota Prado 2024",
    image: "https://images.unsplash.com/photo-1533473359331-35acde7260c9?auto=format&fit=crop&q=80&w=800",
    pricePerDay: 9500,
    seats: 7,
    transmission: "Automatic" as const,
    fuelType: "Diesel",
    year: 2024,
    rating: 4.9,
    location: "Nairobi",
  },
  // Add 5–10 more if you want a fuller grid for testing
];

export default function VehiclesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("price-low");

  // Simple client-side filtering & sorting
  const filteredVehicles = allVehicles
    .filter((vehicle) => {
      const matchesSearch =
        vehicle.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vehicle.location.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === "price-low") return a.pricePerDay - b.pricePerDay;
      if (sortBy === "price-high") return b.pricePerDay - a.pricePerDay;
      if (sortBy === "newest") return b.year - a.year;
      return 0;
    });

  return (
    <div className="min-h-screen bg-neutral-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header + Search + Sort */}
        <div className="mb-8 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <h1 className="text-3xl md:text-4xl font-bold">Available Vehicles</h1>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative w-full min-w-[260px] md:w-80">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name or location..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="newest">Newest First</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="w-full">
          {/* Vehicles Grid */}
          <div className="w-full">
            {filteredVehicles.length === 0 ? (
              <div className="text-center py-20">
                <h3 className="text-xl font-medium mb-2">No vehicles found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your filters or search terms
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredVehicles.map((vehicle) => (
                  <VehicleCard key={vehicle.id} {...vehicle} />
                ))}
              </div>
            )}

            {/* Simple "Load more" button – can be replaced with real pagination later */}
            {filteredVehicles.length > 0 && (
              <div className="mt-12 text-center">
                <Button variant="outline" size="lg">
                  Load More Vehicles
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}