// components/VehicleCard.tsx
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, Users, Gauge } from "lucide-react";

interface VehicleCardProps {
  id: string;
  name: string;
  image: string;
  pricePerDay: number;
  seats: number;
  transmission: "Automatic" | "Manual";
  fuelType: string;
  year: number;
  rating?: number;
  isAvailable?: boolean;
  location?: string;
  priority?: boolean;
}

export function VehicleCard({
  id,
  name,
  image,
  pricePerDay,
  seats,
  transmission,
  fuelType,
  year,
  rating = 4.5,
  isAvailable = true,
  location = "Nairobi",
  priority = false,
}: VehicleCardProps) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1 duration-300">
      <div className="relative aspect-[4/3] w-full">
        <Image
          src={image}
          alt={name}
          fill
          priority={priority}
          loading={priority ? "eager" : "lazy"}
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {isAvailable ? (
          <Badge className="absolute top-3 left-3 bg-green-600 hover:bg-green-600">
            Available
          </Badge>
        ) : (
          <Badge variant="secondary" className="absolute top-3 left-3">
            Booked
          </Badge>
        )}
      </div>

      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold">{name}</CardTitle>
          <div className="text-right">
            <p className="text-xl font-bold text-accent">KSh {pricePerDay.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">per day</p>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mt-1">{location}</p>
      </CardHeader>

      <CardContent className="p-4 pt-0">
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{seats} seats</span>
          </div>
          <div className="flex items-center gap-1">
            <Gauge className="h-4 w-4" />
            <span>{transmission}</span>
          </div>
          <div className="flex items-center gap-1">
            <span>{year}</span>
          </div>
        </div>

        <div className="mt-3 flex items-center gap-1">
          <div className="flex text-yellow-500">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className="h-4 w-4"
                fill={i < Math.floor(rating) ? "currentColor" : "none"}
              />
            ))}
          </div>
          <span className="text-sm font-medium">{rating.toFixed(1)}</span>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button className="w-full bg-accent hover:bg-accent/90" asChild>
          <a href={`/vehicles/${id}`}>View Details</a>
        </Button>
      </CardFooter>
    </Card>
  );
}