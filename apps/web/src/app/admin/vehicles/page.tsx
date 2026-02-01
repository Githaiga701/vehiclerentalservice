"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Car, 
  Search, 
  Filter,
  MapPin,
  DollarSign,
  Users,
  Gauge,
  Fuel,
  CheckCircle2,
  XCircle,
  Eye,
  Loader2,
  AlertCircle,
  ArrowLeft
} from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

// Mock vehicles data
const mockVehicles = [
  {
    id: "v1",
    title: "Toyota Fortuner 2023",
    category: "SUV",
    dailyPrice: 8500,
    location: "Nairobi - Westlands",
    seats: 7,
    transmission: "Automatic",
    fuelType: "Diesel",
    year: 2023,
    isAvailable: true,
    isApproved: true,
    ownerName: "Mary Wanjiku",
    ownerPhone: "+254723456789",
    images: ["https://images.unsplash.com/photo-1742697167580-af91e3ead35e?auto=format&fit=crop&q=80&w=400"],
    createdAt: "2026-01-15",
    totalBookings: 12,
  },
  {
    id: "v2",
    title: "Nissan X-Trail 2022",
    category: "SUV",
    dailyPrice: 6500,
    location: "Mombasa - CBD",
    seats: 5,
    transmission: "Automatic",
    fuelType: "Petrol",
    year: 2022,
    isAvailable: true,
    isApproved: false,
    ownerName: "John Kamau",
    ownerPhone: "+254734567890",
    images: ["https://images.unsplash.com/photo-1551817280-6d59c77ce1b8?auto=format&fit=crop&q=80&w=400"],
    createdAt: "2026-01-20",
    totalBookings: 0,
  },
  {
    id: "v3",
    title: "Toyota Prado 2024",
    category: "SUV",
    dailyPrice: 9500,
    location: "Kisumu - Town",
    seats: 7,
    transmission: "Automatic",
    fuelType: "Diesel",
    year: 2024,
    isAvailable: false,
    isApproved: true,
    ownerName: "Sarah Njeri",
    ownerPhone: "+254745678901",
    images: ["https://images.unsplash.com/photo-1533473359331-35acde7260c9?auto=format&fit=crop&q=80&w=400"],
    createdAt: "2026-01-10",
    totalBookings: 8,
  },
  {
    id: "v4",
    title: "Honda CR-V 2021",
    category: "SUV",
    dailyPrice: 6000,
    location: "Nakuru - CBD",
    seats: 5,
    transmission: "Automatic",
    fuelType: "Petrol",
    year: 2021,
    isAvailable: true,
    isApproved: true,
    ownerName: "Peter Mwangi",
    ownerPhone: "+254756789012",
    images: ["https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=400"],
    createdAt: "2026-01-25",
    totalBookings: 5,
  },
];

export default function AdminVehiclesPage() {
  const { user, isAuthenticated, isLoading, isAdmin } = useAuth();
  const router = useRouter();
  const [vehicles, setVehicles] = useState(mockVehicles);
  const [filteredVehicles, setFilteredVehicles] = useState(mockVehicles);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [isLoadingData, setIsLoadingData] = useState(true);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login");
    } else if (!isLoading && !isAdmin) {
      router.replace("/");
    }
  }, [isAuthenticated, isLoading, isAdmin, router]);

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoadingData(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Filter vehicles based on search, status, and category
    let filtered = vehicles;

    if (searchQuery) {
      filtered = filtered.filter(vehicle =>
        vehicle.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vehicle.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vehicle.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      if (statusFilter === "approved") {
        filtered = filtered.filter(vehicle => vehicle.isApproved);
      } else if (statusFilter === "pending") {
        filtered = filtered.filter(vehicle => !vehicle.isApproved);
      } else if (statusFilter === "available") {
        filtered = filtered.filter(vehicle => vehicle.isAvailable);
      } else if (statusFilter === "unavailable") {
        filtered = filtered.filter(vehicle => !vehicle.isAvailable);
      }
    }

    if (categoryFilter !== "all") {
      filtered = filtered.filter(vehicle => vehicle.category === categoryFilter);
    }

    setFilteredVehicles(filtered);
  }, [searchQuery, statusFilter, categoryFilter, vehicles]);

  const handleApprovalToggle = (vehicleId: string) => {
    setVehicles(prev =>
      prev.map(vehicle =>
        vehicle.id === vehicleId ? { ...vehicle, isApproved: !vehicle.isApproved } : vehicle
      )
    );
  };

  const handleAvailabilityToggle = (vehicleId: string) => {
    setVehicles(prev =>
      prev.map(vehicle =>
        vehicle.id === vehicleId ? { ...vehicle, isAvailable: !vehicle.isAvailable } : vehicle
      )
    );
  };

  if (isLoading || isLoadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading vehicles...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <Card className="max-w-md text-center p-8">
          <AlertCircle className="h-12 w-12 mx-auto text-destructive mb-4" />
          <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
          <p className="text-muted-foreground mb-6">
            This page is only available to administrators.
          </p>
          <Button asChild className="w-full">
            <a href="/admin/dashboard">Back to Dashboard</a>
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => router.push("/admin/dashboard")}
                className="p-2"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-3xl font-bold">Manage Vehicles</h1>
                <p className="text-muted-foreground mt-1">
                  View and manage all platform vehicles
                </p>
              </div>
            </div>
            <Badge variant="secondary" className="px-3 py-1">
              {filteredVehicles.length} vehicles
            </Badge>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Filter className="h-5 w-5" />
              <span>Filters</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search by vehicle name, owner, or location..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="w-full lg:w-48">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="pending">Pending Approval</SelectItem>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="unavailable">Unavailable</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="w-full lg:w-48">
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="SUV">SUV</SelectItem>
                    <SelectItem value="Sedan">Sedan</SelectItem>
                    <SelectItem value="Hatchback">Hatchback</SelectItem>
                    <SelectItem value="Pickup">Pickup</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Vehicles List */}
        <div className="space-y-4">
          {filteredVehicles.length === 0 ? (
            <Card>
              <CardContent className="py-16 text-center">
                <Car className="h-16 w-16 mx-auto text-gray-400 mb-6" />
                <h3 className="text-2xl font-semibold mb-3">No vehicles found</h3>
                <p className="text-muted-foreground text-lg">
                  {searchQuery || statusFilter !== "all" || categoryFilter !== "all"
                    ? "Try adjusting your filters" 
                    : "No vehicles have been added yet"
                  }
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredVehicles.map((vehicle) => (
              <Card key={vehicle.id} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                    {/* Left side - Vehicle info */}
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-gray-100">
                        <Image
                          src={vehicle.images[0]}
                          alt={vehicle.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <h3 className="text-lg font-semibold">{vehicle.title}</h3>
                            <Badge variant="outline" className="text-xs">
                              {vehicle.category}
                            </Badge>
                            <Badge className={cn(
                              "text-xs",
                              vehicle.isApproved 
                                ? "bg-green-100 text-green-800 border-green-200" 
                                : "bg-yellow-100 text-yellow-800 border-yellow-200"
                            )}>
                              {vehicle.isApproved ? "Approved" : "Pending"}
                            </Badge>
                            <Badge className={cn(
                              "text-xs",
                              vehicle.isAvailable 
                                ? "bg-blue-100 text-blue-800 border-blue-200" 
                                : "bg-red-100 text-red-800 border-red-200"
                            )}>
                              {vehicle.isAvailable ? "Available" : "Unavailable"}
                            </Badge>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-green-600">
                              KSh {vehicle.dailyPrice.toLocaleString()}/day
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {vehicle.totalBookings} bookings
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                          <div className="flex items-center space-x-2">
                            <Users className="w-4 h-4 text-muted-foreground" />
                            <span>{vehicle.seats} seats</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Gauge className="w-4 h-4 text-muted-foreground" />
                            <span>{vehicle.transmission}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Fuel className="w-4 h-4 text-muted-foreground" />
                            <span>{vehicle.fuelType}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <MapPin className="w-4 h-4 text-muted-foreground" />
                            <span>{vehicle.location}</span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span>👤 Owner: {vehicle.ownerName}</span>
                          <span>📞 {vehicle.ownerPhone}</span>
                          <span>📅 Added {vehicle.createdAt}</span>
                        </div>
                      </div>
                    </div>

                    {/* Right side - Actions */}
                    <div className="flex flex-col space-y-2 lg:ml-6">
                      {!vehicle.isApproved && (
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => handleApprovalToggle(vehicle.id)}
                        >
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          Approve
                        </Button>
                      )}
                      
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleAvailabilityToggle(vehicle.id)}
                          className={vehicle.isAvailable ? "border-red-600 text-red-600 hover:bg-red-50" : "border-green-600 text-green-600 hover:bg-green-50"}
                        >
                          {vehicle.isAvailable ? (
                            <>
                              <XCircle className="w-3 h-3 mr-1" />
                              Disable
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className="w-3 h-3 mr-1" />
                              Enable
                            </>
                          )}
                        </Button>
                        
                        <Button size="sm" variant="outline">
                          <Eye className="w-3 h-3 mr-1" />
                          View
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}