"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  Users,
  Car,
  Calendar,
  Download,
  Filter,
  Loader2,
  AlertCircle,
  ArrowLeft
} from "lucide-react";
import { cn } from "@/lib/utils";

// Mock reports data
const reportsData = {
  revenue: {
    current: 2450000,
    previous: 2280000,
    growth: 7.5,
    monthly: [
      { month: "Jan", amount: 1800000 },
      { month: "Feb", amount: 2450000 },
      { month: "Mar", amount: 2100000 },
      { month: "Apr", amount: 2800000 },
      { month: "May", amount: 2650000 },
      { month: "Jun", amount: 3200000 },
    ]
  },
  bookings: {
    total: 156,
    completed: 142,
    cancelled: 14,
    pending: 23,
    growth: 12.3,
  },
  users: {
    total: 1247,
    newThisMonth: 89,
    active: 1156,
    growth: 8.2,
  },
  vehicles: {
    total: 89,
    active: 76,
    pending: 8,
    rejected: 5,
    utilization: 85.4,
  },
  topVehicles: [
    { name: "Toyota Fortuner 2023", bookings: 24, revenue: 204000 },
    { name: "Nissan X-Trail 2022", bookings: 18, revenue: 117000 },
    { name: "Toyota Prado 2024", bookings: 16, revenue: 152000 },
    { name: "Honda CR-V 2021", bookings: 14, revenue: 84000 },
    { name: "Subaru Outback 2022", bookings: 12, revenue: 96000 },
  ],
  topOwners: [
    { name: "Mary Wanjiku", vehicles: 4, revenue: 340000 },
    { name: "John Kamau", vehicles: 3, revenue: 285000 },
    { name: "Sarah Njeri", vehicles: 5, revenue: 420000 },
    { name: "Peter Mwangi", vehicles: 2, revenue: 180000 },
    { name: "Grace Muthoni", vehicles: 3, revenue: 225000 },
  ]
};

export default function AdminReportsPage() {
  const { user, isAuthenticated, isLoading, isAdmin } = useAuth();
  const router = useRouter();
  const [selectedPeriod, setSelectedPeriod] = useState("month");
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

  const handleExportReport = (type: string) => {
    // Simulate report generation
    const filename = `${type}_report_${new Date().toISOString().split('T')[0]}.csv`;
    console.log(`Generating ${filename}...`);
    // In a real app, this would trigger a download
    alert(`Report "${filename}" would be downloaded`);
  };

  if (isLoading || isLoadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading reports...</p>
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
                <h1 className="text-3xl font-bold">Reports & Analytics</h1>
                <p className="text-muted-foreground mt-1">
                  Platform performance and business insights
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="quarter">This Quarter</SelectItem>
                  <SelectItem value="year">This Year</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={() => handleExportReport("comprehensive")}>
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">KSh {reportsData.revenue.current.toLocaleString()}</div>
              <div className="flex items-center text-xs text-green-600">
                <TrendingUp className="w-3 h-3 mr-1" />
                +{reportsData.revenue.growth}% from last month
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{reportsData.bookings.total}</div>
              <div className="flex items-center text-xs text-green-600">
                <TrendingUp className="w-3 h-3 mr-1" />
                +{reportsData.bookings.growth}% from last month
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{reportsData.users.active.toLocaleString()}</div>
              <div className="flex items-center text-xs text-green-600">
                <TrendingUp className="w-3 h-3 mr-1" />
                +{reportsData.users.growth}% from last month
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Vehicle Utilization</CardTitle>
              <Car className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{reportsData.vehicles.utilization}%</div>
              <div className="text-xs text-muted-foreground">
                {reportsData.vehicles.active} of {reportsData.vehicles.total} vehicles active
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Revenue Chart Placeholder */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5" />
                <span>Revenue Trend</span>
              </CardTitle>
              <CardDescription>Monthly revenue over the last 6 months</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                <div className="text-center">
                  <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Revenue chart would be displayed here</p>
                  <p className="text-xs text-gray-400">Integration with charting library needed</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Booking Status */}
          <Card>
            <CardHeader>
              <CardTitle>Booking Status Breakdown</CardTitle>
              <CardDescription>Current booking distribution</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Completed</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">{reportsData.bookings.completed}</span>
                  <Badge variant="secondary" className="text-xs">
                    {Math.round((reportsData.bookings.completed / reportsData.bookings.total) * 100)}%
                  </Badge>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm">Pending</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">{reportsData.bookings.pending}</span>
                  <Badge variant="secondary" className="text-xs">
                    {Math.round((reportsData.bookings.pending / reportsData.bookings.total) * 100)}%
                  </Badge>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-sm">Cancelled</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">{reportsData.bookings.cancelled}</span>
                  <Badge variant="secondary" className="text-xs">
                    {Math.round((reportsData.bookings.cancelled / reportsData.bookings.total) * 100)}%
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Performing Vehicles */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Top Performing Vehicles</CardTitle>
                <CardDescription>Vehicles with highest bookings and revenue</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={() => handleExportReport("vehicles")}>
                <Download className="w-3 h-3 mr-1" />
                Export
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reportsData.topVehicles.map((vehicle, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-primary">#{index + 1}</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium">{vehicle.name}</p>
                        <p className="text-xs text-muted-foreground">{vehicle.bookings} bookings</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-green-600">
                        KSh {vehicle.revenue.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Performing Owners */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Top Performing Owners</CardTitle>
                <CardDescription>Owners with highest revenue generation</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={() => handleExportReport("owners")}>
                <Download className="w-3 h-3 mr-1" />
                Export
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reportsData.topOwners.map((owner, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-accent">#{index + 1}</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium">{owner.name}</p>
                        <p className="text-xs text-muted-foreground">{owner.vehicles} vehicles</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-green-600">
                        KSh {owner.revenue.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}