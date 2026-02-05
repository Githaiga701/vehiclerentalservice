"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { apiClient, handleApiError } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  Car, 
  MapPin, 
  DollarSign, 
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
  Phone,
  User
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface Booking {
  id: string;
  vehicleId: string;
  vehicle?: {
    id: string;
    name: string;
    images?: string[];
  };
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: string;
  pickupLocation?: string;
  createdAt: string;
}

const statusColors = {
  PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
  CONFIRMED: "bg-blue-100 text-blue-800 border-blue-200",
  PAYMENT_CONFIRMED: "bg-green-100 text-green-800 border-green-200",
  COMPLETED: "bg-green-100 text-green-800 border-green-200",
  CANCELLED: "bg-red-100 text-red-800 border-red-200",
};

const statusIcons = {
  PENDING: Clock,
  CONFIRMED: CheckCircle2,
  PAYMENT_CONFIRMED: CheckCircle2,
  COMPLETED: CheckCircle2,
  CANCELLED: XCircle,
};

export default function BookingsPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    const fetchBookings = async () => {
      if (!isAuthenticated) return;
      
      try {
        setIsLoadingData(true);
        const response = await apiClient.getMyBookings();
        setBookings(response || []);
      } catch (error) {
        console.error("Error fetching bookings:", error);
        handleApiError(error);
        setBookings([]);
      } finally {
        setIsLoadingData(false);
      }
    };

    if (isAuthenticated) {
      fetchBookings();
    }
  }, [isAuthenticated]);

  const handleCancelBooking = async (bookingId: string) => {
    try {
      await apiClient.updateBookingStatus(bookingId, "CANCELLED");
      toast.success("Booking cancelled successfully");
      // Refresh bookings
      const response = await apiClient.getMyBookings();
      setBookings(response || []);
    } catch (error) {
      handleApiError(error);
    }
  };

  if (isLoading || isLoadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">My Bookings</h1>
          <p className="text-muted-foreground mt-2">
            View and manage your vehicle rental bookings
          </p>
        </div>

        {bookings.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <Calendar className="h-16 w-16 mx-auto text-gray-400 mb-6" />
              <h3 className="text-2xl font-semibold mb-3">No bookings yet</h3>
              <p className="text-muted-foreground text-lg mb-6">
                You haven't made any vehicle bookings yet. Start exploring our available vehicles!
              </p>
              <Button onClick={() => router.push("/vehicles")}>
                Browse Vehicles
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => {
              const StatusIcon = statusIcons[booking.status as keyof typeof statusIcons] || Clock;
              const vehicleImage = booking.vehicle?.images?.[0] || "https://images.unsplash.com/photo-1533473359331-35acde7260c9?auto=format&fit=crop&q=80&w=400";
              const vehicleName = booking.vehicle?.name || "Vehicle";
              
              return (
                <Card key={booking.id} className="overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                      {/* Left side - Booking info */}
                      <div className="flex items-start space-x-4 flex-1">
                        <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-gray-100">
                          <img
                            src={vehicleImage}
                            alt={vehicleName}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        
                        <div className="flex-1 space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <h3 className="text-lg font-semibold">{vehicleName}</h3>
                              <Badge className={cn("border text-xs", statusColors[booking.status as keyof typeof statusColors] || "bg-gray-100 text-gray-800 border-gray-200")}>
                                <StatusIcon className="w-3 h-3 mr-1" />
                                {booking.status.replace("_", " ")}
                              </Badge>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-bold text-green-600">
                                KSh {booking.totalPrice.toLocaleString()}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Booking #{booking.id.slice(0, 8)}
                              </p>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                            <div className="flex items-center space-x-2">
                              <Calendar className="w-4 h-4 text-muted-foreground" />
                              <span>{new Date(booking.startDate).toLocaleDateString()} to {new Date(booking.endDate).toLocaleDateString()}</span>
                            </div>
                            {booking.pickupLocation && (
                              <div className="flex items-center space-x-2">
                                <MapPin className="w-4 h-4 text-muted-foreground" />
                                <span>{booking.pickupLocation}</span>
                              </div>
                            )}
                            <div className="flex items-center space-x-2">
                              <Clock className="w-4 h-4 text-muted-foreground" />
                              <span>Booked {new Date(booking.createdAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right side - Actions */}
                      <div className="flex flex-col space-y-2 lg:ml-6">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => router.push(`/vehicles/${booking.vehicleId}`)}
                        >
                          View Vehicle
                        </Button>
                        
                        {booking.status === "CONFIRMED" && (
                          <Button size="sm" className="bg-green-600 hover:bg-green-700">
                            Contact Owner
                          </Button>
                        )}
                        
                        {booking.status === "COMPLETED" && (
                          <Button size="sm" variant="outline">
                            Rate & Review
                          </Button>
                        )}
                        
                        {booking.status === "PENDING" && (
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="border-red-600 text-red-600 hover:bg-red-50"
                            onClick={() => handleCancelBooking(booking.id)}
                          >
                            Cancel Booking
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Quick Actions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common actions for managing your bookings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <Button variant="outline" onClick={() => router.push("/vehicles")}>
                <Car className="mr-2 h-4 w-4" />
                Book Another Vehicle
              </Button>
              <Button variant="outline" onClick={() => router.push("/profile")}>
                <User className="mr-2 h-4 w-4" />
                View Profile
              </Button>
              {user?.role === "OWNER" && (
                <Button variant="outline" onClick={() => router.push("/owner/dashboard")}>
                  <DollarSign className="mr-2 h-4 w-4" />
                  Owner Dashboard
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}