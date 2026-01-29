"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { format } from "date-fns";
import { CalendarIcon, Users, Gauge, Fuel, DollarSign, Star } from "lucide-react";
import { VehicleCard } from "@/components/VehicleCard";
import { cn } from "@/lib/utils";

// Mock data – in a real app this would come from params.id + API/database
const vehicleData = {
  id: "1",
  name: "Toyota Fortuner 2023",
  slug: "toyota-fortuner-2023",
  mainImage: "https://images.unsplash.com/photo-1742697167580-af91e3ead35e?auto=format&fit=crop&q=80&w=1200",
  gallery: [
    "https://images.unsplash.com/photo-1742697167580-af91e3ead35e?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1533473359331-35acde7260c9?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1551817280-6d59c77ce1b8?auto=format&fit=crop&q=80&w=800",
  ],
  pricePerDay: 8500,
  seats: 7,
  transmission: "Automatic",
  fuelType: "Diesel",
  year: 2023,
  rating: 4.8,
  location: "Nairobi - Westlands / JKIA",
  description:
    "Spacious and powerful 7-seater SUV perfect for family trips, safaris, or business travel across Kenya. Excellent road presence, reliable performance, and modern features including touchscreen infotainment, reverse camera, and hill descent control.",
  features: [
    "Leather seats",
    "Bluetooth & Android Auto",
    "Rear AC vents",
    "4x4 capability",
    "Cruise control",
    "Parking sensors",
  ],
};

const similarVehicles = [
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
];

export default function VehicleDetailPage({ params }: { params: { id: string } }) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const vehicle = vehicleData; // Later: fetch based on params.id

  return (
    <div className="min-h-screen bg-neutral-50 pb-16">
      <div className="container mx-auto px-4 pt-8">
        {/* Breadcrumb */}
        <div className="text-sm text-muted-foreground mb-6">
          <a href="/" className="hover:text-primary">
            Home
          </a>{" "}
          /{" "}
          <a href="/vehicles" className="hover:text-primary">
            Vehicles
          </a>{" "}
          / <span className="text-foreground">{vehicle.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column - Images & Description */}
          <div className="lg:col-span-2 space-y-10">
            {/* Improved Gallery - Main Carousel + Thumbnails */}
            <div className="space-y-6">
              {/* Main large carousel */}
              <Carousel className="w-full">
                <CarouselContent>
                  {vehicle.gallery.map((img, idx) => (
                    <CarouselItem key={idx}>
                      <div className="relative aspect-[4/3] rounded-xl overflow-hidden shadow-lg">
                        <Image
                          src={img}
                          alt={`${vehicle.name} - ${idx + 1}`}
                          fill
                          sizes="(max-width: 1024px) 100vw, (max-width: 1280px) 66vw, 900px"
                          className="object-cover"
                          priority={idx === 0}
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-4" />
                <CarouselNext className="right-4" />
              </Carousel>

              {/* Thumbnail carousel below */}
              <Carousel
                opts={{
                  align: "start",
                  loop: true,
                  dragFree: true,
                }}
                className="w-full"
              >
                <CarouselContent className="-ml-2">
                  {vehicle.gallery.map((img, idx) => (
                    <CarouselItem key={idx} className="basis-1/3 sm:basis-1/4 pl-2">
                      <div className="relative aspect-square rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity border-2 border-transparent hover:border-primary">
                        <Image
                          src={img}
                          alt={`Thumbnail ${idx + 1}`}
                          fill
                          sizes="(max-width: 768px) 25vw, 100px"
                          className="object-cover"
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
            </div>

            {/* Description & Features */}
            <div>
              <h2 className="text-2xl font-bold mb-4">About this vehicle</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">{vehicle.description}</p>

              <h3 className="text-xl font-semibold mb-4">Features</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {vehicle.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <Badge variant="outline" className="text-primary border-primary/30">
                      {feature}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right column - Sticky booking card */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 bg-white rounded-xl shadow-lg border p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-accent">
                    KSh {vehicle.pricePerDay.toLocaleString()}
                  </h2>
                  <p className="text-sm text-muted-foreground">per day</p>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-5 w-5 fill-yellow-500 text-yellow-500" />
                  <span className="font-medium">{vehicle.rating}</span>
                </div>
              </div>

              {/* Quick specs */}
              <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  <span>{vehicle.seats} seats</span>
                </div>
                <div className="flex items-center gap-2">
                  <Gauge className="h-5 w-5 text-muted-foreground" />
                  <span>{vehicle.transmission}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Fuel className="h-5 w-5 text-muted-foreground" />
                  <span>{vehicle.fuelType}</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-muted-foreground" />
                  <span>{vehicle.year}</span>
                </div>
              </div>

              {/* Simple date picker demo */}
              <div className="mb-6">
                <Label className="mb-2 block">Pickup Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !selectedDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? format(selectedDate, "PPP") : <span>Select date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <Button className="w-full bg-accent hover:bg-accent/90 text-lg py-6 mb-4">
                Book Now
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                Free cancellation up to 24 hours before pickup • No hidden fees
              </p>
            </div>
          </div>
        </div>

        {/* Similar Vehicles */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold mb-8">Similar Vehicles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {similarVehicles.map((v) => (
              <VehicleCard key={v.id} {...v} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}