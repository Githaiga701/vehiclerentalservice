// components/VehicleCard.tsx
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Star, Users, Gauge, MapPin, Fuel, Calendar, ArrowRight } from "lucide-react";

interface VehicleCardProps {
  vehicle?: {
    id: string;
    name?: string;
    title?: string;
    image?: string;
    images?: string;
    pricePerDay?: number;
    dailyPrice?: number;
    seats: number;
    transmission: "Automatic" | "Manual";
    fuelType: string;
    year: number;
    rating?: number;
    isAvailable?: boolean;
    location?: string;
    category?: string;
    features?: string[];
    description?: string;
  };
  // Legacy props for backward compatibility
  id?: string;
  name?: string;
  title?: string;
  image?: string;
  images?: string;
  pricePerDay?: number;
  dailyPrice?: number;
  seats?: number;
  transmission?: "Automatic" | "Manual";
  fuelType?: string;
  year?: number;
  rating?: number;
  isAvailable?: boolean;
  location?: string;
  priority?: boolean;
  category?: string;
  features?: string[];
}

export function VehicleCard(props: VehicleCardProps) {
  // Support both vehicle prop and individual props for backward compatibility
  const vehicle = props.vehicle || props;
  
  const {
    id,
    name: vehicleName,
    title,
    image: vehicleImage,
    images,
    pricePerDay: vehiclePricePerDay,
    dailyPrice,
    seats,
    transmission,
    fuelType,
    year,
    rating = 4.5,
    isAvailable = true,
    location = "Nairobi",
    category = "SUV",
    features = [],
  } = vehicle;

  // Handle different property names from API vs mock data
  const name = vehicleName || title || "Unknown Vehicle";
  const image = vehicleImage || (typeof images === 'string' ? JSON.parse(images)?.[0] : images?.[0]) || "/placeholder-car.jpg";
  const pricePerDay = vehiclePricePerDay || dailyPrice || 0;

  const priority = props.priority || false;
  return (
    <Card className="group overflow-hidden transition-all hover:shadow-2xl hover:-translate-y-2 duration-300 border-none shadow-lg">
      {/* Image Section */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-100">
        <Image
          src={image}
          alt={name}
          fill
          priority={priority}
          loading={priority ? "eager" : "lazy"}
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {isAvailable ? (
            <Badge className="bg-success hover:bg-success shadow-lg">
              Available
            </Badge>
          ) : (
            <Badge variant="secondary" className="shadow-lg">
              Booked
            </Badge>
          )}
          {category && (
            <Badge variant="outline" className="bg-white/90 backdrop-blur-sm shadow-lg">
              {category}
            </Badge>
          )}
        </div>

        {/* Rating Badge */}
        <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm rounded-lg px-2 py-1 shadow-lg flex items-center gap-1">
          <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
          <span className="text-sm font-bold">{rating.toFixed(1)}</span>
        </div>
      </div>

      <CardHeader className="p-5 pb-3">
        <div className="flex justify-between items-start gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-bold mb-1 truncate group-hover:text-primary transition-colors">
              {name}
            </h3>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" />
              <span>{location}</span>
            </div>
          </div>
          <div className="text-right flex-shrink-0">
            <div className="text-2xl font-bold text-accent">
              KSh {pricePerDay.toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground">per day</div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-5 pt-0 space-y-4">
        {/* Specs Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 text-sm">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Users className="h-4 w-4 text-primary" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Seats</div>
              <div className="font-semibold">{seats}</div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
              <Gauge className="h-4 w-4 text-accent" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Trans.</div>
              <div className="font-semibold">{transmission}</div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0">
              <Fuel className="h-4 w-4 text-secondary" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Fuel</div>
              <div className="font-semibold">{fuelType}</div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center flex-shrink-0">
              <Calendar className="h-4 w-4 text-success" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Year</div>
              <div className="font-semibold">{year}</div>
            </div>
          </div>
        </div>

        {/* Features - Show first 2 */}
        {features && features.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {features.slice(0, 2).map((feature, idx) => (
              <Badge 
                key={idx} 
                variant="secondary" 
                className="text-xs px-2 py-0.5 font-normal"
              >
                {feature}
              </Badge>
            ))}
            {features.length > 2 && (
              <Badge 
                variant="secondary" 
                className="text-xs px-2 py-0.5 font-normal"
              >
                +{features.length - 2} more
              </Badge>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className="p-5 pt-0">
        <Button 
          className="w-full bg-gradient-accent hover:opacity-90 text-white shadow-lg group/btn" 
          size="lg"
          asChild
        >
          <a href={`/vehicles/${id}`}>
            View Details
            <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
}
