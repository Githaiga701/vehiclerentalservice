"use client";

import { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Search, Loader2, Navigation } from "lucide-react";
import { toast } from "sonner";

// Dynamically import map components to avoid SSR issues
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import("react-leaflet").then((mod) => mod.Popup),
  { ssr: false }
);

interface LocationPickerProps {
  onLocationSelect: (location: {
    lat: number;
    lng: number;
    address: string;
    city: string;
  }) => void;
  initialLocation?: {
    lat: number;
    lng: number;
    address: string;
    city: string;
  };
  className?: string;
}

interface LocationSuggestion {
  display_name: string;
  lat: string;
  lon: string;
  address: {
    city?: string;
    town?: string;
    county?: string;
    state?: string;
    country?: string;
  };
}

export default function LocationPicker({
  onLocationSelect,
  initialLocation,
  className = "",
}: LocationPickerProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(
    initialLocation || {
      lat: -1.2921, // Nairobi coordinates
      lng: 36.8219,
      address: "Nairobi, Kenya",
      city: "Nairobi",
    }
  );
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  // Debounced search function
  const searchLocations = useCallback(
    async (query: string) => {
      if (!query.trim() || query.length < 3) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      setIsSearching(true);
      try {
        // Using Nominatim (OpenStreetMap) API for free geocoding
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=5&countrycodes=ke&q=${encodeURIComponent(
            query
          )}`
        );
        
        if (response.ok) {
          const data: LocationSuggestion[] = await response.json();
          setSuggestions(data);
          setShowSuggestions(true);
        }
      } catch (error) {
        console.error("Location search failed:", error);
        toast.error("Failed to search locations");
      } finally {
        setIsSearching(false);
      }
    },
    []
  );

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      searchLocations(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery, searchLocations]);

  const handleLocationSelect = (suggestion: LocationSuggestion) => {
    const location = {
      lat: parseFloat(suggestion.lat),
      lng: parseFloat(suggestion.lon),
      address: suggestion.display_name,
      city: suggestion.address.city || 
            suggestion.address.town || 
            suggestion.address.county || 
            "Unknown City",
    };

    setSelectedLocation(location);
    setSearchQuery(suggestion.display_name);
    setShowSuggestions(false);
    onLocationSelect(location);
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by this browser");
      return;
    }

    setIsGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          // Reverse geocoding to get address
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          
          if (response.ok) {
            const data = await response.json();
            const location = {
              lat: latitude,
              lng: longitude,
              address: data.display_name || `${latitude}, ${longitude}`,
              city: data.address?.city || 
                    data.address?.town || 
                    data.address?.county || 
                    "Unknown City",
            };
            
            setSelectedLocation(location);
            setSearchQuery(location.address);
            onLocationSelect(location);
            toast.success("Current location detected");
          }
        } catch (error) {
          console.error("Reverse geocoding failed:", error);
          // Still use coordinates even if reverse geocoding fails
          const location = {
            lat: latitude,
            lng: longitude,
            address: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
            city: "Unknown City",
          };
          
          setSelectedLocation(location);
          setSearchQuery(location.address);
          onLocationSelect(location);
          toast.success("Current location detected");
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        toast.error("Failed to get current location");
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
      }
    );
    
    setIsGettingLocation(false);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type="text"
            placeholder="Search for a location in Kenya..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-12"
          />
          {isSearching && (
            <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 animate-spin" />
          )}
        </div>

        {/* Current Location Button */}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={getCurrentLocation}
          disabled={isGettingLocation}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 px-2"
        >
          {isGettingLocation ? (
            <Loader2 className="w-3 h-3 animate-spin" />
          ) : (
            <Navigation className="w-3 h-3" />
          )}
        </Button>

        {/* Suggestions Dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <Card className="absolute top-full left-0 right-0 z-50 mt-1 max-h-60 overflow-y-auto">
            <CardContent className="p-0">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleLocationSelect(suggestion)}
                  className="w-full text-left p-3 hover:bg-gray-50 border-b last:border-b-0 flex items-start space-x-2"
                >
                  <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 truncate">
                      {suggestion.address.city || suggestion.address.town || "Unknown City"}
                    </div>
                    <div className="text-xs text-gray-500 truncate">
                      {suggestion.display_name}
                    </div>
                  </div>
                </button>
              ))}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Map */}
      <div className="h-64 w-full rounded-lg overflow-hidden border">
        <MapContainer
          center={[selectedLocation.lat, selectedLocation.lng]}
          zoom={13}
          style={{ height: "100%", width: "100%" }}
          key={`${selectedLocation.lat}-${selectedLocation.lng}`} // Force re-render when location changes
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[selectedLocation.lat, selectedLocation.lng]}>
            <Popup>
              <div className="text-sm">
                <div className="font-medium">{selectedLocation.city}</div>
                <div className="text-gray-600 text-xs mt-1">
                  {selectedLocation.address}
                </div>
              </div>
            </Popup>
          </Marker>
        </MapContainer>
      </div>

      {/* Selected Location Display */}
      <div className="flex items-center space-x-2 text-sm text-gray-600">
        <MapPin className="w-4 h-4" />
        <span className="truncate">{selectedLocation.address}</span>
      </div>
    </div>
  );
}