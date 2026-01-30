"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Car,
  DollarSign,
  CalendarDays,
  Clock,
  CheckCircle2,
  XCircle,
  Plus,
  Star,
  TrendingUp,
  Users,
  AlertCircle,
  Edit,
  Trash2,
  Eye,
  MoreVertical
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Mock data
const mockVehicles = [
  { id: "v1", name: "Toyota Fortuner 2023", plate: "KDD 123X", status: "active", bookings: 8, rating: 4.8, pricePerDay: 8500, image: "https://images.unsplash.com/photo-1742697167580-af91e3ead35e?auto=format&fit=crop&q=80&w=400" },
  { id: "v2", name: "Nissan X-Trail 2022", plate: "KCA 456Y", status: "maintenance", bookings: 3, rating: 4.5, pricePerDay: 6500, image: "https://images.unsplash.com/photo-1551817280-6d59c77ce1b8?auto=format&fit=crop&q=80&w=400" },
  { id: "v3", name: "Subaru Forester 2021", plate: "KBZ 789Z", status: "active", bookings: 12, rating: 4.7, pricePerDay: 5500, image: "https://images.unsplash.com/photo-1687048988997-ec57f83ea3bd?auto=format&fit=crop&q=80&w=400" },
  { id: "v4", name: "Mercedes-Benz C-Class", plate: "KCB 321A", status: "active", bookings: 15, rating: 4.9, pricePerDay: 12000, image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&q=80&w=400" },
];

const mockBookingRequests = [
  { id: "bk1", renter: "Alice Wanjiku", phone: "+254712345678", vehicle: "Toyota Fortuner", dates: "Feb 10–15", status: "pending", amount: 42500, days: 5 },
  { id: "bk2", renter: "Brian Otieno", phone: "+254723456789", vehicle: "Nissan X-Trail", dates: "Feb 20–22", status: "accepted", amount: 19500, days: 3 },
  { id: "bk3", renter: "Grace Muthoni", phone: "+254734567890", vehicle: "Toyota Fortuner", dates: "Mar 5–7", status: "pending", amount: 25500, days: 3 },
  { id: "bk4", renter: "David Kamau", phone: "+254745678901", vehicle: "Mercedes-Benz C-Class", dates: "Feb 25–28", status: "accepted", amount: 48000, days: 4 },
];

const mockReviews = [
  { id: "r1", renter: "Alice Wanjiku", vehicle: "Toyota Fortuner", rating: 5, comment: "Excellent service! The car was in perfect condition.", date: "2 days ago" },
  { id: "r2", renter: "Brian Otieno", vehicle: "Nissan X-Trail", rating: 4, comment: "Good experience overall. Would rent again.", date: "1 week ago" },
  { id: "r3", renter: "Grace Muthoni", vehicle: "Subaru Forester", rating: 5, comment: "Amazing! Very professional and the car exceeded expectations.", date: "2 weeks ago" },
];

export default function OwnerDashboard() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  // Calculate stats
  const totalBookings = mockBookingRequests.length;
  const pendingRequests = mockBookingRequests.filter(b => b.status === "pending").length;
  const totalRevenue = mockBookingRequests.filter(b => b.status === "accepted").reduce((sum, b) => sum + b.amount, 0);
  const avgRating = mockVehicles.reduce((sum, v) => sum + v.rating, 0) / mockVehicles.length;
  const activeVehicles = mockVehicles.filter(v => v.status === "active").length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-white">
      {/* Header */}
      <div className="bg-gradient-primary text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <Badge className="mb-3 bg-white/20 text-white hover:bg-white/30 border-white/30">
                <Car className="w-3 h-3 mr-1" />
                Owner Dashboard
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold mb-2">Welcome back, {user?.name}!</h1>
              <p className="text-white/90 text-lg">
                Manage your fleet, bookings, and grow your business
              </p>
            </div>

            <Button size="lg" className="bg-white text-primary hover:bg-white/90 shadow-lg" asChild>
              <Link href="/owner/vehicles/add">
                <Plus className="mr-2 h-5 w-5" /> Add New Vehicle
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="container mx-auto px-4 -mt-8 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={<Car className="h-6 w-6" />}
            title="Active Vehicles"
            value={activeVehicles.toString()}
            subtitle={`${mockVehicles.length} total`}
            color="bg-blue-500"
            trend="+2 this month"
          />
          <StatCard
            icon={<CalendarDays className="h-6 w-6" />}
            title="Total Bookings"
            value={totalBookings.toString()}
            subtitle={`${pendingRequests} pending`}
            color="bg-green-500"
            trend="+12% from last month"
          />
          <StatCard
            icon={<DollarSign className="h-6 w-6" />}
            title="Revenue"
            value={`KSh ${(totalRevenue / 1000).toFixed(0)}K`}
            subtitle="This month"
            color="bg-amber-500"
            trend="+18% from last month"
          />
          <StatCard
            icon={<Star className="h-6 w-6" />}
            title="Average Rating"
            value={avgRating.toFixed(1)}
            subtitle={`${mockReviews.length} reviews`}
            color="bg-purple-500"
            trend="Excellent"
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 pb-16">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-flex bg-white shadow-lg rounded-xl p-1">
            <TabsTrigger value="overview" className="text-base">Overview</TabsTrigger>
            <TabsTrigger value="vehicles" className="text-base">Vehicles</TabsTrigger>
            <TabsTrigger value="bookings" className="text-base">
              Bookings
              {pendingRequests > 0 && (
                <Badge className="ml-2 bg-accent">{pendingRequests}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="reviews" className="text-base">Reviews</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Recent Bookings */}
              <Card className="border-none shadow-lg">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Recent Bookings</CardTitle>
                      <CardDescription>Latest booking requests</CardDescription>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link href="#bookings" onClick={() => setActiveTab("bookings")}>
                        View All
                      </Link>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockBookingRequests.slice(0, 3).map((booking) => (
                      <div key={booking.id} className="flex items-center justify-between p-4 rounded-lg border hover:border-primary/50 transition-colors">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback>{booking.renter[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{booking.renter}</p>
                            <p className="text-sm text-muted-foreground">{booking.vehicle}</p>
                          </div>
                        </div>
                        <Badge variant={booking.status === "pending" ? "secondary" : "default"}>
                          {booking.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Top Performing Vehicles */}
              <Card className="border-none shadow-lg">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Top Performers</CardTitle>
                      <CardDescription>Most booked vehicles</CardDescription>
                    </div>
                    <TrendingUp className="h-5 w-5 text-green-500" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockVehicles.sort((a, b) => b.bookings - a.bookings).slice(0, 3).map((vehicle, idx) => (
                      <div key={vehicle.id} className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-gradient-accent flex items-center justify-center text-white font-bold">
                          {idx + 1}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{vehicle.name}</p>
                          <p className="text-sm text-muted-foreground">{vehicle.bookings} bookings</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                          <span className="font-medium">{vehicle.rating}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Reviews */}
            <Card className="border-none shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Recent Reviews</CardTitle>
                    <CardDescription>What customers are saying</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="#reviews" onClick={() => setActiveTab("reviews")}>
                      View All
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {mockReviews.map((review) => (
                    <div key={review.id} className="p-4 rounded-lg border">
                      <div className="flex items-center gap-2 mb-2">
                        {Array.from({ length: review.rating }).map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                        ))}
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">"{review.comment}"</p>
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium">{review.renter}</span>
                        <span className="text-muted-foreground">{review.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Vehicles Tab */}
          <TabsContent value="vehicles">
            <Card className="border-none shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>My Vehicles</CardTitle>
                  <CardDescription>Manage your fleet of {mockVehicles.length} vehicles</CardDescription>
                </div>
                <Button asChild>
                  <Link href="/owner/vehicles/add">
                    <Plus className="mr-2 h-4 w-4" /> Add Vehicle
                  </Link>
                </Button>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  {mockVehicles.map((vehicle) => (
                    <div key={vehicle.id} className="border rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="aspect-video relative bg-neutral-100">
                        <img src={vehicle.image} alt={vehicle.name} className="w-full h-full object-cover" />
                        <Badge className={cn(
                          "absolute top-3 left-3",
                          vehicle.status === "active" ? "bg-success" : "bg-secondary"
                        )}>
                          {vehicle.status === "active" ? "Active" : "Maintenance"}
                        </Badge>
                      </div>
                      <div className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-bold text-lg">{vehicle.name}</h3>
                            <p className="text-sm text-muted-foreground">{vehicle.plate}</p>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="mr-2 h-4 w-4" /> View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="mr-2 h-4 w-4" /> Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive">
                                <Trash2 className="mr-2 h-4 w-4" /> Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                              <span className="font-medium">{vehicle.rating}</span>
                            </div>
                            <span className="text-muted-foreground">{vehicle.bookings} bookings</span>
                          </div>
                          <span className="font-bold text-accent">KSh {vehicle.pricePerDay.toLocaleString()}/day</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Bookings Tab */}
          <TabsContent value="bookings">
            <Card className="border-none shadow-lg">
              <CardHeader>
                <CardTitle>Booking Requests</CardTitle>
                <CardDescription>
                  Review and manage rental requests ({pendingRequests} pending)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockBookingRequests.map((booking) => (
                    <div key={booking.id} className="p-6 border rounded-xl hover:border-primary/50 transition-colors">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <Avatar className="h-14 w-14">
                            <AvatarFallback className="text-lg">{booking.renter[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-bold text-lg">{booking.renter}</h4>
                            <p className="text-sm text-muted-foreground">{booking.phone}</p>
                            <Badge variant="outline" className="mt-1">{booking.vehicle}</Badge>
                          </div>
                        </div>

                        <div className="flex flex-col lg:items-end gap-2">
                          <div className="text-right">
                            <p className="font-bold text-2xl text-accent">KSh {booking.amount.toLocaleString()}</p>
                            <p className="text-sm text-muted-foreground">{booking.dates} ({booking.days} days)</p>
                          </div>

                          {booking.status === "pending" ? (
                            <div className="flex gap-2">
                              <Button size="sm" className="bg-success hover:bg-success/90">
                                <CheckCircle2 className="mr-2 h-4 w-4" /> Accept
                              </Button>
                              <Button size="sm" variant="outline" className="text-destructive border-destructive hover:bg-destructive/10">
                                <XCircle className="mr-2 h-4 w-4" /> Decline
                              </Button>
                            </div>
                          ) : (
                            <Badge variant={booking.status === "accepted" ? "default" : "destructive"} className="w-fit">
                              {booking.status === "accepted" ? "Accepted" : "Declined"}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reviews Tab */}
          <TabsContent value="reviews">
            <Card className="border-none shadow-lg">
              <CardHeader>
                <CardTitle>Customer Reviews</CardTitle>
                <CardDescription>
                  {mockReviews.length} reviews • {avgRating.toFixed(1)} average rating
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {mockReviews.map((review) => (
                    <div key={review.id} className="p-6 border rounded-xl">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-12 w-12">
                            <AvatarFallback>{review.renter[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-bold">{review.renter}</p>
                            <p className="text-sm text-muted-foreground">{review.date}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          {Array.from({ length: review.rating }).map((_, i) => (
                            <Star key={i} className="h-5 w-5 fill-yellow-500 text-yellow-500" />
                          ))}
                        </div>
                      </div>
                      <Badge variant="outline" className="mb-3">{review.vehicle}</Badge>
                      <p className="text-muted-foreground leading-relaxed">"{review.comment}"</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// Enhanced stat card component
function StatCard({
  icon,
  title,
  value,
  subtitle,
  color,
  trend,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  subtitle: string;
  color: string;
  trend: string;
}) {
  return (
    <Card className="border-none shadow-lg hover-lift">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className={cn("p-3 rounded-xl text-white", color)}>
            {icon}
          </div>
          <Badge variant="secondary" className="text-xs">
            {trend}
          </Badge>
        </div>
        <div>
          <p className="text-sm text-muted-foreground mb-1">{title}</p>
          <p className="text-3xl font-bold mb-1">{value}</p>
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        </div>
      </CardContent>
    </Card>
  );
}
