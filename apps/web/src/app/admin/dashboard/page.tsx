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
  BarChart3,
  MessageSquare
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
              <p className="text-indigo-100 text-lg">
                Welcome back, {user?.name || "Administrator"} 👋
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge className="px-4 py-2 bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30">
                <Settings className="w-4 h-4 mr-2" />
                Admin Panel
              </Badge>
              <Button 
                variant="outline" 
                onClick={() => router.push("/")}
                className="bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20"
              >
                View Site
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-100">Total Users</CardTitle>
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <Users className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-1">{dashboardStats.totalUsers.toLocaleString()}</div>
              <p className="text-xs text-blue-100 flex items-center">
                <span className="text-green-300 mr-1">↗ +12%</span> from last month
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-100">Total Vehicles</CardTitle>
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <Car className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-1">{dashboardStats.totalVehicles}</div>
              <p className="text-xs text-purple-100 flex items-center">
                <span className="text-green-300 mr-1">+3</span> new this week
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-orange-100">Active Bookings</CardTitle>
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <Calendar className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-1">{dashboardStats.activeBookings}</div>
              <p className="text-xs text-orange-100">
                {dashboardStats.pendingKyc} pending approval
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-100">Monthly Revenue</CardTitle>
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <DollarSign className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-1">KSh {dashboardStats.monthlyRevenue.toLocaleString()}</div>
              <p className="text-xs text-green-100 flex items-center">
                <span className="text-green-200 mr-1">↗ +8%</span> from last month
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-t-lg">
                <CardTitle className="text-indigo-900">Quick Actions</CardTitle>
                <CardDescription className="text-indigo-600">
                  Common administrative tasks
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 pt-6">
                <Button 
                  className="w-full justify-start bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-md" 
                  onClick={() => router.push("/kyc-approvals")}
                >
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Review KYC Submissions ({dashboardStats.pendingKyc})
                </Button>
                
                <Button 
                  className="w-full justify-start bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-md" 
                  onClick={() => router.push("/admin/bookings")}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  Manage Bookings
                </Button>
                
                <Button 
                  className="w-full justify-start bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white shadow-md" 
                  onClick={() => router.push("/admin/vehicles")}
                >
                  <Car className="mr-2 h-4 w-4" />
                  Manage Vehicles
                </Button>
                
                <Button 
                  className="w-full justify-start bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-md" 
                  onClick={() => router.push("/admin/users")}
                >
                  <Users className="mr-2 h-4 w-4" />
                  Manage Users
                </Button>
                
                <Button 
                  className="w-full justify-start bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white shadow-md" 
                  onClick={() => router.push("/admin/reports")}
                >
                  <BarChart3 className="mr-2 h-4 w-4" />
                  View Reports
                </Button>
                
                <Button 
                  className="w-full justify-start bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white shadow-md" 
                  onClick={() => router.push("/admin/messages")}
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Contact Messages
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activities */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-t-lg">
                <CardTitle className="text-indigo-900">Recent Activities</CardTitle>
                <CardDescription className="text-indigo-600">
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