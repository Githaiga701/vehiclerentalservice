import { useState, useEffect, useCallback } from "react";
import { Vehicle } from "@/types/vehicle";

interface UseVehiclesOptions {
  limit?: number;
  location?: string;
  category?: string;
}

export function useVehicles(options: UseVehiclesOptions = {}) {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchVehicles = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const params = new URLSearchParams();
      if (options.limit) params.append("limit", options.limit.toString());
      if (options.location) params.append("location", options.location);
      if (options.category) params.append("category", options.category);
      
      const response = await fetch(`/api/vehicles?${params}`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch vehicles");
      }
      
      const data = await response.json();
      setVehicles(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Unknown error"));
    } finally {
      setIsLoading(false);
    }
  }, [options.limit, options.location, options.category]);

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  return { vehicles, isLoading, error, refetch: fetchVehicles };
}