"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Car, 
  Calendar, 
  DollarSign, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Loader2, 
  AlertCircle,
  Settings,
  FileText,
  BarChart3
} from "lucide-react";
import { cn } from "@/lib/utils";

// Mock admin dashboard data
const dashboardStats = {
  totalUsers: 1247,
  totalVehicles: 89,
  activeBookings: 23,
  pendingKyc: 8,
  monthlyRevenue: 2450000,
  completedBookings: 156,
};

const recentActivities = [
  {
    id: 1,
    type: "booking",
    message: "New booking request for Toyota Fortuner",
    user: "Alice Wanjiku",
    time: "2 minutes ago",
    status: "pending"
  },
  {
    id: 2,
    type: "kyc",
    message: "KYC submission requires review",
    user: "Brian Otieno",
    time: "15 minutes ago",
    status: "pending"
  },
  {
    id: 3,
    type: "payment",
    message: "Payment confirmed for booking #BK001",
    user: "Grace Muthoni",
    time: "1 hour ago",
    status: "completed"
  },
  {
    id: 4,
    type: "vehicle",
    message: "New vehicle added to platform",
    user: "John Kamau",
    time: "2 hours ago",
    status: "completed"
  },
];

export default function AdminDashboard() {
  const { user, isAuthenticated, isLoading, isAdmin } = useAuth();
  const router = useRouter();
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login");
    } else if (!isLoading && !isAdmin) {
      router.replace("/");
    }
  }, [isAuthenticated, isLoading, isAdmin, router]);

  useEffect(() => {
    // Simulate loading dashboard data
    const timer = setTimeout(() => {
      setIsLoadingStats(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading || isLoadingStats) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading admin dashboard...</p>
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
          <div className="space-y-3">
            <Button asChild className="w-full">
              <a href="/">Back to Home</a>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <a href="/login">Login as Admin</a>
            </Button>
          </div>
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
            <div>
              <h1 className="text-3xl font-bold">Admin Dashboard</h1>
              <p className="text-muted-foreground mt-1">
                Welcome back, {user?.name || "Administrator"}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="px-3 py-1">
                <Settings className="w-4 h-4 mr-1" />
                Admin Panel
              </Badge>
              <Button variant="outline" onClick={() => router.push("/")}>
                View Site
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardStats.totalUsers.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                +12% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Vehicles</CardTitle>
              <Car className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardStats.totalVehicles}</div>
              <p className="text-xs text-muted-foreground">
                +3 new this week
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Bookings</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardStats.activeBookings}</div>
              <p className="text-xs text-muted-foreground">
                {dashboardStats.pendingKyc} pending approval
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">KSh {dashboardStats.monthlyRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                +8% from last month
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>
                  Common administrative tasks
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  className="w-full justify-start" 
                  variant="outline"
                  onClick={() => router.push("/kyc-approvals")}
                >
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Review KYC Submissions ({dashboardStats.pendingKyc})
                </Button>
                
                <Button 
                  className="w-full justify-start" 
                  variant="outline"
                  onClick={() => router.push("/admin/bookings")}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  Manage Bookings
                </Button>
                
                <Button 
                  className="w-full justify-start" 
                  variant="outline"
                  onClick={() => router.push("/admin/vehicles")}
                >
                  <Car className="mr-2 h-4 w-4" />
                  Manage Vehicles
                </Button>
                
                <Button 
                  className="w-full justify-start" 
                  variant="outline"
                  onClick={() => router.push("/admin/users")}
                >
                  <Users className="mr-2 h-4 w-4" />
                  Manage Users
                </Button>
                
                <Button 
                  className="w-full justify-start" 
                  variant="outline"
                  onClick={() => router.push("/admin/reports")}
                >
                  <BarChart3 className="mr-2 h-4 w-4" />
                  View Reports
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activities */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activities</CardTitle>
                <CardDescription>
                  Latest platform activities requiring attention
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity, index) => (
                    <div key={activity.id}>
                      <div className="flex items-start space-x-4">
                        <div className={cn(
                          "flex h-8 w-8 items-center justify-center rounded-full",
                          activity.status === "pending" ? "bg-yellow-100 text-yellow-600" :
                          activity.status === "completed" ? "bg-green-100 text-green-600" :
                          "bg-gray-100 text-gray-600"
                        )}>
                          {activity.type === "booking" && <Calendar className="h-4 w-4" />}
                          {activity.type === "kyc" && <FileText className="h-4 w-4" />}
                          {activity.type === "payment" && <DollarSign className="h-4 w-4" />}
                          {activity.type === "vehicle" && <Car className="h-4 w-4" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">
                            {activity.message}
                          </p>
                          <div className="flex items-center space-x-2 mt-1">
                            <p className="text-sm text-gray-500">
                              by {activity.user}
                            </p>
                            <span className="text-gray-300">•</span>
                            <p className="text-sm text-gray-500">
                              {activity.time}
                            </p>
                          </div>
                        </div>
                        <Badge 
                          variant={activity.status === "pending" ? "secondary" : "default"}
                          className="text-xs"
                        >
                          {activity.status === "pending" ? (
                            <>
                              <Clock className="w-3 h-3 mr-1" />
                              Pending
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className="w-3 h-3 mr-1" />
                              Completed
                            </>
                          )}
                        </Badge>
                      </div>
                      {index < recentActivities.length - 1 && (
                        <div className="w-full h-px bg-gray-300 mt-4" />
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}