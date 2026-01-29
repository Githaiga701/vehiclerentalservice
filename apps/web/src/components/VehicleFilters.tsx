"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface VehicleFiltersProps {
  filters: {
    minPrice: number;
    maxPrice: number;
    seats: string;
    transmission: string;
  };
  setFilters: (filters: any) => void;
}

export function VehicleFilters({ filters, setFilters }: VehicleFiltersProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Filters</h3>
        <button
          className="text-sm text-primary hover:underline"
          onClick={() =>
            setFilters({
              minPrice: 0,
              maxPrice: 20000,
              seats: "all",
              transmission: "all",
            })
          }
        >
          Reset
        </button>
      </div>

      {/* Price Range */}
      <div className="mb-8">
        <Label className="mb-4 block">Min Price (KSh)</Label>
        <Input
          type="number"
          value={filters.minPrice}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setFilters((prev: any) => ({ ...prev, minPrice: Number(e.target.value) }))
          }
          placeholder="0"
        />
        <Label className="mb-4 block mt-4">Max Price (KSh)</Label>
        <Input
          type="number"
          value={filters.maxPrice}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setFilters((prev: any) => ({ ...prev, maxPrice: Number(e.target.value) }))
          }
          placeholder="20000"
        />
      </div>

      <hr className="my-6" />

      {/* Seats */}
      <div className="mb-8">
        <Label className="mb-4 block">Number of Seats</Label>
        <div className="space-y-2">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              name="seats"
              value="all"
              checked={filters.seats === "all"}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFilters((prev: any) => ({ ...prev, seats: e.target.value }))
              }
              className="w-4 h-4"
            />
            <span>Any</span>
          </label>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              name="seats"
              value="5"
              checked={filters.seats === "5"}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFilters((prev: any) => ({ ...prev, seats: e.target.value }))
              }
              className="w-4 h-4"
            />
            <span>5 seats</span>
          </label>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              name="seats"
              value="7"
              checked={filters.seats === "7"}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFilters((prev: any) => ({ ...prev, seats: e.target.value }))
              }
              className="w-4 h-4"
            />
            <span>7+ seats</span>
          </label>
        </div>
      </div>

      <hr className="my-6" />

      {/* Transmission */}
      <div>
        <Label className="mb-4 block">Transmission</Label>
        <div className="space-y-2">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              name="transmission"
              value="all"
              checked={filters.transmission === "all"}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFilters((prev: any) => ({ ...prev, transmission: e.target.value }))
              }
              className="w-4 h-4"
            />
            <span>Any</span>
          </label>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              name="transmission"
              value="automatic"
              checked={filters.transmission === "automatic"}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFilters((prev: any) => ({ ...prev, transmission: e.target.value }))
              }
              className="w-4 h-4"
            />
            <span>Automatic</span>
          </label>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              name="transmission"
              value="manual"
              checked={filters.transmission === "manual"}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFilters((prev: any) => ({ ...prev, transmission: e.target.value }))
              }
              className="w-4 h-4"
            />
            <span>Manual</span>
          </label>
        </div>
      </div>
    </div>
  );
}