"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Calendar, 
  Car, 
  User, 
  Phone, 
  MapPin, 
  DollarSign, 
  Search, 
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  Loader2,
  AlertCircle,
  ArrowLeft
} from "lucide-react";
import { cn } from "@/lib/utils";

// Mock bookings data
const mockBookings = [
  {
    id: "BK001",
    vehicleName: "Toyota Fortuner 2023",
    renterName: "Alice Wanjiku",
    renterPhone: "+254712345678",
    ownerName: "Mary Wanjiku",
    startDate: "2026-02-05",
    endDate: "2026-02-08",
    totalPrice: 25500,
    status: "PENDING",
    pickupLocation: "Nairobi - Westlands",
    createdAt: "2026-02-01",
  },
  {
    id: "BK002",
    vehicleName: "Nissan X-Trail 2022",
    renterName: "Brian Otieno",
    renterPhone: "+254723456789",
    ownerName: "John Kamau",
    startDate: "2026-02-03",
    endDate: "2026-02-05",
    totalPrice: 13000,
    status: "CONFIRMED",
    pickupLocation: "Mombasa - CBD",
    createdAt: "2026-01-30",
  },
  {
    id: "BK003",
    vehicleName: "Toyota Prado 2024",
    renterName: "Grace Muthoni",
    renterPhone: "+254734567890",
    ownerName: "Sarah Njeri",
    startDate: "2026-02-10",
    endDate: "2026-02-15",
    totalPrice: 47500,
    status: "PAYMENT_CONFIRMED",
    pickupLocation: "Kisumu - Town",
    createdAt: "2026-01-28",
  },
  {
    id: "BK004",
    vehicleName: "Honda CR-V 2021",
    renterName: "David Kiprotich",
    renterPhone: "+254745678901",
    ownerName: "Peter Mwangi",
    startDate: "2026-01-25",
    endDate: "2026-01-28",
    totalPrice: 18000,
    status: "CANCELLED",
    pickupLocation: "Nakuru - CBD",
    createdAt: "2026-01-20",
  },
];

const statusColors = {
  PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
  CONFIRMED: "bg-blue-100 text-blue-800 border-blue-200",
  PAYMENT_CONFIRMED: "bg-green-100 text-green-800 border-green-200",
  CANCELLED: "bg-red-100 text-red-800 border-red-200",
};

const statusIcons = {
  PENDING: Clock,
  CONFIRMED: CheckCircle2,
  PAYMENT_CONFIRMED: CheckCircle2,
  CANCELLED: XCircle,
};

export default function AdminBookingsPage() {
  const { user, isAuthenticated, isLoading, isAdmin } = useAuth();
  const router = useRouter();
  const [bookings, setBookings] = useState(mockBookings);
  const [filteredBookings, setFilteredBookings] = useState(mockBookings);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
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
    // Filter bookings based on search and status
    let filtered = bookings;

    if (searchQuery) {
      filtered = filtered.filter(booking =>
        booking.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.vehicleName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.renterName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.ownerName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(booking => booking.status === statusFilter);
    }

    setFilteredBookings(filtered);
  }, [searchQuery, statusFilter, bookings]);

  const handleStatusUpdate = (bookingId: string, newStatus: string) => {
    setBookings(prev =>
      prev.map(booking =>
        booking.id === bookingId ? { ...booking, status: newStatus as any } : booking
      )
    );
  };

  if (isLoading || isLoadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading bookings...</p>
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
                <h1 className="text-3xl font-bold">Manage Bookings</h1>
                <p className="text-muted-foreground mt-1">
                  View and manage all platform bookings
                </p>
              </div>
            </div>
            <Badge variant="secondary" className="px-3 py-1">
              {filteredBookings.length} bookings
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
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search by booking ID, vehicle, renter, or owner..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="w-full md:w-48">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                    <SelectItem value="PAYMENT_CONFIRMED">Payment Confirmed</SelectItem>
                    <SelectItem value="CANCELLED">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bookings List */}
        <div className="space-y-4">
          {filteredBookings.length === 0 ? (
            <Card>
              <CardContent className="py-16 text-center">
                <Calendar className="h-16 w-16 mx-auto text-gray-400 mb-6" />
                <h3 className="text-2xl font-semibold mb-3">No bookings found</h3>
                <p className="text-muted-foreground text-lg">
                  {searchQuery || statusFilter !== "all" 
                    ? "Try adjusting your filters" 
                    : "No bookings have been made yet"
                  }
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredBookings.map((booking) => {
              const StatusIcon = statusIcons[booking.status as keyof typeof statusIcons];
              
              return (
                <Card key={booking.id} className="overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                      {/* Left side - Booking info */}
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <h3 className="text-lg font-semibold">#{booking.id}</h3>
                            <Badge className={cn("border", statusColors[booking.status as keyof typeof statusColors])}>
                              <StatusIcon className="w-3 h-3 mr-1" />
                              {booking.status.replace("_", " ")}
                            </Badge>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-green-600">
                              KSh {booking.totalPrice.toLocaleString()}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Created {booking.createdAt}
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                          <div className="flex items-center space-x-2">
                            <Car className="w-4 h-4 text-muted-foreground" />
                            <span className="font-medium">{booking.vehicleName}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <User className="w-4 h-4 text-muted-foreground" />
                            <span>{booking.renterName}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Phone className="w-4 h-4 text-muted-foreground" />
                            <span>{booking.renterPhone}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <MapPin className="w-4 h-4 text-muted-foreground" />
                            <span>{booking.pickupLocation}</span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span>📅 {booking.startDate} to {booking.endDate}</span>
                          <span>👤 Owner: {booking.ownerName}</span>
                        </div>
                      </div>

                      {/* Right side - Actions */}
                      <div className="flex flex-col space-y-2 lg:ml-6">
                        {booking.status === "PENDING" && (
                          <>
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() => handleStatusUpdate(booking.id, "CONFIRMED")}
                            >
                              <CheckCircle2 className="w-3 h-3 mr-1" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-red-600 text-red-600 hover:bg-red-50"
                              onClick={() => handleStatusUpdate(booking.id, "CANCELLED")}
                            >
                              <XCircle className="w-3 h-3 mr-1" />
                              Cancel
                            </Button>
                          </>
                        )}
                        {booking.status === "CONFIRMED" && (
                          <Button
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700"
                            onClick={() => handleStatusUpdate(booking.id, "PAYMENT_CONFIRMED")}
                          >
                            <DollarSign className="w-3 h-3 mr-1" />
                            Confirm Payment
                          </Button>
                        )}
                        <Button size="sm" variant="outline">
                          View Details
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