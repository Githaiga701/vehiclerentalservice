"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Car, Clock, Star, CheckCircle2, XCircle, Loader2 } from "lucide-react";

// Mock bookings (replace with real API call later)
const mockBookings = [
  {
    id: "bk-001",
    vehicle: "Toyota Fortuner 2023",
    owner: "Jane Kamau",
    dates: "Feb 5 - Feb 8, 2026",
    status: "payment-confirmed",
    total: 25500,
    ratingGiven: false,
  },
  {
    id: "bk-002",
    vehicle: "Nissan X-Trail 2022",
    owner: "Peter Omondi",
    dates: "Jan 20 - Jan 22, 2026",
    status: "completed",
    total: 13000,
    ratingGiven: true,
  },
  {
    id: "bk-003",
    vehicle: "Subaru Forester 2021",
    owner: "Mary Wanjiku",
    dates: "Mar 10 - Mar 15, 2026",
    status: "pending",
    total: 27500,
    ratingGiven: false,
  },
];

export default function MyBookingsPage() {
  const { isAuthenticated, requiresKyc, isLoading } = useAuth();
  const router = useRouter();

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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 py-10 px-4">
      <div className="container mx-auto max-w-5xl">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">My Bookings</h1>
        <p className="text-lg text-muted-foreground mb-10">
          View and manage your current and past rentals
        </p>

        {mockBookings.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Car className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-medium mb-2">No bookings yet</h3>
              <p className="text-muted-foreground mb-6">
                Start exploring vehicles and make your first booking today.
              </p>
              <Button asChild>
                <a href="/vehicles">Browse Vehicles</a>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {mockBookings.map((booking) => (
              <Card key={booking.id} className="overflow-hidden">
                <CardHeader className="bg-neutral-100 pb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">{booking.vehicle}</CardTitle>
                      <CardDescription>Owner: {booking.owner}</CardDescription>
                    </div>
                    <Badge
                      variant={
                        booking.status === "completed" ? "default" :
                        booking.status === "payment-confirmed" ? "secondary" :
                        booking.status === "pending" ? "outline" : "destructive"
                      }
                      className="text-sm px-4 py-1"
                    >
                      {booking.status === "payment-confirmed" ? "Payment Confirmed" :
                       booking.status === "pending" ? "Pending Approval" :
                       booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex items-center gap-3">
                      <CalendarDays className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Dates</p>
                        <p className="text-sm text-muted-foreground">{booking.dates}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Total Paid</p>
                        <p className="text-sm font-semibold">KSh {booking.total.toLocaleString()}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Star className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Rating</p>
                        {booking.ratingGiven ? (
                          <p className="text-sm text-green-600 flex items-center gap-1">
                            <CheckCircle2 className="h-4 w-4" /> Rated
                          </p>
                        ) : booking.status === "completed" ? (
                          <Button variant="outline" size="sm">
                            Rate Now
                          </Button>
                        ) : (
                          <p className="text-sm text-muted-foreground">Available after completion</p>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="bg-neutral-50 border-t px-6 py-4">
                  <Button variant="outline" asChild className="w-full sm:w-auto">
                    <a href={`/booking/${booking.id}`}>View Details</a>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}