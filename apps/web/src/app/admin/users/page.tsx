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
  Users, 
  Search, 
  Filter,
  Phone,
  Mail,
  Calendar,
  Shield,
  Car,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Loader2,
  AlertCircle,
  ArrowLeft,
  MoreHorizontal
} from "lucide-react";
import { cn } from "@/lib/utils";

// Mock users data
const mockUsers = [
  {
    id: "u1",
    name: "Alice Wanjiku",
    phone: "+254712345678",
    email: "alice@example.com",
    role: "RENTER",
    kycStatus: "APPROVED",
    joinDate: "2026-01-15",
    totalBookings: 5,
    isActive: true,
    trustScore: 4.8,
  },
  {
    id: "u2",
    name: "Brian Otieno",
    phone: "+254723456789",
    email: "brian@example.com",
    role: "OWNER",
    kycStatus: "PENDING",
    joinDate: "2026-01-20",
    totalBookings: 0,
    totalVehicles: 2,
    isActive: true,
    trustScore: 4.2,
  },
  {
    id: "u3",
    name: "Grace Muthoni",
    phone: "+254734567890",
    email: "grace@example.com",
    role: "RENTER",
    kycStatus: "APPROVED",
    joinDate: "2026-01-10",
    totalBookings: 12,
    isActive: true,
    trustScore: 4.9,
  },
  {
    id: "u4",
    name: "David Kiprotich",
    phone: "+254745678901",
    email: "david@example.com",
    role: "OWNER",
    kycStatus: "REJECTED",
    joinDate: "2026-01-25",
    totalBookings: 0,
    totalVehicles: 1,
    isActive: false,
    trustScore: 3.1,
  },
  {
    id: "u5",
    name: "Sarah Njeri",
    phone: "+254756789012",
    email: "sarah@example.com",
    role: "OWNER",
    kycStatus: "APPROVED",
    joinDate: "2026-01-05",
    totalBookings: 0,
    totalVehicles: 4,
    isActive: true,
    trustScore: 4.7,
  },
];

const roleColors = {
  RENTER: "bg-blue-100 text-blue-800 border-blue-200",
  OWNER: "bg-purple-100 text-purple-800 border-purple-200",
  ADMIN: "bg-red-100 text-red-800 border-red-200",
};

const kycColors = {
  PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
  APPROVED: "bg-green-100 text-green-800 border-green-200",
  REJECTED: "bg-red-100 text-red-800 border-red-200",
};

export default function AdminUsersPage() {
  const { user, isAuthenticated, isLoading, isAdmin } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState(mockUsers);
  const [filteredUsers, setFilteredUsers] = useState(mockUsers);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [kycFilter, setKycFilter] = useState("all");
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
    // Filter users based on search, role, and KYC status
    let filtered = users;

    if (searchQuery) {
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.phone.includes(searchQuery) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (roleFilter !== "all") {
      filtered = filtered.filter(user => user.role === roleFilter);
    }

    if (kycFilter !== "all") {
      filtered = filtered.filter(user => user.kycStatus === kycFilter);
    }

    setFilteredUsers(filtered);
  }, [searchQuery, roleFilter, kycFilter, users]);

  const handleUserStatusToggle = (userId: string) => {
    setUsers(prev =>
      prev.map(user =>
        user.id === userId ? { ...user, isActive: !user.isActive } : user
      )
    );
  };

  const handleKycStatusUpdate = (userId: string, newStatus: string) => {
    setUsers(prev =>
      prev.map(user =>
        user.id === userId ? { ...user, kycStatus: newStatus as any } : user
      )
    );
  };

  if (isLoading || isLoadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading users...</p>
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
                <h1 className="text-3xl font-bold">Manage Users</h1>
                <p className="text-muted-foreground mt-1">
                  View and manage all platform users
                </p>
              </div>
            </div>
            <Badge variant="secondary" className="px-3 py-1">
              {filteredUsers.length} users
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
                    placeholder="Search by name, phone, or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="w-full lg:w-48">
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="RENTER">Renters</SelectItem>
                    <SelectItem value="OWNER">Owners</SelectItem>
                    <SelectItem value="ADMIN">Admins</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="w-full lg:w-48">
                <Select value={kycFilter} onValueChange={setKycFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by KYC" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All KYC Status</SelectItem>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="APPROVED">Approved</SelectItem>
                    <SelectItem value="REJECTED">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Users List */}
        <div className="space-y-4">
          {filteredUsers.length === 0 ? (
            <Card>
              <CardContent className="py-16 text-center">
                <Users className="h-16 w-16 mx-auto text-gray-400 mb-6" />
                <h3 className="text-2xl font-semibold mb-3">No users found</h3>
                <p className="text-muted-foreground text-lg">
                  {searchQuery || roleFilter !== "all" || kycFilter !== "all"
                    ? "Try adjusting your filters" 
                    : "No users have registered yet"
                  }
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredUsers.map((userData) => (
              <Card key={userData.id} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                    {/* Left side - User info */}
                    <div className="flex items-start space-x-4 flex-1">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                          {userData.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <h3 className="text-lg font-semibold">{userData.name}</h3>
                            <Badge className={cn("border text-xs", roleColors[userData.role as keyof typeof roleColors])}>
                              {userData.role}
                            </Badge>
                            <Badge className={cn("border text-xs", kycColors[userData.kycStatus as keyof typeof kycColors])}>
                              {userData.kycStatus}
                            </Badge>
                            {!userData.isActive && (
                              <Badge variant="destructive" className="text-xs">
                                Inactive
                              </Badge>
                            )}
                          </div>
                          <div className="text-right">
                            <div className="flex items-center space-x-1">
                              <span className="text-sm font-medium">Trust Score:</span>
                              <span className={cn(
                                "text-sm font-bold",
                                userData.trustScore >= 4.5 ? "text-green-600" :
                                userData.trustScore >= 3.5 ? "text-yellow-600" : "text-red-600"
                              )}>
                                {userData.trustScore}/5.0
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                          <div className="flex items-center space-x-2">
                            <Phone className="w-4 h-4 text-muted-foreground" />
                            <span>{userData.phone}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Mail className="w-4 h-4 text-muted-foreground" />
                            <span className="truncate">{userData.email}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            <span>Joined {userData.joinDate}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            {userData.role === "OWNER" ? (
                              <>
                                <Car className="w-4 h-4 text-muted-foreground" />
                                <span>{userData.totalVehicles || 0} vehicles</span>
                              </>
                            ) : (
                              <>
                                <Calendar className="w-4 h-4 text-muted-foreground" />
                                <span>{userData.totalBookings} bookings</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right side - Actions */}
                    <div className="flex flex-col space-y-2 lg:ml-6">
                      {userData.kycStatus === "PENDING" && (
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => handleKycStatusUpdate(userData.id, "APPROVED")}
                          >
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            Approve KYC
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-red-600 text-red-600 hover:bg-red-50"
                            onClick={() => handleKycStatusUpdate(userData.id, "REJECTED")}
                          >
                            <XCircle className="w-3 h-3 mr-1" />
                            Reject
                          </Button>
                        </div>
                      )}
                      
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleUserStatusToggle(userData.id)}
                          className={userData.isActive ? "border-red-600 text-red-600 hover:bg-red-50" : "border-green-600 text-green-600 hover:bg-green-50"}
                        >
                          {userData.isActive ? (
                            <>
                              <XCircle className="w-3 h-3 mr-1" />
                              Deactivate
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className="w-3 h-3 mr-1" />
                              Activate
                            </>
                          )}
                        </Button>
                        
                        <Button size="sm" variant="outline">
                          <MoreHorizontal className="w-3 h-3" />
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