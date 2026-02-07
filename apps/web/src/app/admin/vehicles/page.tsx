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
  ArrowLeft,
  RefreshCw
} from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";

interface Vehicle {
  id: string;
  title: string;
  category: string;
  dailyPrice: number;
  location: string;
  seats: number;
  transmission: string;
  fuelType: string;
  year: number;
  isAvailable: boolean;
  status: string;
  owner: {
    id: string;
    name: string;
    phone: string;
  };
  images: string;
  createdAt: string;
  bookings?: any[];
}

export default function AdminVehiclesPage() {
  const { user, isAuthenticated, isLoading, isAdmin } = useAuth();
  const router = useRouter();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login");
    } else if (!isLoading && !isAdmin) {
      router.replace("/");
    }
  }, [isAuthenticated, isLoading, isAdmin, router]);

  const fetchVehicles = async () => {
    try {
      setIsLoadingData(true);
      const response = await apiClient.getVehicles();
      setVehicles(response.data || []);
    } catch (error) {
      console.error('Failed to fetch vehicles:', error);
      toast.error('Failed to load vehicles');
    } finally {
      setIsLoadingData(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      fetchVehicles();
    }
  }, [isAuthenticated, isAdmin]);

  useEffect(() => {
    // Filter vehicles based on search, status, and category
    let filtered = vehicles;

    if (searchQuery) {
      filtered = filtered.filter(vehicle =>
        vehicle.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vehicle.owner.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vehicle.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      if (statusFilter === "approved") {
        filtered = filtered.filter(vehicle => vehicle.status === "APPROVED");
      } else if (statusFilter === "pending") {
        filtered = filtered.filter(vehicle => vehicle.status === "PENDING");
      } else if (statusFilter === "rejected") {
        filtered = filtered.filter(vehicle => vehicle.status === "REJECTED");
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

  const handleApprove = async (vehicleId: string) => {
    try {
      await apiClient.approveVehicle(vehicleId);
      toast.success('Vehicle approved successfully');
      fetchVehicles();
    } catch (error) {
      console.error('Failed to approve vehicle:', error);
      toast.error('Failed to approve vehicle');
    }
  };

  const handleReject = async (vehicleId: string) => {
    try {
      await apiClient.rejectVehicle(vehicleId, 'Does not meet platform standards');
      toast.success('Vehicle rejected');
      fetchVehicles();
    } catch (error) {
      console.error('Failed to reject vehicle:', error);
      toast.error('Failed to reject vehicle');
    }
  };

  const handleAvailabilityToggle = async (vehicleId: string, currentStatus: boolean) => {
    try {
      await apiClient.updateVehicleAvailability(vehicleId, !currentStatus);
      toast.success(`Vehicle ${!currentStatus ? 'enabled' : 'disabled'} successfully`);
      fetchVehicles();
    } catch (error) {
      console.error('Failed to update availability:', error);
      toast.error('Failed to update availability');
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchVehicles();
  };

  const parseImages = (imagesStr: string): string[] => {
    try {
      const parsed = JSON.parse(imagesStr);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
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

  const pendingCount = vehicles.filter(v => v.status === "PENDING").length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => router.push("/admin/dashboard")}
                className="p-2 hover:bg-white/20 text-white"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-4xl font-bold mb-2">Manage Vehicles</h1>
                <p className="text-emerald-100 text-lg">
                  View and manage all platform vehicles 🚗
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {pendingCount > 0 && (
                <Badge className="px-4 py-2 bg-yellow-500 text-white text-base">
                  {pendingCount} pending approval
                </Badge>
              )}
              <Badge className="px-4 py-2 bg-white/20 backdrop-blur-sm border-white/30 text-white text-base">
                {filteredVehicles.length} vehicles
              </Badge>
              <Button
                variant="ghost"
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="p-2 hover:bg-white/20 text-white"
              >
                <RefreshCw className={cn("h-5 w-5", isRefreshing && "animate-spin")} />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filters */}
        <Card className="mb-6 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-t-lg">
            <CardTitle className="flex items-center space-x-2 text-emerald-900">
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
                    <SelectItem value="pending">Pending Approval</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
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
            filteredVehicles.map((vehicle) => {
              const images = parseImages(vehicle.images);
              const imageUrl = images[0] || 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=400';
              const totalBookings = vehicle.bookings?.length || 0;
              
              return (
              <Card key={vehicle.id} className="overflow-hidden shadow-md hover:shadow-xl transition-all border-l-4 border-l-emerald-500 bg-white/90 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                    {/* Left side - Vehicle info */}
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-gray-100">
                        <Image
                          src={imageUrl}
                          alt={vehicle.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3 flex-wrap gap-2">
                            <h3 className="text-lg font-semibold">{vehicle.title}</h3>
                            <Badge variant="outline" className="text-xs">
                              {vehicle.category}
                            </Badge>
                            <Badge className={cn(
                              "text-xs",
                              vehicle.status === "APPROVED"
                                ? "bg-green-100 text-green-800 border-green-200" 
                                : vehicle.status === "REJECTED"
                                ? "bg-red-100 text-red-800 border-red-200"
                                : "bg-yellow-100 text-yellow-800 border-yellow-200"
                            )}>
                              {vehicle.status}
                            </Badge>
                            <Badge className={cn(
                              "text-xs",
                              vehicle.isAvailable 
                                ? "bg-blue-100 text-blue-800 border-blue-200" 
                                : "bg-gray-100 text-gray-800 border-gray-200"
                            )}>
                              {vehicle.isAvailable ? "Available" : "Unavailable"}
                            </Badge>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-green-600">
                              KSh {vehicle.dailyPrice.toLocaleString()}/day
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {totalBookings} bookings
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
                          <span>👤 Owner: {vehicle.owner.name}</span>
                          <span>📞 {vehicle.owner.phone}</span>
                          <span>📅 Added {new Date(vehicle.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    {/* Right side - Actions */}
                    <div className="flex flex-col space-y-2 lg:ml-6">
                      {vehicle.status === "PENDING" && (
                        <div className="flex flex-col space-y-2">
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => handleApprove(vehicle.id)}
                          >
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-red-600 text-red-600 hover:bg-red-50"
                            onClick={() => handleReject(vehicle.id)}
                          >
                            <XCircle className="w-3 h-3 mr-1" />
                            Reject
                          </Button>
                        </div>
                      )}
                      
                      {vehicle.status === "APPROVED" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleAvailabilityToggle(vehicle.id, vehicle.isAvailable)}
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
                      )}
                      
                      <Button size="sm" variant="outline" onClick={() => router.push(`/vehicles/${vehicle.id}`)}>
                        <Eye className="w-3 h-3 mr-1" />
                        View
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
            })
          )}
        </div>
      </div>
    </div>
  );
}