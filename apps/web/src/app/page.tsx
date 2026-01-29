"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Search } from "lucide-react";
import { VehicleCard } from "@/components/VehicleCard";
import { cn } from "@/lib/utils";

// Mock featured vehicles with WORKING Unsplash image URLs (2025+ compatible)
const featuredVehicles = [
  {
    id: "1",
    name: "Toyota Fortuner 2023",
    image: "https://images.unsplash.com/photo-1742697167580-af91e3ead35e?auto=format&fit=crop&q=80&w=800", // White SUV on road (similar style)
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
    image: "https://images.unsplash.com/photo-1551817280-6d59c77ce1b8?auto=format&fit=crop&q=80&w=800", // Gray Nissan Rogue SUV (close crossover match)
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
    image: "https://images.unsplash.com/photo-1687048988997-ec57f83ea3bd?auto=format&fit=crop&q=80&w=800", // Blue SUV parked (Forester-like)
    pricePerDay: 5500,
    seats: 5,
    transmission: "Manual" as const,
    fuelType: "Petrol",
    year: 2021,
    rating: 4.7,
    location: "Nairobi",
  },
];

export default function Home() {
  const [pickupDate, setPickupDate] = useState<Date | undefined>(undefined);
  const [returnDate, setReturnDate] = useState<Date | undefined>(undefined);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section
        className="relative bg-gradient-to-br from-primary/10 via-background to-accent/10"
        suppressHydrationWarning
      >
        <div className="container mx-auto px-4 py-20 md:py-32 text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Rent Your Perfect Ride in Kenya
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Choose from hundreds of vehicles. No hidden fees. Flexible pickup and drop-off.
          </p>

          {/* Search Bar */}
          <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-xl p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label
                  htmlFor="pickup-location"
                  className="block text-sm font-medium mb-2"
                >
                  Pickup Location
                </label>
                <Input
                  id="pickup-location"
                  placeholder="Nairobi, JKIA, Westlands..."
                />
              </div>

              <div suppressHydrationWarning>
                <label
                  htmlFor="pickup-date"
                  className="block text-sm font-medium mb-2"
                >
                  Pickup Date
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="pickup-date"
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
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
                  className="block text-sm font-medium mb-2"
                >
                  Return Date
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="return-date"
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
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

            <Button className="w-full mt-6 bg-accent hover:bg-accent/90 text-lg py-6">
              <Search className="mr-2 h-5 w-5" /> Search Vehicles
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Vehicles */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-3xl font-bold">Featured Vehicles</h2>
            <Button variant="outline" asChild>
              <a href="/vehicles">View All Vehicles</a>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredVehicles.map((vehicle, idx) => (
              <VehicleCard key={vehicle.id} {...vehicle} priority={idx === 0} />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works - Simple 3-step */}
      <section className="py-16 bg-neutral-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-10">
            <div className="bg-white p-8 rounded-xl shadow-sm">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-primary">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Browse & Select</h3>
              <p className="text-muted-foreground">Find the perfect car from our wide selection.</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-primary">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Book Securely</h3>
              <p className="text-muted-foreground">Choose dates and complete booking in minutes.</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-primary">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Drive Away</h3>
              <p className="text-muted-foreground">Pick up your vehicle and enjoy the ride.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
