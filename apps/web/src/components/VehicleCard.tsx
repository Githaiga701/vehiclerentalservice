// components/VehicleCard.tsx
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Star, Users, Gauge, MapPin, Fuel, Calendar, ArrowRight, Heart, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

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
    <Card className="group overflow-hidden transition-all hover:shadow-2xl hover:-translate-y-3 duration-500 border-none shadow-lg bg-white/80 backdrop-blur-sm hover:bg-white">
      {/* Image Section with Enhanced Effects */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200">
        <Image
          src={image}
          alt={name}
          fill
          priority={priority}
          loading={priority ? "eager" : "lazy"}
          className="object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-1"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        
        {/* Enhanced Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
        
        {/* Animated Shimmer Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
        
        {/* Enhanced Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {isAvailable ? (
            <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 shadow-lg border-0 text-white font-semibold animate-pulse-glow">
              <Zap className="w-3 h-3 mr-1" />
              Available
            </Badge>
          ) : (
            <Badge variant="secondary" className="bg-slate-800/80 text-white backdrop-blur-sm shadow-lg border-0">
              Booked
            </Badge>
          )}
          {category && (
            <Badge variant="outline" className="bg-white/90 backdrop-blur-sm shadow-lg border-white/50 text-slate-700 font-medium">
              {category}
            </Badge>
          )}
        </div>

        {/* Enhanced Rating Badge */}
        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-xl px-3 py-2 shadow-lg flex items-center gap-1.5 group-hover:scale-110 transition-transform duration-300">
          <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
          <span className="text-sm font-bold text-slate-800">{rating.toFixed(1)}</span>
        </div>

        {/* Favorite Button */}
        <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
          <Button size="sm" variant="secondary" className="rounded-full w-10 h-10 p-0 bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg">
            <Heart className="w-4 h-4" />
          </Button>
        </div>

        {/* Hover Overlay Content */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
          <Button className="bg-white text-slate-900 hover:bg-white/90 shadow-xl font-semibold px-6 py-3 rounded-xl" asChild>
            <a href={`/vehicles/${id}`}>
              Quick View
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </div>
      </div>

      <CardHeader className="p-6 pb-4">
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-bold mb-2 truncate group-hover:text-blue-600 transition-colors duration-300">
              {name}
            </h3>
            <div className="flex items-center gap-1.5 text-sm text-slate-500">
              <MapPin className="h-4 w-4 text-blue-500" />
              <span className="font-medium">{location}</span>
            </div>
          </div>
          <div className="text-right flex-shrink-0">
            <div className="text-2xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              KSh {pricePerDay.toLocaleString()}
            </div>
            <div className="text-xs text-slate-500 font-medium">per day</div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6 pt-0 space-y-5">
        {/* Enhanced Specs Grid */}
        <div className="grid grid-cols-2 gap-4">
          {[
            { icon: Users, label: "Seats", value: seats, color: "blue" },
            { icon: Gauge, label: "Trans.", value: transmission, color: "purple" },
            { icon: Fuel, label: "Fuel", value: fuelType, color: "green" },
            { icon: Calendar, label: "Year", value: year, color: "orange" }
          ].map((spec, idx) => (
            <div key={spec.label} className="flex items-center gap-3 text-sm group/spec">
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover/spec:scale-110",
                spec.color === "blue" && "bg-blue-50 group-hover/spec:bg-blue-100",
                spec.color === "purple" && "bg-purple-50 group-hover/spec:bg-purple-100",
                spec.color === "green" && "bg-green-50 group-hover/spec:bg-green-100",
                spec.color === "orange" && "bg-orange-50 group-hover/spec:bg-orange-100"
              )}>
                <spec.icon className={cn(
                  "h-5 w-5",
                  spec.color === "blue" && "text-blue-600",
                  spec.color === "purple" && "text-purple-600",
                  spec.color === "green" && "text-green-600",
                  spec.color === "orange" && "text-orange-600"
                )} />
              </div>
              <div>
                <div className="text-xs text-slate-500 font-medium">{spec.label}</div>
                <div className="font-bold text-slate-800">{spec.value}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Enhanced Features */}
        {features && features.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {features.slice(0, 2).map((feature, idx) => (
              <Badge 
                key={idx} 
                variant="secondary" 
                className="text-xs px-3 py-1 font-medium bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
              >
                {feature}
              </Badge>
            ))}
            {features.length > 2 && (
              <Badge 
                variant="secondary" 
                className="text-xs px-3 py-1 font-medium bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 hover:from-blue-200 hover:to-purple-200 transition-all"
              >
                +{features.length - 2} more
              </Badge>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className="p-6 pt-0">
        <Button 
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg group/btn font-semibold py-6 rounded-xl transition-all duration-300 hover:shadow-xl" 
          size="lg"
          asChild
        >
          <a href={`/vehicles/${id}`}>
            Book Now
            <ArrowRight className="ml-2 h-5 w-5 group-hover/btn:translate-x-1 transition-transform duration-300" />
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
}
