"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Car,
  DollarSign,
  CalendarDays,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Plus,
  BarChart3,
  Users,
  Loader2,
  Star,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Mock data (replace with real API later)
const mockVehicles = [
  { id: "v1", name: "Toyota Fortuner 2023", plate: "KDD 123X", status: "active", bookings: 8, rating: 4.8 },
  { id: "v2", name: "Nissan X-Trail 2022", plate: "KCA 456Y", status: "maintenance", bookings: 3, rating: 4.5 },
];

const mockBookingRequests = [
  { id: "bk1", renter: "Alice Wanjiku", phone: "+254712345678", vehicle: "Toyota Fortuner", dates: "Feb 10–15", status: "pending", amount: 42500 },
  { id: "bk2", renter: "Brian Otieno", phone: "+254723456789", vehicle: "Nissan X-Trail", dates: "Feb 20–22", status: "accepted", amount: 19500 },
  { id: "bk3", renter: "Grace Muthoni", phone: "+254734567890", vehicle: "Toyota Fortuner", dates: "Mar 5–7", status: "rejected", amount: 25500 },
];

export default function OwnerDashboard() {
  const { user, isAuthenticated, requiresKyc, isLoading } = useAuth();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState("vehicles");

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.replace("/login");
      } else if (requiresKyc) {
        router.replace("/kyc");
      }
    }
  }, [isAuthenticated, requiresKyc, isLoading, router]);

  if (isLoading || !isAuthenticated || requiresKyc) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
          <p className="text-lg text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Quick stats calculation (mock)
  const totalBookings = 15;
  const totalRevenue = 285000;
  const avgRating = 4.7;
  const activeVehicles = mockVehicles.filter(v => v.status === "active").length;

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primary/80 text-white">
        <div className="container mx-auto px-4 py-10 md:py-14">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">Owner Dashboard</h1>
              <p className="mt-2 text-white/90">
                Welcome back, {user?.name || "Owner"} • Manage your fleet & bookings
              </p>
            </div>

            <div className="flex items-center gap-4">
              <Avatar className="h-14 w-14 border-2 border-white">
                <AvatarImage src={user?.avatar} alt={user?.name} />
                <AvatarFallback className="bg-white text-primary font-semibold">
                  {user?.name?.[0]?.toUpperCase() || "O"}
                </AvatarFallback>
              </Avatar>
              <Button variant="secondary" size="lg" className="bg-white text-primary hover:bg-white/90">
                <Plus className="mr-2 h-5 w-5" /> Add New Vehicle
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="container mx-auto px-4 -mt-10 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={<Car className="h-6 w-6" />}
            title="Active Vehicles"
            value={activeVehicles.toString()}
            color="text-blue-600"
          />
          <StatCard
            icon={<CalendarDays className="h-6 w-6" />}
            title="Total Bookings"
            value={totalBookings.toString()}
            color="text-green-600"
          />
          <StatCard
            icon={<DollarSign className="h-6 w-6" />}
            title="Reported Revenue"
            value={`KSh ${totalRevenue.toLocaleString()}`}
            color="text-amber-600"
          />
          <StatCard
            icon={<Star className="h-6 w-6" />}
            title="Average Rating"
            value={avgRating.toFixed(1)}
            color="text-purple-600"
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 pb-16">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-flex bg-white shadow-sm rounded-lg">
            <TabsTrigger value="vehicles" className="text-base">
              My Vehicles
            </TabsTrigger>
            <TabsTrigger value="requests" className="text-base">
              Booking Requests
            </TabsTrigger>
            <TabsTrigger value="analytics" className="text-base">
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Vehicles Tab */}
          <TabsContent value="vehicles">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>My Vehicles</CardTitle>
                  <CardDescription>Manage your listed fleet</CardDescription>
                </div>
                <Button>
                  <Plus className="mr-2 h-4 w-4" /> Add Vehicle
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockVehicles.map((v) => (
                    <div
                      key={v.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg hover:bg-neutral-50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-14 w-14 rounded-md bg-neutral-200 flex items-center justify-center text-neutral-500">
                          <Car className="h-7 w-7" />
                        </div>
                        <div>
                          <h4 className="font-medium">{v.name}</h4>
                          <p className="text-sm text-muted-foreground">{v.plate}</p>
                        </div>
                      </div>

                      <div className="mt-4 sm:mt-0 flex flex-wrap gap-4 items-center">
                        <Badge variant={v.status === "active" ? "default" : "secondary"}>
                          {v.status === "active" ? "Active" : "Under Maintenance"}
                        </Badge>
                        <div className="text-sm">
                          <span className="font-medium">{v.bookings}</span> bookings
                        </div>
                        <div className="flex items-center gap-1 text-sm">
                          <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                          {v.rating}
                        </div>
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      </div>
                    </div>
                  ))}

                  {mockVehicles.length === 0 && (
                    <div className="text-center py-12">
                      <Car className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">No vehicles listed yet</h3>
                      <p className="text-muted-foreground mb-6">
                        Start adding your vehicles to receive booking requests.
                      </p>
                      <Button>
                        <Plus className="mr-2 h-4 w-4" /> Add Your First Vehicle
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Booking Requests Tab */}
          <TabsContent value="requests">
            <Card>
              <CardHeader>
                <CardTitle>Booking Requests</CardTitle>
                <CardDescription>
                  Review and respond to incoming rental requests
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockBookingRequests.map((req) => (
                    <div
                      key={req.id}
                      className="p-5 border rounded-lg hover:border-primary/50 transition-colors"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <Avatar className="h-12 w-12">
                            <AvatarFallback>{req.renter[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-medium">{req.renter}</h4>
                            <p className="text-sm text-muted-foreground">{req.phone}</p>
                          </div>
                        </div>

                        <div className="text-right">
                          <p className="font-medium text-lg">KSh {req.amount.toLocaleString()}</p>
                          <p className="text-sm text-muted-foreground">{req.dates}</p>
                        </div>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-3">
                        <Badge variant="outline">{req.vehicle}</Badge>

                        {req.status === "pending" ? (
                          <div className="flex gap-3 mt-3 sm:mt-0 sm:ml-auto">
                            <Button variant="default" size="sm" className="bg-green-600 hover:bg-green-700">
                              <CheckCircle2 className="mr-2 h-4 w-4" /> Accept
                            </Button>
                            <Button variant="outline" size="sm" className="text-red-600 border-red-600 hover:bg-red-50">
                              <XCircle className="mr-2 h-4 w-4" /> Decline
                            </Button>
                          </div>
                        ) : (
                          <Badge
                            variant={req.status === "accepted" ? "default" : "destructive"}
                            className="ml-auto mt-3 sm:mt-0"
                          >
                            {req.status === "accepted" ? "Accepted" : "Rejected"}
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}

                  {mockBookingRequests.length === 0 && (
                    <div className="text-center py-12">
                      <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">No pending requests</h3>
                      <p className="text-muted-foreground">
                        New booking requests will appear here once owners start listing vehicles.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Performance Overview</CardTitle>
                  <CardDescription>Last 30 days</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-neutral-100 rounded-lg flex items-center justify-center">
                    <p className="text-muted-foreground">Revenue & Booking Trend Chart (placeholder)</p>
                  </div>
                  <div className="mt-6 grid grid-cols-2 gap-4">
                    <div className="text-center p-4 border rounded-lg">
                      <p className="text-2xl font-bold">{totalBookings}</p>
                      <p className="text-sm text-muted-foreground">Bookings</p>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <p className="text-2xl font-bold text-green-600">
                        KSh {totalRevenue.toLocaleString()}
                      </p>
                      <p className="text-sm text-muted-foreground">Reported Revenue</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Vehicle Performance</CardTitle>
                  <CardDescription>Ranked by bookings</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockVehicles.map((v) => (
                      <div key={v.id} className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded bg-primary/10 flex items-center justify-center text-primary">
                            <Car className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-medium">{v.name}</p>
                            <p className="text-sm text-muted-foreground">{v.plate}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">{v.bookings}</p>
                          <p className="text-xs text-muted-foreground">bookings</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// Reusable stat card component
function StatCard({
  icon,
  title,
  value,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  color: string;
}) {
  return (
    <Card className="border-none shadow-md">
      <CardContent className="p-6 flex items-center gap-4">
        <div className={cn("p-3 rounded-lg", color.replace("text-", "bg-") + "/10")}>
          {icon}
        </div>
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className={cn("text-2xl font-bold", color)}>{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}